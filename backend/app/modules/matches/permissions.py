from app.core.dependencies import require_role
require_match_manager = require_role("admin", "super_admin")
require_match_official = require_role("match_official", "admin", "super_admin")
