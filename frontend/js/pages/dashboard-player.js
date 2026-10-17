/**
 * Player dashboard
 * =================
 * Sections: Overview, My Team, Fixtures, Results, Statistics
 */

import { api } from "../api.js";
import { getSession, requireRole, clearSession } from "../auth.js";
import { CONFIG, dashboardFor } from "../config.js";
import { escapeHtml, showLoading, showError, showEmpty, formatDate, notify } from "../ui.js";
import { matchCard } from "../components/match-card.js";

let USER = null;
let PLAYER = null;

export async function initPlayerDashboard() {
  if (!requireRole(["player"], CONFIG.ROUTES.LOGIN)) return;

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
            '<div style="font-size: var(--fs-xs); color: var(--fk-gray-500); text-transform: uppercase; letter-spacing: var(--ls-wide);">Signed in as</div>' +
            '<div style="font-weight: var(--fw-semibold);">' + escapeHtml(USER.full_name || USER.email) + '</div>' +
            '<span class="badge badge-green" style="margin-top: var(--sp-2);">Player</span>' +
          '</div>' +
          '<div class="divider" style="margin: 0 var(--sp-4);"></div>' +
          '<nav class="sidebar-nav" id="sidebar-nav">' +
            '<a href="#overview" class="sidebar-link active" data-section="overview">Overview</a>' +
            '<a href="#team" class="sidebar-link" data-section="team">My Team</a>' +
            '<a href="#fixtures" class="sidebar-link" data-section="fixtures">Fixtures</a>' +
            '<a href="#results" class="sidebar-link" data-section="results">Results</a>' +
            '<a href="#stats" class="sidebar-link" data-section="stats">Statistics</a>' +
            '<div class="divider" style="margin: var(--sp-3) 0;"></div>' +
            '<a href="/pages/sports/players.html" class="sidebar-link">Browse players</a>' +
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
      const section = link.dataset.section;
      switchSection(section);
      document.querySelectorAll(".sidebar-link").forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

async function switchSection(section) {
  const content = document.getElementById("dashboard-content");
  content.innerHTML = "";
  showLoading(content, "Loading...");

  try {
    switch (section) {
      case "overview": return renderOverview(content);
      case "team":     return renderTeam(content);
      case "fixtures": return renderFixtures(content);
      case "results":  return renderResults(content);
      case "stats":    return renderStats(content);
    }
  } catch (err) {
    showError(content, err.message);
  }
}

async function loadMyPlayer() {
  if (PLAYER) return PLAYER;
  try {
    const res = await api.get("/players?page_size=200");
    PLAYER = (res.items || []).find((p) => p.user_id === USER.id) || null;
  } catch {
    PLAYER = null;
  }
  return PLAYER;
}

async function renderOverview(content) {
  const player = await loadMyPlayer();

  content.innerHTML =
    '<div class="section-header"><h2 class="section-title">Welcome back, ' + escapeHtml((USER.full_name || "Player").split(" ")[0]) + '</h2>' +
    '<p class="section-subtitle">Your floorball activity at a glance.</p></div>' +
    '<div class="grid grid-3">' +
      statCard("My profile", player ? "Active" : "Not created") +
      statCard("Team", "—") +
      statCard("Matches played", "—") +
    '</div>' +
    (player ? '' :
      '<div class="alert alert-info" style="margin-top: var(--sp-6);">' +
        'You haven\\'t created a player profile yet. ' +
        '<a href="#" onclick="alert(\\'Player profile creation coming soon\\')">Create one</a> ' +
        'to appear in team rosters and stats.' +
      '</div>');
}

function statCard(label, value) {
  return '<div class="stat-card"><div class="stat-card-label">' + escapeHtml(label) + '</div>' +
         '<div class="stat-card-value">' + escapeHtml(value) + '</div></div>';
}

async function renderTeam(content) {
  const player = await loadMyPlayer();
  if (!player) {
    showEmpty(content, { title: "No player profile", text: "Create your player profile to join a team." });
    return;
  }

  content.innerHTML =
    '<div class="section-header"><h2 class="section-title">My team</h2></div>' +
    '<div id="team-container"></div>';

  const container = document.getElementById("team-container");
  showLoading(container, "Loading team...");

  try {
    const res = await api.get("/teams?page_size=200");
    const teams = res.items || [];
    // We don't have a direct "player's team" endpoint; find via roster entries
    // For MVP, just show a placeholder
    showEmpty(container, { title: "Team membership", text: "Team assignment is managed by your team manager." });
  } catch (err) {
    showError(container, err.message);
  }
}

async function renderFixtures(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Upcoming fixtures</h2></div>' +
                     '<div id="fixtures-container"></div>';
  const container = document.getElementById("fixtures-container");
  showLoading(container, "Loading fixtures...");

  try {
    const res = await api.get("/matches?status=scheduled&page_size=20");
    const list = res.items || [];
    if (!list.length) {
      showEmpty(container, { title: "No fixtures scheduled" });
      return;
    }
    container.innerHTML = '<div class="grid">' + list.map(matchCard).join("") + '</div>';
  } catch (err) {
    showError(container, err.message);
  }
}

async function renderResults(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Recent results</h2></div>' +
                     '<div id="results-container"></div>';
  const container = document.getElementById("results-container");
  showLoading(container, "Loading results...");

  try {
    const res = await api.get("/matches?status=completed&page_size=20");
    const list = res.items || [];
    if (!list.length) {
      showEmpty(container, { title: "No results yet" });
      return;
    }
    container.innerHTML = '<div class="grid">' + list.map(matchCard).join("") + '</div>';
  } catch (err) {
    showError(container, err.message);
  }
}

async function renderStats(content) {
  const player = await loadMyPlayer();
  if (!player) {
    showEmpty(content, { title: "No player profile", text: "Statistics appear once you have a player profile." });
    return;
  }

  content.innerHTML = '<div class="section-header"><h2 class="section-title">My statistics</h2></div>' +
                     '<div id="stats-container"></div>';
  const container = document.getElementById("stats-container");
  showLoading(container, "Loading stats...");

  try {
    const stats = await api.get("/players/" + encodeURIComponent(player.id) + "/statistics");
    if (!stats || !stats.length) {
      showEmpty(container, { title: "No statistics yet" });
      return;
    }
    container.innerHTML = '<div class="grid grid-2">' + stats.map((s) =>
      '<div class="card"><div class="card-body">' +
        '<h4 class="card-title">Season</h4>' +
        '<div class="grid grid-2" style="gap: var(--sp-4); margin-top: var(--sp-4);">' +
          '<div><small>Matches</small><div style="font-size: var(--fs-xl); font-weight: 700;">' + s.matches_played + '</div></div>' +
          '<div><small>Goals</small><div style="font-size: var(--fs-xl); font-weight: 700; color: var(--fk-green);">' + s.goals + '</div></div>' +
          '<div><small>Assists</small><div>' + s.assists + '</div></div>' +
          '<div><small>Yellow cards</small><div>' + s.yellow_cards + '</div></div>' +
        '</div>' +
      '</div></div>'
    ).join("") + '</div>';
  } catch (err) {
    showError(container, err.message);
  }
}