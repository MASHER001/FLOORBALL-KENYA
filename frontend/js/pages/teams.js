/**
 * Teams listing page
 * ===================
 * Filter by county, search by name.
 */

import { api } from "../api.js";
import { showLoading, showError, showEmpty, debounce, qs } from "../ui.js";
import { teamCard } from "../components/team-card.js";

let STATE = { page: 1, pageSize: 24, q: "", county: "" };

export async function initTeams() {
  const el = document.getElementById("teams-list");
  if (!el) return;

  // Read initial search from URL
  const initialQ = qs("q") || "";
  if (initialQ) {
    STATE.q = initialQ;
    const input = document.getElementById("teams-search");
    if (input) input.value = initialQ;
  }

  // Wire search input
  const search = document.getElementById("teams-search");
  if (search) {
    search.addEventListener("input", debounce((e) => {
      STATE.q = e.target.value.trim();
      STATE.page = 1;
      loadTeams();
    }, 300));
  }

  loadTeams();
}

async function loadTeams() {
  const el = document.getElementById("teams-list");
  showLoading(el, "Loading teams…");

  try {
    const params = new URLSearchParams();
    params.set("page", STATE.page);
    params.set("page_size", STATE.pageSize);
    if (STATE.q) params.set("q", STATE.q);
    if (STATE.county) params.set("county", STATE.county);

    const res = await api.get(`/teams?${params}`);
    const teams = res.items || [];

    if (!teams.length) {
      showEmpty(el, {
        title: "No teams found",
        text: STATE.q ? `No results for "${STATE.q}".` : "Teams will appear here once registered.",
      });
      return;
    }

    el.innerHTML = `<div class="grid grid-4">${teams.map(teamCard).join("")}</div>`;

    // Pagination (simple)
    renderPagination(res.total || 0);
  } catch (err) {
    showError(el, "Unable to load teams. " + err.message);
  }
}

function renderPagination(total) {
  const pages = Math.ceil(total / STATE.pageSize);
  if (pages <= 1) return;

  const container = document.getElementById("teams-pagination");
  if (!container) return;

  container.innerHTML = `
    <div class="pagination">
      <button ${STATE.page <= 1 ? "disabled" : ""} data-page="${STATE.page - 1}">‹</button>
      ${Array.from({ length: pages }, (_, i) => i + 1).map((p) => `
        <button class="${p === STATE.page ? "active" : ""}" data-page="${p}">${p}</button>
      `).join("")}
      <button ${STATE.page >= pages ? "disabled" : ""} data-page="${STATE.page + 1}">›</button>
    </div>
  `;

  container.querySelectorAll("button[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      STATE.page = parseInt(btn.dataset.page);
      loadTeams();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}
