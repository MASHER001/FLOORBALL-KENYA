from uuid import UUID
from fastapi import APIRouter, Depends
from app.modules.statistics import repository as repo
from app.modules.statistics import service
from app.modules.statistics.permissions import require_stats_reader
from app.modules.statistics.schemas import PlayerStatSummary, TeamStatSummary

router = APIRouter(tags=["Statistics"])


@router.get("/tournaments/{tournament_id}/statistics/teams",
            response_model=list[TeamStatSummary])
def team_stats(tournament_id: UUID):
    return service.team_summary(str(tournament_id))


@router.get("/tournaments/{tournament_id}/statistics/players",
            response_model=list[PlayerStatSummary])
def player_stats(tournament_id: UUID):
    fixtures = repo.completed_fixtures(str(tournament_id))
    match_ids = [f["id"] for f in fixtures]
    return service.player_summary(match_ids)


@router.get("/admin/tournaments/{tournament_id}/statistics/teams",
            response_model=list[TeamStatSummary])
def team_stats_admin(tournament_id: UUID, user=Depends(require_stats_reader)):
    return service.team_summary(str(tournament_id))
