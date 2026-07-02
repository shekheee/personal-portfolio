from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/visits", tags=["visits"])

# Simple in-memory visit counter. Resets whenever the service restarts, which is
# fine for a portfolio site and avoids needing a database. Swap for a persistent
# store (e.g. Upstash Redis) later if you want durable counts.
_VISIT_COUNT = 0


class VisitResponse(BaseModel):
    count: int


@router.get("", response_model=VisitResponse)
async def get_visits():
    return VisitResponse(count=_VISIT_COUNT)


@router.post("", response_model=VisitResponse)
async def increment_visits():
    global _VISIT_COUNT
    _VISIT_COUNT += 1
    return VisitResponse(count=_VISIT_COUNT)
