from fastapi import APIRouter, Depends, HTTPException, status
from app.modules.vendors import repository as repo
from app.modules.vendors import service
from app.modules.vendors.permissions import require_authenticated
from app.modules.vendors.schemas import VendorProfile, VendorProfileUpdate

router = APIRouter(tags=["Vendors"])


@router.get("/vendors/me", response_model=VendorProfile)
def my_vendor(user=Depends(require_authenticated)):
    row = repo.get_by_owner(user["id"])
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No vendor profile")
    return row


@router.patch("/vendors/me", response_model=VendorProfile)
def update_my_vendor(payload: VendorProfileUpdate, user=Depends(require_authenticated)):
    return service.update_my_profile(user["id"], payload)


@router.get("/vendors/me/products")
def my_products(user=Depends(require_authenticated)):
    vendor = repo.get_by_owner(user["id"])
    if not vendor:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No vendor profile")
    return repo.my_products(vendor["id"])
