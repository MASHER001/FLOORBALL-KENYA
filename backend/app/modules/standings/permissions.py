from app.core.dependencies import require_role
require_standings_manager = require_role("admin", "super_admin")
