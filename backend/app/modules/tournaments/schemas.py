from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class TournamentPublic(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    format: str
    starts_on: Optional[date] = None
    ends_on: Optional[date] = None
    venue: Optional[str] = None
    status: str
    created_at: datetime


class TournamentCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    slug: str = Field(..., min_length=2, max_length=64)
    description: Optional[str] = Field(None, max_length=3000)
    format: str = Field("round_robin",
                        pattern="^(round_robin|groups_knockout|single_elim)$")
    starts_on: Optional[date] = None
    ends_on: Optional[date] = None
    venue: Optional[str] = Field(None, max_length=200)


class TournamentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=3000)
    starts_on: Optional[date] = None
    ends_on: Optional[date] = None
    venue: Optional[str] = Field(None, max_length=200)
    status: Optional[str] = Field(None, pattern="^(draft|open|in_progress|completed|archived)$")


class RegistrationPublic(BaseModel):
    id: UUID
    tournament_id: UUID
    team_id: UUID
    status: str
    registered_at: datetime


class RegistrationCreate(BaseModel):
    team_id: UUID


class RegistrationModerate(BaseModel):
    status: str = Field(..., pattern="^(approved|rejected)$")
