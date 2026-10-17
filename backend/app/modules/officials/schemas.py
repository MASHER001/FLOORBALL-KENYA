from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class OfficialPublic(BaseModel):
    id: UUID
    user_id: UUID
    full_name: str
    phone: Optional[str] = None
    experience_years: int
    is_verified: bool
    created_at: datetime


class OfficialRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=200)
    phone: Optional[str] = Field(None, max_length=32)
    experience_years: int = Field(0, ge=0, le=60)


class AvailabilityCreate(BaseModel):
    available_on: date
    notes: Optional[str] = Field(None, max_length=500)


class QualificationCreate(BaseModel):
    qualification: str = Field(..., min_length=2, max_length=64)
    issued_on: Optional[date] = None
    expires_on: Optional[date] = None
    certificate_url: Optional[str] = None


class QualificationPublic(BaseModel):
    id: UUID
    official_id: UUID
    qualification: str
    issued_on: Optional[date] = None
    expires_on: Optional[date] = None
    certificate_url: Optional[str] = None


class AssignmentPublic(BaseModel):
    id: UUID
    match_id: UUID
    official_id: UUID
    role: str
    status: str
    assigned_at: datetime
    responded_at: Optional[datetime] = None
    notes: Optional[str] = None


class AssignmentResponse(BaseModel):
    status: str = Field(..., pattern="^(accepted|declined)$")
    notes: Optional[str] = Field(None, max_length=500)


class BulkAssignRequest(BaseModel):
    tournament_id: UUID
    required_qualification: Optional[str] = Field(None, max_length=64)
