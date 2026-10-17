/**
 * Empty state
 * ===========
 * Renders a friendly "nothing here yet" message.
 */

export function renderEmptyState(host, {
  title = "Nothing here yet",
  message = "Check back later.",
  actionLabel = null,
  actionHref = null,
} = {}) {
  if (!host) return;

  const action = actionLabel && actionHref
    ? `<a class="btn" href="${actionHref}" style="margin-top:16px;">${escape(actionLabel)}</a>`
    : "";

  host.innerHTML = `
    <div class="fk-empty" style="padding:48px 24px;text-align:center;color:#6b7280;">
      <div style="font-size:48px;opacity:.4;">□</div>
      <h3 style="margin:12px 0 6px;color:#111827;">${escape(title)}</h3>
      <p style="margin:0;">${escape(message)}</p>
      ${action}
    </div>
  `;
}

function escape(s) {
  return String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}
