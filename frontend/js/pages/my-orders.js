/**
 * My Orders page
 * ===============
 */

import { api } from "../api.js";
import { isLoggedIn } from "../auth.js";
import { showLoading, showError, showEmpty, notify } from "../ui.js";
import { orderCard } from "../components/order-card.js";

export async function initMyOrders() {
  const host = document.getElementById("my-orders");
  if (!host) return;

  if (!isLoggedIn()) {
    notify.info("Please sign in to view your orders.");
    setTimeout(() => window.location.href = "/pages/auth/login.html?next=/pages/shop/my-orders.html", 600);
    return;
  }

  showLoading(host, "Loading your orders…");

  try {
    const res = await api.get("/orders?page_size=50");
    const orders = res.items || [];

    if (!orders.length) {
      host.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <div class="empty-state-title">No orders yet</div>
          <p class="empty-state-text">Your order history will appear here once you make a purchase.</p>
          <a href="/pages/shop/shop.html" class="btn btn-primary" style="margin-top: var(--sp-6);">Browse shop</a>
        </div>
      `;
      return;
    }

    host.innerHTML = `
      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));">
        ${orders.map(orderCard).join("")}
      </div>
    `;
  } catch (err) {
    showError(host, "Unable to load orders. " + err.message);
  }
}
