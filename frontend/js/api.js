/**
 * API client
 * ==========
 * A thin wrapper around fetch() that:
 *   · Prepends CONFIG.API_URL
 *   · Attaches the Bearer token if present
 *   · Throws on non-2xx
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
  return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
}

export async function apiFetch(path, options = {}) {
  const url = `${CONFIG.API_URL}${path}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (err) {
    throw new ApiError("Network error — is the API running?", 0, null);
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
    const msg =
      (body && (body.detail || body.message)) ||
      response.statusText ||
      "Request failed";
    throw new ApiError(typeof msg === "string" ? msg : JSON.stringify(msg), response.status, body);
  }

  return body;
}

/* ---------- Convenience helpers ---------- */
export const api = {
  get:    (path, opts = {}) => apiFetch(path, { ...opts, method: "GET" }),
  post:   (path, data, opts = {}) =>
    apiFetch(path, { ...opts, method: "POST", body: JSON.stringify(data) }),
  put:    (path, data, opts = {}) =>
    apiFetch(path, { ...opts, method: "PUT", body: JSON.stringify(data) }),
  patch:  (path, data, opts = {}) =>
    apiFetch(path, { ...opts, method: "PATCH", body: JSON.stringify(data) }),
  delete: (path, opts = {}) => apiFetch(path, { ...opts, method: "DELETE" }),
};