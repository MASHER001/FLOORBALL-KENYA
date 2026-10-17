/**
 * Match card — reusable markup for fixtures and results.
 */

import { escapeHtml, formatDateTime } from "../ui.js";

export function matchCard(match) {
  const homeName = (match.home_team && match.home_team.name) || "Home";
  const awayName = (match.away_team && match.away_team.name) || "Away";
  const isCompleted = match.status === "completed";
  const isLive = match.status === "live";

  const scoreHtml = isCompleted || isLive
    ? `<div class="match-score${isLive ? " live" : ""}">${match.home_score ?? 0} – ${match.away_score ?? 0}</div>`
    : `<div class="match-score">VS</div>`;

  return `
    <a href="/pages/sports/match-detail.html?id=${encodeURIComponent(match.id)}"
       class="match-card" style="display:grid;">
      <div class="match-team">
        <div class="match-team-logo"></div>
        <div class="match-team-name">${escapeHtml(homeName)}</div>
      </div>
      ${scoreHtml}
      <div class="match-team away">
        <div class="match-team-logo"></div>
        <div class="match-team-name">${escapeHtml(awayName)}</div>
      </div>
      <div class="match-meta">
        ${formatDateTime(match.match_date)}
        ${match.venue ? " · " + escapeHtml(match.venue) : ""}
      </div>
    </a>
  `;
}

export function matchCardList(matches = []) {
  if (!matches.length) return "";
  return `<div class="grid">${matches.map(matchCard).join("")}</div>`;
}
