import aiosmtplib
from email.message import EmailMessage
import logging

logger = logging.getLogger(__name__)


async def send_contact_email(
    smtp_host: str,
    smtp_port: int,
    smtp_user: str,
    smtp_password: str,
    recipient: str,
    sender_name: str,
    sender_email: str,
    message: str,
) -> bool:
    if not smtp_user or not smtp_password or not recipient:
        logger.warning("SMTP not configured — contact email not sent.")
        return False

    msg = EmailMessage()
    msg["Subject"] = f"[Portfolio Contact] Message from {sender_name}"
    msg["From"] = smtp_user
    msg["To"] = recipient
    msg["Reply-To"] = sender_email
    msg.set_content(
        f"Name: {sender_name}\nEmail: {sender_email}\n\nMessage:\n{message}"
    )

    try:
        await aiosmtplib.send(
            msg,
            hostname=smtp_host,
            port=smtp_port,
            username=smtp_user,
            password=smtp_password,
            start_tls=True,
        )
        return True
    except Exception as e:
        logger.error(f"Failed to send contact email: {e}")
        return False
