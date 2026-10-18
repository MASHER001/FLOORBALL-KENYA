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
  HOME:              "/FloorballKenya/frontend/index.html",
  LOGIN:             "/FloorballKenya/frontend/pages/auth/login.html",
  REGISTER:          "/FloorballKenya/frontend/pages/auth/register.html",
  LEAGUES:           "/FloorballKenya/frontend/pages/sports/leagues.html",
  TOURNAMENTS:       "/FloorballKenya/frontend/pages/sports/tournaments.html",
  TEAMS:             "/FloorballKenya/frontend/pages/sports/teams.html",
  PLAYERS:           "/FloorballKenya/frontend/pages/sports/players.html",
  MATCHES:           "/FloorballKenya/frontend/pages/sports/matches.html",
  SHOP:              "/FloorballKenya/frontend/pages/shop/shop.html",
  CART:              "/FloorballKenya/frontend/pages/shop/cart.html",
  CHECKOUT:          "/FloorballKenya/frontend/pages/shop/checkout.html",
  MY_ORDERS:         "/FloorballKenya/frontend/pages/shop/my-orders.html",
  NEWS:              "/FloorballKenya/frontend/pages/public/news.html",
  GALLERY:           "/FloorballKenya/frontend/pages/public/gallery.html",
  ABOUT:             "/FloorballKenya/frontend/pages/public/about.html",
  CONTACT:           "/FloorballKenya/frontend/pages/public/contact.html",
  DASHBOARD_PLAYER:  "/FloorballKenya/frontend/pages/dashboard/player.html",
  DASHBOARD_MANAGER: "/FloorballKenya/frontend/pages/dashboard/team-manager.html",
  DASHBOARD_VENDOR:  "/FloorballKenya/frontend/pages/dashboard/vendor.html",
  DASHBOARD_ADMIN:   "/FloorballKenya/frontend/pages/dashboard/admin.html",
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