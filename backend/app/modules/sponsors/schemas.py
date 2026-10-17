from datetime import datetime
from typing import Any, Optional
from uuid import UUID
from pydantic import BaseModel, Field


class SponsorPublic(BaseModel):
    id: UUID
    name: str
    slug: str
    logo_url: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    tier: Optional[str] = None


class SponsorCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    slug: str = Field(..., min_length=2, max_length=64)
    logo_url: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = Field(None, max_length=2000)
    tier: Optional[str] = Field(None, pattern="^(basic|featured|premium)$")
    is_public: bool = False


class PackageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    price_cents: Optional[int] = Field(None, ge=0)
    benefits: list[str] = Field(default_factory=list)
class SponsorUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    logo_url: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = Field(None, max_length=2000)
    tier: Optional[str] = Field(None, pattern="^(basic|featured|premium)$")
    is_public: Optional[bool] = None