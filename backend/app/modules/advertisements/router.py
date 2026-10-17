"""
Advertisements router.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.database.supabase import get_supabase_admin
from app.modules.advertisements import repository as repo
from app.modules.advertisements import service
from app.modules.advertisements.models import CampaignStatus
from app.modules.advertisements.permissions import require_ad_manager
from app.modules.advertisements.schemas import (
    AdvertisementPublic,
    AssignPlacementRequest,
    CampaignAdmin,
    CampaignCreate,
    CampaignRejectRequest,
    CampaignUpdate,
)

router = APIRouter(tags=["Advertisements"])


@router.get(
    "/advertisements/active",
    response_model=list[AdvertisementPublic],
    summary="List active public campaigns",
)
def list_active():
    return service.list_active_campaigns()


@router.get(
    "/advertisements/placements/{slug}",
    response_model=list[AdvertisementPublic],
    summary="List active campaigns for a placement",
)
def list_for_placement(slug: str):
    return service.list_active_for_placement(slug)


@router.get(
    "/advertisements/{campaign_id}",
    response_model=AdvertisementPublic,
    summary="Get a single active campaign",
)
def get_one(campaign_id: UUID):
    return service.get_public_campaign(str(campaign_id))



@router.get(
    "/admin/advertisements",
    response_model=list[CampaignAdmin],
    summary="List all campaigns (admin)",
)
def admin_list(
    status_filter: CampaignStatus | None = None,
    limit: int = 50,
    offset: int = 0,
    _user=Depends(require_ad_manager),
):
    rows = repo.list_campaigns(
        status=status_filter.value if status_filter else None,
        limit=limit,
        offset=offset,
    )
    return rows


@router.post(
    "/admin/advertisements",
    response_model=CampaignAdmin,
    status_code=status.HTTP_201_CREATED,
    summary="Create a campaign (admin)",
)
def admin_create(
    payload: CampaignCreate,
    user=Depends(require_ad_manager),
):
    return service.create_campaign(payload, created_by=user["id"])


@router.patch(
    "/admin/advertisements/{campaign_id}",
    response_model=CampaignAdmin,
    summary="Update a campaign (admin)",
)
def admin_update(
    campaign_id: UUID,
    payload: CampaignUpdate,
    _user=Depends(require_ad_manager),
):
    return service.update_campaign(str(campaign_id), payload)


@router.post(
    "/admin/advertisements/{campaign_id}/approve",
    response_model=CampaignAdmin,
    summary="Approve a campaign (admin)",
)
def admin_approve(
    campaign_id: UUID,
    user=Depends(require_ad_manager),
):
    return service.approve_campaign(str(campaign_id), approved_by=user["id"])


@router.post(
    "/admin/advertisements/{campaign_id}/reject",
    response_model=CampaignAdmin,
    summary="Reject a campaign (admin)",
)
def admin_reject(
    campaign_id: UUID,
    payload: CampaignRejectRequest,
    _user=Depends(require_ad_manager),
):
    return service.reject_campaign(str(campaign_id), reason=payload.reason)


@router.post(
    "/admin/advertisements/{campaign_id}/schedule",
    response_model=CampaignAdmin,
    summary="Schedule an approved campaign (admin)",
)
def admin_schedule(
    campaign_id: UUID,
    _user=Depends(require_ad_manager),
):
    return service.schedule_campaign(str(campaign_id))


@router.post(
    "/admin/advertisements/{campaign_id}/placements",
    status_code=status.HTTP_201_CREATED,
    summary="Assign a campaign to a placement (admin)",
)
def admin_assign_placement(
    campaign_id: UUID,
    payload: AssignPlacementRequest,
    _user=Depends(require_ad_manager),
):
    return service.assign_campaign_to_placement(
        str(campaign_id), payload.placement_slug
    )
