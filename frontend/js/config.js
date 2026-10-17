/**
 * Global configuration
 * =====================
 */

export const CONFIG = {
  API_URL: "http://127.0.0.1:8000/api/v1",

  STORAGE_KEYS: {
    TOKEN:        "fk_access_token",
    REFRESH:      "fk_refresh_token",
    USER:         "fk_user",
    CART_GUEST:   "fk_guest_cart",
  },

  ROUTES: {
    HOME:              "/index.html",
    LOGIN:             "/pages/auth/login.html",
    REGISTER:          "/pages/auth/register.html",
    LEAGUES:           "/pages/sports/leagues.html",
    TOURNAMENTS:       "/pages/sports/tournaments.html",
    TEAMS:             "/pages/sports/teams.html",
    PLAYERS:           "/pages/sports/players.html",
    MATCHES:           "/pages/sports/matches.html",
    SHOP:              "/pages/shop/shop.html",
    CART:              "/pages/shop/cart.html",
    CHECKOUT:          "/pages/shop/checkout.html",
    MY_ORDERS:         "/pages/shop/my-orders.html",
    NEWS:              "/pages/public/news.html",
    ABOUT:             "/pages/public/about.html",
    CONTACT:           "/pages/public/contact.html",

    DASHBOARD_PLAYER:  "/pages/dashboard/player.html",
    DASHBOARD_MANAGER: "/pages/dashboard/team-manager.html",
    DASHBOARD_VENDOR:  "/pages/dashboard/vendor.html",
    DASHBOARD_ADMIN:   "/pages/dashboard/admin.html",
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