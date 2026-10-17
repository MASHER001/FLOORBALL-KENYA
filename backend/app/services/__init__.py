"""
Services module
===============

Business logic that sits between routers and the database.

Rules of the layer:
    - Services receive plain dicts / pydantic models — not HTTP objects
    - Services raise domain exceptions (or return Result objects)
    - Routers translate service results into HTTP responses
    - Services never touch FastAPI's Request/Response

Submodules:
    - standings:     league table recalculation
    - statistics:    player/team stats aggregation after results
    - payments:      M-Pesa (Daraja) integration
    - commissions:   vendor earnings calculation
"""

__all__ = ["standings", "statistics", "payments", "commissions"]