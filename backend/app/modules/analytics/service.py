"""
Analytics business logic.

Dedup strategy:
    dedup_key = f"{campaign_id}:{visitor_hash}:{hour_bucket}:{event_type}"

The database has a UNIQUE constraint on dedup_key, so a repeated
impression or click within the same hour bucket is silently dropped.
"""

import hashlib
from datetime import date, datetime, timezone
from typing import Any, Optional

from app.core.config import settings
from app.modules.analytics import repository as repo
from app.modules.analytics.schemas import (
    AnalyticsSummary,
    CampaignAnalytics,
    PlacementAnalytics,
)


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _hour_bucket(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%dT%H")


def _visitor_hash(ip: str | None, user_agent: str | None) -> str:
    """
    Stable per-day anonymous visitor id.
    Not reversible, not linkable across days.
    """
    salt = settings.SUPABASE_URL or "floorballkenya"
    day = _now().strftime("%Y-%m-%d")
    raw = f"{ip or 'unknown'}|{user_agent or 'unknown'}|{salt}|{day}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:32]


def _dedup_key(
    campaign_id: str, visitor_hash: str, bucket: str, event_type: str
) -> str:
    return f"{campaign_id}:{visitor_hash}:{bucket}:{event_type}"


def track_event(
    campaign_id: str,
    placement_slug: Optional[str],
    event_type: str,
    ip: Optional[str],
    user_agent: Optional[str],
) -> bool:
    """
    Record an impression or click. Returns True if recorded,
    False if it was a duplicate within the hour bucket.
    """
    placement_id = None
    if placement_slug:
        placement = repo.get_placement_by_slug(placement_slug)
        if placement:
            placement_id = placement["id"]

    now = _now()
    bucket = _hour_bucket(now)
    visitor = _visitor_hash(ip, user_agent)
    key = _dedup_key(campaign_id, visitor, bucket, event_type)

    payload = {
        "campaign_id": campaign_id,
        "placement_id": placement_id,
        "event_type": event_type,
        "visitor_hash": visitor,
        "dedup_key": key,
        "occurred_at": now.isoformat(),
    }
    result = repo.insert_event(payload)
    return result is not None


def _ctr(clicks: int, impressions: int) -> float:
    return round((clicks / impressions) * 100, 2) if impressions else 0.0


def summary(
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
) -> AnalyticsSummary:
    since = (
        datetime.combine(from_date, datetime.min.time())
        .replace(tzinfo=timezone.utc)
        .isoformat()
        if from_date
        else None
    )
    until = (
        datetime.combine(to_date, datetime.max.time())
        .replace(tzinfo=timezone.utc)
        .isoformat()
        if to_date
        else None
    )

    total_impressions = repo.count_events("impression", since=since, until=until)
    total_clicks = repo.count_events("click", since=since, until=until)

    by_campaign: list[CampaignAnalytics] = []
    for cid in repo.list_campaign_ids_with_events():
        title = repo.get_campaign_title(cid) or "(deleted)"
        imp = repo.count_events("impression", campaign_id=cid, since=since, until=until)
        clk = repo.count_events("click", campaign_id=cid, since=since, until=until)
        if imp == 0 and clk == 0:
            continue
        by_campaign.append(
            CampaignAnalytics(
                campaign_id=cid,
                title=title,
                impressions=imp,
                clicks=clk,
                ctr=_ctr(clk, imp),
            )
        )
    by_campaign.sort(key=lambda c: c.impressions, reverse=True)

    by_placement: list[PlacementAnalytics] = []
    for pid in repo.list_placements_with_events():
        placement = repo.get_placement(pid)
        if not placement:
            continue
        imp = repo.count_events("impression", placement_id=pid, since=since, until=until)
        clk = repo.count_events("click", placement_id=pid, since=since, until=until)
        if imp == 0 and clk == 0:
            continue
        by_placement.append(
            PlacementAnalytics(
                placement_id=pid,
                slug=placement["slug"],
                name=placement["name"],
                impressions=imp,
                clicks=clk,
                ctr=_ctr(clk, imp),
            )
        )
    by_placement.sort(key=lambda p: p.impressions, reverse=True)

    return AnalyticsSummary(
        from_date=from_date,
        to_date=to_date,
        total_impressions=total_impressions,
        total_clicks=total_clicks,
        overall_ctr=_ctr(total_clicks, total_impressions),
        by_campaign=by_campaign,
        by_placement=by_placement,
    )
