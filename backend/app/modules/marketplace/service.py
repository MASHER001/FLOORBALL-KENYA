from typing import Any
from fastapi import HTTPException, status
from app.modules.audit import service as audit
from app.modules.marketplace import repository as repo
from app.modules.marketplace.schemas import (
    ProductCreate, ProductModeration, VendorCreate,
)


def create_vendor(payload: VendorCreate, created_by: str) -> dict[str, Any]:
    if repo.get_vendor_by_slug(payload.slug):
        raise HTTPException(status.HTTP_409_CONFLICT, "Slug already exists")
    data = payload.model_dump()
    data["owner_id"] = created_by
    vendor = repo.insert_vendor(data)
    audit.log_action(actor={"id": created_by}, action="vendor.create",
                     resource_type="vendor", resource_id=vendor["id"])
    return vendor


def verify_vendor(vendor_id: str, actor_id: str) -> dict[str, Any]:
    existing = repo.get_vendor(vendor_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vendor not found")
    updated = repo.update_vendor(vendor_id, {"is_verified": True}) or existing
    audit.log_action(actor={"id": actor_id}, action="vendor.verify",
                     resource_type="vendor", resource_id=vendor_id)
    return updated


def create_product(payload: ProductCreate, created_by: str) -> dict[str, Any]:
    if not repo.get_vendor(str(payload.vendor_id)):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vendor not found")
    data = payload.model_dump()
    data["vendor_id"] = str(data["vendor_id"])
    data["status"] = "pending"
    product = repo.insert_product(data)
    audit.log_action(actor={"id": created_by}, action="product.create",
                     resource_type="product", resource_id=product["id"])
    return product


def moderate_product(product_id: str, payload: ProductModeration, actor_id: str) -> dict[str, Any]:
    existing = repo.get_product(product_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    updated = repo.update_product(product_id, {"status": payload.status}) or existing
    audit.log_action(actor={"id": actor_id}, action=f"product.{payload.status}",
                     resource_type="product", resource_id=product_id,
                     metadata={"from_status": existing["status"], "reason": payload.reason})
    return updated
