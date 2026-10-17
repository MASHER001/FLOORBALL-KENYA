"""
Permission guards for campaign management.
"""

from app.core.dependencies import require_role

require_campaign_manager = require_role("admin", "super_admin")
