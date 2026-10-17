"""
Permission guards for analytics.
"""

from app.core.dependencies import require_role

require_analytics_viewer = require_role("admin", "super_admin")
