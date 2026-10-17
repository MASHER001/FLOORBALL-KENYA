/**
 * Dashboard sidebar
 * =================
 * Renders a role-appropriate sidebar into <aside id="dashboard-sidebar"></aside>.
 *
 * Usage:
 *   renderSidebarFor("admin", document.getElementById("dashboard-sidebar"));
 */

import { isLoggedIn, getSession } from "../auth.js";

const MENUS = {
  admin: [
    { group: "Overview",     items: [
      { label: "Dashboard",   href: "/pages/dashboard/admin.html" },
    ]},
    { group: "Users",        items: [
      { label: "Users",       href: "/pages/admin/users.html" },
      { label: "Roles",       href: "/pages/admin/roles-permissions.html" },
    ]},
    { group: "Competitions", items: [
      { label: "Leagues",     href: "/pages/admin/leagues.html" },
      { label: "Tournaments", href: "/pages/admin/tournaments.html" },
      { label: "Draws",       href: "/pages/admin/tournament-draws.html" },
      { label: "Fixtures",    href: "/pages/admin/fixture-generator.html" },
      { label: "Matches",     href: "/pages/admin/matches.html" },
      { label: "Results",     href: "/pages/admin/result-approvals.html" },
      { label: "Standings",   href: "/pages/admin/standings.html" },
    ]},
    { group: "Marketplace",  items: [
      { label: "Vendors",     href: "/pages/admin/vendors.html" },
      { label: "Products",    href: "/pages/admin/products.html" },
      { label: "Orders",      href: "/pages/admin/orders.html" },
      { label: "Payments",    href: "/pages/admin/payments.html" },
    ]},
    { group: "Advertising",  items: [
      { label: "Campaigns",   href: "/pages/admin/advertisements.html" },
      { label: "Analytics",   href: "/pages/admin/advertisement-analytics.html" },
      { label: "Sponsors",    href: "/pages/admin/sponsors.html" },
    ]},
    { group: "Content",      items: [
      { label: "Gallery",     href: "/pages/admin/gallery-management.html" },
      { label: "News",        href: "/pages/admin/news-management.html" },
    ]},
    { group: "System",       items: [
      { label: "Audit logs",  href: "/pages/admin/audit-logs.html" },
      { label: "Health",      href: "/pages/admin/system-health.html" },
      { label: "Deployments", href: "/pages/admin/deployments.html" },
      { label: "Settings",    href: "/pages/admin/settings.html" },
    ]},
  ],
  team_manager: [
    { group: "Team", items: [
      { label: "Dashboard",     href: "/pages/dashboard/team-manager.html" },
      { label: "Roster",        href: "/pages/team-manager/roster.html" },
      { label: "Registrations", href: "/pages/team-manager/registrations.html" },
      { label: "Fixtures",      href: "/pages/team-manager/fixtures.html" },
      { label: "Results",       href: "/pages/team-manager/match-results.html" },
    ]},
  ],
  player: [
    { group: "My Area", items: [
      { label: "Dashboard",     href: "/pages/dashboard/player.html" },
      { label: "Profile",       href: "/pages/player/profile-edit.html" },
      { label: "My Team",       href: "/pages/player/team.html" },
      { label: "Statistics",    href: "/pages/player/statistics.html" },
      { label: "Notifications", href: "/pages/player/notifications.html" },
    ]},
  ],
  vendor: [
    { group: "Store", items: [
      { label: "Dashboard",  href: "/pages/dashboard/vendor.html" },
      { label: "Products",   href: "/pages/vendor/products.html" },
      { label: "Orders",     href: "/pages/vendor/orders.html" },
      { label: "Inventory",  href: "/pages/vendor/inventory.html" },
      { label: "Payouts",    href: "/pages/vendor/payouts.html" },
      { label: "Promotions", href: "/pages/vendor/promotions.html" },
    ]},
  ],
  advertiser: [
    { group: "Campaigns", items: [
      { label: "Dashboard",  href: "/pages/advertiser/dashboard.html" },
      { label: "Campaigns",  href: "/pages/advertiser/campaigns.html" },
      { label: "Analytics",  href: "/pages/advertiser/analytics.html" },
    ]},
  ],
  match_official: [
    { group: "Officiating", items: [
      { label: "Dashboard",     href: "/pages/officials/dashboard.html" },
      { label: "Profile",       href: "/pages/officials/profile.html" },
      { label: "Availability",  href: "/pages/officials/availability.html" },
      { label: "Assignments",   href: "/pages/officials/assignments.html" },
      { label: "Result Entry",  href: "/pages/officials/result-submission.html" },
      { label: "Match Report",  href: "/pages/officials/match-report.html" },
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
