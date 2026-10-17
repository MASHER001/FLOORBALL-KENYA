from app.core.dependencies import require_role, get_current_user
require_authenticated = get_current_user
require_order_manager = require_role("admin", "super_admin")
