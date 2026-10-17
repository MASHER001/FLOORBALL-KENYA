from app.core.dependencies import require_role

require_draw_manager = require_role("admin", "super_admin")
