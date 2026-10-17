"""
Auth schemas
============

Models for registration, login, and the /auth/me response.

Note: We do NOT handle passwords ourselves — Supabase Auth does.
These schemas are the payloads we forward to Supabase's Auth API
and the shapes we return to the frontend.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ---------- Roles ----------
class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    TEAM_MANAGER = "team_manager"
    PLAYER = "player"
    VENDOR = "vendor"
    CUSTOMER = "customer"


# ---------- Register ----------
class RegisterRequest(BaseModel):
    """Payload sent by the frontend to create a new account."""

    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)
    full_name: str = Field(..., min_length=2, max_length=120)
    phone: Optional[str] = Field(default=None, max_length=20)
    role: UserRole = UserRole.CUSTOMER

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "player@example.com",
                "password": "password123",
                "full_name": "John Kamau",
                "phone": "0712345678",
                "role": "player",
            }
        }
    }


# ---------- Login ----------
class LoginRequest(BaseModel):
    """Payload sent by the frontend to authenticate."""

    email: EmailStr
    password: str = Field(..., min_length=1)

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "vikingsmasha36@gmail.com",
                "password": "CAPTAIN@chaos",
            }
        }
    }


class TokenResponse(BaseModel):
    """Supabase Auth session returned after successful login."""

    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int
    user: "AuthUser"


class AuthUser(BaseModel):
    """Minimal user identity from Supabase Auth."""

    id: str
    email: Optional[EmailStr] = None


# ---------- /auth/me ----------
class MeResponse(BaseModel):
    """Current authenticated user's full profile."""

    id: str
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: UserRole
    profile_image: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------- Logout ----------
class LogoutResponse(BaseModel):
    success: bool = True
    message: str = "Logged out successfully"


# Forward-ref resolution
TokenResponse.model_rebuild()