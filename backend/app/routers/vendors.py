"""
Vendors router
==============

Vendor application + admin approval + vendor dashboard.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, EmailStr, Field

from app.core.dependencies import get_current_user, require_admin
from app.database.supabase import get_supabase_admin

router = APIRouter(prefix="/vendors", tags=["Vendors"])


# ---------- Inline schemas ----------
class VendorApply(BaseModel):
    business_name: str = Field(..., min_length=2, max_length=120)
    description: str | None = None
    logo_url: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    county: str | None = None
    address: str | None = None


class VendorUpdate(BaseModel):
    business_name: str | None = None
    description: str | None = None
    logo_url: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    county: str | None = None
    address: str | None = None


class VendorResponse(BaseModel):
    id: str
    user_id: str
    business_name: str
    description: str | None = None
    logo_url: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    county: str | None = None
    address: str | None = None
    status: str
    approved_by: str | None = None
    approved_at: str | None = None
    created_at: str
    updated_at: str | None = None


# ============================================================
# APPLY
# ============================================================
@router.post(
    "",
    response_model=VendorResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Apply to become a vendor",
)
def apply_vendor(
    payload: VendorApply,
    user: dict = Depends(get_current_user),
):
    sb = get_supabase_admin()

    existing = (
        sb.table("vendors").select("id").eq("user_id", user["id"]).limit(1).execute()
    )
    if existing.data:
        raise HTTPException(
            status_code=400,
            detail="You already have a vendor application or account",
        )

    data = payload.model_dump(exclude_unset=True)
    data["user_id"] = user["id"]
    data["status"] = "pending"

    created = sb.table("vendors").insert(data).execute()

    # Upgrade role to vendor (if not already admin)
    if user["role"] == "customer":
        sb.table("profiles").update({"role": "vendor"}).eq("id", user["id"]).execute()

    return created.data[0]


# ============================================================
# PUBLIC LIST
# ============================================================
@router.get("", summary="List approved vendors")
def list_vendors(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size
    query = sb.table("vendors").select("*", count="exact").eq("status", "approved")
    if q:
        query = query.ilike("business_name", f"%{q}%")
    result = query.order("business_name").range(offset, offset + page_size - 1).execute()
    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


# ============================================================
# MY VENDOR PROFILE
# ============================================================
@router.get(
    "/me",
    response_model=VendorResponse,
    summary="Get the current user's vendor profile",
)
def get_my_vendor(user: dict = Depends(get_current_user)):
    sb = get_supabase_admin()
    resp = (
        sb.table("vendors").select("*").eq("user_id", user["id"]).limit(1).execute()
    )
    if not resp.data:
        raise HTTPException(status_code=404, detail="You have no vendor profile")
    return resp.data[0]


@router.put(
    "/me",
    response_model=VendorResponse,
    summary="Update own vendor profile",
)
def update_my_vendor(
    payload: VendorUpdate,
    user: dict = Depends(get_current_user),
):
    sb = get_supabase_admin()
    existing = (
        sb.table("vendors").select("*").eq("user_id", user["id"]).limit(1).execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="You have no vendor profile")

    data = payload.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")

    sb.table("vendors").update(data).eq("user_id", user["id"]).execute()
    updated = (
        sb.table("vendors").select("*").eq("user_id", user["id"]).limit(1).execute()
    )
    return updated.data[0]


# ============================================================
# PUBLIC: single vendor profile
# ============================================================
@router.get("/{vendor_id}", response_model=VendorResponse, summary="Get a vendor")
def get_vendor(vendor_id: str):
    sb = get_supabase_admin()
    resp = sb.table("vendors").select("*").eq("id", vendor_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return resp.data[0]


# ============================================================
# VENDOR DASHBOARD
# ============================================================
@router.get("/{vendor_id}/products", summary="Products of a vendor")
def vendor_products(vendor_id: str):
    sb = get_supabase_admin()
    resp = (
        sb.table("products")
        .select("*")
        .eq("vendor_id", vendor_id)
        .eq("is_active", True)
        .order("created_at", desc=True)
        .execute()
    )
    return resp.data or []


@router.get(
    "/{vendor_id}/orders",
    summary="Orders containing this vendor's products",
)
def vendor_orders(
    vendor_id: str,
    user: dict = Depends(get_current_user),
):
    sb = get_supabase_admin()

    # Only the vendor themselves or admin can view
    if user["role"] not in ("admin", "super_admin"):
        owner = (
            sb.table("vendors").select("user_id").eq("id", vendor_id).limit(1).execute()
        )
        if not owner.data or owner.data[0]["user_id"] != user["id"]:
            raise HTTPException(status_code=403, detail="Not your vendor account")

    items = (
        sb.table("order_items")
        .select("*, orders(id,status,created_at,total,user_id,delivery_address,delivery_phone)")
        .eq("vendor_id", vendor_id)
        .order("created_at", desc=True)
        .execute()
    ).data or []

    # Group by order
    orders: dict = {}
    for item in items:
        oid = item["order_id"]
        if oid not in orders:
            orders[oid] = {
                "order": item.get("orders") or {"id": oid},
                "items": [],
                "vendor_subtotal": 0,
            }
        orders[oid]["items"].append(item)
        orders[oid]["vendor_subtotal"] += float(item.get("subtotal") or 0)

    return list(orders.values())


# ============================================================
# ADMIN: approvals
# ============================================================
@router.patch(
    "/{vendor_id}/approve",
    response_model=VendorResponse,
    summary="Approve a vendor (admin)",
)
def approve_vendor(vendor_id: str, admin: dict = Depends(require_admin)):
    sb = get_supabase_admin()
    sb.table("vendors").update(
        {
            "status": "approved",
            "approved_by": admin["id"],
            "approved_at": "now()",
        }
    ).eq("id", vendor_id).execute()

    updated = sb.table("vendors").select("*").eq("id", vendor_id).limit(1).execute()
    if not updated.data:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return updated.data[0]


@router.patch(
    "/{vendor_id}/suspend",
    response_model=VendorResponse,
    summary="Suspend a vendor (admin)",
)
def suspend_vendor(vendor_id: str, _admin: dict = Depends(require_admin)):
    sb = get_supabase_admin()
    sb.table("vendors").update({"status": "suspended"}).eq("id", vendor_id).execute()
    updated = sb.table("vendors").select("*").eq("id", vendor_id).limit(1).execute()
    if not updated.data:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return updated.data[0]