from app.core.dependencies import require_role
require_official_manager = require_role("admin", "super_admin")
require_authenticated = None  # set below via get_current_user
from app.core.dependencies import get_current_user
require_authenticated = get_current_user
