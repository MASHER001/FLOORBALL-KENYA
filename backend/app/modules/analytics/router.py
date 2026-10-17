"""
Analytics router.

Public:
    POST /advertisements/track/impression
    POST /advertisements/track/click

Admin:
    GET /admin/advertisements/analytics
"""

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Request, status

from app.modules.analytics import service
from app.modules.analytics.permissions import require_analytics_viewer
from app.modules.analytics.schemas import (
    AnalyticsSummary,
    TrackEventRequest,
)

router = APIRouter(tags=["Analytics"])


def _client_ip(request: Request) -> Optional[str]:
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else None


@router.post(
    "/advertisements/track/impression",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Record a campaign impression (dedup per visitor per hour)",
)
def track_impression(payload: TrackEventRequest, request: Request):
    service.track_event(
        campaign_id=str(payload.campaign_id),
        placement_slug=payload.placement_slug,
        event_type="impression",
        ip=_client_ip(request),
        user_agent=request.headers.get("user-agent"),
    )
    return None


@router.post(
    "/advertisements/track/click",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Record a campaign click (dedup per visitor per hour)",
)
def track_click(payload: TrackEventRequest, request: Request):
    service.track_event(
        campaign_id=str(payload.campaign_id),
        placement_slug=payload.placement_slug,
        event_type="click",
        ip=_client_ip(request),
        user_agent=request.headers.get("user-agent"),
    )
    return None


@router.get(
    "/admin/advertisements/analytics",
    response_model=AnalyticsSummary,
    summary="Campaign and placement analytics (admin)",
)
def admin_analytics(
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    _user=Depends(require_analytics_viewer),
):
    return service.summary(from_date=from_date, to_date=to_date)
