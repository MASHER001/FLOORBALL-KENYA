"""
FloorballKenya Backend — FastAPI Entry Point
============================================

Run:
    uvicorn app.main:app --reload
"""

import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.routers import api_router
from app.modules import api_router as modules_router

# ---------- Logging ----------
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger("floorballkenya")


# ============================================================
# Lifespan — startup / shutdown
# ============================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)
    logger.info("   Environment : %s", settings.ENVIRONMENT)
    logger.info("   Debug       : %s", settings.DEBUG)
    logger.info("   Supabase URL: %s", settings.SUPABASE_URL or "(not set)")
    logger.info(
        "   Service key : %s",
        "loaded" if settings.SUPABASE_SERVICE_ROLE_KEY else "MISSING",
    )
    logger.info(
        "   JWT secret  : %s",
        "loaded" if settings.SUPABASE_JWT_SECRET else "MISSING",
    )
    logger.info("   CORS        : %s", settings.cors_origins)
    yield
    logger.info("🛑 Shutting down %s", settings.APP_NAME)


# ============================================================
# FastAPI app
# ============================================================
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Backend API for FloorballKenya — sports management, "
        "marketplace, M-Pesa payments, and admin operations."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)


# ============================================================
# CORS
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# ============================================================
# Request timing middleware
# ============================================================
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    response.headers["X-Process-Time-Ms"] = f"{duration_ms:.2f}"
    return response


# ============================================================
# Global exception handler with CORS headers
# ============================================================
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)

    # Build the CORS headers manually so the browser doesn't misreport
    # a 500 as a CORS error
    origin = request.headers.get("origin")
    cors_headers = {}
    if origin and origin in settings.cors_origins:
        cors_headers["Access-Control-Allow-Origin"] = origin
        cors_headers["Access-Control-Allow-Credentials"] = "true"
        cors_headers["Vary"] = "Origin"

    if settings.is_production:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
            headers=cors_headers,
        )

    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "type": exc.__class__.__name__,
        },
        headers=cors_headers,
    )


# ============================================================
# Mount all API routers
# ============================================================
app.include_router(api_router, prefix=settings.API_V1_PREFIX)
app.include_router(modules_router, prefix=settings.API_V1_PREFIX)


# ============================================================
# Health & root
# ============================================================
@app.get("/", tags=["System"], summary="API root")
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "env": settings.ENVIRONMENT,
        "docs": "/docs",
        "api_prefix": settings.API_V1_PREFIX,
    }


@app.get("/health", tags=["System"], summary="Health check")
def health():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "env": settings.ENVIRONMENT,
    }