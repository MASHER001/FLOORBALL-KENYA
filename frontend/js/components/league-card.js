/**
 * League card — reusable markup for league listings.
 */

import { escapeHtml } from "../ui.js";

export function leagueCard(league) {
  const initial = (league.name || "?").charAt(0).toUpperCase();
  return `
    <a href="/pages/sports/league-detail.html?id=${encodeURIComponent(league.id)}"
       class="card card-hover" style="display:block;">
      <div class="card-image"
           style="display:flex; align-items:center; justify-content:center;
                  background: linear-gradient(135deg, var(--fk-green), var(--fk-green-dark));
                  color: var(--fk-white); font-family: var(--fk-font-display);
                  font-size: var(--fs-5xl); font-weight: 800;">
        ${escapeHtml(initial)}
      </div>
      <div class="card-body">
        <div class="card-title">${escapeHtml(league.name)}</div>
        <p class="card-text">${escapeHtml(league.category || "League")}</p>
      </div>
    </a>
  `;
}

export function leagueCardGrid(leagues = []) {
  if (!leagues.length) return "";
  return `<div class="grid grid-3">${leagues.map(leagueCard).join("")}</div>`;
}
