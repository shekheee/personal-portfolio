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
from app.services.llm import stream_chat
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

    provider = "fallback"
    model = "none"
    token_stream: AsyncIterator[str]

    if settings.anthropic_api_key or settings.openai_api_key or settings.groq_api_key:
        messages = [
            {"role": "system", "content": f"{SYSTEM_PROMPT}\n\nContext about the portfolio owner:\n{context}"},
            {"role": "user", "content": user_message},
        ]
        token_stream, provider, model = await stream_chat(messages, settings)
    else:
        token_stream = _stream_fallback(user_message)

    async def event_stream():
        try:
            async for chunk in token_stream:
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            logger.info("Chat completed session=%s provider=%s model=%s", session_id, provider, model)
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
            "X-LLM-Provider": provider,
            "X-LLM-Model": model,
        },
    )
