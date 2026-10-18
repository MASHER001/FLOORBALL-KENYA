/**
 * Auth helpers
 * ============
 * Wraps /auth endpoints, manages localStorage session.
 */

import { CONFIG } from "./config.js";
import { api } from "./api.js";

/* ---------- Session storage ---------- */
export function saveSession({ access_token, refresh_token, user }) {
  if (access_token)  localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, access_token);
  if (refresh_token) localStorage.setItem(CONFIG.STORAGE_KEYS.REFRESH, refresh_token);
  if (user)          localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getSession() {
  const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
  const userRaw = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
  let user = null;
  try { user = userRaw ? JSON.parse(userRaw) : null; } catch { user = null; }
  return { token, user };
}

export function clearSession() {
  localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
  localStorage.removeItem(CONFIG.STORAGE_KEYS.REFRESH);
  localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN));
}

/* ---------- API calls ---------- */
export async function register(payload) {
  // 1. Register via Supabase Auth (through our backend)
  const user = await api.post("/auth/register", payload);
  // 2. Log them in
  const session = await login({ email: payload.email, password: payload.password });
  return { user, session };
}

export async function login({ email, password }) {
  // Clear any stale token so it isn't sent in the Authorization header
  clearSession();

  const session = await api.post("/auth/login", { email, password });

  saveSession({
    access_token:  session.access_token,
    refresh_token: session.refresh_token,
    user:          session.user,
  });

  // Try to enrich with full profile, but don't fail login if it does
  try {
    const profile = await api.get("/auth/me");
    saveSession({ user: profile });
    return profile;
  } catch {
    return session.user;
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout", {});
  } catch { /* ignore */ }
  clearSession();
}

export async function getCurrentUser() {
  if (!isLoggedIn()) return null;
  try {
    const profile = await api.get("/auth/me");
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(profile));
    return profile;
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      clearSession();
      return null;
    }
    throw err;
  }
}

/* ---------- Role checks ---------- */
export function isAdmin(user) {
  return user && (user.role === "admin" || user.role === "super_admin");
}

export function isSuperAdmin(user) {
  return user && user.role === "super_admin";
}

export function isVendor(user) {
  return user && user.role === "vendor";
}

export function isManager(user) {
  return user && user.role === "team_manager";
}

export function isPlayer(user) {
  return user && user.role === "player";
}

/* ---------- Route guard ---------- */
export function requireAuth(redirectTo = CONFIG.ROUTES.LOGIN) {
  if (!isLoggedIn()) {
    const next = encodeURIComponent(window.location.pathname);
    window.location.href = `${redirectTo}?next=${next}`;
    return false;
  }
  return true;
}

export function requireRole(roles, redirectTo = CONFIG.ROUTES.HOME) {
  const { user } = getSession();
  if (!user) {
    window.location.href = redirectTo;
    return false;
  }
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}