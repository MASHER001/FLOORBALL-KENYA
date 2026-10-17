"""
Draw generation service.

Algorithms:
    - round_robin     : everyone plays everyone (single group)
    - groups_knockout : split into N groups, round robin within each
    - single_elim     : seeded bracket

Pots: if provided, teams are assigned so that each group gets at
most one team per pot. If not provided, teams are distributed
snake-style across groups by seed order.
"""

import random
from typing import Any
from uuid import uuid4

from fastapi import HTTPException, status

from app.modules.audit import service as audit
from app.modules.draws import repository as repo
from app.modules.draws.schemas import DrawGenerateRequest


def _validate_request(payload: DrawGenerateRequest) -> None:
    total_teams = len(payload.teams)
    if payload.pots:
        pot_total = sum(len(p.team_ids) for p in payload.pots)
        if pot_total != total_teams:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "Sum of teams across pots must equal total teams",
            )

        # No team should appear in two pots.
        seen: set[str] = set()
        for pot in payload.pots:
            for tid in pot.team_ids:
                key = str(tid)
                if key in seen:
                    raise HTTPException(
                        status.HTTP_400_BAD_REQUEST,
                        f"Team {tid} appears in more than one pot",
                    )
                seen.add(key)

    if payload.format == "groups_knockout" and payload.num_groups < 2:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "groups_knockout requires at least 2 groups",
        )

    if total_teams < 2:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "At least 2 teams are required",
        )


def _allocate_to_groups(
    team_ids: list[str],
    pots: list[list[str]],
    num_groups: int,
    rng: random.Random,
) -> dict[str, list[str]]:
    """
    Returns {group_index: [team_id, ...]}.
    Each pot is distributed one team per group where possible.
    """
    groups: dict[int, list[str]] = {i: [] for i in range(num_groups)}

    if pots:
        for pot in pots:
            pot_copy = list(pot)
            rng.shuffle(pot_copy)
            # Give one team per group, in order.
            for idx, team_id in enumerate(pot_copy):
                group_index = idx % num_groups
                groups[group_index].append(team_id)
    else:
        shuffled = list(team_ids)
        rng.shuffle(shuffled)
        # Snake distribution for balance.
        direction = 1
        gi = 0
        for team_id in shuffled:
            groups[gi].append(team_id)
            gi += direction
            if gi == num_groups:
                gi = num_groups - 1
                direction = -1
            elif gi < 0:
                gi = 0
                direction = 1

    return groups


def generate_draw(
    payload: DrawGenerateRequest, created_by: str
) -> dict[str, Any]:
    _validate_request(payload)

    # Deterministic if seed provided.
    rng = random.Random(payload.seed) if payload.seed else random.Random()

    team_ids = [str(t.team_id) for t in payload.teams]
    pots_lists = [[str(tid) for tid in p.team_ids] for p in payload.pots]

    version = repo.next_version(str(payload.tournament_id))

    draw = repo.insert_draw(
        {
            "tournament_id": str(payload.tournament_id),
            "version": version,
            "algorithm": f"{payload.format}_v1",
            "seed": payload.seed,
            "status": "draft",
            "created_by": created_by,
            "notes": payload.notes,
        }
    )

    draw_id = draw["id"]

    # Allocate teams to groups.
    if payload.format == "round_robin":
        groups = {0: team_ids}
        num_groups = 1
    else:
        num_groups = payload.num_groups
        groups = _allocate_to_groups(team_ids, pots_lists, num_groups, rng)

    # Persist group ids as strings so we can reference them in entries.
    group_ids = {i: str(uuid4()) for i in range(num_groups)}

    entries: list[dict[str, Any]] = []
    for gi, members in groups.items():
        for position, team_id in enumerate(members, start=1):
            entries.append(
                {
                    "draw_id": draw_id,
                    "team_id": team_id,
                    "pot_id": None,
                    "group_id": group_ids[gi] if num_groups > 1 else None,
                    "position": position,
                }
            )

    repo.insert_entries(entries)

    audit.log_action(
        actor={"id": created_by},
        action="draw.generate",
        resource_type="tournament_draw",
        resource_id=draw_id,
        metadata={
            "tournament_id": str(payload.tournament_id),
            "format": payload.format,
            "num_groups": num_groups,
            "team_count": len(team_ids),
            "version": version,
        },
    )

    return repo.get_draw(draw_id) or draw


def approve_draw(draw_id: str, actor_id: str, notes: str | None = None) -> dict[str, Any]:
    existing = repo.get_draw(draw_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Draw not found")

    if existing["status"] != "draft":
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Cannot approve draw in status '{existing['status']}'",
        )

    from datetime import datetime, timezone

    updated = repo.update_draw(
        draw_id,
        {
            "status": "approved",
            "approved_by": actor_id,
            "approved_at": datetime.now(timezone.utc).isoformat(),
            "notes": notes or existing.get("notes"),
        },
    ) or existing

    audit.log_action(
        actor={"id": actor_id},
        action="draw.approve",
        resource_type="tournament_draw",
        resource_id=draw_id,
        metadata={"from_status": existing["status"], "to_status": "approved"},
    )
    return updated


def publish_draw(draw_id: str, actor_id: str) -> dict[str, Any]:
    existing = repo.get_draw(draw_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Draw not found")

    if existing["status"] != "approved":
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Only approved draws can be published",
        )

    updated = repo.update_draw(draw_id, {"status": "published"}) or existing

    audit.log_action(
        actor={"id": actor_id},
        action="draw.publish",
        resource_type="tournament_draw",
        resource_id=draw_id,
        metadata={"from_status": existing["status"], "to_status": "published"},
    )
    return updated
