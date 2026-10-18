/**
 * Login page
 * ===========
 * Signs in via /auth/login, saves the session, then redirects
 * the user to the dashboard for their role (or `?next=`).
 */

import { login, getCurrentUser } from "../auth.js";
import { CONFIG, dashboardFor } from "../config.js";
import { qs, notify } from "../ui.js";

export function initLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;

  // 1. ALWAYS attach the submit handler first
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      notify.error("Please enter your email and password.");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Signing in...";

    try {
      const user = await login({ email, password });
      notify.success("Welcome back, " + (user.full_name || user.email) + "!");

      const next = qs("next");
      const destination = next || dashboardFor(user.role);

      setTimeout(() => {
        window.location.href = destination;
      }, 500);
    } catch (err) {
      notify.error(err.message || "Login failed. Check your credentials.");
      btn.disabled = false;
      btn.textContent = "Sign in";
    }
  });

  // 2. THEN check for an existing valid session — redirect if so
  const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
  if (token) {
    getCurrentUser()
      .then((profile) => {
        if (profile && profile.id) {
          const next = qs("next");
          window.location.href = next || dashboardFor(profile.role);
        }
        // profile null means invalid token — getCurrentUser already cleared it,
        // form stays visible
      })
      .catch(() => {
        // network/server error — let them log in anyway
      });
  }
}