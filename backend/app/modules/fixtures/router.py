"""
Fixtures router.

    GET  /tournaments/{tournament_id}/fixtures
    GET  /fixtures/{fixture_id}

    POST /admin/tournaments/{tournament_id}/fixtures/generate
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.fixtures import repository as repo
from app.modules.fixtures import service
from app.modules.fixtures.permissions import require_fixture_manager
from app.modules.fixtures.schemas import (
    FixtureGenerateReport,
    FixtureGenerateRequest,
    FixturePublic,
)

router = APIRouter(tags=["Fixtures"])


@router.get(
    "/tournaments/{tournament_id}/fixtures",
    response_model=list[FixturePublic],
    summary="List fixtures for a tournament",
)
def list_fixtures(tournament_id: UUID):
    return repo.list_fixtures_for_tournament(str(tournament_id))


@router.get(
    "/fixtures/{fixture_id}",
    response_model=FixturePublic,
    summary="Get a fixture by id",
)
def get_fixture(fixture_id: UUID):
    row = repo.get_fixture(str(fixture_id))
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Fixture not found")
    return row


@router.post(
    "/admin/tournaments/{tournament_id}/fixtures/generate",
    response_model=FixtureGenerateReport,
    status_code=status.HTTP_201_CREATED,
    summary="Generate fixtures from an approved draw (admin)",
)
def generate(
    tournament_id: UUID,
    payload: FixtureGenerateRequest,
    user=Depends(require_fixture_manager),
):
    return service.generate_fixtures(
        tournament_id=str(tournament_id),
        payload=payload,
        created_by=user["id"],
    )
