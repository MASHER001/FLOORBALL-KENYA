"""
Schemas module
==============

Pydantic models for request/response validation.

Each submodule corresponds to a domain:
    - auth:         login, register, tokens
    - user:         profiles and user management
    - team:         teams and rosters
    - player:       players and their stats
    - league:       leagues, seasons, standings
    - match:        fixtures, results, events
    - tournament:   tournaments and registrations
    - product:      marketplace products and categories
    - order:        orders and cart items
    - payment:      M-Pesa and payment records

Convention:
    - `<Entity>Base`     → shared fields
    - `<Entity>Create`   → POST body (write)
    - `<Entity>Update`   → PUT/PATCH body (partial)
    - `<Entity>Response` → API response (read)
"""

__all__ = [
    "auth",
    "user",
    "team",
    "player",
    "league",
    "match",
    "tournament",
    "product",
    "order",
    "payment",
]