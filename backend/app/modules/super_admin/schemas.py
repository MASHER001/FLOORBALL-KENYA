from datetime import datetime
from typing import Any
from pydantic import BaseModel


class SystemHealth(BaseModel):
    status: str
    app_name: str
    version: str
    environment: str
    supabase_configured: bool
    service_key_loaded: bool
    jwt_secret_loaded: bool
    checked_at: datetime


class DeploymentRecord(BaseModel):
    id: int
    commit_sha: str | None = None
    environment: str
    status: str
    requested_by: str | None = None
    requested_at: datetime
