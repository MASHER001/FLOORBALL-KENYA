from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class VendorProfile(BaseModel):
    id: UUID
    owner_id: Optional[UUID] = None
    name: str
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    contact_email: Optional[str] = None
    is_verified: bool
    is_active: bool
    created_at: datetime


class VendorProfileUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    logo_url: Optional[str] = None
    contact_email: Optional[str] = None
