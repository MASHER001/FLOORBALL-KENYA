"""
Orders router
=============

Flow:
    POST /orders              → create order from cart
    GET  /orders              → list my orders
    GET  /orders/{id}         → order detail
    POST /orders/{id}/cancel  → cancel (only if pending)
    PATCH /orders/{id}/status → admin update
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.dependencies import get_current_user, require_admin
from app.database.supabase import get_supabase_admin
from app.schemas.order import (
    OrderCreate,
    OrderListResponse,
    OrderResponse,
    OrderStatusUpdate,
)

router = APIRouter(prefix="/orders", tags=["Orders"])

DELIVERY_FEE_DEFAULT = 0.0  # override with a real rate later


# ============================================================
# POST /orders — create from cart
# ============================================================
@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an order from my cart",
)
def create_order(
    payload: OrderCreate,
    user: dict = Depends(get_current_user),
):
    sb = get_supabase_admin()

    # ---------- 1. Load cart ----------
    cart = (
        sb.table("cart_items").select("*").eq("user_id", user["id"]).execute()
    ).data or []
    if not cart:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # ---------- 2. Load product details ----------
    product_ids = [c["product_id"] for c in cart]
    products = (
        sb.table("products")
        .select("id, name, price, vendor_id, stock, is_active")
        .in_("id", product_ids)
        .execute()
    ).data or []
    pmap = {p["id"]: p for p in products}

    # Validate
    for c in cart:
        p = pmap.get(c["product_id"])
        if not p:
            raise HTTPException(status_code=400, detail="A product in your cart no longer exists")
        if not p.get("is_active"):
            raise HTTPException(status_code=400, detail=f"Product '{p['name']}' is not available")
        if p["stock"] < c["quantity"]:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for '{p['name']}' (available: {p['stock']})",
            )

    # ---------- 3. Compute totals ----------
    subtotal = sum(float(pmap[c["product_id"]]["price"]) * c["quantity"] for c in cart)
    delivery_fee = DELIVERY_FEE_DEFAULT
    total = subtotal + delivery_fee

    # ---------- 4. Create order ----------
    order = sb.table("orders").insert(
        {
            "user_id": user["id"],
            "status": "pending",
            "subtotal": round(subtotal, 2),
            "delivery_fee": delivery_fee,
            "total": round(total, 2),
            "delivery_address": payload.delivery_address,
            "delivery_phone": payload.delivery_phone,
            "notes": payload.notes,
        }
    ).execute().data[0]

    # ---------- 5. Create order_items (snapshot prices) ----------
    item_rows = []
    for c in cart:
        p = pmap[c["product_id"]]
        item_rows.append(
            {
                "order_id": order["id"],
                "product_id": p["id"],
                "vendor_id": p["vendor_id"],
                "product_name": p["name"],
                "unit_price": float(p["price"]),
                "quantity": c["quantity"],
                "subtotal": round(float(p["price"]) * c["quantity"], 2),
            }
        )
    sb.table("order_items").insert(item_rows).execute()

    # ---------- 6. Clear cart ----------
    sb.table("cart_items").delete().eq("user_id", user["id"]).execute()

    # ---------- 7. Return with items ----------
    items = (
        sb.table("order_items").select("*").eq("order_id", order["id"]).execute()
    ).data or []
    order["items"] = items
    return order


# ============================================================
# GET /orders — my orders (admin sees all)
# ============================================================
@router.get("", response_model=OrderListResponse, summary="List my orders")
def list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_: str | None = Query(None, alias="status"),
    user: dict = Depends(get_current_user),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size

    query = sb.table("orders").select("*", count="exact")
    if user["role"] not in ("admin", "super_admin"):
        query = query.eq("user_id", user["id"])
    if status_:
        query = query.eq("status", status_)

    result = (
        query.order("created_at", desc=True)
        .range(offset, offset + page_size - 1)
        .execute()
    )

    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


# ============================================================
# GET /orders/{order_id}
# ============================================================
@router.get("/{order_id}", response_model=OrderResponse, summary="Get an order")
def get_order(order_id: str, user: dict = Depends(get_current_user)):
    sb = get_supabase_admin()
    order = sb.table("orders").select("*").eq("id", order_id).limit(1).execute()
    if not order.data:
        raise HTTPException(status_code=404, detail="Order not found")

    o = order.data[0]
    if user["role"] not in ("admin", "super_admin") and o["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your order")

    items = (
        sb.table("order_items").select("*").eq("order_id", order_id).execute()
    ).data or []
    o["items"] = items
    return o


# ============================================================
# POST /orders/{order_id}/cancel
# ============================================================
@router.post("/{order_id}/cancel", summary="Cancel an order (if still pending)")
def cancel_order(order_id: str, user: dict = Depends(get_current_user)):
    sb = get_supabase_admin()
    order = sb.table("orders").select("*").eq("id", order_id).limit(1).execute()
    if not order.data:
        raise HTTPException(status_code=404, detail="Order not found")

    o = order.data[0]
    if user["role"] not in ("admin", "super_admin") and o["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your order")
    if o["status"] not in ("pending",):
        raise HTTPException(status_code=400, detail=f"Cannot cancel order in status '{o['status']}'")

    sb.table("orders").update({"status": "cancelled"}).eq("id", order_id).execute()
    return {"success": True}


# ============================================================
# PATCH /orders/{order_id}/status (admin)
# ============================================================
@router.patch(
    "/{order_id}/status",
    response_model=OrderResponse,
    summary="Update order status (admin only)",
)
def update_order_status(
    order_id: str,
    payload: OrderStatusUpdate,
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    sb.table("orders").update({"status": payload.status.value}).eq("id", order_id).execute()
    updated = sb.table("orders").select("*").eq("id", order_id).limit(1).execute()
    if not updated.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated.data[0]