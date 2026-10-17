from app.core.config import settings
from app.modules.super_admin import repository as repo


def system_health() -> dict:
    return repo.build_health(settings)
