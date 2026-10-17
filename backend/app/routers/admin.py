"""
Admin router
============

Admin & super admin shared endpoints — dashboards, listings, reports.
"""

from fastapi import APIRouter, Depends, Query

from app.core.dependencies import require_admin
from app.database.supabase import get_supabase_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


# ============================================================
# GET /admin/dashboard
# ============================================================
@router.get("/dashboard", summary="Admin dashboard counts")
def dashboard(_admin: dict = Depends(require_admin)):
    sb = get_supabase_admin()

    def count(table: str, **filters) -> int:
        q = sb.table(table).select("id", count="exact")
        for k, v in filters.items():
            q = q.eq(k, v)
        return q.execute().count or 0

    return {
        "users": count("profiles"),
        "teams": count("teams", is_active=True),
        "players": count("players", is_active=True),
        "leagues": count("leagues", is_active=True),
        "tournaments": count("tournaments", is_active=True),
        "vendors": count("vendors", status="approved"),
        "products": count("products", is_active=True),
        "orders": count("orders"),
        "payments": count("payments"),
    }


# ============================================================
# GET /admin/users
# ============================================================
@router.get("/users", summary="List all users (admin)")
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    role: str | None = Query(None),
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size
    q = sb.table("profiles").select("*", count="exact")
    if role:
        q = q.eq("role", role)
    result = q.order("created_at", desc=True).range(offset, offset + page_size - 1).execute()
    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


# ============================================================
# GET /admin/vendors
# ============================================================
@router.get("/vendors", summary="List all vendors (admin)")
def list_vendors_admin(
    status_: str | None = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size
    q = sb.table("vendors").select("*", count="exact")
    if status_:
        q = q.eq("status", status_)
    result = q.order("created_at", desc=True).range(offset, offset + page_size - 1).execute()
    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


# ============================================================
# GET /admin/orders
# ============================================================
@router.get("/orders", summary="List all orders (admin)")
def list_orders_admin(
    status_: str | None = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size
    q = sb.table("orders").select("*", count="exact")
    if status_:
        q = q.eq("status", status_)
    result = q.order("created_at", desc=True).range(offset, offset + page_size - 1).execute()
    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


# ============================================================
# GET /admin/payments
# ============================================================
@router.get("/payments", summary="List all payments (admin)")
def list_payments_admin(
    status_: str | None = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size
    q = sb.table("payments").select("*", count="exact")
    if status_:
        q = q.eq("status", status_)
    result = q.order("created_at", desc=True).range(offset, offset + page_size - 1).execute()
    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


# ============================================================
# GET /admin/reports
# ============================================================
@router.get("/reports", summary="High-level platform report")
def reports(_admin: dict = Depends(require_admin)):
    sb = get_supabase_admin()

    orders = sb.table("orders").select("total, status").execute().data or []
    payments = (
        sb.table("payments").select("amount, status").eq("status", "success").execute()
    ).data or []
    commissions = sb.table("commissions").select("commission_amt").execute().data or []

    gross_sales = sum(float(o["total"]) for o in orders if o["status"] not in ("cancelled",))
    successful_payments = sum(float(p["amount"]) for p in payments)
    total_commission = sum(float(c["commission_amt"]) for c in commissions)

    return {
        "orders_total": len(orders),
        "gross_sales": round(gross_sales, 2),
        "successful_payments": round(successful_payments, 2),
        "platform_commission": round(total_commission, 2),
        "vendor_payouts": round(successful_payments - total_commission, 2),
    }