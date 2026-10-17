from datetime import datetime, timezone
from datetime import datetime, timezone
from typing import Any
from fastapi import HTTPException, status
from app.modules.audit import service as audit
from app.modules.officials import repository as repo
from app.modules.officials.schemas import OfficialRegister, AvailabilityCreate
from app.modules.officials import assignment as assign_engine
from app.modules.officials.schemas import QualificationCreate


def add_qualification(official_id: str, payload: QualificationCreate,
                      actor_id: str) -> dict[str, Any]:
    official = repo.get(official_id)
    if not official:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Official not found")
    data = payload.model_dump()
    for k in ("issued_on", "expires_on"):
        if data.get(k):
            data[k] = data[k].isoformat()
    data["official_id"] = official_id
    q = repo.add_qualification(data)
    audit.log_action(actor={"id": actor_id}, action="official.add_qualification",
                     resource_type="official", resource_id=official_id,
                     metadata={"qualification": data["qualification"]})
    return q


def assign_for_tournament(tournament_id: str, required_qualification: str | None,
                          actor_id: str) -> dict[str, Any]:
    fixtures = repo.fixtures_for_tournament(tournament_id)
    summary = {"fixtures_processed": 0, "assignments_created": 0, "unfilled": []}
    for f in fixtures:
        result = assign_engine.assign_officials_to_fixture(f, required_qualification)
        summary["fixtures_processed"] += 1
        summary["assignments_created"] += len(result.get("assigned", []))
        if result.get("unfilled"):
            summary["unfilled"].append({
                "match_id": f["id"],
                "roles": result["unfilled"],
            })
    audit.log_action(actor={"id": actor_id}, action="officials.bulk_assign",
                     resource_type="tournament", resource_id=tournament_id,
                     metadata=summary)
    return summary


def respond_to_assignment(assignment_id: str, status: str,
                          actor_id: str, notes: str | None) -> dict[str, Any]:
    existing = repo.get_assignment(assignment_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Assignment not found")
    official = repo.get_by_user(actor_id)
    if not official or existing["official_id"] != official["id"]:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your assignment")
    patch = {
        "status": status,
        "responded_at": datetime.now(timezone.utc).isoformat(),
    }
    if notes:
        patch["notes"] = notes
    updated = repo.update_assignment(assignment_id, patch) or existing
    audit.log_action(actor={"id": actor_id}, action=f"assignment.{status}",
                     resource_type="match_official_assignment", resource_id=assignment_id)
    return updated

def register(user_id: str, payload: OfficialRegister) -> dict[str, Any]:
    if repo.get_by_user(user_id):
        raise HTTPException(status.HTTP_409_CONFLICT, "Already registered as official")
    data = payload.model_dump()
    data["user_id"] = user_id
    official = repo.insert(data)
    audit.log_action(actor={"id": user_id}, action="official.register",
                     resource_type="official", resource_id=official["id"])
    return official


def verify(official_id: str, actor_id: str) -> dict[str, Any]:
    existing = repo.get(official_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Official not found")
    updated = repo.update(official_id, {
        "is_verified": True,
        "verified_by": actor_id,
        "verified_at": datetime.now(timezone.utc).isoformat(),
    }) or existing
    audit.log_action(actor={"id": actor_id}, action="official.verify",
                     resource_type="official", resource_id=official_id)
    return updated


def set_availability(official_id: str, payload: AvailabilityCreate) -> dict[str, Any]:
    if not repo.get(official_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Official not found")
    data = payload.model_dump()
    data["official_id"] = official_id
    data["available_on"] = data["available_on"].isoformat()
    return repo.upsert_availability(data)
