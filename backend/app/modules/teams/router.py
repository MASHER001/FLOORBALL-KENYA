from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.modules.teams import repository as repo
from app.modules.teams import service
from app.modules.teams.permissions import require_team_manager
from app.modules.teams.schemas import (
    MembershipCreate, MembershipPublic, TeamCreate, TeamPublic, TeamUpdate,
)

router = APIRouter(tags=["Teams"])


@router.get("/teams", response_model=list[TeamPublic])
def list_teams(limit: int = 100, offset: int = 0):
    return repo.list_teams(limit=limit, offset=offset)


@router.get("/teams/{team_id}", response_model=TeamPublic)
def get_team(team_id: UUID):
    row = repo.get_team(str(team_id))
    if not row or not row.get("is_active"):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Team not found")
    return row


@router.get("/teams/{team_id}/members", response_model=list[MembershipPublic])
def list_members(team_id: UUID):
    return repo.list_memberships(str(team_id))


@router.post("/admin/teams", response_model=TeamPublic, status_code=status.HTTP_201_CREATED)
def create_team(payload: TeamCreate, user=Depends(require_team_manager)):
    return service.create_team(payload, created_by=user["id"])


@router.patch("/admin/teams/{team_id}", response_model=TeamPublic)
def update_team(team_id: UUID, payload: TeamUpdate, user=Depends(require_team_manager)):
    return service.update_team(str(team_id), payload, actor_id=user["id"])


@router.post("/admin/teams/{team_id}/members", response_model=MembershipPublic,
             status_code=status.HTTP_201_CREATED)
def add_member(team_id: UUID, payload: MembershipCreate,
               user=Depends(require_team_manager)):
    return service.add_member(str(team_id), payload, actor_id=user["id"])


@router.delete("/admin/team-memberships/{membership_id}", response_model=MembershipPublic)
def remove_member(membership_id: UUID, user=Depends(require_team_manager)):
    return service.remove_member(str(membership_id), actor_id=user["id"])
