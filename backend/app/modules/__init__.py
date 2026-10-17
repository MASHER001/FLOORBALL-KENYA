"""
Modules package.
"""

from fastapi import APIRouter

# Specific-path routers first
from app.modules.analytics.router import router as analytics_router
from app.modules.audit.router import router as audit_router
from app.modules.campaigns.router import router as campaigns_router
from app.modules.draws.router import router as draws_router
from app.modules.fixtures.router import router as fixtures_router
from app.modules.gallery.router import router as gallery_router

# Domain routers
from app.modules.leagues.router import router as leagues_router
from app.modules.marketplace.router import router as marketplace_router
from app.modules.matches.router import router as matches_router
from app.modules.news.router import router as news_router
from app.modules.notifications.router import router as notifications_router
from app.modules.officials.router import router as officials_router
from app.modules.orders.router import router as orders_router
from app.modules.payments.router import router as payments_router
from app.modules.players.router import router as players_router
from app.modules.sponsors.router import router as sponsors_router
from app.modules.standings.router import router as standings_router
from app.modules.statistics.router import router as statistics_router
from app.modules.super_admin.router import router as super_admin_router
from app.modules.teams.router import router as teams_router
from app.modules.tournaments.router import router as tournaments_router
from app.modules.users.router import router as users_router
from app.modules.vendors.router import router as vendors_router

# Advertisement-specific
from app.modules.advertisements.router import router as advertisements_router
from app.modules.placements.router import router as placements_router

api_router = APIRouter()

# Specific first, then domain, then generic
api_router.include_router(analytics_router)
api_router.include_router(audit_router)
api_router.include_router(campaigns_router)
api_router.include_router(draws_router)
api_router.include_router(fixtures_router)
api_router.include_router(gallery_router)
api_router.include_router(super_admin_router)

api_router.include_router(leagues_router)
api_router.include_router(marketplace_router)
api_router.include_router(matches_router)
api_router.include_router(news_router)
api_router.include_router(notifications_router)
api_router.include_router(officials_router)
api_router.include_router(orders_router)
api_router.include_router(payments_router)
api_router.include_router(players_router)
api_router.include_router(sponsors_router)
api_router.include_router(standings_router)
api_router.include_router(statistics_router)
api_router.include_router(teams_router)
api_router.include_router(tournaments_router)
api_router.include_router(users_router)
api_router.include_router(vendors_router)

api_router.include_router(advertisements_router)
api_router.include_router(placements_router)