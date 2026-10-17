"""
Pydantic schemas for fixtures.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class FixturePublic(BaseModel):
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


class FixtureGenerateRequest(BaseModel):
    draw_id: UUID
    start_date: datetime
    match_duration_minutes: int = Field(60, ge=15, le=180)
    break_between_matches_minutes: int = Field(15, ge=0, le=120)
    matches_per_day: int = Field(8, ge=1, le=40)
    venue_ids: list[UUID] = Field(default_factory=list)
    double_round_robin: bool = False


class FixtureGenerateReport(BaseModel):
    tournament_id: UUID
    draw_id: UUID
    created: int
    skipped: int
    conflicts: list[str] = Field(default_factory=list)
    fixture_ids: list[UUID] = Field(default_factory=list)
