"""Multi-provider LLM streaming with graceful fallback."""

import logging
from collections.abc import AsyncIterator

from app.config import Settings

logger = logging.getLogger(__name__)


async def _stream_openai_compatible(
    messages: list[dict],
    model: str,
    api_key: str,
    base_url: str | None = None,
) -> AsyncIterator[str]:
    from openai import AsyncOpenAI

    kwargs: dict = {"api_key": api_key}
    if base_url:
        kwargs["base_url"] = base_url
    client = AsyncOpenAI(**kwargs)
    stream = await client.chat.completions.create(
        model=model,
        messages=messages,
        stream=True,
        max_tokens=256,
        temperature=0.7,
    )
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta


async def _stream_anthropic(messages: list[dict], model: str, api_key: str) -> AsyncIterator[str]:
    import anthropic

    system_parts: list[str] = []
    chat_messages: list[dict] = []
    for msg in messages:
        if msg["role"] == "system":
            system_parts.append(msg["content"])
        else:
            chat_messages.append({"role": msg["role"], "content": msg["content"]})

    client = anthropic.AsyncAnthropic(api_key=api_key)
    stream = await client.messages.create(
        model=model,
        max_tokens=256,
        system="\n\n".join(system_parts),
        messages=chat_messages,
        stream=True,
    )
    async for event in stream:
        if event.type == "content_block_delta" and event.delta.type == "text_delta":
            yield event.delta.text


async def _validated_stream(raw: AsyncIterator[str]) -> AsyncIterator[str]:
    """Ensure at least one token can be read before committing to a provider."""
    iterator = raw.__aiter__()
    first = await anext(iterator)

    async def combined() -> AsyncIterator[str]:
        yield first
        async for chunk in iterator:
            yield chunk

    return combined()


async def stream_chat(
    messages: list[dict],
    settings: Settings,
) -> tuple[AsyncIterator[str], str, str]:
    """Return (token stream, provider name, model id) for the first working provider."""
    candidates: list[tuple[str, str, AsyncIterator[str]]] = []

    if settings.anthropic_api_key:
        candidates.append(
            ("anthropic", settings.anthropic_model, _stream_anthropic(messages, settings.anthropic_model, settings.anthropic_api_key))
        )
    if settings.openai_api_key:
        candidates.append(
            ("openai", settings.openai_model, _stream_openai_compatible(messages, settings.openai_model, settings.openai_api_key))
        )
    if settings.groq_api_key:
        candidates.append(
            (
                "groq",
                settings.groq_model,
                _stream_openai_compatible(
                    messages,
                    settings.groq_model,
                    settings.groq_api_key,
                    "https://api.groq.com/openai/v1",
                ),
            )
        )

    if not candidates:
        raise RuntimeError("No LLM provider configured")

    last_error: Exception | None = None
    for provider, model, raw in candidates:
        try:
            logger.info("Trying LLM provider=%s model=%s", provider, model)
            stream = await _validated_stream(raw)
            logger.info("Serving chat via provider=%s model=%s", provider, model)
            return stream, provider, model
        except StopAsyncIteration:
            logger.info("Serving chat via provider=%s model=%s (empty stream)", provider, model)

            async def empty() -> AsyncIterator[str]:
                if False:
                    yield ""

            return empty(), provider, model
        except Exception as exc:
            last_error = exc
            logger.warning("Provider %s (%s) failed: %s", provider, model, exc)

    raise RuntimeError(f"All LLM providers failed: {last_error}")
