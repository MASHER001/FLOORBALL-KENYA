from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.matches import repository as repo
from app.modules.matches import service
from app.modules.matches.permissions import require_match_manager, require_match_official
from app.modules.matches.schemas import (
    DisputeRequest,
    MatchDetail,
    MatchEventCreate,
    MatchEventPublic,
    MatchSummary,
    ResultSubmissionCreate,
    ResultSubmissionPublic,
)

router = APIRouter(tags=["Matches"])