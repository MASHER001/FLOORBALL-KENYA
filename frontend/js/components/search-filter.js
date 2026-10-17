/**
 * Search + filter bar
 * ===================
 * Renders a search input and optional select filters.
 *
 * Usage:
 *   renderSearchFilter(host, {
 *     placeholder: "Search teams…",
 *     filters: [{ id: "status", label: "Status", options: ["active","pending"] }],
 *     onChange: ({ q, filters }) => reload({ q, ...filters }),
 *   });
 */

export function renderSearchFilter(host, {
  placeholder = "Search…",
  filters = [],
  onChange = () => {},
  delay = 250,
} = {}) {
  if (!host) return;

  const filterHtml = filters
    .map(
      (f) => `
      <label style="display:flex;gap:6px;align-items:center;">
        <span style="font-size:13px;color:#374151;">${esc(f.label)}</span>
        <select data-filter="${f.id}">
          <option value="">All</option>
          ${(f.options || []).map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join("")}
        </select>
      </label>
    `
    )
    .join("");

  host.innerHTML = `
    <div class="fk-search-filter" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:16px;">
      <input type="search" placeholder="${esc(placeholder)}" data-search style="flex:1;min-width:220px;padding:9px 12px;border:1px solid #d1d5db;border-radius:6px;">
      ${filterHtml}
    </div>
  `;

  let timer = null;
  const emit = () => {
    const q = host.querySelector("[data-search]").value.trim();
    const out = {};
    host.querySelectorAll("[data-filter]").forEach((sel) => {
      out[sel.dataset.filter] = sel.value || undefined;
    });
    onChange({ q: q || undefined, filters: out });
  };

  host.querySelector("[data-search]").addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(emit, delay);
  });
  host.querySelectorAll("[data-filter]").forEach((sel) => {
    sel.addEventListener("change", emit);
  });
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}
