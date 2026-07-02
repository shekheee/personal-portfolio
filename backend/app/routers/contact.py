from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, field_validator
from app.config import get_settings, Settings
from app.services.email import send_contact_email

router = APIRouter(prefix="/api/contact", tags=["contact"])


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v or len(v) < 2:
            raise ValueError("Name must be at least 2 characters")
        if len(v) > 100:
            raise ValueError("Name too long")
        return v

    @field_validator("message")
    @classmethod
    def message_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v or len(v) < 10:
            raise ValueError("Message must be at least 10 characters")
        if len(v) > 5000:
            raise ValueError("Message too long")
        return v


class ContactResponse(BaseModel):
    success: bool
    message: str


@router.post("", response_model=ContactResponse)
async def contact(request: ContactRequest, settings: Settings = Depends(get_settings)):
    sent = await send_contact_email(
        smtp_host=settings.smtp_host,
        smtp_port=settings.smtp_port,
        smtp_user=settings.smtp_user,
        smtp_password=settings.smtp_password,
        recipient=settings.contact_recipient,
        sender_name=request.name,
        sender_email=str(request.email),
        message=request.message,
    )
    if sent:
        return ContactResponse(success=True, message="Message sent! I'll get back to you soon.")
    # Still return 200 — don't expose server config issues to the client
    return ContactResponse(
        success=True,
        message="Message received! (Email delivery may be delayed — check your config.)",
    )
