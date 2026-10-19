/**
 * Navbar component
 * ================
 * Renders the site navigation into <header id="navbar"></header>.
 */

import { CONFIG, dashboardFor, BASE } from "../config.js";
import { getSession, isLoggedIn, logout } from "../auth.js";
import { escapeHtml, notify } from "../ui.js";

const NAV_LINKS = [
  { label: "Home",        href: `${BASE}/index.html` },
  { label: "Leagues",     href: `${BASE}/pages/sports/leagues.html` },
  { label: "Tournaments", href: `${BASE}/pages/sports/tournaments.html` },
  { label: "Marketplace", href: `${BASE}/pages/shop/shop.html` },
  { label: "Teams",       href: `${BASE}/pages/sports/teams.html` },
  { label: "Gallery",     href: `${BASE}/pages/public/gallery.html` },
  { label: "About",       href: `${BASE}/pages/public/about.html` },
];

/** Are we currently on the page pointed to by `href`? */
function isActive(href) {
  const path = window.location.pathname;
  if (path === href) return true;
  if (href.endsWith("/index.html") && (path === "/" || path.endsWith("/index.html"))) {
    return true;
  }
  return false;
}

/** Read cart count if logged in */
async function getCartCount() {
  if (!isLoggedIn()) return 0;
  // TODO: re-enable when /api/v1/cart is implemented
  return 0;
}

function navLinksHtml() {
  return NAV_LINKS.map(
    (l) => `<a href="${l.href}"${isActive(l.href) ? ' class="active"' : ""}>${escapeHtml(l.label)}</a>`
  ).join("");
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
        ${escapeHtml(displayName)}
      </a>
      <button type="button" class="logout-btn" id="logout-btn">Logout</button>
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
    <div class="nav-inner">
      <a href="${BASE}/index.html" class="brand" aria-label="FloorballKenya home">
        <img src="${BASE}/assets/img/logo/image.png" alt="FloorballKenya" onerror="this.style.display='none'" />
        <span>Floorball<span class="brand-accent">Kenya</span></span>
      </a>
      <nav class="site-nav">${navLinksHtml()}</nav>
      <div class="header-actions">${authAreaHtml()}</div>
    </div>
  `;

  // Logout handler
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await logout();
      notify.success("Logged out");
      setTimeout(() => (window.location.href = `${BASE}/index.html`), 400);
    });
  }
}