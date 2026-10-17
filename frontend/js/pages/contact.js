/**
 * Contact page — form with basic validation.
 * No backend endpoint yet; logs submission and shows success.
 */

import { notify } from "../ui.js";

export function initContact() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !subject || !message) {
      notify.error("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notify.error("Please enter a valid email address.");
      return;
    }

    if (message.length < 10) {
      notify.error("Message should be at least 10 characters.");
      return;
    }

    // For now, just acknowledge. A POST /api/contact endpoint can be added later.
    notify.success("Message sent! We'll be in touch soon.", { title: "Thanks" });
    form.reset();
  });
}
