/**
 * Pagination
 * ==========
 * Renders pagination controls into a container element.
 *
 * Usage:
 *   renderPagination(document.getElementById("pager"), {
 *     total: 200, limit: 20, offset: 0,
 *     onChange: (newOffset) => load(newOffset),
 *   });
 */

export function renderPagination(host, { total, limit, offset, onChange }) {
  if (!host) return;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const current   = Math.floor(offset / limit) + 1;

  host.innerHTML = `
    <div class="fk-pager" style="display:flex;gap:8px;align-items:center;margin-top:16px;">
      <button class="btn btn-outline" data-p="${current - 1}" ${current <= 1 ? "disabled" : ""}>‹ Prev</button>
      <span style="padding:0 12px;color:#374151;">Page ${current} of ${pageCount}</span>
      <button class="btn btn-outline" data-p="${current + 1}" ${current >= pageCount ? "disabled" : ""}>Next ›</button>
    </div>
  `;

  host.querySelectorAll("button[data-p]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = Number(btn.dataset.p);
      if (p < 1 || p > pageCount) return;
      onChange((p - 1) * limit);
    });
  });
}
