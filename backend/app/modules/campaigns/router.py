"""
Campaign admin lifecycle endpoints.

    GET   /admin/advertisements
    POST  /admin/advertisements
    PATCH /admin/advertisements/{id}
    POST  /admin/advertisements/{id}/approve
    POST  /admin/advertisements/{id}/reject
    POST  /admin/advertisements/{id}/schedule
    POST  /admin/advertisements/{id}/placements
"""

from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.modules.campaigns import service
from app.modules.campaigns.permissions import require_campaign_manager
from app.modules.campaigns.schemas import (
    AssignPlacementRequest,
    CampaignAdmin,
    CampaignCreate,
    CampaignRejectRequest,
    CampaignUpdate,
)
from app.modules.advertisements.models import CampaignStatus

router = APIRouter(tags=["Campaigns"])


@router.get(
    "/admin/advertisements",
    response_model=list[CampaignAdmin],
    summary="List all campaigns (admin)",
)
def admin_list(
    status_filter: CampaignStatus | None = None,
    limit: int = 50,
    offset: int = 0,
    _user=Depends(require_campaign_manager),
):
    return service.list_campaigns(
        status_filter=status_filter.value if status_filter else None,
        limit=limit,
        offset=offset,
    )


@router.post(
    "/admin/advertisements",
    response_model=CampaignAdmin,
    status_code=status.HTTP_201_CREATED,
    summary="Create a campaign (admin)",
)
def admin_create(
    payload: CampaignCreate,
    user=Depends(require_campaign_manager),
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
    user=Depends(require_campaign_manager),
):
    return service.update_campaign(str(campaign_id), payload, actor_id=user["id"])


@router.post(
    "/admin/advertisements/{campaign_id}/approve",
    response_model=CampaignAdmin,
    summary="Approve a campaign (admin)",
)
def admin_approve(
    campaign_id: UUID,
    user=Depends(require_campaign_manager),
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
    user=Depends(require_campaign_manager),
):
    return service.reject_campaign(
        str(campaign_id), reason=payload.reason, actor_id=user["id"]
    )


@router.post(
    "/admin/advertisements/{campaign_id}/schedule",
    response_model=CampaignAdmin,
    summary="Schedule an approved campaign (admin)",
)
def admin_schedule(
    campaign_id: UUID,
    user=Depends(require_campaign_manager),
):
    return service.schedule_campaign(str(campaign_id), actor_id=user["id"])


@router.post(
    "/admin/advertisements/{campaign_id}/placements",
    status_code=status.HTTP_201_CREATED,
    summary="Assign a campaign to a placement (admin)",
)
def admin_assign_placement(
    campaign_id: UUID,
    payload: AssignPlacementRequest,
    user=Depends(require_campaign_manager),
):
    return service.assign_campaign_to_placement(
        str(campaign_id), payload.placement_slug, actor_id=user["id"]
    )
