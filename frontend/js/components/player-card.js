/**
 * Player card — reusable markup for player listings.
 */

import { escapeHtml } from "../ui.js";
import { initials } from "../utils.js";

export function playerCard(player) {
  const initials_ = initials(player.full_name);
  const number = player.jersey_number ? `#${player.jersey_number}` : "";
  return `
    <a href="/pages/sports/player-detail.html?id=${encodeURIComponent(player.id)}"
       class="entity-card" style="display:flex;">
      <div class="entity-logo">${escapeHtml(initials_)}</div>
      <div class="entity-name">${escapeHtml(player.full_name)}</div>
      <div class="entity-meta">
        ${escapeHtml(player.position || "Player")}
        ${number ? " · " + escapeHtml(number) : ""}
      </div>
    </a>
  `;
}

export function playerCardGrid(players = []) {
  if (!players.length) return "";
  return `<div class="grid grid-4">${players.map(playerCard).join("")}</div>`;
}
