"""
Database module
===============

Wraps Supabase clients and future DB helpers.
"""

from app.database.supabase import (
    get_supabase,
    get_supabase_admin,
)

__all__ = [
    "get_supabase",
    "get_supabase_admin",
]