"""
Audit router.

    GET /admin/audit-logs
"""

from typing import Optional

from fastapi import APIRouter, Depends

from app.modules.audit import service
from app.modules.audit.permissions import require_audit_reader
from app.modules.audit.schemas import AuditLogPage

router = APIRouter(tags=["Audit"])


@router.get(
    "/admin/audit-logs",
    response_model=AuditLogPage,
    summary="List audit log entries (admin)",
)
def list_logs(
    actor_id: Optional[str] = None,
    action: Optional[str] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    _user=Depends(require_audit_reader),
):
    return service.list_audit_logs(
        actor_id=actor_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        limit=limit,
        offset=offset,
    )
