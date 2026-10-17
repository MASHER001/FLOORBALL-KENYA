"""
Official assignment engine.

For a given fixture, pick up to three officials:
    - empire_1
    - empire_2
    - table_referee

Selection rules:
    1. Only verified officials.
    2. Must hold the required qualification (if specified).
    3. Must be available on the fixture's date.
    4. Must not already be assigned to another fixture at the same time.
    5. Ranked by fewest existing assignments (workload balance).
    6. If fewer than 3 suitable officials, return partial and flag.
"""

from datetime import datetime, timedelta, timezone
from typing import Any

from app.modules.officials import repository as repo


ROLES = ["empire_1", "empire_2", "table_referee"]


def _fixture_date(fixture: dict[str, Any]) -> str | None:
    k = fixture.get("kickoff_at")
    if not k:
        return None
    if isinstance(k, datetime):
        d = k
    else:
        d = datetime.fromisoformat(str(k).replace("Z", "+00:00"))
    return d.date().isoformat()


def _overlaps(candidate_fixture_time: str, other_time: str, window_minutes: int = 120) -> bool:
    def parse(t):
        return datetime.fromisoformat(str(t).replace("Z", "+00:00")).astimezone(timezone.utc)

    try:
        a = parse(candidate_fixture_time)
        b = parse(other_time)
    except Exception:
        return False
    delta = abs((a - b).total_seconds())
    return delta < window_minutes * 60


def _build_busy_index(official_ids: list[str]) -> dict[str, list[str]]:
    """
    For each official, list the kickoff times of fixtures they're assigned to
    (excluding declined/replaced assignments).
    """
    busy: dict[str, list[str]] = {oid: [] for oid in official_ids}
    for oid in official_ids:
        for a in repo.assignments_for_official(oid):
            if a["status"] in ("declined", "replaced"):
                continue
            fixture = repo.get_fixture(a["match_id"])
            if fixture and fixture.get("kickoff_at"):
                busy[oid].append(fixture["kickoff_at"])
    return busy


def assign_officials_to_fixture(
    fixture: dict[str, Any],
    required_qualification: str | None = None,
) -> dict[str, Any]:
    """
    Assign up to ROLES.length officials to one fixture.
    Returns dict with 'assigned' list and 'unfilled' list of role names.
    """
    fixture_date = _fixture_date(fixture)
    if not fixture_date:
        return {"assigned": [], "unfilled": ROLES.copy(), "reason": "fixture has no kickoff_at"}

    candidates = repo.list_all(limit=500)
    verified = [c for c in candidates if c.get("is_verified")]

    if required_qualification:
        qualified_ids = set(repo.officials_with_qualification(required_qualification))
        verified = [c for c in verified if c["id"] in qualified_ids]

    available = [c for c in verified if repo.is_available(c["id"], fixture_date)]

    official_ids = [c["id"] for c in available]
    busy = _build_busy_index(official_ids)

    # Filter out officials already committed at the fixture's kickoff time
    kickoff = fixture["kickoff_at"]
    free = []
    for c in available:
        conflicts = busy.get(c["id"], [])
        if any(_overlaps(kickoff, t) for t in conflicts):
            continue
        free.append(c)

    # Rank by workload (fewest existing assignments)
    free.sort(key=lambda c: len(busy.get(c["id"], [])))

    # Also exclude officials already assigned to this same match (idempotency)
    already = {a["official_id"] for a in repo.assignments_for_match(fixture["id"])}
    free = [c for c in free if c["id"] not in already]

    assigned = []
    unfilled = []

    for role in ROLES:
        if not free:
            unfilled.append(role)
            continue
        chosen = free.pop(0)
        row = repo.insert_assignment({
            "match_id": fixture["id"],
            "official_id": chosen["id"],
            "role": role,
            "status": "pending",
        })
        assigned.append(row)

    return {
        "match_id": fixture["id"],
        "assigned": assigned,
        "unfilled": unfilled,
    }
