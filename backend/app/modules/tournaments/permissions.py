from app.core.dependencies import require_role
require_tournament_manager = require_role("admin", "super_admin")
