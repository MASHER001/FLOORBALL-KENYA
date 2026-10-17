/**
 * Loading indicator
 * =================
 */

export function showLoading(host, message = "Loading…") {
  if (!host) return;
  host.innerHTML = `
    <div class="fk-loading" style="padding:32px;text-align:center;color:#6b7280;">
      <div style="display:inline-block;width:28px;height:28px;border:3px solid #e5e7eb;border-top-color:#16a34a;border-radius:50%;animation:fkSpin .8s linear infinite;"></div>
      <p style="margin-top:12px;">${escape(message)}</p>
    </div>
  `;
}

export function hideLoading(host) {
  if (!host) return;
  host.innerHTML = "";
}

function escape(s) {
  return String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}
