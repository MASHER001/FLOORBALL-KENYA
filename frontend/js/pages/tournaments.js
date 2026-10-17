/**
 * Tournaments listing page
 * =========================
 */

import { api } from "../api.js";
import { showLoading, showError, showEmpty, escapeHtml, formatDate } from "../ui.js";

export async function initTournaments() {
  const el = document.getElementById("tournaments-list");
  if (!el) return;

  showLoading(el, "Loading tournaments…");

  try {
    const res = await api.get("/tournaments?page_size=50");
    const tournaments = res.items || [];

    if (!tournaments.length) {
      showEmpty(el, {
        title: "No tournaments yet",
        text: "Check back soon — tournaments will appear here once created.",
      });
      return;
    }

    el.innerHTML = `<div class="grid grid-3">${tournaments.map(card).join("")}</div>`;
  } catch (err) {
    showError(el, "Unable to load tournaments. " + err.message);
  }
}

function card(t) {
  const initial = (t.name || "?").charAt(0).toUpperCase();
  const dates = [t.start_date, t.end_date].filter(Boolean).map(formatDate).join(" – ");

  return `
    <a href="/pages/sports/tournament-detail.html?id=${encodeURIComponent(t.id)}"
       class="card card-hover" style="display:block;">
      <div class="card-image"
           style="display:flex; align-items:center; justify-content:center;
                  background: linear-gradient(135deg, var(--fk-gold), var(--fk-gold-dark));
                  color: var(--fk-black); font-family: var(--fk-font-display);
                  font-size: var(--fs-5xl); font-weight: 800;">
        ${escapeHtml(initial)}
      </div>
      <div class="card-body">
        <div class="card-title">${escapeHtml(t.name)}</div>
        <p class="card-text">${escapeHtml(t.format ? t.format.replace(/_/g, " ") : "Tournament")}</p>
        ${dates ? `<p class="card-text" style="margin-top: var(--sp-2); font-size: var(--fs-xs); color: var(--fk-gray-500);">${escapeHtml(dates)}</p>` : ""}
      </div>
    </a>
  `;
}
