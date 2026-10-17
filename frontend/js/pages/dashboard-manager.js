/**
 * Team Manager dashboard
 * =======================
 * Sections: Overview, My Team, Players, Leagues, Tournaments
 */

import { api } from "../api.js";
import { getSession, requireRole } from "../auth.js";
import { CONFIG } from "../config.js";
import { escapeHtml, showLoading, showError, showEmpty } from "../ui.js";
import { teamCard } from "../components/team-card.js";
import { playerCard } from "../components/player-card.js";

let USER = null;
let MY_TEAM = null;

export async function initManagerDashboard() {
  if (!requireRole(["team_manager"], CONFIG.ROUTES.LOGIN)) return;

  const { user } = getSession();
  USER = user;

  renderShell();
  wireSidebar();
  switchSection("overview");
}

function renderShell() {
  const host = document.getElementById("dashboard-root");
  if (!host) return;

  host.innerHTML =
    '<div class="container">' +
      '<div class="dashboard">' +
        '<aside class="dashboard-sidebar">' +
          '<div style="padding: var(--sp-3) var(--sp-4); margin-bottom: var(--sp-3);">' +
            '<div style="font-size: var(--fs-xs); color: var(--fk-gray-500); text-transform: uppercase; letter-spacing: var(--ls-wide);">Manager</div>' +
            '<div style="font-weight: var(--fw-semibold);">' + escapeHtml(USER.full_name || USER.email) + '</div>' +
            '<span class="badge badge-green" style="margin-top: var(--sp-2);">Team Manager</span>' +
          '</div>' +
          '<div class="divider" style="margin: 0 var(--sp-4);"></div>' +
          '<nav class="sidebar-nav" id="sidebar-nav">' +
            '<a href="#overview" class="sidebar-link active" data-section="overview">Overview</a>' +
            '<a href="#team" class="sidebar-link" data-section="team">My Team</a>' +
            '<a href="#players" class="sidebar-link" data-section="players">Manage Players</a>' +
            '<a href="#leagues" class="sidebar-link" data-section="leagues">Leagues</a>' +
            '<a href="#tournaments" class="sidebar-link" data-section="tournaments">Tournaments</a>' +
            '<div class="divider" style="margin: var(--sp-3) 0;"></div>' +
            '<a href="/pages/sports/teams.html" class="sidebar-link">Browse teams</a>' +
          '</nav>' +
        '</aside>' +
        '<section class="dashboard-content" id="dashboard-content"></section>' +
      '</div>' +
    '</div>';
}

function wireSidebar() {
  document.querySelectorAll(".sidebar-link[data-section]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".sidebar-link").forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      switchSection(link.dataset.section);
    });
  });
}

async function switchSection(section) {
  const content = document.getElementById("dashboard-content");
  content.innerHTML = "";
  showLoading(content, "Loading...");

  try {
    switch (section) {
      case "overview":    return renderOverview(content);
      case "team":        return renderTeam(content);
      case "players":     return renderPlayers(content);
      case "leagues":     return renderLeagues(content);
      case "tournaments": return renderTournaments(content);
    }
  } catch (err) {
    showError(content, err.message);
  }
}

async function loadMyTeam() {
  if (MY_TEAM) return MY_TEAM;
  try {
    const res = await api.get("/teams?page_size=200");
    MY_TEAM = (res.items || []).find((t) => t.manager_id === USER.id) || null;
  } catch {
    MY_TEAM = null;
  }
  return MY_TEAM;
}

async function renderOverview(content) {
  const team = await loadMyTeam();

  content.innerHTML =
    '<div class="section-header"><h2 class="section-title">Welcome, ' + escapeHtml((USER.full_name || "Manager").split(" ")[0]) + '</h2>' +
    '<p class="section-subtitle">Manage your team, players, and competition registrations.</p></div>' +
    '<div class="grid grid-3">' +
      '<div class="stat-card"><div class="stat-card-label">My Team</div><div class="stat-card-value">' +
        (team ? escapeHtml(team.name) : "—") +
      '</div></div>' +
      '<div class="stat-card"><div class="stat-card-label">Team Status</div><div class="stat-card-value">' +
        (team ? (team.is_active ? "Active" : "Inactive") : "—") +
      '</div></div>' +
      '<div class="stat-card"><div class="stat-card-label">Roster Size</div><div class="stat-card-value">—</div></div>' +
    '</div>' +
    (team ? '' :
      '<div class="alert alert-info" style="margin-top: var(--sp-6);">' +
        'You have not registered a team yet. ' +
        '<a href="/pages/sports/teams.html">Register your first team</a> to get started.' +
      '</div>');
}

async function renderTeam(content) {
  const team = await loadMyTeam();

  if (!team) {
    showEmpty(content, { title: "No team yet", text: "Register a team to get started." });
    return;
  }

  content.innerHTML =
    '<div class="section-header"><h2 class="section-title">My team</h2></div>' +
    '<div class="grid grid-2">' +
      '<div class="card"><div class="card-body">' +
        '<h3 class="card-title">' + escapeHtml(team.name) + '</h3>' +
        '<p class="card-text">' + escapeHtml(team.description || "No description") + '</p>' +
        '<div class="divider"></div>' +
        '<div class="grid grid-2" style="gap: var(--sp-3); font-size: var(--fs-sm);">' +
          '<div><small>County</small><div>' + escapeHtml(team.county || "—") + '</div></div>' +
          '<div><small>City</small><div>' + escapeHtml(team.city || "—") + '</div></div>' +
          '<div><small>Founded</small><div>' + (team.founded_year || "—") + '</div></div>' +
          '<div><small>Status</small><div>' + (team.is_active ? "Active" : "Inactive") + '</div></div>' +
        '</div>' +
        '<div class="flex gap-3 mt-6">' +
          '<a href="/pages/sports/team-detail.html?id=' + encodeURIComponent(team.id) + '" class="btn btn-secondary">View public page</a>' +
        '</div>' +
      '</div></div>' +
      '<div class="card"><div class="card-body">' +
        '<h3 class="card-title">Quick actions</h3>' +
        '<div class="grid" style="gap: var(--sp-2); margin-top: var(--sp-4);">' +
          '<button class="btn btn-primary" onclick="alert(\\'Coming soon: Edit team\\')">Edit team details</button>' +
          '<button class="btn btn-secondary" onclick="alert(\\'Coming soon: Manage roster\\')">Manage roster</button>' +
        '</div>' +
      '</div></div>' +
    '</div>';
}

async function renderPlayers(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Manage players</h2></div>' +
                     '<div id="players-container"></div>';
  const container = document.getElementById("players-container");
  showLoading(container, "Loading players...");

  try {
    const res = await api.get("/players?page_size=50");
    const players = res.items || [];
    if (!players.length) {
      showEmpty(container, { title: "No players yet" });
      return;
    }
    container.innerHTML =
      '<p class="text-muted mb-4">All registered players. Use team management to add them to your roster.</p>' +
      '<div class="grid grid-4">' + players.map(playerCard).join("") + '</div>';
  } catch (err) {
    showError(container, err.message);
  }
}

async function renderLeagues(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Leagues</h2>' +
                     '<p class="section-subtitle">Register your team for a league season.</p></div>' +
                     '<div id="leagues-container"></div>';
  const container = document.getElementById("leagues-container");
  showLoading(container, "Loading leagues...");

  try {
    const res = await api.get("/leagues?page_size=50");
    const leagues = res.items || [];
    if (!leagues.length) {
      showEmpty(container, { title: "No leagues available yet" });
      return;
    }
    let html = '<div class="grid grid-3">';
    for (const l of leagues) {
      html += '<div class="card"><div class="card-body">' +
        '<h3 class="card-title">' + escapeHtml(l.name) + '</h3>' +
        '<p class="card-text">' + escapeHtml(l.category || "League") + '</p>' +
        '<button class="btn btn-primary btn-sm btn-full mt-4" onclick="alert(\\'Registration request sent\\')">Register my team</button>' +
      '</div></div>';
    }
    html += '</div>';
    container.innerHTML = html;
  } catch (err) {
    showError(container, err.message);
  }
}

async function renderTournaments(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Tournaments</h2>' +
                     '<p class="section-subtitle">Register your team for tournaments.</p></div>' +
                     '<div id="tournaments-container"></div>';
  const container = document.getElementById("tournaments-container");
  showLoading(container, "Loading tournaments...");

  try {
    const res = await api.get("/tournaments?page_size=50");
    const tournaments = res.items || [];
    if (!tournaments.length) {
      showEmpty(container, { title: "No tournaments available yet" });
      return;
    }
    let html = '<div class="grid grid-3">';
    for (const t of tournaments) {
      html += '<div class="card"><div class="card-body">' +
        '<h3 class="card-title">' + escapeHtml(t.name) + '</h3>' +
        '<p class="card-text">' + escapeHtml(t.format ? t.format.replace(/_/g, " ") : "Tournament") + '</p>' +
        '<a href="/pages/sports/tournament-detail.html?id=' + encodeURIComponent(t.id) + '" class="btn btn-primary btn-sm btn-full mt-4">View and register</a>' +
      '</div></div>';
    }
    html += '</div>';
    container.innerHTML = html;
  } catch (err) {
    showError(container, err.message);
  }
}