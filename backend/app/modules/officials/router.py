"""
Officials router.

Registration and self-service:
    POST /officials/register
    GET  /officials/me
    GET  /officials/me/availability
    PUT  /officials/me/availability
    POST /officials/me/qualifications
    GET  /officials/me/qualifications
    GET  /officials/me/assignments
    POST /officials/assignments/{assignment_id}/respond

Public:
    GET  /matches/{match_id}/officials

Admin:
    GET  /admin/officials
    POST /admin/officials/{official_id}/verify
    POST /admin/tournaments/{tournament_id}/fixtures/assign-officials
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.officials import repository as repo
from app.modules.officials import service
from app.modules.officials.permissions import (
    require_authenticated,
    require_official_manager,
)
from app.modules.officials.schemas import (
    AssignmentPublic,
    AssignmentResponse,
    AvailabilityCreate,
    BulkAssignRequest,
    OfficialPublic,
    OfficialRegister,
    QualificationCreate,
    QualificationPublic,
)

router = APIRouter(tags=["Officials"])


# ============================================================
# Self-service
# ============================================================

@router.post(
    "/officials/register",
    response_model=OfficialPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Register as a match official",
)
def register(payload: OfficialRegister, user=Depends(require_authenticated)):
    return service.register(user["id"], payload)


@router.get(
    "/officials/me",
    response_model=OfficialPublic,
    summary="Get my official profile",
)
def get_me(user=Depends(require_authenticated)):
    row = repo.get_by_user(user["id"])
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not registered as official")
    return row


@router.get(
    "/officials/me/availability",
    summary="List my availability",
)
def my_availability(user=Depends(require_authenticated)):
    official = repo.get_by_user(user["id"])
    if not official:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not registered as official")
    return repo.list_availability(official["id"])


@router.put(
    "/officials/me/availability",
    summary="Set my availability for a date",
)
def set_availability(payload: AvailabilityCreate, user=Depends(require_authenticated)):
    official = repo.get_by_user(user["id"])
    if not official:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not registered as official")
    return service.set_availability(official["id"], payload)


@router.post(
    "/officials/me/qualifications",
    response_model=QualificationPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Add a qualification to my profile",
)
def add_my_qualification(
    payload: QualificationCreate,
    user=Depends(require_authenticated),
):
    official = repo.get_by_user(user["id"])
    if not official:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not registered as official")
    return service.add_qualification(official["id"], payload, actor_id=user["id"])


@router.get(
    "/officials/me/qualifications",
    response_model=list[QualificationPublic],
    summary="List my qualifications",
)
def my_qualifications(user=Depends(require_authenticated)):
    official = repo.get_by_user(user["id"])
    if not official:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not registered as official")
    return repo.list_qualifications(official["id"])


@router.get(
    "/officials/me/assignments",
    response_model=list[AssignmentPublic],
    summary="List my match assignments",
)
def my_assignments(user=Depends(require_authenticated)):
    official = repo.get_by_user(user["id"])
    if not official:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not registered as official")
    return repo.assignments_for_official(official["id"])


@router.post(
    "/officials/assignments/{assignment_id}/respond",
    response_model=AssignmentPublic,
    summary="Accept or decline an assignment",
)
def respond_to_assignment(
    assignment_id: UUID,
    payload: AssignmentResponse,
    user=Depends(require_authenticated),
):
    return service.respond_to_assignment(
        str(assignment_id),
        status=payload.status,
        actor_id=user["id"],
        notes=payload.notes,
    )


# ============================================================
# Public reads
# ============================================================

@router.get(
    "/matches/{match_id}/officials",
    response_model=list[AssignmentPublic],
    summary="List officials assigned to a match",
)
def match_officials(match_id: UUID):
    return repo.assignments_for_match(str(match_id))


# ============================================================
# Admin
# ============================================================

@router.get(
    "/admin/officials",
    response_model=list[OfficialPublic],
    summary="List all registered officials (admin)",
)
def list_officials(
    limit: int = 100,
    offset: int = 0,
    _user=Depends(require_official_manager),
):
    return repo.list_all(limit=limit, offset=offset)


@router.post(
    "/admin/officials/{official_id}/verify",
    response_model=OfficialPublic,
    summary="Verify an official (admin)",
)
def verify(official_id: UUID, user=Depends(require_official_manager)):
    return service.verify(str(official_id), actor_id=user["id"])


@router.post(
    "/admin/tournaments/{tournament_id}/fixtures/assign-officials",
    summary="Bulk-assign officials to a tournament's fixtures (admin)",
)
def bulk_assign(
    tournament_id: UUID,
    payload: BulkAssignRequest,
    user=Depends(require_official_manager),
):
    return service.assign_for_tournament(
        str(tournament_id),
        required_qualification=payload.required_qualification,
        actor_id=user["id"],
    )