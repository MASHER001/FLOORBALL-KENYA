/**
 * League detail page
 * ===================
 * Tabs: Overview, Standings, Fixtures, Results, Statistics
 */

import { api } from "../api.js";
import {
  escapeHtml, formatDateTime, qs,
  showLoading, showError, showEmpty,
} from "../ui.js";
import { matchCard } from "../components/match-card.js";
import { teamCard } from "../components/team-card.js";

let LEAGUE = null;
let CURRENT_TAB = "standings";

export async function initLeagueDetail() {
  const host = document.getElementById("league-detail");
  if (!host) return;

  const id = qs("id");
  if (!id) {
    showError(host, "No league specified.");
    return;
  }

  showLoading(host, "Loading league…");

  try {
    LEAGUE = await api.get(`/leagues/${encodeURIComponent(id)}`);
    document.title = `${LEAGUE.name} — FloorballKenya`;

    renderShell();
    switchTab("standings");
  } catch (err) {
    showError(host, "Unable to load league. " + err.message);
  }
}

function renderShell() {
  const host = document.getElementById("league-detail");
  const initial = (LEAGUE.name || "?").charAt(0).toUpperCase();

  host.innerHTML = `
    <div class="league-hero">
      <div class="container">
        <div class="league-hero-logo">${escapeHtml(initial)}</div>
        <h1 style="color: var(--fk-white); margin-bottom: var(--sp-2);">${escapeHtml(LEAGUE.name)}</h1>
        <p style="color: var(--fk-gray-300);">${escapeHtml(LEAGUE.category || "League")}${LEAGUE.description ? " · " + escapeHtml(LEAGUE.description) : ""}</p>
      </div>
    </div>

    <div class="container">
      <div class="tabs" id="league-tabs">
        <button class="tab" data-tab="overview">Overview</button>
        <button class="tab" data-tab="standings">Standings</button>
        <button class="tab" data-tab="fixtures">Fixtures</button>
        <button class="tab" data-tab="results">Results</button>
        <button class="tab" data-tab="teams">Teams</button>
      </div>

      <div id="league-content"></div>
    </div>
  `;

  document.querySelectorAll("#league-tabs .tab").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
}

async function switchTab(tab) {
  CURRENT_TAB = tab;
  document.querySelectorAll("#league-tabs .tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  const content = document.getElementById("league-content");
  content.innerHTML = "";
  showLoading(content, "Loading…");

  try {
    switch (tab) {
      case "overview":   return renderOverview(content);
      case "standings":  return renderStandings(content);
      case "fixtures":   return renderFixtures(content);
      case "results":    return renderResults(content);
      case "teams":      return renderTeams(content);
    }
  } catch (err) {
    showError(content, err.message);
  }
}

function renderOverview(content) {
  content.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">About this league</h3>
        <p>${escapeHtml(LEAGUE.description || "No description provided.")}</p>
        <div class="divider"></div>
        <div class="flex gap-6 flex-wrap">
          <div><strong>Category:</strong> ${escapeHtml(LEAGUE.category || "—")}</div>
          <div><strong>Status:</strong> ${LEAGUE.is_active ? "Active" : "Inactive"}</div>
        </div>
      </div>
    </div>
  `;
}

async function renderStandings(content) {
  content.innerHTML = "";
  showLoading(content, "Loading standings…");

  try {
    const data = await api.get(`/leagues/${encodeURIComponent(LEAGUE.id)}/standings`);
    const table = data.table || [];

    if (!table.length) {
      showEmpty(content, { title: "No standings yet", text: "Standings appear once matches are played." });
      return;
    }

    content.innerHTML = `
      <div class="table-wrapper">
        <table class="table table-standings">
          <thead>
            <tr>
              <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th>
              <th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
            </tr>
          </thead>
          <tbody>
            ${table.map((r) => `
              <tr>
                <td><span class="pos">${r.position}</span></td>
                <td><a href="/pages/sports/team-detail.html?id=${encodeURIComponent(r.team_id)}">${escapeHtml(r.team_name)}</a></td>
                <td>${r.played}</td>
                <td>${r.won}</td>
                <td>${r.drawn}</td>
                <td>${r.lost}</td>
                <td>${r.goals_for}</td>
                <td>${r.goals_against}</td>
                <td>${r.goal_difference >= 0 ? "+" : ""}${r.goal_difference}</td>
                <td><strong>${r.points}</strong></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    showError(content, "Unable to load standings. " + err.message);
  }
}

async function renderFixtures(content) {
  content.innerHTML = "";
  showLoading(content, "Loading fixtures…");

  try {
    const matches = await api.get(`/leagues/${encodeURIComponent(LEAGUE.id)}/fixtures`);
    if (!matches.length) {
      showEmpty(content, { title: "No fixtures scheduled", text: "Fixtures will appear here once scheduled." });
      return;
    }
    content.innerHTML = `<div class="grid">${matches.map(matchCard).join("")}</div>`;
  } catch (err) {
    showError(content, "Unable to load fixtures. " + err.message);
  }
}

async function renderResults(content) {
  content.innerHTML = "";
  showLoading(content, "Loading results…");

  try {
    const matches = await api.get(`/leagues/${encodeURIComponent(LEAGUE.id)}/results`);
    if (!matches.length) {
      showEmpty(content, { title: "No results yet", text: "Results appear once matches are completed." });
      return;
    }
    content.innerHTML = `<div class="grid">${matches.map(matchCard).join("")}</div>`;
  } catch (err) {
    showError(content, "Unable to load results. " + err.message);
  }
}

async function renderTeams(content) {
  content.innerHTML = "";
  showLoading(content, "Loading teams…");

  try {
    const data = await api.get(`/leagues/${encodeURIComponent(LEAGUE.id)}/teams`);
    const rows = (data || []).map((r) => r.teams).filter(Boolean);
    if (!rows.length) {
      showEmpty(content, { title: "No teams registered", text: "Teams will appear here once registered." });
      return;
    }
    content.innerHTML = `<div class="grid grid-4">${rows.map(teamCard).join("")}</div>`;
  } catch (err) {
    showError(content, "Unable to load teams. " + err.message);
  }
}
