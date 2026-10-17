from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.modules.players import repository as repo
from app.modules.players import service
from app.modules.players.permissions import require_authenticated
from app.modules.players.schemas import PlayerCreate, PlayerPublic, PlayerUpdate

router = APIRouter(tags=["Players"])


@router.get("/players/me", response_model=PlayerPublic)
def my_profile(user=Depends(require_authenticated)):
    row = repo.get_by_user(user["id"])
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No player profile")
    return row


@router.post("/players/me", response_model=PlayerPublic, status_code=status.HTTP_201_CREATED)
def create_profile(payload: PlayerCreate, user=Depends(require_authenticated)):
    return service.create_profile(user["id"], payload)


@router.patch("/players/me", response_model=PlayerPublic)
def update_profile(payload: PlayerUpdate, user=Depends(require_authenticated)):
    row = repo.get_by_user(user["id"])
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No player profile")
    return service.update_profile(row["id"], payload, actor_id=user["id"])


@router.get("/teams/{team_id}/players", response_model=list[PlayerPublic])
def team_players(team_id: UUID):
    return repo.list_for_team(str(team_id))
