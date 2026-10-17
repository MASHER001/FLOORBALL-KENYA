/**
 * Small utilities
 */

export function titleCase(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function initials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(str, len = 120) {
  const s = String(str || "");
  return s.length > len ? s.slice(0, len).trim() + "…" : s;
}

export function statusBadge(status) {
  const map = {
    scheduled:  "badge-gray",
    live:       "badge-red badge-live",
    completed:  "badge-green",
    postponed:  "badge-gold",
    cancelled:  "badge-red",

    pending:    "badge-gold",
    paid:       "badge-green",
    processing: "badge-gold",
    shipped:    "badge-gold",
    delivered:  "badge-green",
    refunded:   "badge-red",

    success:    "badge-green",
    failed:     "badge-red",

    approved:   "badge-green",
    rejected:   "badge-red",
    suspended:  "badge-red",

    active:     "badge-green",
    inactive:   "badge-gray",
  };
  return map[status] || "badge-gray";
}

export function scrollReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  els.forEach((el) => io.observe(el));
}