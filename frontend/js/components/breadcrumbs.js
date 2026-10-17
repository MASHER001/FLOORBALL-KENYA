/**
 * Breadcrumbs
 * ===========
 * Renders a breadcrumb trail into <nav id="breadcrumbs"></nav>.
 *
 * Usage:
 *   import { renderBreadcrumbs } from "../components/breadcrumbs.js";
 *   renderBreadcrumbs([
 *     { label: "Home", href: "/index.html" },
 *     { label: "Leagues", href: "/pages/sports/leagues.html" },
 *     { label: "Premier League" },
 *   ]);
 */

export function renderBreadcrumbs(items) {
  const host = document.getElementById("breadcrumbs");
  if (!host) return;

  const html = items
    .map((item, i) => {
      const isLast = i === items.length - 1;
      if (isLast || !item.href) {
        return `<span class="crumb current">${escape(item.label)}</span>`;
      }
      return `<a class="crumb" href="${item.href}">${escape(item.label)}</a>`;
    })
    .join('<span class="sep"> / </span>');

  host.innerHTML = `<nav aria-label="Breadcrumb" class="breadcrumbs">${html}</nav>`;
}

function escape(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
