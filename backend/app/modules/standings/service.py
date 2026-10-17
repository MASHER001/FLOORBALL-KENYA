from typing import Any
from app.modules.standings import repository as repo
from app.modules.audit import service as audit


def _empty_row(tournament_id: str, team_id: str, group_id: str | None) -> dict[str, Any]:
    return {
        "tournament_id": tournament_id,
        "team_id": team_id,
        "group_id": group_id,
        "played": 0, "won": 0, "drawn": 0, "lost": 0,
        "goals_for": 0, "goals_against": 0, "goal_diff": 0, "points": 0,
    }


def recompute(tournament_id: str, actor_id: str | None = None) -> list[dict[str, Any]]:
    """
    Recalculate standings from confirmed/completed fixtures.
    Idempotent — safe to re-run.
    """
    fixtures = repo.list_completed_fixtures(tournament_id)

    table: dict[tuple[str, str | None], dict[str, Any]] = {}

    def row_for(team_id: str, group_id: str | None) -> dict[str, Any]:
        key = (team_id, group_id)
        if key not in table:
            table[key] = _empty_row(tournament_id, team_id, group_id)
        return table[key]

    for f in fixtures:
        if f.get("home_score") is None or f.get("away_score") is None:
            continue
        gid = f.get("group_id")
        home = row_for(f["home_team_id"], gid)
        away = row_for(f["away_team_id"], gid)

        hs, as_ = f["home_score"], f["away_score"]

        home["played"] += 1
        away["played"] += 1
        home["goals_for"] += hs
        home["goals_against"] += as_
        away["goals_for"] += as_
        away["goals_against"] += hs

        if hs > as_:
            home["won"] += 1
            home["points"] += 3
            away["lost"] += 1
        elif hs < as_:
            away["won"] += 1
            away["points"] += 3
            home["lost"] += 1
        else:
            home["drawn"] += 1
            away["drawn"] += 1
            home["points"] += 1
            away["points"] += 1

    rows = list(table.values())
    for r in rows:
        r["goal_diff"] = r["goals_for"] - r["goals_against"]

    if rows:
        repo.upsert_rows(rows)

    if actor_id:
        audit.log_action(actor={"id": actor_id}, action="standings.recompute",
                         resource_type="tournament", resource_id=tournament_id,
                         metadata={"teams": len(rows)})
    return rows
