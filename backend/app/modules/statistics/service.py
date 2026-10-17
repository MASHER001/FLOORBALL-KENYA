from collections import defaultdict
from typing import Any
from app.modules.statistics import repository as repo


def team_summary(tournament_id: str) -> list[dict[str, Any]]:
    fixtures = repo.completed_fixtures(tournament_id)
    teams: dict[str, dict[str, Any]] = defaultdict(lambda: {
        "matches_played": 0, "wins": 0, "draws": 0, "losses": 0,
        "goals_for": 0, "goals_against": 0,
    })

    for f in fixtures:
        if f.get("home_score") is None:
            continue
        h, a = f["home_team_id"], f["away_team_id"]
        hs, as_ = f["home_score"], f["away_score"]

        teams[h]["matches_played"] += 1
        teams[a]["matches_played"] += 1
        teams[h]["goals_for"] += hs
        teams[h]["goals_against"] += as_
        teams[a]["goals_for"] += as_
        teams[a]["goals_against"] += hs

        if hs > as_:
            teams[h]["wins"] += 1
            teams[a]["losses"] += 1
        elif hs < as_:
            teams[a]["wins"] += 1
            teams[h]["losses"] += 1
        else:
            teams[h]["draws"] += 1
            teams[a]["draws"] += 1

    return [{"team_id": k, **v} for k, v in teams.items()]


def player_summary(match_ids: list[str]) -> list[dict[str, Any]]:
    events = repo.match_events(match_ids)
    players: dict[str, dict[str, int]] = defaultdict(lambda: {
        "goals": 0, "assists": 0, "yellow_cards": 0, "red_cards": 0,
    })
    for e in events:
        pid = e.get("player_id")
        if not pid:
            continue
        if e["event_type"] == "goal":
            players[pid]["goals"] += 1
        elif e["event_type"] == "yellow":
            players[pid]["yellow_cards"] += 1
        elif e["event_type"] == "red":
            players[pid]["red_cards"] += 1
    return [{"player_id": k, **v} for k, v in players.items()]
