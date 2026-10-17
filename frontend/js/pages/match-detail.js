/**
 * Match detail page
 * ==================
 * Shows score, teams, events timeline, venue, and status.
 */

import { api } from "../api.js";
import {
  escapeHtml, formatDateTime, qs,
  showLoading, showError,
} from "../ui.js";

let MATCH = null;
let EVENTS = [];

export async function initMatchDetail() {
  const host = document.getElementById("match-detail");
  if (!host) return;

  const id = qs("id");
  if (!id) {
    showError(host, "No match specified.");
    return;
  }

  showLoading(host, "Loading match…");

  try {
    // Fetch match and events in parallel
    const [match, events] = await Promise.all([
      api.get(`/matches/${encodeURIComponent(id)}`),
      api.get(`/matches/${encodeURIComponent(id)}/events`).catch(() => []),
    ]);
    MATCH = match;
    EVENTS = events || [];
    document.title = `Match — FloorballKenya`;
    render();
  } catch (err) {
    showError(host, "Unable to load match. " + err.message);
  }
}

function render() {
  const host = document.getElementById("match-detail");

  const homeName = (MATCH.home_team && MATCH.home_team.name) || "Home";
  const awayName = (MATCH.away_team && MATCH.away_team.name) || "Away";
  const homeInitial = homeName.charAt(0).toUpperCase();
  const awayInitial = awayName.charAt(0).toUpperCase();

  const isCompleted = MATCH.status === "completed";
  const isLive = MATCH.status === "live";
  const hasScore = isCompleted || isLive;

  const statusLabel = {
    scheduled: "Scheduled",
    live: "Live",
    completed: "Full time",
    postponed: "Postponed",
    cancelled: "Cancelled",
  }[MATCH.status] || MATCH.status;

  const statusClass = {
    scheduled: "badge-gray",
    live: "badge-red badge-live",
    completed: "badge-green",
    postponed: "badge-gold",
    cancelled: "badge-red",
  }[MATCH.status] || "badge-gray";

  host.innerHTML = `
    <div class="container" style="padding-top: var(--sp-8);">
      <div class="breadcrumbs">
        <a href="/index.html">Home</a> <span>/</span>
        <a href="/pages/sports/matches.html">Matches</a> <span>/</span>
        <span>${escapeHtml(homeName)} vs ${escapeHtml(awayName)}</span>
      </div>

      <div class="card" style="margin-top: var(--sp-6);">
        <div class="card-body">
          <div style="text-align: center; margin-bottom: var(--sp-6);">
            <span class="badge ${statusClass}">${escapeHtml(statusLabel)}</span>
          </div>

          <div class="flex gap-6" style="align-items:center; justify-content:center; flex-wrap:wrap;">
            <a href="/pages/sports/team-detail.html?id=${encodeURIComponent(MATCH.home_team_id)}"
               style="text-align:center; text-decoration:none; color:inherit; min-width:120px;">
              <div class="entity-logo" style="margin: 0 auto var(--sp-3);">${escapeHtml(homeInitial)}</div>
              <div style="font-weight: var(--fw-semibold);">${escapeHtml(homeName)}</div>
            </a>

            <div style="text-align:center; padding: 0 var(--sp-4);">
              ${hasScore
                ? `<div style="font-family: var(--fk-font-display); font-size: var(--fs-5xl); font-weight: 800; line-height: 1;">
                     ${MATCH.home_score} – ${MATCH.away_score}
                   </div>`
                : `<div style="font-family: var(--fk-font-display); font-size: var(--fs-3xl); color: var(--fk-gray-400);">VS</div>`}
              <div style="font-size: var(--fs-sm); color: var(--fk-gray-500); margin-top: var(--sp-2);">
                ${formatDateTime(MATCH.match_date)}
              </div>
              ${MATCH.venue ? `<div style="font-size: var(--fs-xs); color: var(--fk-gray-500); margin-top: var(--sp-1);">${escapeHtml(MATCH.venue)}</div>` : ""}
            </div>

            <a href="/pages/sports/team-detail.html?id=${encodeURIComponent(MATCH.away_team_id)}"
               style="text-align:center; text-decoration:none; color:inherit; min-width:120px;">
              <div class="entity-logo" style="margin: 0 auto var(--sp-3);">${escapeHtml(awayInitial)}</div>
              <div style="font-weight: var(--fw-semibold);">${escapeHtml(awayName)}</div>
            </a>
          </div>
        </div>
      </div>

      ${EVENTS.length ? `
        <div class="card" style="margin-top: var(--sp-6);">
          <div class="card-header">
            <h3 style="margin: 0;">Match events</h3>
          </div>
          <div class="card-body">
            <ul style="list-style:none; padding: 0;">
              ${EVENTS.map(renderEvent).join("")}
            </ul>
          </div>
        </div>
      ` : ""}

      ${MATCH.notes ? `
        <div class="card" style="margin-top: var(--sp-6);">
          <div class="card-header">
            <h3 style="margin: 0;">Notes</h3>
          </div>
          <div class="card-body">
            <p>${escapeHtml(MATCH.notes)}</p>
          </div>
        </div>
      ` : ""}
    </div>
  `;
}

function renderEvent(ev) {
  const playerName = (ev.players && ev.players.full_name) || "Unknown";
  const icon = {
    goal: "⚽",
    assist: "🅰️",
    yellow_card: "🟨",
    red_card: "🟥",
    own_goal: "🙃",
    penalty: "🎯",
  }[ev.event_type] || "•";

  return `
    <li style="display:flex; gap: var(--sp-4); padding: var(--sp-3) 0; border-bottom: 1px solid var(--fk-gray-100);">
      <span style="font-size: var(--fs-lg);">${icon}</span>
      <div style="flex: 1;">
        <div style="font-weight: var(--fw-medium);">${escapeHtml(playerName)}</div>
        <div style="font-size: var(--fs-xs); color: var(--fk-gray-500); text-transform: capitalize;">
          ${escapeHtml(ev.event_type.replace(/_/g, " "))}
          ${ev.minute ? " · " + ev.minute + "'" : ""}
        </div>
      </div>
    </li>
  `;
}
