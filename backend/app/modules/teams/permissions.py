from app.core.dependencies import require_role
require_team_manager = require_role("admin", "super_admin", "team_manager")
