"""
Domain enums for advertisements.
Mirror the enums defined in database/schema.sql.
"""

from enum import Enum


class CampaignStatus(str, Enum):
    DRAFT = "draft"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    PAUSED = "paused"
    EXPIRED = "expired"
    ARCHIVED = "archived"
    REJECTED = "rejected"


class CampaignType(str, Enum):
    EVENT_PROMOTION = "event_promotion"
    SPONSOR_AD = "sponsor_ad"
    MARKETPLACE_PRODUCT = "marketplace_product"
    GENERAL_ANNOUNCEMENT = "general_announcement"
    COMMUNITY_NOTICE = "community_notice"
