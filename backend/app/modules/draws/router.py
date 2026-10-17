"""
Draws router.

    GET  /tournaments/{tournament_id}/draws
    GET  /draws/{draw_id}

    POST /admin/tournaments/{tournament_id}/draws        (generate)
    POST /admin/draws/{draw_id}/approve
    POST /admin/draws/{draw_id}/publish
"""

from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.modules.draws import repository as repo
from app.modules.draws import service
from app.modules.draws.permissions import require_draw_manager
from app.modules.draws.schemas import (
    DrawApproveRequest,
    DrawGenerateRequest,
    DrawPublic,
)

router = APIRouter(tags=["Draws"])


@router.get(
    "/tournaments/{tournament_id}/draws",
    response_model=list[DrawPublic],
    summary="List draws for a tournament",
)
def list_draws(tournament_id: UUID):
    return repo.list_draws_for_tournament(str(tournament_id))


@router.get(
    "/draws/{draw_id}",
    response_model=DrawPublic,
    summary="Get a draw by id",
)
def get_draw(draw_id: UUID):
    row = repo.get_draw(str(draw_id))
    if not row:
        from fastapi import HTTPException
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Draw not found")
    return row


@router.post(
    "/admin/tournaments/{tournament_id}/draws",
    response_model=DrawPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Generate a draw (admin)",
)
def generate_draw(
    tournament_id: UUID,
    payload: DrawGenerateRequest,
    user=Depends(require_draw_manager),
):
    # Force the path tournament_id to match the payload.
    payload.tournament_id = tournament_id
    return service.generate_draw(payload, created_by=user["id"])


@router.post(
    "/admin/draws/{draw_id}/approve",
    response_model=DrawPublic,
    summary="Approve a draw (admin)",
)
def approve_draw(
    draw_id: UUID,
    payload: DrawApproveRequest,
    user=Depends(require_draw_manager),
):
    return service.approve_draw(str(draw_id), user["id"], payload.notes)


@router.post(
    "/admin/draws/{draw_id}/publish",
    response_model=DrawPublic,
    summary="Publish an approved draw (admin)",
)
def publish_draw(
    draw_id: UUID,
    user=Depends(require_draw_manager),
):
    return service.publish_draw(str(draw_id), user["id"])
