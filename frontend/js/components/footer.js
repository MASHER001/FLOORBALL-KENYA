/**
 * Footer component
 * ================
 * Renders into <footer id="footer"></footer>.
 */

import { CONFIG } from "../config.js";

export function renderFooter() {
  const host = document.getElementById("footer");
  if (!host) return;

  const year = new Date().getFullYear();

  host.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <img src="/assets/img/logo/logo.svg" alt=""
                 onerror="this.style.display='none'" />
            <span>Floorball<span class="brand-accent">Kenya</span></span>
          </div>
          <p style="color: var(--fk-gray-400); font-size: var(--fs-sm); max-width: 360px;">
            The official platform for floorball in Kenya — leagues, teams, players,
            tournaments, and a marketplace built for the community.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <ul style="display:grid; gap: var(--sp-2); font-size: var(--fs-sm);">
            <li><a href="${CONFIG.ROUTES.LEAGUES}">Leagues</a></li>
            <li><a href="${CONFIG.ROUTES.TOURNAMENTS}">Tournaments</a></li>
            <li><a href="${CONFIG.ROUTES.TEAMS}">Teams</a></li>
            <li><a href="${CONFIG.ROUTES.PLAYERS}">Players</a></li>
          </ul>
        </div>

        <div>
          <h4>Marketplace</h4>
          <ul style="display:grid; gap: var(--sp-2); font-size: var(--fs-sm);">
            <li><a href="${CONFIG.ROUTES.SHOP}">Shop</a></li>
            <li><a href="${CONFIG.ROUTES.CART}">Cart</a></li>
            <li><a href="${CONFIG.ROUTES.MY_ORDERS}">My Orders</a></li>
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul style="display:grid; gap: var(--sp-2); font-size: var(--fs-sm);">
            <li><a href="${CONFIG.ROUTES.ABOUT}">About</a></li>
            <li><a href="${CONFIG.ROUTES.CONTACT}">Contact</a></li>
            <li><a href="${CONFIG.ROUTES.NEWS}">News</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        © ${year} FloorballKenya. All rights reserved.
      </div>
    </div>
  `;
}