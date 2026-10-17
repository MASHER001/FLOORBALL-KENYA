from app.core.dependencies import get_current_user

# Authenticated user — reads their own notifications.
require_authenticated = get_current_user
