from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.modules.marketplace import repository as repo
from app.modules.marketplace import service
from app.modules.marketplace.permissions import require_marketplace_manager
from app.modules.marketplace.schemas import (
    ProductCreate, ProductModeration, ProductPublic, VendorCreate, VendorPublic,
)

router = APIRouter(tags=["Marketplace"])


@router.get("/marketplace/vendors", response_model=list[VendorPublic])
def list_vendors(limit: int = 100, offset: int = 0):
    return repo.list_public_vendors(limit=limit, offset=offset)


@router.get("/marketplace/vendors/{vendor_id}", response_model=VendorPublic)
def get_vendor(vendor_id: UUID):
    row = repo.get_vendor(str(vendor_id))
    if not row or not row.get("is_active"):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vendor not found")
    return row


@router.get("/marketplace/products", response_model=list[ProductPublic])
def list_products(vendor_id: UUID | None = None, limit: int = 100, offset: int = 0):
    return repo.list_products(
        status="approved",
        vendor_id=str(vendor_id) if vendor_id else None,
        limit=limit, offset=offset,
    )


@router.get("/marketplace/products/{product_id}", response_model=ProductPublic)
def get_product(product_id: UUID):
    row = repo.get_product(str(product_id))
    if not row or row["status"] != "approved":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    return row


@router.post("/admin/marketplace/vendors", response_model=VendorPublic,
             status_code=status.HTTP_201_CREATED)
def create_vendor(payload: VendorCreate, user=Depends(require_marketplace_manager)):
    return service.create_vendor(payload, created_by=user["id"])


@router.post("/admin/marketplace/vendors/{vendor_id}/verify", response_model=VendorPublic)
def verify_vendor(vendor_id: UUID, user=Depends(require_marketplace_manager)):
    return service.verify_vendor(str(vendor_id), actor_id=user["id"])


@router.post("/admin/marketplace/products", response_model=ProductPublic,
             status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate, user=Depends(require_marketplace_manager)):
    return service.create_product(payload, created_by=user["id"])


@router.post("/admin/marketplace/products/{product_id}/moderate", response_model=ProductPublic)
def moderate_product(product_id: UUID, payload: ProductModeration,
                     user=Depends(require_marketplace_manager)):
    return service.moderate_product(str(product_id), payload, actor_id=user["id"])
