/**
 * Matches page — fixtures + results with filters.
 */

import { api } from "../api.js";
import { showLoading, showError, showEmpty, debounce, qs } from "../ui.js";
import { matchCard } from "../components/match-card.js";

let STATE = {
  page: 1,
  pageSize: 20,
  status: "scheduled",
  teamId: "",
};

export async function initMatches() {
  const el = document.getElementById("matches-list");
  if (!el) return;

  // Read initial tab from URL (?tab=results or ?status=completed)
  const tab = qs("tab");
  if (tab === "results") STATE.status = "completed";
  if (tab === "live") STATE.status = "live";

  // Status filter
  const statusFilter = document.getElementById("matches-status");
  if (statusFilter) {
    statusFilter.value = STATE.status;
    statusFilter.addEventListener("change", (e) => {
      STATE.status = e.target.value;
      STATE.page = 1;
      loadMatches();
    });
  }

  // Team filter (by team_id, populated on demand)
  const teamFilter = document.getElementById("matches-team");
  if (teamFilter) {
    api.get("/teams?page_size=200").then((res) => {
      const teams = res.items || [];
      teamFilter.innerHTML = `<option value="">All teams</option>` +
        teams.map((t) => `<option value="${t.id}">${escapeHtmlSimple(t.name)}</option>`).join("");
      teamFilter.addEventListener("change", (e) => {
        STATE.teamId = e.target.value;
        STATE.page = 1;
        loadMatches();
      });
    }).catch(() => {});
  }

  loadMatches();
}

function escapeHtmlSimple(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

async function loadMatches() {
  const el = document.getElementById("matches-list");
  showLoading(el, "Loading matches…");

  try {
    const params = new URLSearchParams();
    params.set("page", STATE.page);
    params.set("page_size", STATE.pageSize);
    if (STATE.status) params.set("status", STATE.status);
    if (STATE.teamId) params.set("team_id", STATE.teamId);

    const res = await api.get(`/matches?${params}`);
    const matches = res.items || [];

    if (!matches.length) {
      const msg = STATE.status === "completed"
        ? "No completed matches yet."
        : STATE.status === "live"
        ? "No matches live right now."
        : "No fixtures scheduled.";
      showEmpty(el, { title: "Nothing here yet", text: msg });
      return;
    }

    el.innerHTML = `<div class="grid">${matches.map(matchCard).join("")}</div>`;
    renderPagination(res.total || 0);
  } catch (err) {
    showError(el, "Unable to load matches. " + err.message);
  }
}

function renderPagination(total) {
  const pages = Math.ceil(total / STATE.pageSize);
  if (pages <= 1) return;
  const container = document.getElementById("matches-pagination");
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
      loadMatches();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}
