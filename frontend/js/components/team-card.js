/**
 * Team card — reusable markup for team listings.
 */

import { escapeHtml } from "../ui.js";

export function teamCard(team) {
  const initial = (team.name || "?").charAt(0).toUpperCase();
  return `
    <a href="/pages/sports/team-detail.html?id=${encodeURIComponent(team.id)}"
       class="entity-card" style="display:flex;">
      <div class="entity-logo">${escapeHtml(initial)}</div>
      <div class="entity-name">${escapeHtml(team.name)}</div>
      <div class="entity-meta">${escapeHtml(team.county || "Kenya")}</div>
    </a>
  `;
}

export function teamCardGrid(teams = []) {
  if (!teams.length) return "";
  return `<div class="grid grid-4">${teams.map(teamCard).join("")}</div>`;
}
