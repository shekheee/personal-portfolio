from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_name: str = "Resume API"
    environment: str = "development"

    # LLM — Anthropic Fable 5 is primary; OpenAI GPT-5.6 and Groq are fallbacks.
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-fable-5"
    openai_api_key: str = ""
    openai_model: str = "gpt-5.6"
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"

    # Email (SMTP) — optional; contact form degrades gracefully if unset.
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    contact_recipient: str = ""

    # GitHub
    github_token: str = ""
    github_username: str = "shekheee"

    # CORS — comma-separated list of allowed origins.
    allowed_origins: str = "http://localhost:3000,http://localhost:3001"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
