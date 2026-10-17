from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class PlacementPublic(BaseModel):
    id: UUID
    slug: str
    name: str
    description: Optional[str] = None
    max_active: int = 1
