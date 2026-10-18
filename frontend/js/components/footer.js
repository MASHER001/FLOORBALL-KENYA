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
            <img src="/FloorballKenya/frontend/assets/img/logo/image.png" alt=""
                 onerror="this.style.display='none'" />
            <span>Floorball<span class="brand-accent">Kenya</span></span>
          </div>
          <p class="footer-tagline">
            The official platform for floorball in Kenya — leagues, teams, players,
            tournaments, and a marketplace built for the community.
          </p>
        </div>

        <div class="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><a href="${CONFIG.ROUTES.LEAGUES}">Leagues</a></li>
            <li><a href="${CONFIG.ROUTES.TOURNAMENTS}">Tournaments</a></li>
            <li><a href="${CONFIG.ROUTES.TEAMS}">Teams</a></li>
            <li><a href="${CONFIG.ROUTES.PLAYERS}">Players</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Marketplace</h4>
          <ul>
            <li><a href="${CONFIG.ROUTES.SHOP}">Shop</a></li>
            <li><a href="${CONFIG.ROUTES.CART}">Cart</a></li>
            <li><a href="${CONFIG.ROUTES.MY_ORDERS}">My Orders</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Company</h4>
          <ul>
          <li><a href="${CONFIG.ROUTES.GALLERY}">Gallery</a></li>
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