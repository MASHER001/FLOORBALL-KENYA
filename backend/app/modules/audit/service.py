"""
Audit log service.

`log_action()` is a fire-and-forget helper that services call
after (or before) performing a state-changing operation.

It must NEVER raise. If the audit write fails, the original
business action still completes.
"""

import logging
from typing import Any, Optional

from app.modules.audit import repository as repo

logger = logging.getLogger("floorballkenya.audit")


def log_action(
    *,
    actor: Optional[dict[str, Any]],
    action: str,
    resource_type: str,
    resource_id: Optional[str] = None,
    metadata: Optional[dict[str, Any]] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> None:
    payload = {
        "actor_id": actor.get("id") if actor else None,
        "actor_email": actor.get("email") if actor else None,
        "action": action,
        "resource_type": resource_type,
        "resource_id": str(resource_id) if resource_id is not None else None,
        "metadata": metadata or {},
        "ip_address": ip_address,
        "user_agent": user_agent,
    }
    try:
        repo.insert_log(payload)
    except Exception:
        logger.exception("Failed to write audit log: %s", action)


def list_audit_logs(
    actor_id: Optional[str] = None,
    action: Optional[str] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> dict[str, Any]:
    rows, total = repo.list_logs(
        actor_id=actor_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        limit=limit,
        offset=offset,
    )
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "items": rows,
    }
