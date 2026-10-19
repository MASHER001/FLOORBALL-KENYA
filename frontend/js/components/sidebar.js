/**
 * Dashboard sidebar
 * =================
 * Renders a role-appropriate sidebar into <aside id="dashboard-sidebar"></aside>.
 *
 * Usage:
 *   renderSidebarFor("admin", document.getElementById("dashboard-sidebar"));
 */

import { BASE } from "../config.js";
import { isLoggedIn, getSession } from "../auth.js";

const MENUS = {
  admin: [
    { group: "Overview", items: [
      { label: "Dashboard",   href: `${BASE}/pages/dashboard/admin.html` },
    ]},
    { group: "Users", items: [
      { label: "Users",       href: `${BASE}/pages/admin/users.html` },
      { label: "Roles",       href: `${BASE}/pages/admin/roles-permissions.html` },
    ]},
    { group: "Competitions", items: [
      { label: "Leagues",     href: `${BASE}/pages/admin/leagues.html` },
      { label: "Tournaments", href: `${BASE}/pages/admin/tournaments.html` },
      { label: "Draws",       href: `${BASE}/pages/admin/tournament-draws.html` },
      { label: "Fixtures",    href: `${BASE}/pages/admin/fixture-generator.html` },
      { label: "Matches",     href: `${BASE}/pages/admin/matches.html` },
      { label: "Results",     href: `${BASE}/pages/admin/result-approvals.html` },
      { label: "Standings",   href: `${BASE}/pages/admin/standings.html` },
    ]},
    { group: "Marketplace", items: [
      { label: "Vendors",     href: `${BASE}/pages/admin/vendors.html` },
      { label: "Products",    href: `${BASE}/pages/admin/products.html` },
      { label: "Orders",      href: `${BASE}/pages/admin/orders.html` },
      { label: "Payments",    href: `${BASE}/pages/admin/payments.html` },
    ]},
    { group: "Advertising", items: [
      { label: "Campaigns",   href: `${BASE}/pages/admin/advertisements.html` },
      { label: "Analytics",   href: `${BASE}/pages/admin/advertisement-analytics.html` },
      { label: "Sponsors",    href: `${BASE}/pages/admin/sponsors.html` },
    ]},
    { group: "Content", items: [
      { label: "Gallery",     href: `${BASE}/pages/admin/gallery-management.html` },
      { label: "News",        href: `${BASE}/pages/admin/news-management.html` },
    ]},
    { group: "System", items: [
      { label: "Audit logs",  href: `${BASE}/pages/admin/audit-logs.html` },
      { label: "Health",      href: `${BASE}/pages/admin/system-health.html` },
      { label: "Deployments", href: `${BASE}/pages/admin/deployments.html` },
      { label: "Settings",    href: `${BASE}/pages/admin/settings.html` },
    ]},
  ],
  team_manager: [
    { group: "Team", items: [
      { label: "Dashboard",     href: `${BASE}/pages/dashboard/team-manager.html` },
      { label: "Roster",        href: `${BASE}/pages/team-manager/roster.html` },
      { label: "Registrations", href: `${BASE}/pages/team-manager/registrations.html` },
      { label: "Fixtures",      href: `${BASE}/pages/team-manager/fixtures.html` },
      { label: "Results",       href: `${BASE}/pages/team-manager/match-results.html` },
    ]},
  ],
  player: [
    { group: "My Area", items: [
      { label: "Dashboard",     href: `${BASE}/pages/dashboard/player.html` },
      { label: "Profile",       href: `${BASE}/pages/player/profile-edit.html` },
      { label: "My Team",       href: `${BASE}/pages/player/team.html` },
      { label: "Statistics",    href: `${BASE}/pages/player/statistics.html` },
      { label: "Notifications", href: `${BASE}/pages/player/notifications.html` },
    ]},
  ],
  vendor: [
    { group: "Store", items: [
      { label: "Dashboard",  href: `${BASE}/pages/dashboard/vendor.html` },
      { label: "Products",   href: `${BASE}/pages/vendor/products.html` },
      { label: "Orders",     href: `${BASE}/pages/vendor/orders.html` },
      { label: "Inventory",  href: `${BASE}/pages/vendor/inventory.html` },
      { label: "Payouts",    href: `${BASE}/pages/vendor/payouts.html` },
      { label: "Promotions", href: `${BASE}/pages/vendor/promotions.html` },
    ]},
  ],
  advertiser: [
    { group: "Campaigns", items: [
      { label: "Dashboard",  href: `${BASE}/pages/advertiser/dashboard.html` },
      { label: "Campaigns",  href: `${BASE}/pages/advertiser/campaigns.html` },
      { label: "Analytics",  href: `${BASE}/pages/advertiser/analytics.html` },
    ]},
  ],
  match_official: [
    { group: "Officiating", items: [
      { label: "Dashboard",     href: `${BASE}/pages/officials/dashboard.html` },
      { label: "Profile",       href: `${BASE}/pages/officials/profile.html` },
      { label: "Availability",  href: `${BASE}/pages/officials/availability.html` },
      { label: "Assignments",   href: `${BASE}/pages/officials/assignments.html` },
      { label: "Result Entry",  href: `${BASE}/pages/officials/result-submission.html` },
      { label: "Match Report",  href: `${BASE}/pages/officials/match-report.html` },
    ]},
  ],
};

export function renderSidebarFor(role, host) {
  host = host || document.getElementById("dashboard-sidebar");
  if (!host) return;

  let menu = MENUS[role];
  if (!menu && isLoggedIn()) {
    const s = getSession();
    const r = s?.user?.role || s?.role;
    menu = MENUS[r];
  }
  if (!menu) menu = MENUS.player;

  const current = window.location.pathname;

  host.innerHTML = menu
    .map((g) => {
      const items = g.items
        .map(
          (it) =>
            `<a href="${it.href}" class="${current.endsWith(it.href.split("/").pop()) ? "active" : ""}">${esc(it.label)}</a>`
        )
        .join("");
      return `<div class="group-title">${esc(g.group)}</div>${items}`;
    })
    .join("");
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}