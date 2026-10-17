"""
Tournament schemas
==================

Teams register for tournaments; admins approve/reject.
"""

from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class TournamentFormat(str, Enum):
    KNOCKOUT = "knockout"
    ROUND_ROBIN = "round_robin"
    GROUP_KNOCKOUT = "group_knockout"


class RegistrationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


# ---------- Tournament ----------
class TournamentBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    description: Optional[str] = None
    logo_url: Optional[str] = None
    format: Optional[TournamentFormat] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    venue: Optional[str] = None
    max_teams: Optional[int] = Field(default=None, ge=2, le=256)
    entry_fee: float = Field(default=0, ge=0)


class TournamentCreate(TournamentBase):
    pass


class TournamentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    format: Optional[TournamentFormat] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    venue: Optional[str] = None
    max_teams: Optional[int] = None
    entry_fee: Optional[float] = None
    is_active: Optional[bool] = None


class TournamentResponse(TournamentBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------- Registration ----------
class RegistrationCreate(BaseModel):
    team_id: str
    notes: Optional[str] = None


class RegistrationDecision(BaseModel):
    status: RegistrationStatus
    notes: Optional[str] = None


class RegistrationResponse(BaseModel):
    id: str
    tournament_id: str
    team_id: str
    status: RegistrationStatus
    notes: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------- List ----------
class TournamentListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[TournamentResponse]