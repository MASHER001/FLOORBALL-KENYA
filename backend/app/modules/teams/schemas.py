from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class TeamPublic(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    home_venue: Optional[str] = None
    is_active: bool
    created_at: datetime


class TeamCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    slug: str = Field(..., min_length=2, max_length=64)
    description: Optional[str] = Field(None, max_length=2000)
    logo_url: Optional[str] = None
    home_venue: Optional[str] = Field(None, max_length=200)


class TeamUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    logo_url: Optional[str] = None
    home_venue: Optional[str] = Field(None, max_length=200)
    is_active: Optional[bool] = None


class MembershipPublic(BaseModel):
    id: UUID
    team_id: UUID
    user_id: UUID
    role: str
    joined_on: Optional[date] = None
    left_on: Optional[date] = None
    is_active: bool


class MembershipCreate(BaseModel):
    user_id: UUID
    role: str = Field("player", pattern="^(player|coach|manager)$")
    joined_on: Optional[date] = None
