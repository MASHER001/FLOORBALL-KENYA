"""
Permission guards for advertisements.
"""

from app.core.dependencies import require_role

require_ad_manager = require_role("admin", "super_admin")
