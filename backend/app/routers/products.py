"""
Products router
===============

Public read for active products; vendors manage their own.
Admins can manage all.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.dependencies import (
    get_optional_user,
    require_admin,
    require_vendor,
)
from app.database.supabase import get_supabase_admin
from app.schemas.product import (
    CategoryCreate,
    CategoryResponse,
    ProductCreate,
    ProductListResponse,
    ProductResponse,
    ProductStockUpdate,
    ProductUpdate,
)

router = APIRouter(prefix="/products", tags=["Products"])


# ============================================================
# CATEGORIES
# ============================================================
@router.get(
    "/categories",
    response_model=list[CategoryResponse],
    summary="List product categories (public)",
)
def list_categories():
    sb = get_supabase_admin()
    resp = sb.table("product_categories").select("*").order("name").execute()
    return resp.data or []


@router.post(
    "/categories",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a category (admin only)",
)
def create_category(
    payload: CategoryCreate,
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    created = sb.table("product_categories").insert(payload.model_dump()).execute()
    return created.data[0]


# ============================================================
# PRODUCTS — PUBLIC LIST / SEARCH
# ============================================================
@router.get(
    "",
    response_model=ProductListResponse,
    summary="List products with filters",
)
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None, description="Search name/description"),
    category_id: str | None = Query(None),
    vendor_id: str | None = Query(None),
    min_price: float | None = Query(None, ge=0),
    max_price: float | None = Query(None, ge=0),
    in_stock: bool | None = Query(None),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size

    query = (
        sb.table("products")
        .select("*, vendors(business_name)", count="exact")
        .eq("is_active", True)
    )

    if q:
        # Match name OR description
        query = query.or_(f"name.ilike.%{q}%,description.ilike.%{q}%")
    if category_id:
        query = query.eq("category_id", category_id)
    if vendor_id:
        query = query.eq("vendor_id", vendor_id)
    if min_price is not None:
        query = query.gte("price", min_price)
    if max_price is not None:
        query = query.lte("price", max_price)
    if in_stock is True:
        query = query.gt("stock", 0)

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


@router.get(
    "/search",
    response_model=ProductListResponse,
    summary="Search products (convenience alias)",
)
def search_products(
    q: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    return list_products(q=q, page=page, page_size=page_size)


# ============================================================
# PRODUCTS — READ ONE
# ============================================================
@router.get("/{product_id}", response_model=ProductResponse, summary="Get a product")
def get_product(product_id: str):
    sb = get_supabase_admin()
    resp = (
        sb.table("products")
        .select("*, vendors(business_name)")
        .eq("id", product_id)
        .limit(1)
        .execute()
    )
    if not resp.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return resp.data[0]


# ============================================================
# PRODUCTS — WRITE (vendor or admin)
# ============================================================
@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a product (vendor or admin)",
)
def create_product(
    payload: ProductCreate,
    user: dict = Depends(require_vendor),
):
    sb = get_supabase_admin()

    # Resolve vendor_id
    if user["role"] in ("admin", "super_admin"):
        # Admin must specify vendor_id in body (not yet supported → use own)
        vendor = (
            sb.table("vendors")
            .select("id, status")
            .eq("user_id", user["id"])
            .limit(1)
            .execute()
        )
        if not vendor.data:
            raise HTTPException(
                status_code=400,
                detail="Admins without a vendor profile cannot create products directly",
            )
        vendor_id = vendor.data[0]["id"]
    else:
        vendor = (
            sb.table("vendors")
            .select("id, status")
            .eq("user_id", user["id"])
            .limit(1)
            .execute()
        )
        if not vendor.data:
            raise HTTPException(
                status_code=403,
                detail="You must register as a vendor first",
            )
        if vendor.data[0]["status"] != "approved":
            raise HTTPException(
                status_code=403,
                detail="Your vendor account is not yet approved",
            )
        vendor_id = vendor.data[0]["id"]

    data = payload.model_dump(exclude_unset=True)
    data["vendor_id"] = vendor_id

    try:
        created = sb.table("products").insert(data).execute()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not create product: {exc}")
    return created.data[0]


def _assert_vendor_owns_product(product: dict, user: dict) -> None:
    if user["role"] in ("admin", "super_admin"):
        return
    sb = get_supabase_admin()
    vendor = (
        sb.table("vendors")
        .select("id")
        .eq("user_id", user["id"])
        .limit(1)
        .execute()
    )
    if not vendor.data or vendor.data[0]["id"] != product.get("vendor_id"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this product",
        )


@router.put(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Update a product (owner vendor or admin)",
)
def update_product(
    product_id: str,
    payload: ProductUpdate,
    user: dict = Depends(require_vendor),
):
    sb = get_supabase_admin()
    resp = sb.table("products").select("*").eq("id", product_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Product not found")
    product = resp.data[0]
    _assert_vendor_owns_product(product, user)

    data = payload.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")

    sb.table("products").update(data).eq("id", product_id).execute()
    updated = sb.table("products").select("*").eq("id", product_id).limit(1).execute()
    return updated.data[0]


@router.patch(
    "/{product_id}/stock",
    response_model=ProductResponse,
    summary="Update stock (owner vendor or admin)",
)
def update_stock(
    product_id: str,
    payload: ProductStockUpdate,
    user: dict = Depends(require_vendor),
):
    sb = get_supabase_admin()
    resp = sb.table("products").select("*").eq("id", product_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Product not found")
    _assert_vendor_owns_product(resp.data[0], user)

    sb.table("products").update({"stock": payload.stock}).eq("id", product_id).execute()
    updated = sb.table("products").select("*").eq("id", product_id).limit(1).execute()
    return updated.data[0]


@router.delete("/{product_id}", summary="Delete a product (owner vendor or admin)")
def delete_product(
    product_id: str,
    user: dict = Depends(require_vendor),
):
    sb = get_supabase_admin()
    resp = sb.table("products").select("*").eq("id", product_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Product not found")
    _assert_vendor_owns_product(resp.data[0], user)

    sb.table("products").delete().eq("id", product_id).execute()
    return {"success": True}