"""
Security utilities
==================

Handles verification of Supabase-issued JWTs.

Supabase can sign tokens with either:
    - HS256 (legacy shared-secret) — verified with SUPABASE_JWT_SECRET
    - ES256 (modern asymmetric)    — verified with the project's JWKS

The `alg` header of each token is inspected and the correct key type
is used automatically.

JWT claims:
    - `sub`   = the user's UUID (matches auth.users.id)
    - `email` = the user's email
    - `aud`   = "authenticated"
    - `role`  = "authenticated" (not to be confused with our app role)

Our app role lives in `public.profiles.role` and is fetched from the DB,
NOT trusted from the JWT. This is intentional and more secure.
"""

import json
from functools import lru_cache
from typing import Any, Dict, Optional

import httpx
import jwt
from fastapi import HTTPException, status
from jwt import PyJWTError
from jwt.algorithms import ECAlgorithm

from app.core.config import settings


class TokenError(HTTPException):
    """Raised when a JWT is missing, malformed, expired or has bad claims."""

    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


# ============================================================
# JWKS cache (for ES256)
# ============================================================

@lru_cache(maxsize=1)
def _get_supabase_jwks() -> list[dict]:
    """
    Fetch and cache Supabase's public JWKS.

    Cached for the life of the process — JWKS rarely change.
    If Supabase rotates signing keys, restart uvicorn to refresh.
    """
    url = f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/.well-known/jwks.json"

    try:
        response = httpx.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
    except Exception as exc:
        raise TokenError(f"Could not fetch Supabase JWKS: {exc}")

    keys = data.get("keys") or []
    if not keys:
        raise TokenError("Supabase JWKS returned no keys")

    return keys


def _resolve_public_key(kid: Optional[str]):
    """
    Return the EC public key matching the given `kid`.
    Falls back to the first key if kid is missing or unknown.
    """
    keys = _get_supabase_jwks()

    if kid:
        matched = [k for k in keys if k.get("kid") == kid]
        key_data = matched[0] if matched else keys[0]
    else:
        key_data = keys[0]

    try:
        return ECAlgorithm.from_jwk(json.dumps(key_data))
    except Exception as exc:
        raise TokenError(f"Could not build public key from JWKS: {exc}")


# ============================================================
# Token verification
# ============================================================

def decode_supabase_token(token: str) -> Dict[str, Any]:
    """
    Decode and verify a Supabase-issued access token.

    Supports both HS256 (legacy) and ES256 (modern) tokens.

    Returns the decoded payload (dict) on success.
    Raises TokenError on any failure.
    """
    # Read the algorithm from the unverified header (needed to pick the key type)
    try:
        header = jwt.get_unverified_header(token)
    except PyJWTError:
        raise TokenError("Invalid token format")

    alg = header.get("alg", "HS256")
    kid = header.get("kid")

    # Choose key based on algorithm
    if alg == "HS256":
        if not settings.SUPABASE_JWT_SECRET:
            raise TokenError("Server misconfiguration: SUPABASE_JWT_SECRET is not set")
        key = settings.SUPABASE_JWT_SECRET
        algorithms = ["HS256"]
    elif alg in ("ES256", "ES384", "ES512"):
        key = _resolve_public_key(kid)
        algorithms = [alg]
    else:
        raise TokenError(f"Unsupported signing algorithm: {alg}")

    # Verify and decode
    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=algorithms,
            audience=settings.SUPABASE_JWT_AUDIENCE,
            options={"require": ["exp", "sub", "aud"]},
        )
    except jwt.ExpiredSignatureError:
        raise TokenError("Token has expired")
    except jwt.InvalidAudienceError:
        raise TokenError("Invalid token audience")
    except jwt.InvalidAlgorithmError:
        raise TokenError("Invalid token algorithm")
    except jwt.InvalidTokenError:
        raise TokenError("Invalid token")
    except PyJWTError:
        raise TokenError("Could not validate credentials")

    return payload


# ============================================================
# Claim extraction
# ============================================================

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