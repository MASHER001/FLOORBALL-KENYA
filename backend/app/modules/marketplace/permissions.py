from app.core.dependencies import require_role
require_marketplace_manager = require_role("admin", "super_admin")
