"""
Routers registry
================

Aggregates every router into a single `api_router` mounted by main.py.
"""

from fastapi import APIRouter

# Auth & Users
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router

# Sports
from app.routers.teams import router as teams_router
from app.routers.players import router as players_router
from app.routers.leagues import router as leagues_router
from app.routers.matches import router as matches_router
from app.routers.tournaments import router as tournaments_router

# Marketplace
from app.routers.products import router as products_router
from app.routers.vendors import router as vendors_router
from app.routers.cart import router as cart_router
from app.routers.orders import router as orders_router
from app.routers.payments import router as payments_router
from app.routers.commissions import router as commissions_router

# Content
from app.routers.news import router as news_router

# Admin
from app.routers.admin import router as admin_router
from app.routers.superadmin import router as superadmin_router


api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(teams_router)
api_router.include_router(players_router)
api_router.include_router(leagues_router)
api_router.include_router(matches_router)
api_router.include_router(tournaments_router)
api_router.include_router(products_router)
api_router.include_router(vendors_router)
api_router.include_router(cart_router)
api_router.include_router(orders_router)
api_router.include_router(payments_router)
api_router.include_router(commissions_router)
api_router.include_router(news_router)
api_router.include_router(admin_router)
api_router.include_router(superadmin_router)