"""
Security utilities
==================

Handles verification of Supabase-issued JWTs.

Supabase uses HS256-signed JWTs where:
    - `sub`   = the user's UUID (matches auth.users.id)
    - `email` = the user's email
    - `aud`   = "authenticated"
    - `role`  = "authenticated" (not to be confused with our app role)

Our app role lives in `public.profiles.role` and is fetched from the DB,
NOT trusted from the JWT. This is intentional and more secure.
"""

from typing import Any, Dict, Optional

import jwt
from fastapi import HTTPException, status
from jwt import PyJWTError

from app.core.config import settings


class TokenError(HTTPException):
    """Raised when a JWT is missing, malformed, expired or has bad claims."""

    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


def decode_supabase_token(token: str) -> Dict[str, Any]:
    """
    Decode and verify a Supabase-issued access token.

    Returns the decoded payload (dict) on success.
    Raises TokenError on any failure.
    """
    if not settings.SUPABASE_JWT_SECRET:
        raise TokenError("Server misconfiguration: SUPABASE_JWT_SECRET is not set")

    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=[settings.SUPABASE_JWT_ALGORITHM],
            audience=settings.SUPABASE_JWT_AUDIENCE,
            options={"require": ["exp", "sub", "aud"]},
        )
    except jwt.ExpiredSignatureError:
        raise TokenError("Token has expired")
    except jwt.InvalidAudienceError:
        raise TokenError("Invalid token audience")
    except jwt.InvalidTokenError:
        raise TokenError("Invalid token")
    except PyJWTError:
        raise TokenError("Could not validate credentials")

    return payload


def extract_user_id(payload: Dict[str, Any]) -> str:
    """Extract the `sub` claim (user UUID) from a decoded JWT payload."""
    user_id: Optional[str] = payload.get("sub")
    if not user_id:
        raise TokenError("Token is missing subject (sub) claim")
    return user_id


def extract_email(payload: Dict[str, Any]) -> Optional[str]:
    """Extract the `email` claim if present."""
    return payload.get("email")


def extract_bearer_token(authorization: Optional[str]) -> str:
    """
    Parse the Authorization header value and return the raw token.

    Expected format:
        Authorization: Bearer <token>
    """
    if not authorization:
        raise TokenError("Missing Authorization header")

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise TokenError("Authorization header must be 'Bearer <token>'")

    return parts[1]