/**
 * UI helpers — toasts, modals, loaders, formatters, escapeHtml
 */

/* ---------- Escape HTML (use everywhere you inject user data) ---------- */
export function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ---------- Currency ---------- */
export function formatKES(amount) {
  const n = Number(amount || 0);
  return "KSh " + n.toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/* ---------- Dates ---------- */
export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-KE", {
    year: "numeric", month: "short", day: "numeric", ...opts,
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-KE", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const seconds = Math.floor((Date.now() - d) / 1000);
  const intervals = [
    ["year",   31536000],
    ["month",  2592000],
    ["week",   604800],
    ["day",    86400],
    ["hour",   3600],
    ["minute", 60],
  ];
  for (const [name, secs] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${name}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

/* ---------- Toast notifications ---------- */
function ensureToastContainer() {
  let c = document.querySelector(".toast-container");
  if (!c) {
    c = document.createElement("div");
    c.className = "toast-container";
    document.body.appendChild(c);
  }
  return c;
}

export function toast(message, { type = "info", title = "", duration = 4000 } = {}) {
  const container = ensureToastContainer();
  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  el.innerHTML = `
    ${title ? `<div class="toast-title">${escapeHtml(title)}</div>` : ""}
    <div>${escapeHtml(message)}</div>
  `;
  container.appendChild(el);

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(24px)";
    el.style.transition = "all 0.3s";
    setTimeout(() => el.remove(), 300);
  }, duration);
}

export const notify = {
  success: (msg, opts = {}) => toast(msg, { ...opts, type: "success" }),
  error:   (msg, opts = {}) => toast(msg, { ...opts, type: "error" }),
  warning: (msg, opts = {}) => toast(msg, { ...opts, type: "warning" }),
  info:    (msg, opts = {}) => toast(msg, { ...opts, type: "info" }),
};

/* ---------- Modal ---------- */
export function openModal(html, { onClose } = {}) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add("active"));

  const close = () => {
    overlay.classList.remove("active");
    setTimeout(() => overlay.remove(), 250);
    onClose && onClose();
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  overlay.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  return { overlay, close };
}

/* ---------- Loaders ---------- */
export function showLoading(container, message = "Loading…") {
  const el = typeof container === "string" ? document.querySelector(container) : container;
  if (!el) return;
  el.innerHTML = `
    <div class="loading-block">
      <div class="spinner spinner-lg"></div>
      <div>${escapeHtml(message)}</div>
    </div>
  `;
}

export function showEmpty(container, { title = "Nothing here yet", text = "" } = {}) {
  const el = typeof container === "string" ? document.querySelector(container) : container;
  if (!el) return;
  el.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">📭</div>
      <div class="empty-state-title">${escapeHtml(title)}</div>
      ${text ? `<p class="empty-state-text">${escapeHtml(text)}</p>` : ""}
    </div>
  `;
}

export function showError(container, message) {
  const el = typeof container === "string" ? document.querySelector(container) : container;
  if (!el) return;
  el.innerHTML = `
    <div class="alert alert-error">
      <div>${escapeHtml(message)}</div>
    </div>
  `;
}

/* ---------- Query string helper ---------- */
export function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* ---------- Debounce ---------- */
export function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}