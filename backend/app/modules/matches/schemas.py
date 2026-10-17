from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class MatchEventPublic(BaseModel):
    id: UUID
    match_id: UUID
    event_type: str
    minute: Optional[int] = None
    team_id: Optional[UUID] = None
    player_id: Optional[UUID] = None
    notes: Optional[str] = None
    created_at: datetime


class MatchEventCreate(BaseModel):
    event_type: str = Field(..., pattern="^(goal|penalty|own_goal|yellow|red)$")
    minute: Optional[int] = Field(None, ge=0, le=200)
    team_id: Optional[UUID] = None
    player_id: Optional[UUID] = None
    notes: Optional[str] = Field(None, max_length=500)


class ResultSubmissionCreate(BaseModel):
    home_score: int = Field(..., ge=0, le=99)
    away_score: int = Field(..., ge=0, le=99)


class ResultSubmissionPublic(BaseModel):
    id: UUID
    match_id: UUID
    home_score: int
    away_score: int
    status: str
    reason: Optional[str] = None
    created_at: datetime


class DisputeRequest(BaseModel):
    reason: str = Field(..., min_length=3, max_length=500)


class MatchSummary(BaseModel):
    id: UUID
    tournament_id: UUID
    draw_id: Optional[UUID] = None
    group_id: Optional[UUID] = None
    round: int
    home_team_id: UUID
    away_team_id: UUID
    venue_id: Optional[UUID] = None
    kickoff_at: Optional[datetime] = None
    status: str
    home_score: Optional[int] = None
    away_score: Optional[int] = None


class MatchDetail(MatchSummary):
    events: list[MatchEventPublic] = []