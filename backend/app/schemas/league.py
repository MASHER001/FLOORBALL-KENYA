"""
League schemas
==============

Leagues contain seasons; seasons contain teams and matches.
Standings are computed from team_statistics.
"""

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


# ---------- League ----------
class LeagueBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    description: Optional[str] = None
    logo_url: Optional[str] = None
    category: Optional[str] = Field(default=None, max_length=40)


class LeagueCreate(LeagueBase):
    pass


class LeagueUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None


class LeagueResponse(LeagueBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------- Season ----------
class SeasonBase(BaseModel):
    league_id: str
    name: str = Field(..., min_length=2, max_length=40)
    start_date: date
    end_date: date
    is_current: bool = False


class SeasonCreate(SeasonBase):
    pass


class SeasonUpdate(BaseModel):
    name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None


class SeasonResponse(SeasonBase):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------- League Teams ----------
class LeagueTeamAdd(BaseModel):
    team_id: str


# ---------- Standings row ----------
class StandingRow(BaseModel):
    position: int
    team_id: str
    team_name: str
    played: int
    won: int
    drawn: int
    lost: int
    goals_for: int
    goals_against: int
    goal_difference: int
    points: int


class StandingsResponse(BaseModel):
    season_id: str
    league_id: str
    table: list[StandingRow]


# ---------- List ----------
class LeagueListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[LeagueResponse]