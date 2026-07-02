"""Lightweight resume knowledge base.

The entire knowledge base is a small set of documents (a resume PDF / text
files) that comfortably fit inside a modern LLM context window, so there is no
need for a vector database or embedding model. We simply extract the text once,
cache it in memory, and hand it to the model as context.
"""

import logging
from pathlib import Path

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).parent.parent.parent / "data"

# Cap the context we inject so a very large document can't blow the token budget.
MAX_CONTEXT_CHARS = 12000

FALLBACK_CONTEXT = """
I am Ajay Shekhawat, a software engineer passionate about building intelligent
systems. My experience spans full-stack development, machine learning, and
DevOps. I enjoy solving complex problems and building cool projects.
"""

_CACHED_CONTEXT: str | None = None


def _extract_pdf(pdf_path: Path) -> str:
    import pdfplumber

    with pdfplumber.open(pdf_path) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)


def load_context() -> str:
    """Read and cache all resume documents in data/ as a single context string."""
    global _CACHED_CONTEXT
    if _CACHED_CONTEXT is not None:
        return _CACHED_CONTEXT

    parts: list[str] = []

    if DATA_DIR.exists():
        for pdf_path in sorted(DATA_DIR.glob("*.pdf")):
            try:
                text = _extract_pdf(pdf_path)
                if text.strip():
                    parts.append(text.strip())
                    logger.info(f"Loaded PDF: {pdf_path.name}")
            except Exception as e:
                logger.error(f"Failed to load {pdf_path}: {e}")

        for txt_path in sorted(DATA_DIR.glob("*.txt")):
            try:
                text = txt_path.read_text(encoding="utf-8")
                if text.strip():
                    parts.append(text.strip())
                    logger.info(f"Loaded TXT: {txt_path.name}")
            except Exception as e:
                logger.error(f"Failed to load {txt_path}: {e}")

    if not parts:
        logger.warning("No documents found in data/. Using fallback context.")
        _CACHED_CONTEXT = FALLBACK_CONTEXT.strip()
    else:
        combined = "\n\n---\n\n".join(parts)
        _CACHED_CONTEXT = combined[:MAX_CONTEXT_CHARS]

    return _CACHED_CONTEXT


async def get_rag_context(query: str) -> str:
    """Return the knowledge-base context for a query.

    The corpus is tiny, so we return the full cached document text rather than
    doing similarity search. `query` is accepted for API compatibility.
    """
    return load_context()
