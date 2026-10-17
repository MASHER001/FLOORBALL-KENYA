"""
Campaign lifecycle:
    draft -> approved -> scheduled/active -> expired/archived
    (rejection path: draft/pending -> rejected)

All state changes are written to the audit log.
"""

from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException, status

from app.modules.audit import service as audit
from app.modules.campaigns import repository as repo
from app.modules.campaigns.schemas import CampaignCreate, CampaignUpdate
from app.modules.advertisements.models import CampaignStatus


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _parse_dt(value: Any) -> datetime | None:
    if not value:
        return None
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    return datetime.fromisoformat(str(value).replace("Z", "+00:00"))


def list_campaigns(
    status_filter: str | None, limit: int, offset: int
) -> list[dict[str, Any]]:
    return repo.list_campaigns(status=status_filter, limit=limit, offset=offset)


def create_campaign(payload: CampaignCreate, created_by: str) -> dict[str, Any]:
    data = payload.model_dump(exclude_none=True)
    if "destination_url" in data:
        data["destination_url"] = str(data["destination_url"])
    data["status"] = CampaignStatus.DRAFT.value
    data["created_by"] = created_by

    created = repo.insert_campaign(data)

    audit.log_action(
        actor={"id": created_by},
        action="campaign.create",
        resource_type="advertising_campaign",
        resource_id=created.get("id"),
        metadata={"title": created.get("title")},
    )
    return created


def update_campaign(
    campaign_id: str, payload: CampaignUpdate, actor_id: str | None = None
) -> dict[str, Any]:
    existing = repo.get_campaign_by_id(campaign_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Campaign not found")

    patch = payload.model_dump(exclude_none=True)
    if "destination_url" in patch:
        patch["destination_url"] = str(patch["destination_url"])

    updated = repo.update_campaign(campaign_id, patch) or existing

    audit.log_action(
        actor={"id": actor_id} if actor_id else None,
        action="campaign.update",
        resource_type="advertising_campaign",
        resource_id=campaign_id,
        metadata={"fields": sorted(patch.keys())},
    )
    return updated


def approve_campaign(campaign_id: str, approved_by: str) -> dict[str, Any]:
    existing = repo.get_campaign_by_id(campaign_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Campaign not found")

    if existing["status"] not in (
        CampaignStatus.DRAFT.value,
        CampaignStatus.PENDING_APPROVAL.value,
    ):
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Cannot approve campaign in status '{existing['status']}'",
        )

    patch = {
        "status": CampaignStatus.APPROVED.value,
        "approved_by": approved_by,
        "approved_at": _now().isoformat(),
    }
    updated = repo.update_campaign(campaign_id, patch) or existing

    audit.log_action(
        actor={"id": approved_by},
        action="campaign.approve",
        resource_type="advertising_campaign",
        resource_id=campaign_id,
        metadata={
            "from_status": existing["status"],
            "to_status": CampaignStatus.APPROVED.value,
        },
    )
    return updated


def reject_campaign(
    campaign_id: str, reason: str, actor_id: str | None = None
) -> dict[str, Any]:
    existing = repo.get_campaign_by_id(campaign_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Campaign not found")

    patch = {
        "status": CampaignStatus.REJECTED.value,
        "rejection_reason": reason,
    }
    updated = repo.update_campaign(campaign_id, patch) or existing

    audit.log_action(
        actor={"id": actor_id} if actor_id else None,
        action="campaign.reject",
        resource_type="advertising_campaign",
        resource_id=campaign_id,
        metadata={"from_status": existing["status"], "reason": reason},
    )
    return updated


def schedule_campaign(
    campaign_id: str, actor_id: str | None = None
) -> dict[str, Any]:
    existing = repo.get_campaign_by_id(campaign_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Campaign not found")

    if existing["status"] != CampaignStatus.APPROVED.value:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Only approved campaigns can be scheduled",
        )

    now = _now()
    s = _parse_dt(existing.get("starts_at"))
    e = _parse_dt(existing.get("ends_at"))

    if e and e < now:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Cannot schedule a campaign whose end date is already past",
        )

    new_status = (
        CampaignStatus.ACTIVE.value
        if (s is None or s <= now)
        else CampaignStatus.SCHEDULED.value
    )
    updated = repo.update_campaign(campaign_id, {"status": new_status}) or existing

    audit.log_action(
        actor={"id": actor_id} if actor_id else None,
        action="campaign.schedule",
        resource_type="advertising_campaign",
        resource_id=campaign_id,
        metadata={"from_status": existing["status"], "to_status": new_status},
    )
    return updated


def assign_campaign_to_placement(
    campaign_id: str, placement_slug: str, actor_id: str | None = None
) -> dict[str, Any]:
    existing = repo.get_campaign_by_id(campaign_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Campaign not found")

    placement = repo.get_placement_by_slug(placement_slug)
    if not placement:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"Unknown placement '{placement_slug}'"
        )

    assignment = repo.assign_placement(campaign_id, placement["id"])

    audit.log_action(
        actor={"id": actor_id} if actor_id else None,
        action="campaign.assign_placement",
        resource_type="advertising_campaign",
        resource_id=campaign_id,
        metadata={"placement_slug": placement_slug},
    )
    return assignment
