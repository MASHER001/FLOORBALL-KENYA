"""
Permission guards for audit logs.
Only admin and super_admin can read them.
"""

from app.core.dependencies import require_role

require_audit_reader = require_role("admin", "super_admin")
