from typing import Any
from uuid import UUID
from pydantic import BaseModel


class TeamStatSummary(BaseModel):
    team_id: UUID
    matches_played: int
    wins: int
    draws: int
    losses: int
    goals_for: int
    goals_against: int


class PlayerStatSummary(BaseModel):
    player_id: UUID
    goals: int
    assists: int
    yellow_cards: int
    red_cards: int
