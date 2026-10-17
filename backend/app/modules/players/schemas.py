from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class PlayerPublic(BaseModel):
    id: UUID
    user_id: UUID
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    date_of_birth: Optional[date] = None
    height_cm: Optional[int] = None
    bio: Optional[str] = None
    created_at: datetime


class PlayerCreate(BaseModel):
    jersey_number: Optional[int] = Field(None, ge=0, le=99)
    position: Optional[str] = Field(None, pattern="^(forward|defender|goalkeeper)$")
    date_of_birth: Optional[date] = None
    height_cm: Optional[int] = Field(None, ge=100, le=250)
    bio: Optional[str] = Field(None, max_length=2000)


class PlayerUpdate(BaseModel):
    jersey_number: Optional[int] = Field(None, ge=0, le=99)
    position: Optional[str] = Field(None, pattern="^(forward|defender|goalkeeper)$")
    height_cm: Optional[int] = Field(None, ge=100, le=250)
    bio: Optional[str] = Field(None, max_length=2000)
