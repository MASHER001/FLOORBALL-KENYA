"""
Fixture generation service.

Given an approved draw (with groups), generate a round-robin
schedule inside each group, spread across days/venues, and store
the fixtures.

Round robin: circle method (Berger tables). Handles odd team counts
by inserting a bye.
"""

from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import UUID

from fastapi import HTTPException, status

from app.modules.audit import service as audit
from app.modules.fixtures import repository as repo
from app.modules.fixtures.schemas import FixtureGenerateReport, FixtureGenerateRequest


def _round_robin_pairs(team_ids: list[str]) -> list[list[tuple[str, str]]]:
    """
    Circle method. Returns rounds, each round is a list of (home, away).
    Adds a bye if odd number of teams.
    """
    teams = list(team_ids)
    if len(teams) % 2 == 1:
        teams.append("__BYE__")

    n = len(teams)
    rounds = n - 1
    half = n // 2

    rotation = teams[1:]  # first team stays fixed
    fixed = teams[0]

    schedule: list[list[tuple[str, str]]] = []
    for _ in range(rounds):
        current = [fixed] + rotation
        pairs = []
        for i in range(half):
            home = current[i]
            away = current[n - 1 - i]
            if home != "__BYE__" and away != "__BYE__":
                pairs.append((home, away))
        schedule.append(pairs)
        rotation = [rotation[-1]] + rotation[:-1]
    return schedule


def _iter_slots(
    start: datetime,
    matches_per_day: int,
    duration_min: int,
    break_min: int,
    total_matches: int,
    venue_ids: list[str],
):
    """
    Yield (kickoff_at, venue_id_or_None) for each match.
    """
    per_day = max(1, matches_per_day)
    step = timedelta(minutes=duration_min + break_min)
    day = start
    count_today = 0
    venue_cycle = venue_ids or [None]

    for _ in range(total_matches):
        if count_today >= per_day:
            day = day + timedelta(days=1)
            day = day.replace(hour=start.hour, minute=start.minute, second=0, microsecond=0)
            count_today = 0

        venue = venue_cycle[count_today % len(venue_cycle)]

        yield day, venue

        day = day + step
        count_today += 1


def generate_fixtures(
    tournament_id: str, payload: FixtureGenerateRequest, created_by: str
) -> FixtureGenerateReport:
    draw = repo.get_draw_with_entries(str(payload.draw_id))
    if not draw:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Draw not found")

    if str(draw["tournament_id"]) != tournament_id:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Draw does not belong to this tournament",
        )

    if draw["status"] not in ("approved", "published"):
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Only approved or published draws can generate fixtures",
        )

    entries = draw.get("tournament_draw_entries") or []
    if not entries:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Draw has no entries")

    # Group teams by group_id (or one group if none).
    groups: dict[str, list[str]] = {}
    for entry in entries:
        gid = entry.get("group_id") or "__ALL__"
        groups.setdefault(gid, []).append(str(entry["team_id"]))

    # Build all (group_id, home, away) tuples.
    matches: list[tuple[str | None, str, str]] = []
    for gid, team_ids in groups.items():
        rounds = _round_robin_pairs(team_ids)
        for round_pairs in rounds:
            for home, away in round_pairs:
                matches.append((None if gid == "__ALL__" else gid, home, away))

        if payload.double_round_robin:
            for round_pairs in rounds:
                for home, away in round_pairs:
                    matches.append(
                        (None if gid == "__ALL__" else gid, away, home)
                    )

    total = len(matches)
    if total == 0:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "No matches to generate"
        )

    start = payload.start_date.astimezone(timezone.utc)
    venue_ids = [str(v) for v in payload.venue_ids]

    rows: list[dict[str, Any]] = []
    for (gid, home, away), (kickoff, venue) in zip(
        matches,
        _iter_slots(
            start,
            payload.matches_per_day,
            payload.match_duration_minutes,
            payload.break_between_matches_minutes,
            total,
            venue_ids,
        ),
    ):
        rows.append(
            {
                "tournament_id": tournament_id,
                "draw_id": str(payload.draw_id),
                "group_id": gid,
                "round": 1,
                "home_team_id": home,
                "away_team_id": away,
                "venue_id": venue,
                "kickoff_at": kickoff.isoformat(),
                "status": "scheduled",
            }
        )

    created = repo.insert_fixtures(rows)
    fixture_ids = [UUID(r["id"]) for r in created]

    repo.insert_generation_run(
        {
            "tournament_id": tournament_id,
            "draw_id": str(payload.draw_id),
            "created_by": created_by,
            "request": payload.model_dump(mode="json"),
            "result_summary": {"created": len(created)},
        }
    )

    audit.log_action(
        actor={"id": created_by},
        action="fixtures.generate",
        resource_type="tournament",
        resource_id=tournament_id,
        metadata={"draw_id": str(payload.draw_id), "created": len(created)},
    )

    return FixtureGenerateReport(
        tournament_id=UUID(tournament_id),
        draw_id=payload.draw_id,
        created=len(created),
        skipped=0,
        conflicts=[],
        fixture_ids=fixture_ids,
    )
