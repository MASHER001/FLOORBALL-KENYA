from app.core.dependencies import get_current_user, require_role
require_authenticated = get_current_user
require_user_admin = require_role("admin", "super_admin")
