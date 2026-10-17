"""
Pydantic schemas for analytics.
"""

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class TrackEventRequest(BaseModel):
    """Payload sent by the frontend when an ad is shown or clicked."""
    campaign_id: UUID
    placement_slug: Optional[str] = Field(None, max_length=64)


class CampaignAnalytics(BaseModel):
    campaign_id: UUID
    title: str
    impressions: int
    clicks: int
    ctr: float


class PlacementAnalytics(BaseModel):
    placement_id: UUID
    slug: str
    name: str
    impressions: int
    clicks: int
    ctr: float


class AnalyticsSummary(BaseModel):
    from_date: Optional[date] = None
    to_date: Optional[date] = None
    total_impressions: int
    total_clicks: int
    overall_ctr: float
    by_campaign: list[CampaignAnalytics]
    by_placement: list[PlacementAnalytics]
