/**
 * Navbar component
 * ================
 * Renders the site navigation into <header id="navbar"></header>.
 *
 * · Public links always visible
 * · Auth links (Dashboard, Logout) shown when logged in
 * · Login/Register shown when logged out
 * · Mobile drawer toggle
 * · Cart badge with live count
 * · Active page highlighting
 */

import { CONFIG, dashboardFor } from "../config.js";
import { getSession, isLoggedIn, logout } from "../auth.js";
import { escapeHtml, notify } from "../ui.js";

const NAV_LINKS = [
  { label: "Home",        href: "/index.html" },
  { label: "Leagues",     href: "/pages/sports/leagues.html" },
  { label: "Tournaments", href: "/pages/sports/tournaments.html" },
  { label: "Teams",       href: "/pages/sports/teams.html" },
  { label: "Players",     href: "/pages/sports/players.html" },
  { label: "Shop",        href: "/pages/shop/shop.html" },
  { label: "News",        href: "/pages/public/news.html" },
];

/** Are we currently on the page pointed to by `href`? */
function isActive(href) {
  const path = window.location.pathname;
  // Exact match, or href is a folder + we're on a child page
  if (path === href) return true;
  // Handle index.html at root
  if (href === "/index.html" && (path === "/" || path === "/index.html")) return true;
  return false;
}

/** Read the cart count from the API if the user is logged in. */
async function getCartCount() {
  if (!isLoggedIn()) return 0;
  // TODO: re-enable when /api/v1/cart is implemented on the backend
  return 0;
}

function navLinksHtml(mobile = false) {
  const cls = mobile ? "mobile-nav-link" : "nav-link";
  return NAV_LINKS.map(
    (l) => `
    <a href="${l.href}" class="${cls}${isActive(l.href) ? " active" : ""}">
      ${escapeHtml(l.label)}
    </a>
  `
  ).join("");
}

function authAreaHtml(mobile = false) {
  const { user } = getSession();
  const cls = mobile ? "mobile-nav-link" : "nav-link";

  if (user) {
    const dashHref = dashboardFor(user.role);
    const displayName = user.full_name || user.email || "Account";
    return `
      <a href="${CONFIG.ROUTES.CART}" class="nav-icon-btn" aria-label="Cart">
        🛒 <span class="cart-count" id="cart-count">0</span>
      </a>
      <a href="${dashHref}" class="${cls}">
        ${escapeHtml(displayName)}
      </a>
      <button type="button" class="${cls} logout-btn" id="logout-btn">Logout</button>
    `;
  }

  return `
    <a href="${CONFIG.ROUTES.LOGIN}" class="${cls}">Login</a>
    <a href="${CONFIG.ROUTES.REGISTER}" class="btn btn-primary btn-sm">Sign up</a>
  `;
}

export function renderNavbar() {
  const host = document.getElementById("navbar");
  if (!host) return;

  host.innerHTML = `
    <nav class="navbar" aria-label="Main navigation">
      <div class="container navbar-inner">
        <a href="/FloorballKenya/frontend/index.html" class="navbar-brand" aria-label="FloorballKenya home">
          <img src="/FloorballKenya/frontend/assets/img/logo/image.png" alt="FloorballKenya" class="navbar-logo">
               onerror="this.style.display='none'" />
          <span class="navbar-brand-text">Floorball<span class="brand-accent">Kenya</span></span>
        </a>

        <div class="nav-links-desktop">
          ${navLinksHtml(false)}
        </div>

        <div class="nav-actions">
          ${authAreaHtml(false)}
          <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <div class="mobile-menu" id="mobile-menu" hidden>
        <div class="container mobile-menu-inner">
          ${navLinksHtml(true)}
          <div class="mobile-menu-divider"></div>
          ${authAreaHtml(true)}
        </div>
      </div>
    </nav>
  `;

  // Mobile menu toggle
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = !menu.hidden;
      menu.hidden = open;
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.classList.toggle("open", !open);
    });
  }

  // Logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await logout();
      notify.success("You have been signed out.");
      setTimeout(() => (window.location.href = "/index.html"), 400);
    });
  }

  // Cart count (async, non-blocking)
  getCartCount().then((count) => {
    const el = document.getElementById("cart-count");
    if (el) {
      el.textContent = String(count);
      el.style.display = count > 0 ? "" : "none";
    }
  });
}