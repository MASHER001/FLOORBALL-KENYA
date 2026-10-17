"""
Standings service
=================

Recalculates the league table for a season from scratch based on
all completed matches in that season.

Why recalculate from scratch instead of incrementally?
    - Simpler to reason about
    - Immune to double-recording mistakes
    - Fast enough for MVP (dozens of teams, hundreds of matches)

Points rule:
    - Win  = 3 points
    - Draw = 1 point
    - Loss = 0 points

Tiebreakers (in order):
    1. Points (desc)
    2. Goal difference (desc)
    3. Goals scored (desc)
    4. Team name (asc) — stable fallback
"""

from typing import Any, Dict, List

from app.database.supabase import get_supabase_admin

POINTS_WIN = 3
POINTS_DRAW = 1
POINTS_LOSS = 0


def _empty_row(team_id: str, team_name: str) -> Dict[str, Any]:
    return {
        "team_id": team_id,
        "team_name": team_name,
        "played": 0,
        "won": 0,
        "drawn": 0,
        "lost": 0,
        "goals_for": 0,
        "goals_against": 0,
        "goal_difference": 0,
        "points": 0,
    }


def calculate_standings(season_id: str) -> List[Dict[str, Any]]:
    """
    Compute standings for a season purely in memory (no writes).

    Returns a list of rows sorted by position.
    """
    sb = get_supabase_admin()

    # ---------- 1. All teams registered in this season ----------
    teams_resp = (
        sb.table("league_teams")
        .select("team_id, teams(id, name)")
        .eq("season_id", season_id)
        .execute()
    )

    table: Dict[str, Dict[str, Any]] = {}
    for row in teams_resp.data or []:
        team = row.get("teams") or {}
        team_id = team.get("id") or row.get("team_id")
        team_name = team.get("name") or "Unknown"
        table[team_id] = _empty_row(team_id, team_name)

    # ---------- 2. All completed matches in this season ----------
    matches_resp = (
        sb.table("matches")
        .select("home_team_id, away_team_id, home_score, away_score")
        .eq("season_id", season_id)
        .eq("status", "completed")
        .execute()
    )

    for m in matches_resp.data or []:
        home_id = m["home_team_id"]
        away_id = m["away_team_id"]
        hs = m.get("home_score")
        aws = m.get("away_score")

        if hs is None or aws is None:
            continue  # skip incomplete rows

        if home_id not in table:
            table[home_id] = _empty_row(home_id, "Unknown")
        if away_id not in table:
            table[away_id] = _empty_row(away_id, "Unknown")

        home = table[home_id]
        away = table[away_id]

        home["played"] += 1
        away["played"] += 1
        home["goals_for"] += hs
        home["goals_against"] += aws
        away["goals_for"] += aws
        away["goals_against"] += hs

        if hs > aws:
            home["won"] += 1
            away["lost"] += 1
            home["points"] += POINTS_WIN
        elif hs < aws:
            away["won"] += 1
            home["lost"] += 1
            away["points"] += POINTS_WIN
        else:
            home["drawn"] += 1
            away["drawn"] += 1
            home["points"] += POINTS_DRAW
            away["points"] += POINTS_DRAW

    # ---------- 3. Goal difference ----------
    for row in table.values():
        row["goal_difference"] = row["goals_for"] - row["goals_against"]

    # ---------- 4. Sort ----------
    sorted_rows = sorted(
        table.values(),
        key=lambda r: (
            -r["points"],
            -r["goal_difference"],
            -r["goals_for"],
            r["team_name"].lower(),
        ),
    )

    # ---------- 5. Assign position ----------
    for i, row in enumerate(sorted_rows, start=1):
        row["position"] = i

    return sorted_rows


def recalculate_standings(season_id: str) -> List[Dict[str, Any]]:
    """
    Persist the standings into `team_statistics` for the season.

    Returns the freshly sorted table.
    """
    sb = get_supabase_admin()
    rows = calculate_standings(season_id)

    for row in rows:
        payload = {
            "team_id": row["team_id"],
            "season_id": season_id,
            "played": row["played"],
            "won": row["won"],
            "drawn": row["drawn"],
            "lost": row["lost"],
            "goals_for": row["goals_for"],
            "goals_against": row["goals_against"],
            "goal_difference": row["goal_difference"],
            "points": row["points"],
        }
        (
            sb.table("team_statistics")
            .upsert(payload, on_conflict="team_id,season_id")
            .execute()
        )

    return rows