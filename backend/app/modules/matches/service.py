from datetime import datetime, timezone
from typing import Any
from fastapi import HTTPException, status
from app.modules.audit import service as audit
from app.modules.matches import repository as repo
from app.modules.matches.schemas import MatchEventCreate, ResultSubmissionCreate


def add_event(match_id: str, payload: MatchEventCreate, actor_id: str) -> dict[str, Any]:
    if not repo.get_fixture(match_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Match not found")
    data = payload.model_dump()
    data["match_id"] = match_id
    data["recorded_by"] = actor_id
    if data.get("team_id"):
        data["team_id"] = str(data["team_id"])
    if data.get("player_id"):
        data["player_id"] = str(data["player_id"])
    event = repo.insert_event(data)
    audit.log_action(actor={"id": actor_id}, action="match.event_add",
                     resource_type="match", resource_id=match_id,
                     metadata={"event_type": data["event_type"]})
    return event


def submit_result(match_id: str, payload: ResultSubmissionCreate,
                  actor_id: str) -> dict[str, Any]:
    if not repo.get_fixture(match_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Match not found")
    data = payload.model_dump()
    data["match_id"] = match_id
    data["submitted_by"] = actor_id
    data["status"] = "pending"
    submission = repo.insert_submission(data)
    audit.log_action(actor={"id": actor_id}, action="result.submit",
                     resource_type="match", resource_id=match_id,
                     metadata={"home_score": data["home_score"],
                               "away_score": data["away_score"]})
    return submission


def confirm_result(submission_id: str, actor_id: str) -> dict[str, Any]:
    existing = repo.get_submission(submission_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Submission not found")
    if existing["status"] != "pending":
        raise HTTPException(status.HTTP_400_BAD_REQUEST,
                            f"Cannot confirm from status '{existing['status']}'")
    updated = repo.update_submission(submission_id, {"status": "confirmed"}) or existing
    repo.update_fixture(existing["match_id"], {
        "home_score": existing["home_score"],
        "away_score": existing["away_score"],
        "status": "completed",
    })
    audit.log_action(actor={"id": actor_id}, action="result.confirm",
                     resource_type="match", resource_id=existing["match_id"],
                     metadata={"submission_id": submission_id})
    return updated


def dispute_result(submission_id: str, reason: str, actor_id: str) -> dict[str, Any]:
    existing = repo.get_submission(submission_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Submission not found")
    updated = repo.update_submission(submission_id, {
        "status": "disputed", "reason": reason,
    }) or existing
    audit.log_action(actor={"id": actor_id}, action="result.dispute",
                     resource_type="match", resource_id=existing["match_id"],
                     metadata={"submission_id": submission_id, "reason": reason})
    return updated
