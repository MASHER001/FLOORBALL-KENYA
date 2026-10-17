from uuid import UUID
from fastapi import APIRouter, Depends
from app.modules.standings import repository as repo
from app.modules.standings import service
from app.modules.standings.permissions import require_standings_manager
from app.modules.standings.schemas import StandingRow

router = APIRouter(tags=["Standings"])


@router.get("/tournaments/{tournament_id}/standings",
            response_model=list[StandingRow])
def standings(tournament_id: UUID, group_id: UUID | None = None):
    return repo.list_for_tournament(str(tournament_id),
                                    str(group_id) if group_id else None)


@router.post("/admin/tournaments/{tournament_id}/standings/recompute")
def recompute(tournament_id: UUID, user=Depends(require_standings_manager)):
    rows = service.recompute(str(tournament_id), actor_id=user["id"])
    return {"recomputed": len(rows)}
