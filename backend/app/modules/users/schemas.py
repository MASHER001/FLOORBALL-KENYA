from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class ProfilePublic(BaseModel):
    id: UUID
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: str
    is_active: bool
    created_at: Optional[datetime] = None


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=200)
    phone: Optional[str] = Field(None, max_length=32)


class UserStatusUpdate(BaseModel):
    is_active: bool


class RoleUpdate(BaseModel):
    role: str = Field(..., pattern="^(super_admin|admin|competition_manager|match_official|team_manager|player|vendor|customer)$")
