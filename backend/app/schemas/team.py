"""
Team schemas
============

Teams are managed by team_managers and admins.
"""

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


# ---------- Base ----------
class TeamBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    short_name: Optional[str] = Field(default=None, max_length=20)
    logo_url: Optional[str] = None
    county: Optional[str] = Field(default=None, max_length=60)
    city: Optional[str] = Field(default=None, max_length=60)
    founded_year: Optional[int] = Field(default=None, ge=1800, le=2100)
    description: Optional[str] = None


# ---------- Create ----------
class TeamCreate(TeamBase):
    """Create a team. The manager_id is taken from the JWT."""


# ---------- Update ----------
class TeamUpdate(BaseModel):
    name: Optional[str] = None
    short_name: Optional[str] = None
    logo_url: Optional[str] = None
    county: Optional[str] = None
    city: Optional[str] = None
    founded_year: Optional[int] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


# ---------- Response ----------
class TeamResponse(TeamBase):
    id: str
    manager_id: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------- Roster ----------
class RosterAddRequest(BaseModel):
    player_id: str
    joined_at: Optional[date] = None


class RosterEntry(BaseModel):
    id: str
    team_id: str
    player_id: str
    joined_at: date
    left_at: Optional[date] = None
    is_active: bool


# ---------- List ----------
class TeamListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[TeamResponse]