"""
Statistics service
==================

Handles post-match bookkeeping:

    record_match_result(match_id, payload)
        1. Update matches (score, status)
        2. Delete old events for this match (idempotent re-record)
        3. Insert new match_events (goals)
        4. Refresh player_statistics for the season
        5. Recalculate team_statistics (standings)

All operations are done as admin (bypasses RLS) since this is a
server-side operation triggered by an admin endpoint.
"""

from typing import Any, Dict, List

from app.database.supabase import get_supabase_admin
from app.services.standings import recalculate_standings


class MatchNotFoundError(Exception):
    pass


class InvalidResultError(Exception):
    pass


def _get_match(match_id: str) -> Dict[str, Any]:
    sb = get_supabase_admin()
    resp = sb.table("matches").select("*").eq("id", match_id).limit(1).execute()
    if not resp.data:
        raise MatchNotFoundError(f"Match {match_id} not found")
    return resp.data[0]


def _clear_match_events(match_id: str) -> None:
    """Delete existing events so re-recording doesn't double-count."""
    sb = get_supabase_admin()
    sb.table("match_events").delete().eq("match_id", match_id).execute()


def _insert_goal_events(
    match_id: str,
    home_team_id: str,
    goal_scorers: List[Dict[str, Any]],
    player_team_map: Dict[str, str],
) -> None:
    """
    Insert one `match_events` row per goal scored.

    `goal_scorers` = [{"player_id": "...", "goals": N}, ...]
    `player_team_map` = {player_id: team_id} — resolved from team_players
    """
    sb = get_supabase_admin()

    rows: List[Dict[str, Any]] = []
    for entry in goal_scorers:
        player_id = entry.get("player_id")
        goals = int(entry.get("goals") or 0)
        if not player_id or goals <= 0:
            continue

        team_id = player_team_map.get(player_id)
        if not team_id:
            # Fallback: skip if we can't resolve their team
            continue

        for _ in range(goals):
            rows.append(
                {
                    "match_id": match_id,
                    "player_id": player_id,
                    "team_id": team_id,
                    "event_type": "goal",
                }
            )

    if rows:
        sb.table("match_events").insert(rows).execute()


def _resolve_player_teams(player_ids: List[str]) -> Dict[str, str]:
    """Look up which team each player currently belongs to."""
    if not player_ids:
        return {}
    sb = get_supabase_admin()
    resp = (
        sb.table("team_players")
        .select("player_id, team_id")
        .in_("player_id", player_ids)
        .eq("is_active", True)
        .execute()
    )
    return {row["player_id"]: row["team_id"] for row in (resp.data or [])}


def refresh_player_statistics(season_id: str) -> None:
    """
    Rebuild `player_statistics` for a season from `match_events`.

    Idempotent — recomputes from source data.
    """
    if not season_id:
        return

    sb = get_supabase_admin()

    # Fetch all events in this season
    events_resp = (
        sb.table("match_events")
        .select("player_id, event_type, match_id, matches!inner(season_id)")
        .eq("matches.season_id", season_id)
        .not_.is_("player_id", "null")
        .execute()
    )

    # Aggregate in memory
    agg: Dict[str, Dict[str, Any]] = {}
    for ev in events_resp.data or []:
        pid = ev["player_id"]
        row = agg.setdefault(
            pid,
            {
                "matches_played": set(),
                "goals": 0,
                "assists": 0,
                "yellow_cards": 0,
                "red_cards": 0,
            },
        )
        row["matches_played"].add(ev["match_id"])
        et = ev["event_type"]
        if et == "goal":
            row["goals"] += 1
        elif et == "assist":
            row["assists"] += 1
        elif et == "yellow_card":
            row["yellow_cards"] += 1
        elif et == "red_card":
            row["red_cards"] += 1

    # Upsert aggregated rows
    for player_id, row in agg.items():
        payload = {
            "player_id": player_id,
            "season_id": season_id,
            "matches_played": len(row["matches_played"]),
            "goals": row["goals"],
            "assists": row["assists"],
            "yellow_cards": row["yellow_cards"],
            "red_cards": row["red_cards"],
        }
        (
            sb.table("player_statistics")
            .upsert(payload, on_conflict="player_id,season_id")
            .execute()
        )


def record_match_result(match_id: str, result: Dict[str, Any]) -> Dict[str, Any]:
    """
    High-level entry point. Given a match_id and a result payload
    (home_score, away_score, goal_scorers), update everything:

        matches → match_events → player_statistics → team_statistics

    Returns a summary dict.
    """
    sb = get_supabase_admin()
    match = _get_match(match_id)

    if match.get("status") == "cancelled":
        raise InvalidResultError("Cannot record result for a cancelled match")

    home_score = int(result.get("home_score", 0))
    away_score = int(result.get("away_score", 0))
    goal_scorers = result.get("goal_scorers") or []

    # ---------- 1. Update the match ----------
    sb.table("matches").update(
        {
            "home_score": home_score,
            "away_score": away_score,
            "status": "completed",
        }
    ).eq("id", match_id).execute()

    # ---------- 2. Reset + insert events ----------
    _clear_match_events(match_id)

    player_ids = [g["player_id"] for g in goal_scorers if g.get("player_id")]
    player_team_map = _resolve_player_teams(player_ids)

    _insert_goal_events(
        match_id=match_id,
        home_team_id=match["home_team_id"],
        goal_scorers=goal_scorers,
        player_team_map=player_team_map,
    )

    # ---------- 3. Refresh player stats ----------
    season_id = match.get("season_id")
    if season_id:
        refresh_player_statistics(season_id)

    # ---------- 4. Recalculate standings (writes team_statistics) ----------
    if season_id:
        recalculate_standings(season_id)

    return {
        "match_id": match_id,
        "season_id": season_id,
        "home_score": home_score,
        "away_score": away_score,
        "events_inserted": sum(int(g.get("goals") or 0) for g in goal_scorers),
    }