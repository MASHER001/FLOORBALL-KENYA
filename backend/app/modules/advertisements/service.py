"""
Business rules for advertisements.

Public read returns only campaigns that are:
    - status = 'active'
    - starts_at is null OR starts_at <= now()
    - ends_at   is null OR ends_at   >= now()

State-changing operations write an entry to the audit log via
`app.modules.audit.service.log_action`.
"""

from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException, status

from app.modules.advertisements import repository as repo
from app.modules.advertisements.models import CampaignStatus
from app.modules.advertisements.schemas import (
    AdvertisementPublic,
    CampaignCreate,
    CampaignUpdate,
)
from app.modules.audit import service as audit


# ============================================================
# Helpers
# ============================================================

def _now() -> datetime:
    return datetime.now(timezone.utc)


def _parse_dt(value: Any) -> datetime | None:
    if not value:
        return None
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    return datetime.fromisoformat(str(value).replace("Z", "+00:00"))


def _is_within_window(campaign: dict[str, Any], now: datetime) -> bool:
    s = _parse_dt(campaign.get("starts_at"))
    e = _parse_dt(campaign.get("ends_at"))
    if s and s > now:
        return False
    if e and e < now:
        return False
    return True


def _to_public(campaign: dict[str, Any]) -> AdvertisementPublic:
    return AdvertisementPublic(
        id=campaign["id"],
        title=campaign["title"],
        subtitle=campaign.get("subtitle"),
        description=campaign.get("description"),
        campaign_type=campaign["campaign_type"],
        destination_url=campaign.get("destination_url"),
        starts_at=campaign.get("starts_at"),
        ends_at=campaign.get("ends_at"),
        is_paid=campaign.get("is_paid", False),
        creatives=campaign.get("advertisement_creatives", []) or [],
    )


# ============================================================
# Public reads
# ============================================================

def list_active_campaigns() -> list[AdvertisementPublic]:
    rows = repo.list_campaigns(status=CampaignStatus.ACTIVE.value, limit=200)
    now = _now()
    return [_to_public(r) for r in rows if _is_within_window(r, now)]


def list_active_for_placement(slug: str) -> list[AdvertisementPublic]:
    placement = repo.get_placement_by_slug(slug)
    if not placement:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"Unknown placement '{slug}'"
        )
    rows = repo.list_campaigns_for_placement(placement["id"])
    now = _now()
    return [_to_public(r) for r in rows if _is_within_window(r, now)]


def get_public_campaign(campaign_id: str) -> AdvertisementPublic:
    row = repo.get_campaign_by_id(campaign_id)
    if not row or row["status"] != CampaignStatus.ACTIVE.value:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Campaign not found")
    if not _is_within_window(row, _now()):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Campaign not found")
    return _to_public(row)


# ============================================================
# Admin lifecycle
# ============================================================

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
        metadata={
            "from_status": existing["status"],
            "reason": reason,
        },
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
        metadata={
            "from_status": existing["status"],
            "to_status": new_status,
        },
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