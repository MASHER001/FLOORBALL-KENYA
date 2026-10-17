/**
 * Leagues listing page
 * =====================
 */

import { api } from "../api.js";
import { showLoading, showError, showEmpty } from "../ui.js";
import { leagueCard } from "../components/league-card.js";

export async function initLeagues() {
  const el = document.getElementById("leagues-list");
  if (!el) return;

  showLoading(el, "Loading leagues…");

  try {
    const res = await api.get("/leagues?page_size=50");
    const leagues = res.items || [];

    if (!leagues.length) {
      showEmpty(el, {
        title: "No leagues yet",
        text: "Check back soon — leagues will appear here once created.",
      });
      return;
    }

    el.innerHTML = `<div class="grid grid-3">${leagues.map(leagueCard).join("")}</div>`;
  } catch (err) {
    showError(el, "Unable to load leagues. " + err.message);
  }
}
