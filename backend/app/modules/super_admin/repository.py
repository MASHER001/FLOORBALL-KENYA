from datetime import datetime, timezone
from typing import Any


def build_health(settings) -> dict[str, Any]:
    return {
        "status": "ok",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "supabase_configured": bool(settings.SUPABASE_URL),
        "service_key_loaded": bool(settings.SUPABASE_SERVICE_ROLE_KEY),
        "jwt_secret_loaded": bool(settings.SUPABASE_JWT_SECRET),
        "checked_at": datetime.now(timezone.utc).isoformat(),
    }
