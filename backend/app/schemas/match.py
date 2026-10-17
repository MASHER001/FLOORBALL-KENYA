"""
Match schemas
=============

A match can belong to a season (league) or a tournament.
Recording a result triggers stats + standings recalculation (in services).
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class MatchStatus(str, Enum):
    SCHEDULED = "scheduled"
    LIVE = "live"
    COMPLETED = "completed"
    POSTPONED = "postponed"
    CANCELLED = "cancelled"


# ---------- Create ----------
class MatchCreate(BaseModel):
    season_id: Optional[str] = None
    tournament_id: Optional[str] = None
    home_team_id: str
    away_team_id: str
    venue: Optional[str] = Field(default=None, max_length=120)
    match_date: datetime
    notes: Optional[str] = None


# ---------- Update fixture ----------
class MatchUpdate(BaseModel):
    venue: Optional[str] = None
    match_date: Optional[datetime] = None
    status: Optional[MatchStatus] = None
    notes: Optional[str] = None


# ---------- Goal scorer entry ----------
class GoalScorer(BaseModel):
    player_id: str
    goals: int = Field(..., ge=1, le=20)


# ---------- Record result ----------
class MatchResultCreate(BaseModel):
    home_score: int = Field(..., ge=0, le=99)
    away_score: int = Field(..., ge=0, le=99)
    goal_scorers: list[GoalScorer] = Field(default_factory=list)
    notes: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "home_score": 5,
                "away_score": 3,
                "goal_scorers": [
                    {"player_id": "123", "goals": 3},
                    {"player_id": "456", "goals": 2},
                ],
            }
        }
    }


# ---------- Match event ----------
class MatchEventResponse(BaseModel):
    id: str
    match_id: str
    player_id: Optional[str] = None
    team_id: str
    event_type: str
    minute: Optional[int] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------- Response ----------
class MatchResponse(BaseModel):
    id: str
    season_id: Optional[str] = None
    tournament_id: Optional[str] = None
    home_team_id: str
    away_team_id: str
    venue: Optional[str] = None
    match_date: datetime
    status: MatchStatus
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------- Result response ----------
class MatchResultResponse(BaseModel):
    match: MatchResponse
    events: list[MatchEventResponse]


# ---------- List ----------
class MatchListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[MatchResponse]