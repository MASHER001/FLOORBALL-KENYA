"""
User schemas
============

Profiles are the app's representation of a user (extends auth.users).
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.schemas.auth import UserRole


# ---------- Base ----------
class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=120)
    phone: Optional[str] = Field(default=None, max_length=20)


# ---------- Update own profile ----------
class UserUpdate(BaseModel):
    """Fields a user can change on their own profile."""

    full_name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    phone: Optional[str] = Field(default=None, max_length=20)
    profile_image: Optional[str] = None


# ---------- Admin update ----------
class UserAdminUpdate(BaseModel):
    """Fields an admin can change on any profile."""

    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


# ---------- Status change ----------
class UserStatusUpdate(BaseModel):
    is_active: bool


# ---------- Response ----------
class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: UserRole
    profile_image: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------- Paginated list ----------
class UserListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[UserResponse]