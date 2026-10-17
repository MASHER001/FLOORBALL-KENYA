from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class LeaguePublic(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    is_active: bool
    created_at: datetime


class LeagueCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    slug: str = Field(..., min_length=2, max_length=64)
    description: Optional[str] = Field(None, max_length=2000)
    logo_url: Optional[str] = None


class LeagueUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    logo_url: Optional[str] = None
    is_active: Optional[bool] = None


class SeasonPublic(BaseModel):
    id: UUID
    league_id: UUID
    name: str
    starts_on: Optional[date] = None
    ends_on: Optional[date] = None
    status: str
    created_at: datetime


class SeasonCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    starts_on: Optional[date] = None
    ends_on: Optional[date] = None
    status: str = Field("draft", pattern="^(draft|active|completed|archived)$")
