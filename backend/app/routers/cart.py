"""
Cart router
===========

Each user has exactly one implicit cart (rows in `cart_items`).
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_user
from app.database.supabase import get_supabase_admin
from app.schemas.order import (
    CartItemAdd,
    CartItemResponse,
    CartItemUpdate,
    CartResponse,
)

router = APIRouter(prefix="/cart", tags=["Cart"])


def _load_cart(user_id: str) -> dict:
    sb = get_supabase_admin()
    items = (
        sb.table("cart_items")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    ).data or []

    subtotal = 0.0
    item_count = 0

    if items:
        product_ids = [i["product_id"] for i in items]
        products = (
            sb.table("products")
            .select("id, price, name, image_urls")
            .in_("id", product_ids)
            .execute()
        ).data or []
        price_map = {p["id"]: p for p in products}

        for item in items:
            p = price_map.get(item["product_id"])
            if p:
                item["product"] = p
                subtotal += float(p["price"]) * item["quantity"]
                item_count += item["quantity"]

    return {
        "items": items,
        "subtotal": round(subtotal, 2),
        "item_count": item_count,
    }


# ============================================================
# GET /cart
# ============================================================
@router.get("", response_model=CartResponse, summary="Get my cart")
def get_cart(user: dict = Depends(get_current_user)):
    return _load_cart(user["id"])


# ============================================================
# POST /cart/items
# ============================================================
@router.post(
    "/items",
    response_model=CartItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a product to my cart",
)
def add_to_cart(
    payload: CartItemAdd,
    user: dict = Depends(get_current_user),
):
    sb = get_supabase_admin()

    # Ensure product exists & active
    product = (
        sb.table("products")
        .select("id, stock, is_active")
        .eq("id", payload.product_id)
        .limit(1)
        .execute()
    )
    if not product.data:
        raise HTTPException(status_code=404, detail="Product not found")
    if not product.data[0].get("is_active"):
        raise HTTPException(status_code=400, detail="Product is not available")

    # If already in cart, increment quantity
    existing = (
        sb.table("cart_items")
        .select("*")
        .eq("user_id", user["id"])
        .eq("product_id", payload.product_id)
        .limit(1)
        .execute()
    )
    if existing.data:
        new_qty = existing.data[0]["quantity"] + payload.quantity
        updated = (
            sb.table("cart_items")
            .update({"quantity": new_qty})
            .eq("id", existing.data[0]["id"])
            .execute()
        )
        return updated.data[0]

    created = sb.table("cart_items").insert(
        {
            "user_id": user["id"],
            "product_id": payload.product_id,
            "quantity": payload.quantity,
        }
    ).execute()
    return created.data[0]


# ============================================================
# PATCH /cart/items/{item_id}
# ============================================================
@router.patch(
    "/items/{item_id}",
    response_model=CartItemResponse,
    summary="Change quantity of a cart item",
)
def update_cart_item(
    item_id: str,
    payload: CartItemUpdate,
    user: dict = Depends(get_current_user),
):
    sb = get_supabase_admin()
    existing = (
        sb.table("cart_items").select("*").eq("id", item_id).limit(1).execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if existing.data[0]["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your cart item")

    updated = (
        sb.table("cart_items")
        .update({"quantity": payload.quantity})
        .eq("id", item_id)
        .execute()
    )
    return updated.data[0]


# ============================================================
# DELETE /cart/items/{item_id}
# ============================================================
@router.delete("/items/{item_id}", summary="Remove a cart item")
def remove_cart_item(item_id: str, user: dict = Depends(get_current_user)):
    sb = get_supabase_admin()
    existing = (
        sb.table("cart_items").select("*").eq("id", item_id).limit(1).execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if existing.data[0]["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your cart item")

    sb.table("cart_items").delete().eq("id", item_id).execute()
    return {"success": True}


# ============================================================
# DELETE /cart
# ============================================================
@router.delete("", summary="Clear my cart")
def clear_cart(user: dict = Depends(get_current_user)):
    sb = get_supabase_admin()
    sb.table("cart_items").delete().eq("user_id", user["id"]).execute()
    return {"success": True}