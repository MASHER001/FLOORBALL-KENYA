from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.modules.tournaments import repository as repo
from app.modules.tournaments import service
from app.modules.tournaments.permissions import require_tournament_manager
from app.modules.tournaments.schemas import (
    RegistrationCreate, RegistrationModerate, RegistrationPublic,
    TournamentCreate, TournamentPublic, TournamentUpdate,
)

router = APIRouter(tags=["Tournaments"])


@router.get("/tournaments", response_model=list[TournamentPublic])
def list_tournaments(status_filter: str | None = None, limit: int = 100, offset: int = 0):
    return repo.list_tournaments(status=status_filter, limit=limit, offset=offset)


@router.get("/tournaments/{tournament_id}", response_model=TournamentPublic)
def get_tournament(tournament_id: UUID):
    row = repo.get_tournament(str(tournament_id))
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Tournament not found")
    return row


@router.get("/tournaments/{tournament_id}/registrations",
            response_model=list[RegistrationPublic])
def list_registrations(tournament_id: UUID):
    return repo.list_registrations(str(tournament_id))


@router.post("/admin/tournaments", response_model=TournamentPublic,
             status_code=status.HTTP_201_CREATED)
def create_tournament(payload: TournamentCreate,
                      user=Depends(require_tournament_manager)):
    return service.create_tournament(payload, created_by=user["id"])


@router.patch("/admin/tournaments/{tournament_id}", response_model=TournamentPublic)
def update_tournament(tournament_id: UUID, payload: TournamentUpdate,
                      user=Depends(require_tournament_manager)):
    return service.update_tournament(str(tournament_id), payload, actor_id=user["id"])


@router.post("/admin/tournaments/{tournament_id}/registrations",
             response_model=RegistrationPublic,
             status_code=status.HTTP_201_CREATED)
def register_team(tournament_id: UUID, payload: RegistrationCreate,
                  user=Depends(require_tournament_manager)):
    return service.register_team(str(tournament_id), payload, actor_id=user["id"])


@router.post("/admin/tournament-registrations/{reg_id}/moderate",
             response_model=RegistrationPublic)
def moderate_registration(reg_id: UUID, payload: RegistrationModerate,
                          user=Depends(require_tournament_manager)):
    return service.moderate_registration(str(reg_id), payload, actor_id=user["id"])
