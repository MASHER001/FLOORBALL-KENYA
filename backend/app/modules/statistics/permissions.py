from app.core.dependencies import require_role
require_stats_reader = require_role("admin", "super_admin")
