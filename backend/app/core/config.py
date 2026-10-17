"""
Application configuration
=========================

Loads environment variables from `.env` and exposes them
as a typed `settings` singleton.

Usage:
    from app.core.config import settings
    print(settings.SUPABASE_URL)
"""

from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed application settings loaded from environment."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ---------- App ----------
    APP_NAME: str = "FloorballKenya API"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = Field(default="development")  # development | staging | production
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # ---------- Security ----------
    # Comma-separated list of allowed origins for CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"

    # Supabase JWT secret (Project Settings → API → JWT Secret)
    SUPABASE_JWT_SECRET: str = ""
    SUPABASE_JWT_ALGORITHM: str = "HS256"
    SUPABASE_JWT_AUDIENCE: str = "authenticated"

    # ---------- Supabase ----------
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # ---------- M-Pesa (Daraja) ----------
    MPESA_ENV: str = "sandbox"              # sandbox | production
    MPESA_CONSUMER_KEY: str = ""
    MPESA_CONSUMER_SECRET: str = ""
    MPESA_SHORTCODE: str = "174379"
    MPESA_PASSKEY: str = ""
    MPESA_CALLBACK_URL: str = ""

    # ---------- Business rules ----------
    DEFAULT_COMMISSION_RATE: float = 0.10   # 10%

    # ---------- Validators ----------
    @field_validator("ENVIRONMENT")
    @classmethod
    def _validate_env(cls, v: str) -> str:
        allowed = {"development", "staging", "production"}
        if v not in allowed:
            raise ValueError(f"ENVIRONMENT must be one of {allowed}, got '{v}'")
        return v

    @field_validator("DEFAULT_COMMISSION_RATE")
    @classmethod
    def _validate_rate(cls, v: float) -> float:
        if not 0 <= v <= 1:
            raise ValueError("DEFAULT_COMMISSION_RATE must be between 0 and 1")
        return v

    # ---------- Computed helpers ----------
    @property
    def cors_origins(self) -> List[str]:
        """Return ALLOWED_ORIGINS as a clean list."""
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"

    @property
    def supabase_jwks_url(self) -> str:
        """JWKS endpoint for verifying asymmetric Supabase JWTs (future-proof)."""
        return f"{self.SUPABASE_URL}/auth/v1/.well-known/jwks.json"


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor — ensures .env is only parsed once."""
    return Settings()


# Module-level singleton — import this everywhere
settings = get_settings()