/**
 * Navbar component
 * ================
 * Renders into <header id="navbar"></header> using the shared design-system
 * classes from layout.css: .site-header / .site-header__inner / .brand /
 * .site-nav / .header-actions / .icon-btn / .avatar / .nav-toggle.
 *
 * Mobile menu: there is ONE .site-nav list. On mobile it's hidden by
 * responsive.css; toggling adds/removes .open on the <header class="site-header">
 * itself, which responsive.css uses to show .site-nav as a dropdown
 * (see .site-header.open .site-nav in layout.css).
 */

import { CONFIG, dashboardFor } from "../config.js";
import { getSession, isLoggedIn, logout } from "../auth.js";
import { escapeHtml, notify } from "../ui.js";

const BASE = "/FloorballKenya/frontend";
const NAV_LINKS = [
  { label: "Home",        href: "/FloorballKenya/frontend/index.html" },
  { label: "Leagues",     href: "/FloorballKenya/frontend/pages/sports/leagues.html" },
  { label: "Tournaments", href: "/FloorballKenya/frontend/pages/sports/tournaments.html" },
  { label: "Marketplace", href: "/FloorballKenya/frontend/pages/shop/shop.html" },
  { label: "Teams",       href: "/FloorballKenya/frontend/pages/sports/teams.html" },
  { label: "Gallery",     href: "/FloorballKenya/frontend/pages/public/gallery.html" },
  { label: "About",       href: "/FloorballKenya/frontend/pages/public/about.html" },
];

/** Are we currently on the page pointed to by `href`? */
function isActive(href) {
  const path = window.location.pathname;
  if (path === href) return true;
  if (href === "/index.html" && (path === "/" || path === "/index.html")) return true;
  return false;
}

/** Read the cart count from the API if the user is logged in. */
async function getCartCount() {
  if (!isLoggedIn()) return 0;
  // TODO: re-enable when /api/v1/cart is implemented on the backend
  return 0;
}

function initialsFor(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("");
}

function navLinksHtml() {
  return NAV_LINKS.map(
    (l) => `<a href="${l.href}"${isActive(l.href) ? ' class="active"' : ""}>${escapeHtml(l.label)}</a>`
  ).join("");
}

/** Search / notifications / flag — small icon cluster inside .header-actions. */
function iconClusterHtml() {
  return `
    <button type="button" class="icon-btn" id="nav-search-btn" aria-label="Search">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </button>
    <button type="button" class="icon-btn" id="nav-notify-btn" aria-label="Notifications">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      <span class="dot" id="notify-dot" hidden></span>
    </button>
    <span class="flag-badge" aria-label="Kenya" title="Kenya">🇰🇪</span>
  `;
}

function authAreaHtml() {
  const { user } = getSession();

  if (user) {
    const dashHref = dashboardFor(user.role);
    const displayName = user.full_name || user.email || "Account";
    return `
      <a href="${CONFIG.ROUTES.CART}" class="icon-btn" aria-label="Cart">
        🛒 <span class="cart-count" id="cart-count">0</span>
      </a>
      <a href="${dashHref}" class="user-chip" aria-label="Account">
        <span class="avatar">${escapeHtml(initialsFor(displayName))}</span>
        <span>${escapeHtml(displayName)}</span>
      </a>
      <button type="button" class="btn btn-outline btn-sm" id="logout-btn">Logout</button>
    `;
  }

  return `
    <a href="${CONFIG.ROUTES.LOGIN}" class="btn btn-outline btn-sm">Login</a>
    <a href="${CONFIG.ROUTES.REGISTER}" class="btn btn-sm">Sign up</a>
  `;
}

export function renderNavbar() {
  const host = document.getElementById("navbar");
  if (!host) return;

  host.innerHTML = `
    <header class="site-header" id="site-header">
      <div class="container site-header__inner">
        <a href="${BASE}/index.html" class="brand" aria-label="FloorballKenya home">
          <img src="${BASE}/assets/img/logo/image.png" alt="FloorballKenya" onerror="this.style.display='none'" />
          <span>Floorball<span class="brand-accent">Kenya</span></span>
        </a>

        <nav class="site-nav" aria-label="Main navigation">
          ${navLinksHtml()}
        </nav>

        <div class="header-actions">
          ${iconClusterHtml()}
          ${authAreaHtml()}
          <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  `;

  // Mobile menu toggle — toggles .open on .site-header itself
  const header = document.getElementById("site-header");
  const toggle = document.getElementById("nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await logout();
      notify.success("You have been signed out.");
      setTimeout(() => (window.location.href = `${BASE}/index.html`), 400);
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