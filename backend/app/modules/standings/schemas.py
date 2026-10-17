from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class StandingRow(BaseModel):
    team_id: UUID
    group_id: Optional[UUID] = None
    played: int
    won: int
    drawn: int
    lost: int
    goals_for: int
    goals_against: int
    goal_diff: int
    points: int
    updated_at: datetime
