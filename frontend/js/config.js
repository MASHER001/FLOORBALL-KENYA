/**
 * Global configuration
 * =====================
 */

const HOST = location.hostname;
const IS_LOCAL = HOST === "localhost" || HOST === "127.0.0.1";

// Live Server serves from the parent folder, so local paths need this prefix.
// On Vercel the frontend folder is the site root, so no prefix is needed.
export const BASE = IS_LOCAL ? "/FloorballKenya/frontend" : "";

export const CONFIG = {
  API_URL: IS_LOCAL
    ? "http://127.0.0.1:8000/api/v1"
    : "https://floorball-kenya-e6j7.vercel.app/api/v1",

  STORAGE_KEYS: {
    TOKEN:        "fk_access_token",
    REFRESH:      "fk_refresh_token",
    USER:         "fk_user",
    CART_GUEST:   "fk_guest_cart",
  },

  ROUTES: {
    HOME:              `${BASE}/index.html`,
    LOGIN:             `${BASE}/pages/auth/login.html`,
    REGISTER:          `${BASE}/pages/auth/register.html`,
    LEAGUES:           `${BASE}/pages/sports/leagues.html`,
    TOURNAMENTS:       `${BASE}/pages/sports/tournaments.html`,
    TEAMS:             `${BASE}/pages/sports/teams.html`,
    PLAYERS:           `${BASE}/pages/sports/players.html`,
    MATCHES:           `${BASE}/pages/sports/matches.html`,
    SHOP:              `${BASE}/pages/shop/shop.html`,
    CART:              `${BASE}/pages/shop/cart.html`,
    CHECKOUT:          `${BASE}/pages/shop/checkout.html`,
    MY_ORDERS:         `${BASE}/pages/shop/my-orders.html`,
    NEWS:              `${BASE}/pages/public/news.html`,
    GALLERY:           `${BASE}/pages/public/gallery.html`,
    ABOUT:             `${BASE}/pages/public/about.html`,
    CONTACT:           `${BASE}/pages/public/contact.html`,
    DASHBOARD_PLAYER:  `${BASE}/pages/dashboard/player.html`,
    DASHBOARD_MANAGER: `${BASE}/pages/dashboard/team-manager.html`,
    DASHBOARD_VENDOR:  `${BASE}/pages/dashboard/vendor.html`,
    DASHBOARD_ADMIN:   `${BASE}/pages/dashboard/admin.html`,
  },

  CURRENCY: "KES",
};

/**
 * Return the correct dashboard route for a given role.
 * Used after login/register to redirect the user to their area.
 */
export function dashboardFor(role) {
  switch (role) {
    case "super_admin":
    case "admin":
      return CONFIG.ROUTES.DASHBOARD_ADMIN;
    case "team_manager":
      return CONFIG.ROUTES.DASHBOARD_MANAGER;
    case "vendor":
      return CONFIG.ROUTES.DASHBOARD_VENDOR;
    case "player":
      return CONFIG.ROUTES.DASHBOARD_PLAYER;
    default:
      return CONFIG.ROUTES.HOME;
  }
}