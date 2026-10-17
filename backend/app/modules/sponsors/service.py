from typing import Any
from fastapi import HTTPException, status
from app.modules.audit import service as audit
from app.modules.sponsors import repository as repo
from app.modules.sponsors.schemas import PackageCreate, SponsorCreate


def create_sponsor(payload: SponsorCreate, actor_id: str) -> dict[str, Any]:
    if repo.get_by_slug(payload.slug):
        raise HTTPException(status.HTTP_409_CONFLICT, "Slug already exists")
    s = repo.insert_sponsor(payload.model_dump())
    audit.log_action(actor={"id": actor_id}, action="sponsor.create",
                     resource_type="sponsor", resource_id=s["id"])
    return s


def create_package(payload: PackageCreate, actor_id: str) -> dict[str, Any]:
    p = repo.insert_package(payload.model_dump())
    audit.log_action(actor={"id": actor_id}, action="package.create",
                     resource_type="sponsorship_package", resource_id=p["id"])
    return p
from app.modules.sponsors.schemas import PackageCreate, SponsorCreate, SponsorUpdate


def update_sponsor(sponsor_id: str, payload: SponsorUpdate, actor_id: str) -> dict[str, Any]:
    existing = repo.get(sponsor_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Sponsor not found")
    updated = repo.update_sponsor(sponsor_id, payload.model_dump(exclude_none=True)) or existing
    audit.log_action(actor={"id": actor_id}, action="sponsor.update",
                     resource_type="sponsor", resource_id=sponsor_id,
                     metadata={"fields": sorted(payload.model_dump(exclude_none=True).keys())})
    return updated