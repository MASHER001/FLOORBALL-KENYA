from fastapi import APIRouter, Depends
from app.modules.super_admin import service
from app.modules.super_admin.permissions import require_super_admin

router = APIRouter(tags=["Super Admin"])


@router.get("/super-admin/system/health")
def health(_user=Depends(require_super_admin)):
    return service.system_health()


@router.get("/super-admin/audit-logs")
def audit_hint(_user=Depends(require_super_admin)):
    return {"detail": "Use /admin/audit-logs — this endpoint is a placeholder for future expansion."}
