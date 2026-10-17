/**
 * Checkout page
 * ==============
 */

import { api } from "../api.js";
import { isLoggedIn, getSession } from "../auth.js";
import { cart } from "../cart.js";
import {
  escapeHtml, formatKES,
  showLoading, showError, notify,
} from "../ui.js";

export async function initCheckout() {
  const host = document.getElementById("checkout-content");
  if (!host) return;

  if (!isLoggedIn()) {
    notify.info("Please sign in to checkout.");
    setTimeout(() => {
      window.location.href = "/pages/auth/login.html";
    }, 600);
    return;
  }

  showLoading(host, "Loading checkout...");

  try {
    const data = await cart.get();
    const items = data.items || [];

    if (!items.length) {
      host.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state-icon">🛒</div>' +
          '<div class="empty-state-title">Your cart is empty</div>' +
          '<p class="empty-state-text">Add some products before checking out.</p>' +
          '<a href="/pages/shop/shop.html" class="btn btn-primary" style="margin-top: var(--sp-6);">Browse shop</a>' +
        '</div>';
      return;
    }

    const { user } = getSession();
    const defaultPhone = (user && user.phone) || "";

    let itemsHtml = "";
    for (const it of items) {
      const p = it.product || {};
      const price = p.price || 0;
      const lineTotal = price * it.quantity;
      itemsHtml +=
        '<div class="flex-between gap-3" style="padding: var(--sp-2) 0; font-size: var(--fs-sm);">' +
          '<div>' +
            '<div style="font-weight: var(--fw-medium);">' + escapeHtml(p.name || "Product") + '</div>' +
            '<div style="color: var(--fk-gray-500); font-size: var(--fs-xs);">' +
              it.quantity + " x " + formatKES(price) +
            '</div>' +
          '</div>' +
          '<div style="font-weight: var(--fw-semibold);">' + formatKES(lineTotal) + '</div>' +
        '</div>';
    }

    host.innerHTML =
      '<div class="cart-layout">' +
        '<div>' +
          '<div class="card">' +
            '<div class="card-header"><h3 style="margin: 0;">Delivery details</h3></div>' +
            '<div class="card-body">' +
              '<form id="checkout-form">' +
                '<div class="form-group">' +
                  '<label class="form-label" for="delivery_address">Delivery address <span class="required">*</span></label>' +
                  '<input type="text" id="delivery_address" name="delivery_address" class="form-control" required placeholder="Building, street, area, city" />' +
                '</div>' +
                '<div class="form-group">' +
                  '<label class="form-label" for="delivery_phone">Delivery phone <span class="required">*</span></label>' +
                  '<input type="tel" id="delivery_phone" name="delivery_phone" class="form-control" required value="' + escapeHtml(defaultPhone) + '" placeholder="0712345678" />' +
                  '<div class="form-help">M-Pesa payment will be requested on this number.</div>' +
                '</div>' +
                '<div class="form-group">' +
                  '<label class="form-label" for="notes">Notes (optional)</label>' +
                  '<textarea id="notes" name="notes" class="form-textarea" placeholder="Any special delivery instructions..."></textarea>' +
                '</div>' +
              '</form>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="cart-summary">' +
          '<h3 style="margin-bottom: var(--sp-4);">Order summary</h3>' +
          '<div style="max-height: 320px; overflow-y: auto; margin-bottom: var(--sp-4);">' +
            itemsHtml +
          '</div>' +
          '<div class="summary-row"><span>Subtotal</span><span>' + formatKES(data.subtotal) + '</span></div>' +
          '<div class="summary-row"><span>Delivery</span><span>Free</span></div>' +
          '<div class="summary-row total"><span>Total</span><span class="value">' + formatKES(data.subtotal) + '</span></div>' +
          '<button id="place-order-btn" class="btn btn-primary btn-lg btn-full mt-6">Place order and pay</button>' +
          '<div style="font-size: var(--fs-xs); color: var(--fk-gray-500); text-align: center; margin-top: var(--sp-3);">You will be redirected to M-Pesa payment.</div>' +
        '</div>' +
      '</div>';

    wireCheckout();
  } catch (err) {
    showError(host, "Unable to load checkout. " + err.message);
  }
}

function wireCheckout() {
  const btn = document.getElementById("place-order-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const form = document.getElementById("checkout-form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const address = String(data.get("delivery_address") || "").trim();
    const phone = String(data.get("delivery_phone") || "").trim();
    const notes = String(data.get("notes") || "").trim();

    if (address.length < 5) {
      notify.error("Please enter a valid delivery address.");
      return;
    }
    if (phone.length < 10) {
      notify.error("Please enter a valid phone number.");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Placing order...";

    try {
      const order = await api.post("/orders", {
        delivery_address: address,
        delivery_phone: phone,
        notes: notes || null,
      });
      notify.success("Order created! Proceeding to payment...");
      setTimeout(() => {
        window.location.href = "/pages/shop/payment.html?order=" + order.id;
      }, 600);
    } catch (err) {
      notify.error("Could not place order: " + err.message);
      btn.disabled = false;
      btn.textContent = "Place order and pay";
    }
  });
}