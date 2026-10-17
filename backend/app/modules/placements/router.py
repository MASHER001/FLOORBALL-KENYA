from fastapi import APIRouter, HTTPException, status

from app.modules.placements import repository as repo
from app.modules.placements.schemas import PlacementPublic

router = APIRouter(tags=["Placements"])


@router.get(
    "/placements",
    response_model=list[PlacementPublic],
    summary="List available ad placements",
)
def list_placements():
    return repo.list_placements()


@router.get(
    "/placements/{slug}",
    response_model=PlacementPublic,
    summary="Get a placement by slug",
)
def get_placement(slug: str):
    row = repo.get_placement_by_slug(slug)
    if not row:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"Placement '{slug}' not found"
        )
    return row
