/**
 * Register page
 * ==============
 */

import { register } from "../auth.js";
import { CONFIG, dashboardFor } from "../config.js";
import { notify } from "../ui.js";

export function initRegister() {
  const form = document.getElementById("register-form");
  if (!form) return;

  const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
  if (token) {
    window.location.href = CONFIG.ROUTES.HOME;
    return;
  }

  const roleSelect = form.role;
  const roleHint = document.getElementById("role-hint");
  const hints = {
    player: "Create your player profile and track your stats.",
    team_manager: "Register and manage your own team.",
    vendor: "Sell gear on the marketplace after admin approval.",
    customer: "Shop products and follow the sport.",
  };

  if (roleSelect && roleHint) {
    roleHint.textContent = hints[roleSelect.value] || "";
    roleSelect.addEventListener("change", () => {
      roleHint.textContent = hints[roleSelect.value] || "";
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;
    const confirm = form.confirm_password.value;
    const full_name = form.full_name.value.trim();
    const phone = form.phone.value.trim();
    const role = form.role.value;

    if (!email || !password || !full_name) {
      notify.error("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      notify.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      notify.error("Passwords do not match.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notify.error("Please enter a valid email address.");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Creating account...";

    try {
      const result = await register({
        email,
        password,
        full_name,
        phone: phone || null,
        role,
      });

      notify.success("Account created! Redirecting...");

      const destination = dashboardFor(result?.user?.role || role);
      setTimeout(() => {
        window.location.href = destination;
      }, 700);
    } catch (err) {
      notify.error(err.message || "Registration failed. Please try again.");
      btn.disabled = false;
      btn.textContent = "Create account";
    }
  });
}