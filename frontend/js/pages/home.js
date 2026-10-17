/**
 * Home page logic
 * ===============
 * Loads live data from the backend:
 *   · Stats (from /admin/dashboard — falls back gracefully)
 *   · Featured leagues
 *   · Upcoming matches
 *   · Featured teams
 *   · Latest news
 */

import { api } from "../api.js";
import {
  escapeHtml,
  formatKES,
  formatDateTime,
  showLoading,
  showError,
  showEmpty,
} from "../ui.js";

/* ---------------- Hero stats ---------------- */

async function loadStats() {
  const el = document.getElementById("hero-stats");
  if (!el) return;
  try {
    // Public users can't read /admin/dashboard. Use a small batch of public endpoints.
    const [teams, leagues, tournaments, players] = await Promise.all([
      api.get("/teams?page_size=1").catch(() => ({ total: 0 })),
      api.get("/leagues?page_size=1").catch(() => ({ total: 0 })),
      api.get("/tournaments?page_size=1").catch(() => ({ total: 0 })),
      api.get("/players?page_size=1").catch(() => ({ total: 0 })),
    ]);

    el.innerHTML = `
      ${statItem(leagues.total ?? 0, "Leagues")}
      ${statItem(teams.total ?? 0, "Teams")}
      ${statItem(players.total ?? 0, "Players")}
      ${statItem(tournaments.total ?? 0, "Tournaments")}
    `;
  } catch {
    el.innerHTML = `
      ${statItem("—", "Leagues")}
      ${statItem("—", "Teams")}
      ${statItem("—", "Players")}
      ${statItem("—", "Tournaments")}
    `;
  }
}

function statItem(value, label) {
  return `
    <div class="stat-item">
      <div class="stat-value">${escapeHtml(String(value))}</div>
      <div class="stat-label">${escapeHtml(label)}</div>
    </div>
  `;
}

/* ---------------- Leagues ---------------- */

async function loadLeagues() {
  const el = document.getElementById("home-leagues");
  if (!el) return;
  showLoading(el, "Loading leagues…");

  try {
    const res = await api.get("/leagues?page_size=3");
    const leagues = res.items || [];
    if (!leagues.length) {
      showEmpty(el, { title: "No leagues yet", text: "Check back soon." });
      return;
    }
    el.innerHTML = `<div class="grid grid-3">${leagues.map(leagueCard).join("")}</div>`;
  } catch (err) {
    showError(el, "Unable to load leagues. " + err.message);
  }
}

function leagueCard(l) {
  const initial = (l.name || "?").charAt(0).toUpperCase();
  return `
    <a href="/pages/sports/league-detail.html?id=${encodeURIComponent(l.id)}" class="card card-hover" style="display:block;">
      <div class="card-image" style="display:flex; align-items:center; justify-content:center;
           background: linear-gradient(135deg, var(--fk-green), var(--fk-green-dark));
           color: var(--fk-white); font-family: var(--fk-font-display);
           font-size: var(--fs-5xl); font-weight: 800;">
        ${escapeHtml(initial)}
      </div>
      <div class="card-body">
        <div class="card-title">${escapeHtml(l.name)}</div>
        <p class="card-text">${escapeHtml(l.category || "League")}</p>
      </div>
    </a>
  `;
}

/* ---------------- Matches ---------------- */

async function loadMatches() {
  const el = document.getElementById("home-matches");
  if (!el) return;
  showLoading(el, "Loading fixtures…");

  try {
    const res = await api.get("/matches?status=scheduled&page_size=4");
    const matches = res.items || [];
    if (!matches.length) {
      showEmpty(el, { title: "No upcoming matches", text: "Fixtures will appear here." });
      return;
    }
    el.innerHTML = `<div class="grid">${matches.map(matchCard).join("")}</div>`;
  } catch (err) {
    showError(el, "Unable to load matches. " + err.message);
  }
}

function matchCard(m) {
  const homeName = m.home_team?.name || "Home";
  const awayName = m.away_team?.name || "Away";
  return `
    <a href="/pages/sports/match-detail.html?id=${encodeURIComponent(m.id)}"
       class="match-card" style="display:grid;">
      <div class="match-team">
        <div class="match-team-logo"></div>
        <div class="match-team-name">${escapeHtml(homeName)}</div>
      </div>
      <div class="match-score">VS</div>
      <div class="match-team away">
        <div class="match-team-logo"></div>
        <div class="match-team-name">${escapeHtml(awayName)}</div>
      </div>
      <div class="match-meta">${formatDateTime(m.match_date)}${m.venue ? " · " + escapeHtml(m.venue) : ""}</div>
    </a>
  `;
}

/* ---------------- Teams ---------------- */

async function loadTeams() {
  const el = document.getElementById("home-teams");
  if (!el) return;
  showLoading(el, "Loading teams…");

  try {
    const res = await api.get("/teams?page_size=4");
    const teams = res.items || [];
    if (!teams.length) {
      showEmpty(el, { title: "No teams yet" });
      return;
    }
    el.innerHTML = `<div class="grid grid-4">${teams.map(teamCard).join("")}</div>`;
  } catch (err) {
    showError(el, "Unable to load teams. " + err.message);
  }
}

function teamCard(t) {
  const initial = (t.name || "?").charAt(0).toUpperCase();
  return `
    <a href="/pages/sports/team-detail.html?id=${encodeURIComponent(t.id)}" class="entity-card" style="display:flex;">
      <div class="entity-logo">${escapeHtml(initial)}</div>
      <div class="entity-name">${escapeHtml(t.name)}</div>
      <div class="entity-meta">${escapeHtml(t.county || "Kenya")}</div>
    </a>
  `;
}

/* ---------------- News ---------------- */

async function loadNews() {
  const el = document.getElementById("home-news");
  if (!el) return;
  showLoading(el, "Loading news…");

  try {
    const news = await api.get("/news?page_size=3");
    if (!news || !news.length) {
      showEmpty(el, { title: "No news yet" });
      return;
    }
    el.innerHTML = `<div class="grid grid-3">${news.map(newsCard).join("")}</div>`;
  } catch (err) {
    showError(el, "Unable to load news. " + err.message);
  }
}

function newsCard(n) {
  return `
    <a href="/pages/public/news-detail.html?id=${encodeURIComponent(n.id)}" class="card card-hover" style="display:block;">
      ${n.cover_image
        ? `<img class="card-image" src="${escapeHtml(n.cover_image)}" alt="" loading="lazy" />`
        : `<div class="card-image" style="background: linear-gradient(135deg, var(--fk-gray-100), var(--fk-gray-200));"></div>`}
      <div class="card-body">
        <div class="card-title">${escapeHtml(n.title)}</div>
        <p class="card-text">${escapeHtml(n.excerpt || "")}</p>
      </div>
    </a>
  `;
}

/* ---------------- Init ---------------- */

export async function initHome() {
  // Kick off all fetches in parallel
  await Promise.allSettled([
    loadStats(),
    loadLeagues(),
    loadMatches(),
    loadTeams(),
    loadNews(),
  ]);
}