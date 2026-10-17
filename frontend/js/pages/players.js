/**
 * Players listing page
 * =====================
 * Search, filter by position, paginate.
 */

import { api } from "../api.js";
import { showLoading, showError, showEmpty, debounce, qs } from "../ui.js";
import { playerCard } from "../components/player-card.js";

let STATE = { page: 1, pageSize: 24, q: "", position: "" };

export async function initPlayers() {
  const el = document.getElementById("players-list");
  if (!el) return;

  const initialQ = qs("q") || "";
  if (initialQ) {
    STATE.q = initialQ;
    const input = document.getElementById("players-search");
    if (input) input.value = initialQ;
  }

  const search = document.getElementById("players-search");
  if (search) {
    search.addEventListener("input", debounce((e) => {
      STATE.q = e.target.value.trim();
      STATE.page = 1;
      loadPlayers();
    }, 300));
  }

  const positionFilter = document.getElementById("players-position");
  if (positionFilter) {
    positionFilter.addEventListener("change", (e) => {
      STATE.position = e.target.value;
      STATE.page = 1;
      loadPlayers();
    });
  }

  loadPlayers();
}

async function loadPlayers() {
  const el = document.getElementById("players-list");
  showLoading(el, "Loading players…");

  try {
    const params = new URLSearchParams();
    params.set("page", STATE.page);
    params.set("page_size", STATE.pageSize);
    if (STATE.q) params.set("q", STATE.q);
    if (STATE.position) params.set("position", STATE.position);

    const res = await api.get(`/players?${params}`);
    const players = res.items || [];

    if (!players.length) {
      showEmpty(el, {
        title: "No players found",
        text: STATE.q ? `No results for "${STATE.q}".` : "Players will appear here once registered.",
      });
      return;
    }

    el.innerHTML = `<div class="grid grid-4">${players.map(playerCard).join("")}</div>`;
    renderPagination(res.total || 0);
  } catch (err) {
    showError(el, "Unable to load players. " + err.message);
  }
}

function renderPagination(total) {
  const pages = Math.ceil(total / STATE.pageSize);
  if (pages <= 1) return;

  const container = document.getElementById("players-pagination");
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
      loadPlayers();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}
