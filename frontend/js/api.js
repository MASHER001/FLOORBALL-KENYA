/**
 * API client
 * ==========
 * A thin wrapper around fetch() that:
 *   · Prepends CONFIG.API_URL
 *   · Attaches the Bearer token if present
 *   · Times out after 15 seconds
 *   · Auto-clears session on 401
 *   · Builds query strings from objects
 *   · Parses JSON automatically
 */

import { CONFIG } from "./config.js";

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

function buildQuery(params) {
  if (!params) return "";
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  return parts.length ? "?" + parts.join("&") : "";
}

function extractErrorMessage(body, statusText) {
  if (!body) return statusText || "Request failed";
  if (typeof body.detail === "string") return body.detail;
  if (Array.isArray(body.detail)) {
    return body.detail
      .map((e) => `${(e.loc || []).slice(1).join(".") || "field"}: ${e.msg}`)
      .join("; ");
  }
  if (typeof body.message === "string") return body.message;
  return statusText || "Request failed";
}

export async function apiFetch(path, options = {}) {
  const url = `${CONFIG.API_URL}${path}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 15000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new ApiError("Request timed out", 0, null);
    }
    throw new ApiError("Network error — is the API running?", 0, null);
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 204) return null;

  let body = null;
  const ct = response.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    body = await response.json().catch(() => null);
  } else {
    body = await response.text().catch(() => null);
  }

  if (!response.ok) {
    // Auto-logout on 401 (expired/invalid token) — but not on login pages
    if (response.status === 401 && !window.location.pathname.includes("/auth/")) {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.REFRESH);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
      window.location.href = CONFIG.ROUTES.LOGIN;
      return null;
    }
    const msg = extractErrorMessage(body, response.statusText);
    throw new ApiError(msg, response.status, body);
  }

  return body;
}

/* ---------- Convenience helpers ---------- */
export const api = {
  get:    (path, params, opts) =>
    apiFetch(path + buildQuery(params), { ...(opts || {}), method: "GET" }),
  post:   (path, data, opts) =>
    apiFetch(path, { ...(opts || {}), method: "POST", body: JSON.stringify(data) }),
  put:    (path, data, opts) =>
    apiFetch(path, { ...(opts || {}), method: "PUT", body: JSON.stringify(data) }),
  patch:  (path, data, opts) =>
    apiFetch(path, { ...(opts || {}), method: "PATCH", body: JSON.stringify(data) }),
  delete: (path, opts) =>
    apiFetch(path, { ...(opts || {}), method: "DELETE" }),
};