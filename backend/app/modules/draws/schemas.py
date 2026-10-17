"""
Pydantic schemas for tournament draws.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class TeamRef(BaseModel):
    team_id: UUID
    seed: Optional[int] = None


class PotConfig(BaseModel):
    name: str = Field(..., min_length=1, max_length=64)
    team_ids: list[UUID]


class DrawGenerateRequest(BaseModel):
    tournament_id: UUID
    format: str = Field(..., pattern="^(round_robin|single_elim|groups_knockout)$")
    num_groups: int = Field(1, ge=1, le=16)
    pots: list[PotConfig] = Field(default_factory=list)
    teams: list[TeamRef] = Field(default_factory=list)
    seed: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=1000)


class DrawEntry(BaseModel):
    id: UUID
    team_id: UUID
    pot_id: Optional[UUID] = None
    group_id: Optional[UUID] = None
    position: Optional[int] = None


class DrawPublic(BaseModel):
    id: UUID
    tournament_id: UUID
    version: int
    algorithm: str
    status: str
    seed: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    approved_at: Optional[datetime] = None
    entries: list[DrawEntry] = Field(default_factory=list)


class DrawApproveRequest(BaseModel):
    notes: Optional[str] = Field(None, max_length=1000)
