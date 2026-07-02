import asyncio
import json
import logging
import uuid
from collections import defaultdict
from typing import AsyncIterator

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.config import get_settings, Settings
from app.services.rag import get_rag_context

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["chat"])

# In-memory per-session message counter (resets on server restart)
# Limits one session to 20 messages max — enough for any genuine visitor
SESSION_MESSAGE_COUNTS: dict[str, int] = defaultdict(int)
SESSION_MESSAGE_LIMIT = 20

SYSTEM_PROMPT = """You are Ajay Shekhawat's personal AI assistant embedded in his portfolio website.
Answer questions about Ajay directly and naturally, as if you know him well.
Rules:
- Never say "based on the provided context", "according to the context", "the context mentions", or any similar meta-phrases
- Never refer to having a "context" or "document" — just answer as if you know Ajay
- If you don't know something, say "I don't have that detail — reach out to Ajay directly via the contact form"
- Be friendly, concise, and conversational
- Keep responses under 150 words unless explicitly asked for more detail
- Do not make up information"""


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None


async def _stream_openai(messages: list[dict], model: str, api_key: str, base_url: str | None = None) -> AsyncIterator[str]:
    from openai import AsyncOpenAI

    kwargs = {"api_key": api_key}
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


async def _stream_fallback(query: str) -> AsyncIterator[str]:
    response = (
        "I'd love to tell you more about my background! "
        "Unfortunately, my AI brain isn't fully connected right now. "
        "Feel free to reach out directly via the contact form below — I'd love to chat."
    )
    for word in response.split(" "):
        yield word + " "
        await asyncio.sleep(0.04)


@router.post("")
async def chat(request: ChatRequest, settings: Settings = Depends(get_settings)):
    session_id = request.session_id or str(uuid.uuid4())
    user_message = request.message.strip()

    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    if len(user_message) > 500:
        raise HTTPException(status_code=400, detail="Message too long (max 500 characters)")

    # Per-session message cap — prevents a single visitor from burning through quota
    SESSION_MESSAGE_COUNTS[session_id] += 1
    if SESSION_MESSAGE_COUNTS[session_id] > SESSION_MESSAGE_LIMIT:
        raise HTTPException(status_code=429, detail="Session limit reached. Refresh the page or use the contact form.")

    context = await get_rag_context(user_message)

    has_groq = bool(settings.groq_api_key)
    has_openai = bool(settings.openai_api_key)

    async def event_stream():
        try:
            if has_groq or has_openai:
                if has_groq:
                    api_key = settings.groq_api_key
                    model = settings.groq_model
                    base_url = "https://api.groq.com/openai/v1"
                else:
                    api_key = settings.openai_api_key
                    model = settings.openai_model
                    base_url = None
                messages = [
                    {"role": "system", "content": f"{SYSTEM_PROMPT}\n\nContext about the portfolio owner:\n{context}"},
                    {"role": "user", "content": user_message},
                ]
                async for chunk in _stream_openai(messages, model, api_key, base_url):
                    yield f"data: {json.dumps({'content': chunk})}\n\n"
            else:
                async for chunk in _stream_fallback(user_message):
                    yield f"data: {json.dumps({'content': chunk})}\n\n"

            yield "data: [DONE]\n\n"

        except Exception as e:
            logger.error(f"Chat stream error: {e}")
            yield f"data: {json.dumps({'error': 'Stream failed'})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "X-Session-ID": session_id,
        },
    )
