from typing import Any
from fastapi import HTTPException, status
from app.modules.audit import service as audit
from app.modules.vendors import repository as repo
from app.modules.vendors.schemas import VendorProfileUpdate


def update_my_profile(owner_id: str, payload: VendorProfileUpdate) -> dict[str, Any]:
    vendor = repo.get_by_owner(owner_id)
    if not vendor:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No vendor profile for this user")
    updated = repo.update(vendor["id"], payload.model_dump(exclude_none=True)) or vendor
    audit.log_action(actor={"id": owner_id}, action="vendor.update_self",
                     resource_type="vendor", resource_id=vendor["id"])
    return updated
