"""
Commissions router
==================

    GET /commissions                       — admin: list all
    GET /commissions/vendors/{vendor_id}/earnings — vendor: own earnings
"""

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.dependencies import get_current_user, require_admin
from app.database.supabase import get_supabase_admin
from app.services.commissions import get_vendor_earnings

router = APIRouter(prefix="/commissions", tags=["Commissions"])


# ============================================================
# GET /commissions (admin)
# ============================================================
@router.get("", summary="List all commissions (admin only)")
def list_commissions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    vendor_id: str | None = Query(None),
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size

    query = sb.table("commissions").select("*, vendors(business_name)", count="exact")
    if vendor_id:
        query = query.eq("vendor_id", vendor_id)

    result = (
        query.order("created_at", desc=True)
        .range(offset, offset + page_size - 1)
        .execute()
    )

    total_commission = sum(float(r["commission_amt"]) for r in (result.data or []))

    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "total_commission_page": round(total_commission, 2),
        "items": result.data or [],
    }


# ============================================================
# GET /commissions/vendors/{vendor_id}/earnings
# ============================================================
@router.get(
    "/vendors/{vendor_id}/earnings",
    summary="Vendor earnings summary",
)
def vendor_earnings(
    vendor_id: str,
    user: dict = Depends(get_current_user),
):
    sb = get_supabase_admin()

    # Vendor owner or admin only
    if user["role"] not in ("admin", "super_admin"):
        owner = (
            sb.table("vendors").select("user_id").eq("id", vendor_id).limit(1).execute()
        )
        if not owner.data or owner.data[0]["user_id"] != user["id"]:
            raise HTTPException(status_code=403, detail="Not your vendor account")

    summary = get_vendor_earnings(vendor_id)

    # Recent line items
    recent = (
        sb.table("commissions")
        .select("*")
        .eq("vendor_id", vendor_id)
        .order("created_at", desc=True)
        .limit(20)
        .execute()
    ).data or []

    return {
        "summary": summary,
        "recent": recent,
    }