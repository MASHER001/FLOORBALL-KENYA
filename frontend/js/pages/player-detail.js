/**
 * Player detail page
 * ===================
 * Tabs: Overview, Statistics, Matches, Team
 */

import { api } from "../api.js";
import {
  escapeHtml, formatDate, qs,
  showLoading, showError, showEmpty,
} from "../ui.js";
import { initials } from "../utils.js";
import { matchCard } from "../components/match-card.js";

let PLAYER = null;

export async function initPlayerDetail() {
  const host = document.getElementById("player-detail");
  if (!host) return;

  const id = qs("id");
  if (!id) {
    showError(host, "No player specified.");
    return;
  }

  showLoading(host, "Loading player…");

  try {
    PLAYER = await api.get(`/players/${encodeURIComponent(id)}`);
    document.title = `${PLAYER.full_name} — FloorballKenya`;
    renderShell();
    switchTab("overview");
  } catch (err) {
    showError(host, "Unable to load player. " + err.message);
  }
}

function renderShell() {
  const host = document.getElementById("player-detail");
  const init = initials(PLAYER.full_name);

  host.innerHTML = `
    <div class="page-header">
      <div class="container">
        <div class="breadcrumbs">
          <a href="/index.html">Home</a> <span>/</span>
          <a href="/pages/sports/players.html">Players</a> <span>/</span>
          <span>${escapeHtml(PLAYER.full_name)}</span>
        </div>
        <div class="flex gap-6 flex-wrap" style="align-items:center;">
          <div class="entity-logo" style="margin:0;">${escapeHtml(init)}</div>
          <div>
            <h1 style="margin-bottom: var(--sp-2);">${escapeHtml(PLAYER.full_name)}</h1>
            <p class="text-muted">
              ${escapeHtml(PLAYER.position || "Player")}
              ${PLAYER.jersey_number ? " · #" + PLAYER.jersey_number : ""}
              ${PLAYER.gender ? " · " + escapeHtml(PLAYER.gender) : ""}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="tabs" id="player-tabs">
        <button class="tab" data-tab="overview">Overview</button>
        <button class="tab" data-tab="stats">Statistics</button>
        <button class="tab" data-tab="matches">Matches</button>
      </div>
      <div id="player-content"></div>
    </div>
  `;

  document.querySelectorAll("#player-tabs .tab").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
}

async function switchTab(tab) {
  document.querySelectorAll("#player-tabs .tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  const content = document.getElementById("player-content");
  content.innerHTML = "";
  showLoading(content, "Loading…");

  try {
    switch (tab) {
      case "overview": return renderOverview(content);
      case "stats":    return renderStats(content);
      case "matches":  return renderMatches(content);
    }
  } catch (err) {
    showError(content, err.message);
  }
}

function renderOverview(content) {
  content.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">Profile</h3>
        <div class="grid grid-2" style="gap: var(--sp-4); margin-top: var(--sp-4);">
          <div><small>Full Name</small><div>${escapeHtml(PLAYER.full_name)}</div></div>
          <div><small>Position</small><div>${escapeHtml(PLAYER.position || "—")}</div></div>
          <div><small>Jersey Number</small><div>${PLAYER.jersey_number ? "#" + PLAYER.jersey_number : "—"}</div></div>
          <div><small>Date of Birth</small><div>${PLAYER.date_of_birth ? formatDate(PLAYER.date_of_birth) : "—"}</div></div>
          <div><small>Gender</small><div>${escapeHtml(PLAYER.gender || "—")}</div></div>
          <div><small>Height</small><div>${PLAYER.height_cm ? PLAYER.height_cm + " cm" : "—"}</div></div>
          <div><small>Weight</small><div>${PLAYER.weight_kg ? PLAYER.weight_kg + " kg" : "—"}</div></div>
          <div><small>Status</small><div>${PLAYER.is_active ? "Active" : "Inactive"}</div></div>
        </div>
      </div>
    </div>
  `;
}

async function renderStats(content) {
  content.innerHTML = "";
  showLoading(content, "Loading statistics…");

  try {
    const stats = await api.get(`/players/${encodeURIComponent(PLAYER.id)}/statistics`);
    if (!stats || !stats.length) {
      showEmpty(content, { title: "No statistics yet", text: "Stats appear once the player features in matches." });
      return;
    }

    content.innerHTML = `
      <div class="grid grid-2">
        ${stats.map((s) => `
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Season ${escapeHtml((s.season_id || "").slice(0, 8) || "—")}</h4>
              <div class="grid grid-2" style="gap: var(--sp-4); margin-top: var(--sp-4);">
                <div><small>Matches</small><div style="font-size: var(--fs-xl); font-weight: 700;">${s.matches_played}</div></div>
                <div><small>Goals</small><div style="font-size: var(--fs-xl); font-weight: 700; color: var(--fk-green);">${s.goals}</div></div>
                <div><small>Assists</small><div>${s.assists}</div></div>
                <div><small>Yellow Cards</small><div>${s.yellow_cards}</div></div>
                <div><small>Red Cards</small><div>${s.red_cards}</div></div>
                <div><small>Minutes</small><div>${s.minutes_played}</div></div>
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

async function renderMatches(content) {
  content.innerHTML = "";
  showLoading(content, "Loading matches…");

  try {
    const matches = await api.get(`/players/${encodeURIComponent(PLAYER.id)}/matches`);
    if (!matches || !matches.length) {
      showEmpty(content, { title: "No matches yet" });
      return;
    }
    content.innerHTML = `<div class="grid">${matches.map(matchCard).join("")}</div>`;
  } catch (err) {
    showError(content, "Unable to load matches. " + err.message);
  }
}
