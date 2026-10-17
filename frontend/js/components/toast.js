/**
 * Toast
 * =====
 * Non-blocking notification messages.
 *
 * Usage:
 *   toast.success("Saved");
 *   toast.error("Something failed");
 *   toast.info("Heads up");
 */

function ensureHost() {
  let host = document.getElementById("fk-toast-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "fk-toast-host";
    host.style.cssText = "position:fixed;top:20px;right:20px;z-index:2000;display:flex;flex-direction:column;gap:10px;";
    document.body.appendChild(host);
  }
  return host;
}

function show(message, type = "info", ms = 3500) {
  const host = ensureHost();
  const el = document.createElement("div");
  const colors = {
    info:    "#1e40af",
    success: "#166534",
    error:   "#991b1b",
    warning: "#92400e",
  };
  el.style.cssText = `
    background:${colors[type] || colors.info};
    color:#fff;padding:12px 18px;border-radius:6px;
    box-shadow:0 8px 24px rgba(0,0,0,.18);
    font-size:14px;min-width:240px;max-width:360px;
    animation:fkToastIn .2s ease;
  `;
  el.textContent = message;
  host.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity .2s ease";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 200);
  }, ms);
}

export const toast = {
  info:    (m, ms) => show(m, "info", ms),
  success: (m, ms) => show(m, "success", ms),
  error:   (m, ms) => show(m, "error", ms),
  warning: (m, ms) => show(m, "warning", ms),
};
