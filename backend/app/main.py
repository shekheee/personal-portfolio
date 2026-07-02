import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import chat, visits, github, contact
from app.services.rag import load_context

logging.basicConfig(level=logging.INFO, format="%(levelname)s:     %(name)s - %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up Resume API...")
    try:
        context = load_context()
        logger.info(f"Knowledge base ready ({len(context)} chars)")
    except Exception as e:
        logger.warning(f"Knowledge base load skipped: {e}")
    yield
    logger.info("Shutting down Resume API...")


settings = get_settings()

app = FastAPI(
    title="Resume Portfolio API",
    description="Backend for the personal resume portfolio site with RAG chatbot",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(visits.router)
app.include_router(github.router)
app.include_router(contact.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "resume-api"}
