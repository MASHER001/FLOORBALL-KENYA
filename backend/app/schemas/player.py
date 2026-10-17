"""
Player schemas
==============

Players belong to teams via `team_players`.
"""

from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class PlayerPosition(str, Enum):
    GOALKEEPER = "goalkeeper"
    DEFENDER = "defender"
    FORWARD = "forward"
    CENTER = "center"


class PlayerGender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


# ---------- Base ----------
class PlayerBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    date_of_birth: Optional[date] = None
    gender: Optional[PlayerGender] = None
    jersey_number: Optional[int] = Field(default=None, ge=0, le=999)
    position: Optional[PlayerPosition] = None
    height_cm: Optional[int] = Field(default=None, ge=50, le=260)
    weight_kg: Optional[int] = Field(default=None, ge=20, le=200)
    photo_url: Optional[str] = None


# ---------- Create ----------
class PlayerCreate(PlayerBase):
    """If user_id is omitted, it's taken from the JWT (self-registration)."""

    user_id: Optional[str] = None


# ---------- Update ----------
class PlayerUpdate(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[PlayerGender] = None
    jersey_number: Optional[int] = None
    position: Optional[PlayerPosition] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[int] = None
    photo_url: Optional[str] = None
    is_active: Optional[bool] = None


# ---------- Response ----------
class PlayerResponse(PlayerBase):
    id: str
    user_id: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------- Statistics ----------
class PlayerStatLine(BaseModel):
    player_id: str
    season_id: Optional[str] = None
    matches_played: int = 0
    goals: int = 0
    assists: int = 0
    yellow_cards: int = 0
    red_cards: int = 0
    minutes_played: int = 0


# ---------- Assign to team ----------
class PlayerTeamAssign(BaseModel):
    team_id: Optional[str] = None   # None = remove from current team


# ---------- List ----------
class PlayerListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[PlayerResponse]