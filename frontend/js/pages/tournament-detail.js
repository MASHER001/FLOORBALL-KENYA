/**
 * Tournament detail page
 * =======================
 * Tabs: Overview, Teams, Fixtures, Results
 */

import { api } from "../api.js";
import {
  escapeHtml, formatDate, formatDateTime, qs,
  showLoading, showError, showEmpty,
} from "../ui.js";
import { teamCard } from "../components/team-card.js";
import { matchCard } from "../components/match-card.js";
import { getSession, isLoggedIn } from "../auth.js";
import { notify } from "../ui.js";

let TOURNAMENT = null;

export async function initTournamentDetail() {
  const host = document.getElementById("tournament-detail");
  if (!host) return;

  const id = qs("id");
  if (!id) {
    showError(host, "No tournament specified.");
    return;
  }

  showLoading(host, "Loading tournament…");

  try {
    TOURNAMENT = await api.get(`/tournaments/${encodeURIComponent(id)}`);
    document.title = `${TOURNAMENT.name} — FloorballKenya`;
    renderShell();
    switchTab("overview");
  } catch (err) {
    showError(host, "Unable to load tournament. " + err.message);
  }
}

function renderShell() {
  const host = document.getElementById("tournament-detail");
  const initial = (TOURNAMENT.name || "?").charAt(0).toUpperCase();
  const dates = [TOURNAMENT.start_date, TOURNAMENT.end_date].filter(Boolean).map(formatDate).join(" – ");

  host.innerHTML = `
    <div class="page-header">
      <div class="container">
        <div class="breadcrumbs">
          <a href="/index.html">Home</a> <span>/</span>
          <a href="/pages/sports/tournaments.html">Tournaments</a> <span>/</span>
          <span>${escapeHtml(TOURNAMENT.name)}</span>
        </div>
        <div class="flex gap-6 flex-wrap" style="align-items:center;">
          <div class="entity-logo" style="margin:0; background: linear-gradient(135deg, var(--fk-gold), var(--fk-gold-dark)); color: var(--fk-black);">${escapeHtml(initial)}</div>
          <div>
            <h1 style="margin-bottom: var(--sp-2);">${escapeHtml(TOURNAMENT.name)}</h1>
            <p class="text-muted">
              ${escapeHtml(TOURNAMENT.format ? TOURNAMENT.format.replace(/_/g, " ") : "Tournament")}
              ${dates ? " · " + escapeHtml(dates) : ""}
              ${TOURNAMENT.venue ? " · " + escapeHtml(TOURNAMENT.venue) : ""}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="tabs" id="tournament-tabs">
        <button class="tab" data-tab="overview">Overview</button>
        <button class="tab" data-tab="teams">Teams</button>
        <button class="tab" data-tab="fixtures">Fixtures</button>
        <button class="tab" data-tab="results">Results</button>
      </div>
      <div id="tournament-content"></div>
    </div>
  `;

  document.querySelectorAll("#tournament-tabs .tab").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
}

async function switchTab(tab) {
  document.querySelectorAll("#tournament-tabs .tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  const content = document.getElementById("tournament-content");
  content.innerHTML = "";
  showLoading(content, "Loading…");

  try {
    switch (tab) {
      case "overview": return renderOverview(content);
      case "teams":    return renderTeams(content);
      case "fixtures": return renderFixtures(content);
      case "results":  return renderResults(content);
    }
  } catch (err) {
    showError(content, err.message);
  }
}

function renderOverview(content) {
  const canRegister = TOURNAMENT.is_active;
  content.innerHTML = `
    <div class="grid grid-2" style="gap: var(--sp-6); align-items:start;">
      <div class="card">
        <div class="card-body">
          <h3 class="card-title">About this tournament</h3>
          <p>${escapeHtml(TOURNAMENT.description || "No description provided.")}</p>
          <div class="divider"></div>
          <div class="grid grid-2" style="gap: var(--sp-4);">
            <div><small>Format</small><div>${escapeHtml(TOURNAMENT.format ? TOURNAMENT.format.replace(/_/g, " ") : "—")}</div></div>
            <div><small>Max Teams</small><div>${TOURNAMENT.max_teams || "—"}</div></div>
            <div><small>Entry Fee</small><div>${TOURNAMENT.entry_fee ? "KSh " + TOURNAMENT.entry_fee : "Free"}</div></div>
            <div><small>Venue</small><div>${escapeHtml(TOURNAMENT.venue || "—")}</div></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h3 class="card-title">Registration</h3>
          <p class="card-text">Team managers can register their team for this tournament.</p>
          <div style="margin-top: var(--sp-4);">
            ${canRegister
              ? `<button class="btn btn-primary btn-full" id="register-team-btn">Register a team</button>`
              : `<div class="alert alert-warning">Registration is closed.</div>`}
          </div>
        </div>
      </div>
    </div>
  `;

  const btn = document.getElementById("register-team-btn");
  if (btn) btn.addEventListener("click", onRegisterClick);
}

async function onRegisterClick() {
  if (!isLoggedIn()) {
    notify.info("Please sign in to register a team.");
    setTimeout(() => window.location.href = "/pages/auth/login.html", 600);
    return;
  }
  const { user } = getSession();
  if (user.role !== "team_manager" && user.role !== "admin" && user.role !== "super_admin") {
    notify.warning("Only team managers can register teams.");
    return;
  }

  // Fetch my teams
  try {
    const res = await api.get(`/teams?page_size=100`);
    const myTeams = (res.items || []).filter((t) => t.manager_id === user.id);

    if (!myTeams.length) {
      notify.warning("You don't manage any teams yet.");
      return;
    }

    const teamId = prompt(`Choose a team to register:\n${myTeams.map((t, i) => `${i + 1}. ${t.name}`).join("\n")}\n\nEnter number:`);
    const idx = parseInt(teamId) - 1;
    if (isNaN(idx) || !myTeams[idx]) return;

    await api.post(`/tournaments/${encodeURIComponent(TOURNAMENT.id)}/register`, {
      team_id: myTeams[idx].id,
    });
    notify.success("Registration submitted! Awaiting approval.");
    switchTab("teams");
  } catch (err) {
    notify.error("Registration failed: " + err.message);
  }
}

async function renderTeams(content) {
  content.innerHTML = "";
  showLoading(content, "Loading teams…");

  try {
    const registrations = await api.get(`/tournaments/${encodeURIComponent(TOURNAMENT.id)}/teams`);
    const approved = (registrations || []).filter((r) => r.status === "approved");

    if (!approved.length) {
      showEmpty(content, { title: "No teams registered", text: "Approved teams will appear here." });
      return;
    }

    const teamIds = approved.map((r) => r.team_id);
    const teamsRes = await api.get(`/teams?page_size=100`);
    const teamMap = {};
    (teamsRes.items || []).forEach((t) => { teamMap[t.id] = t; });
    const teams = teamIds.map((id) => teamMap[id]).filter(Boolean);

    content.innerHTML = `<div class="grid grid-4">${teams.map(teamCard).join("")}</div>`;
  } catch (err) {
    showError(content, "Unable to load teams. " + err.message);
  }
}

async function renderFixtures(content) {
  content.innerHTML = "";
  showLoading(content, "Loading fixtures…");

  try {
    const matches = await api.get(`/matches?tournament_id=${encodeURIComponent(TOURNAMENT.id)}&status=scheduled&page_size=50`);
    const list = matches.items || [];
    if (!list.length) {
      showEmpty(content, { title: "No fixtures scheduled" });
      return;
    }
    content.innerHTML = `<div class="grid">${list.map(matchCard).join("")}</div>`;
  } catch (err) {
    showError(content, "Unable to load fixtures. " + err.message);
  }
}

async function renderResults(content) {
  content.innerHTML = "";
  showLoading(content, "Loading results…");

  try {
    const matches = await api.get(`/matches?tournament_id=${encodeURIComponent(TOURNAMENT.id)}&status=completed&page_size=50`);
    const list = matches.items || [];
    if (!list.length) {
      showEmpty(content, { title: "No results yet" });
      return;
    }
    content.innerHTML = `<div class="grid">${list.map(matchCard).join("")}</div>`;
  } catch (err) {
    showError(content, "Unable to load results. " + err.message);
  }
}
