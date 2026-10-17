from fastapi import APIRouter, Depends, status
from app.modules.sponsors import repository as repo
from app.modules.sponsors import service
from app.modules.sponsors.permissions import require_sponsor_manager
from app.modules.sponsors.schemas import PackageCreate, SponsorCreate, SponsorPublic

router = APIRouter(tags=["Sponsors"])


@router.get("/sponsors", response_model=list[SponsorPublic])
def list_public_sponsors():
    return repo.list_public()


@router.get("/sponsors/packages")
def list_packages():
    return repo.list_packages()


@router.post("/admin/sponsors", response_model=SponsorPublic,
             status_code=status.HTTP_201_CREATED)
def create_sponsor(payload: SponsorCreate, user=Depends(require_sponsor_manager)):
    return service.create_sponsor(payload, actor_id=user["id"])


@router.post("/admin/sponsors/packages", status_code=status.HTTP_201_CREATED)
def create_package(payload: PackageCreate, user=Depends(require_sponsor_manager)):
    return service.create_package(payload, actor_id=user["id"])
from uuid import UUID
from app.modules.sponsors.schemas import PackageCreate, SponsorCreate, SponsorUpdate

@router.patch("/admin/sponsors/{sponsor_id}", response_model=SponsorPublic,
              summary="Update a sponsor (admin)")
def update_sponsor(sponsor_id: UUID, payload: SponsorUpdate,
                   user=Depends(require_sponsor_manager)):
    return service.update_sponsor(str(sponsor_id), payload, actor_id=user["id"])