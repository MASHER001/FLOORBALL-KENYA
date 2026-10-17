"""
Permission guards for the gallery.
"""

from app.core.dependencies import require_role

require_gallery_manager = require_role("admin", "super_admin")