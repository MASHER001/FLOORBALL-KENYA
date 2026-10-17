/**
 * Team detail page
 * =================
 * Tabs: Overview, Roster, Fixtures, Results, Statistics
 */

import { api } from "../api.js";
import {
  escapeHtml, formatDate, qs,
  showLoading, showError, showEmpty,
} from "../ui.js";
import { matchCard } from "../components/match-card.js";
import { initials } from "../utils.js";

let TEAM = null;

export async function initTeamDetail() {
  const host = document.getElementById("team-detail");
  if (!host) return;

  const id = qs("id");
  if (!id) {
    showError(host, "No team specified.");
    return;
  }

  showLoading(host, "Loading team…");

  try {
    TEAM = await api.get(`/teams/${encodeURIComponent(id)}`);
    document.title = `${TEAM.name} — FloorballKenya`;
    renderShell();
    switchTab("roster");
  } catch (err) {
    showError(host, "Unable to load team. " + err.message);
  }
}

function renderShell() {
  const host = document.getElementById("team-detail");
  const initial = (TEAM.name || "?").charAt(0).toUpperCase();

  host.innerHTML = `
    <div class="page-header">
      <div class="container">
        <div class="breadcrumbs">
          <a href="/index.html">Home</a> <span>/</span>
          <a href="/pages/sports/teams.html">Teams</a> <span>/</span>
          <span>${escapeHtml(TEAM.name)}</span>
        </div>
        <div class="flex gap-6 flex-wrap" style="align-items:center;">
          <div class="entity-logo" style="margin:0;">${escapeHtml(initial)}</div>
          <div>
            <h1 style="margin-bottom: var(--sp-2);">${escapeHtml(TEAM.name)}</h1>
            <p class="text-muted">
              ${escapeHtml(TEAM.county || "Kenya")}
              ${TEAM.founded_year ? " · Founded " + TEAM.founded_year : ""}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="tabs" id="team-tabs">
        <button class="tab" data-tab="overview">Overview</button>
        <button class="tab" data-tab="roster">Roster</button>
        <button class="tab" data-tab="fixtures">Fixtures</button>
        <button class="tab" data-tab="results">Results</button>
        <button class="tab" data-tab="stats">Statistics</button>
      </div>

      <div id="team-content"></div>
    </div>
  `;

  document.querySelectorAll("#team-tabs .tab").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
}

async function switchTab(tab) {
  document.querySelectorAll("#team-tabs .tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  const content = document.getElementById("team-content");
  content.innerHTML = "";
  showLoading(content, "Loading…");

  try {
    switch (tab) {
      case "overview":  return renderOverview(content);
      case "roster":    return renderRoster(content);
      case "fixtures":  return renderFixtures(content);
      case "results":   return renderResults(content);
      case "stats":     return renderStats(content);
    }
  } catch (err) {
    showError(content, err.message);
  }
}

function renderOverview(content) {
  content.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">About ${escapeHtml(TEAM.name)}</h3>
        <p>${escapeHtml(TEAM.description || "No description provided.")}</p>
        <div class="divider"></div>
        <div class="grid grid-2">
          <div><strong>County:</strong> ${escapeHtml(TEAM.county || "—")}</div>
          <div><strong>City:</strong> ${escapeHtml(TEAM.city || "—")}</div>
          <div><strong>Founded:</strong> ${escapeHtml(String(TEAM.founded_year || "—"))}</div>
          <div><strong>Status:</strong> ${TEAM.is_active ? "Active" : "Inactive"}</div>
        </div>
      </div>
    </div>
  `;
}

async function renderRoster(content) {
  content.innerHTML = "";
  showLoading(content, "Loading roster…");

  try {
    const roster = await api.get(`/teams/${encodeURIComponent(TEAM.id)}/players`);
    if (!roster.length) {
      showEmpty(content, { title: "No players yet", text: "The roster will appear here once players join." });
      return;
    }

    // Fetch player details for each roster entry
    const playerIds = roster.map((r) => r.player_id);
    const playersRes = await api.get(`/players?page_size=100`);
    const playerMap = {};
    (playersRes.items || []).forEach((p) => { playerMap[p.id] = p; });

    content.innerHTML = `
      <div class="grid grid-4">
        ${roster.map((r) => {
          const p = playerMap[r.player_id];
          if (!p) return "";
          const init = initials(p.full_name);
          return `
            <a href="/pages/sports/player-detail.html?id=${encodeURIComponent(p.id)}"
               class="entity-card" style="display:flex;">
              <div class="entity-logo">${escapeHtml(init)}</div>
              <div class="entity-name">${escapeHtml(p.full_name)}</div>
              <div class="entity-meta">
                ${escapeHtml(p.position || "Player")}
                ${p.jersey_number ? " · #" + p.jersey_number : ""}
              </div>
            </a>
          `;
        }).join("")}
      </div>
    `;
  } catch (err) {
    showError(content, "Unable to load roster. " + err.message);
  }
}

async function renderFixtures(content) {
  content.innerHTML = "";
  showLoading(content, "Loading fixtures…");

  try {
    const matches = await api.get(`/teams/${encodeURIComponent(TEAM.id)}/matches`);
    const upcoming = (matches || []).filter((m) => m.status === "scheduled");
    if (!upcoming.length) {
      showEmpty(content, { title: "No fixtures scheduled" });
      return;
    }
    content.innerHTML = `<div class="grid">${upcoming.map(matchCard).join("")}</div>`;
  } catch (err) {
    showError(content, "Unable to load fixtures. " + err.message);
  }
}

async function renderResults(content) {
  content.innerHTML = "";
  showLoading(content, "Loading results…");

  try {
    const matches = await api.get(`/teams/${encodeURIComponent(TEAM.id)}/matches`);
    const completed = (matches || []).filter((m) => m.status === "completed");
    if (!completed.length) {
      showEmpty(content, { title: "No results yet" });
      return;
    }
    content.innerHTML = `<div class="grid">${completed.map(matchCard).join("")}</div>`;
  } catch (err) {
    showError(content, "Unable to load results. " + err.message);
  }
}

async function renderStats(content) {
  content.innerHTML = "";
  showLoading(content, "Loading statistics…");

  try {
    const stats = await api.get(`/teams/${encodeURIComponent(TEAM.id)}/statistics`);
    if (!stats.length) {
      showEmpty(content, { title: "No statistics yet", text: "Stats appear once matches are played." });
      return;
    }
    content.innerHTML = `
      <div class="grid grid-2">
        ${stats.map((s) => `
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Season ${escapeHtml(s.season_id?.slice(0, 8) || "—")}</h4>
              <div class="grid grid-2" style="gap: var(--sp-4);">
                <div><small>Played</small><div style="font-size: var(--fs-xl); font-weight: 700;">${s.played}</div></div>
                <div><small>Points</small><div style="font-size: var(--fs-xl); font-weight: 700; color: var(--fk-green);">${s.points}</div></div>
                <div><small>Won</small><div>${s.won}</div></div>
                <div><small>Drawn</small><div>${s.drawn}</div></div>
                <div><small>Lost</small><div>${s.lost}</div></div>
                <div><small>Goal Diff</small><div>${s.goal_difference >= 0 ? "+" : ""}${s.goal_difference}</div></div>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } catch (err) {
    showError(content, "Unable to load statistics. " + err.message);
  }
}
