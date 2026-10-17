/**
 * Forgot password page
 * =====================
 * Supabase Auth handles password resets via email.
 * For now this shows a friendly message; wire to the backend later.
 */

import { notify } from "../ui.js";

export function initForgotPassword() {
  const form = document.getElementById("forgot-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();

    if (!email) {
      notify.error("Please enter your email address.");
      return;
    }

    // TODO: POST /auth/forgot-password once implemented in the backend
    notify.info("If an account exists for " + email + ", you'll receive a reset link.");
    form.reset();
  });
}