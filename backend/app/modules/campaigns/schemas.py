"""
Pydantic schemas for campaign management.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl

from app.modules.advertisements.models import CampaignStatus, CampaignType


class CampaignCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    subtitle: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    campaign_type: CampaignType = CampaignType.EVENT_PROMOTION
    destination_url: Optional[HttpUrl] = None
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    advertiser_id: Optional[UUID] = None
    priority: int = 0
    is_paid: bool = False
    budget_cents: Optional[int] = None


class CampaignUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    subtitle: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    campaign_type: Optional[CampaignType] = None
    destination_url: Optional[HttpUrl] = None
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    priority: Optional[int] = None
    is_paid: Optional[bool] = None
    budget_cents: Optional[int] = None


class CampaignAdmin(BaseModel):
    id: UUID
    advertiser_id: Optional[UUID] = None
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    campaign_type: CampaignType
    status: CampaignStatus
    destination_url: Optional[str] = None
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    priority: int = 0
    is_paid: bool = False
    budget_cents: Optional[int] = None
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class CampaignRejectRequest(BaseModel):
    reason: str = Field(..., min_length=3, max_length=500)


class AssignPlacementRequest(BaseModel):
    placement_slug: str = Field(..., min_length=2, max_length=64)
