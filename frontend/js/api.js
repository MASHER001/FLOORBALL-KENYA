/**
 * API client
 * ==========
 * A thin wrapper around fetch() that:
 *   · Prepends CONFIG.API_URL
 *   · Attaches the Bearer token if present
 *   · Sends JSON (or FormData for uploads)
 *   · Times out and retries GETs once (serverless cold starts)
 *   · Throws ApiError on non-2xx / network failure
 *   · Parses JSON automatically
 */

import { CONFIG } from "./config.js";

const TIMEOUT_MS = 20000;

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function getToken() {
  const t = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
  if (!t || t === "null" || t === "undefined" || t.length < 20) return null;
  return t;
}

function clearSession() {
  Object.values(CONFIG.STORAGE_KEYS).forEach((k) => {
    if (k !== CONFIG.STORAGE_KEYS.CART_GUEST) localStorage.removeItem(k);
  });
}

/** Turn FastAPI's `detail` (string | list of validation errors) into text. */
function errorMessage(body, fallback) {
  const d = body && (body.detail ?? body.message);
  if (!d) return fallback || "Request failed";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) {
    return d
      .map((e) => {
        const field = Array.isArray(e.loc) ? e.loc.slice(1).join(".") : "";
        return field ? `${field}: ${e.msg}` : e.msg;
      })
      .join("; ");
  }
  return JSON.stringify(d);
}

async function fetchWithTimeout(url, init) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function apiFetch(path, options = {}) {
  const { skipAuth, headers: extraHeaders, ...fetchOptions } = options;
  const method = (fetchOptions.method || "GET").toUpperCase();
  const url = `${CONFIG.API_URL}${path.startsWith("/") ? path : "/" + path}`;
  const token = skipAuth ? null : getToken();

  const headers = { ...(extraHeaders || {}) };

  // Only declare a JSON body when there is one (avoids needless CORS
  // preflights on GETs). FormData must NOT get a Content-Type: the browser
  // sets the multipart boundary itself.
  const hasBody = fetchOptions.body !== undefined && fetchOptions.body !== null;
  if (hasBody && !(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const init = { ...fetchOptions, method, headers };

  // GETs are safe to retry once (cold start / dropped connection).
  const attempts = method === "GET" ? 2 : 1;
  let response;
  for (let i = 0; i < attempts; i++) {
    try {
      response = await fetchWithTimeout(url, init);
      break;
    } catch (err) {
      if (i === attempts - 1) {
        const timedOut = err && err.name === "AbortError";
        throw new ApiError(
          timedOut
            ? "The server took too long to respond. Please try again."
            : "Network error — please check your connection and try again.",
          0,
          null,
        );
      }
    }
  }

  // No content (204)
  if (response.status === 204) return null;

  let body = null;
  const ct = response.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    body = await response.json().catch(() => null);
  } else {
    body = await response.text().catch(() => null);
  }

  if (!response.ok) {
    // Expired / invalid token: drop the session and send them to login.
    // (Only when we actually sent a token, so wrong-password 401s on the
    // login endpoint don't trigger this.)
    if (response.status === 401 && token) {
      clearSession();
      if (!location.pathname.endsWith("/login.html")) {
        location.href = CONFIG.ROUTES.LOGIN;
      }
    }
    throw new ApiError(
      errorMessage(body, response.statusText),
      response.status,
      body,
    );
  }

  return body;
}

/* ---------- Convenience helpers ---------- */
const jsonBody = (data) =>
  data instanceof FormData ? data : JSON.stringify(data ?? {});

export const api = {
  get:    (path, params, opts) =>
    apiFetch(path + buildQuery(params), { ...(opts || {}), method: "GET" }),
  post:   (path, data, opts) =>
    apiFetch(path, { ...(opts || {}), method: "POST",  body: jsonBody(data) }),
  put:    (path, data, opts) =>
    apiFetch(path, { ...(opts || {}), method: "PUT",   body: jsonBody(data) }),
  patch:  (path, data, opts) =>
    apiFetch(path, { ...(opts || {}), method: "PATCH", body: jsonBody(data) }),
  delete: (path, opts) =>
    apiFetch(path, { ...(opts || {}), method: "DELETE" }),
};

function buildQuery(params) {
  if (!params) return "";
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  return parts.length ? "?" + parts.join("&") : "";
}