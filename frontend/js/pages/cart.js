/**
 * Cart page
 * ==========
 * Works for both guests (localStorage) and logged-in users (backend).
 */

import {
  escapeHtml, formatKES,
  showLoading, showError, showEmpty, notify,
} from "../ui.js";
import { cart } from "../cart.js";

export async function initCart() {
  const host = document.getElementById("cart-content");
  if (!host) return;

  await loadCart();
  window.addEventListener("cart:changed", loadCart);
}

async function loadCart() {
  const host = document.getElementById("cart-content");
  if (!host) return;

  showLoading(host, "Loading cart…");

  try {
    const data = await cart.get();
    const items = data.items || [];

    if (!items.length) {
      host.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <div class="empty-state-title">Your cart is empty</div>
          <p class="empty-state-text">Browse the shop and add products to get started.</p>
          <a href="/pages/shop/shop.html" class="btn btn-primary" style="margin-top: var(--sp-6);">Browse shop</a>
        </div>
      `;
      return;
    }

    host.innerHTML = `
      <div class="cart-layout">
        <div>
          <div class="grid" style="gap: var(--sp-4);">
            ${items.map(cartItem).join("")}
          </div>
          <div class="flex-between mt-6">
            <a href="/pages/shop/shop.html" class="btn btn-ghost">← Continue shopping</a>
            <button id="clear-cart-btn" class="btn btn-ghost" style="color: var(--fk-red);">Clear cart</button>
          </div>
        </div>

        <div class="cart-summary">
          <h3 style="margin-bottom: var(--sp-4);">Order summary</h3>
          <div class="summary-row">
            <span>Items</span>
            <span>${data.item_count}</span>
          </div>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>${formatKES(data.subtotal)}</span>
          </div>
          <div class="summary-row">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span class="value">${formatKES(data.subtotal)}</span>
          </div>
          <a href="/pages/shop/checkout.html" class="btn btn-primary btn-lg btn-full mt-6">
            Proceed to checkout
          </a>
        </div>
      </div>
    `;

    wireActions();
  } catch (err) {
    showError(host, "Unable to load cart. " + err.message);
  }
}

function cartItem(item) {
  // item shape from backend: {id, product_id, quantity}
  // item shape from guest:   {id: "local-...", product_id, quantity, product: {...}}
  const p = item.product || null;
  const name = p?.name || "Product";
  const price = p?.price || 0;
  const image = (Array.isArray(p?.image_urls) && p.image_urls[0]) || "/assets/img/placeholder/product.svg";
  const subtotal = price * item.quantity;

  return `
    <div class="cart-item" data-item-id="${escapeHtml(item.id)}" data-product-id="${escapeHtml(item.product_id)}">
      <img class="cart-item-image" src="${escapeHtml(image)}" alt=""
           onerror="this.src='/assets/img/placeholder/product.svg';" />

      <div>
        <a href="/pages/shop/product-detail.html?id=${encodeURIComponent(item.product_id)}"
           style="font-weight: var(--fw-semibold); color: var(--fk-black); display: block; margin-bottom: var(--sp-2);">
          ${escapeHtml(name)}
        </a>
        <div style="color: var(--fk-gray-500); font-size: var(--fs-sm); margin-bottom: var(--sp-3);">
          ${formatKES(price)} each
        </div>

        <div class="flex gap-2" style="align-items:center;">
          <button class="btn btn-secondary btn-sm qty-minus">−</button>
          <input type="number" class="qty-input" value="${item.quantity}" min="1"
                 style="width:56px;text-align:center;padding: var(--sp-2);border:1.5px solid var(--fk-gray-300);border-radius: var(--radius-sm);" />
          <button class="btn btn-secondary btn-sm qty-plus">+</button>
          <button class="btn btn-ghost btn-sm remove-item" style="color: var(--fk-red);">Remove</button>
        </div>
      </div>

      <div style="font-family: var(--fk-font-display); font-weight: 700; font-size: var(--fs-lg); color: var(--fk-green); text-align: right;">
        ${formatKES(subtotal)}
      </div>
    </div>
  `;
}

function wireActions() {
  const host = document.getElementById("cart-content");

  // Quantity change
  host.querySelectorAll(".cart-item").forEach((el) => {
    const itemId = el.dataset.itemId;
    const qtyInput = el.querySelector(".qty-input");

    el.querySelector(".qty-minus")?.addEventListener("click", () => {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
      changeQty(itemId, parseInt(qtyInput.value));
    });

    el.querySelector(".qty-plus")?.addEventListener("click", () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
      changeQty(itemId, parseInt(qtyInput.value));
    });

    qtyInput?.addEventListener("change", () => {
      changeQty(itemId, Math.max(1, parseInt(qtyInput.value)));
    });

    el.querySelector(".remove-item")?.addEventListener("click", () => {
      removeItem(itemId);
    });
  });

  // Clear cart
  document.getElementById("clear-cart-btn")?.addEventListener("click", async () => {
    if (!confirm("Clear your entire cart?")) return;
    try {
      await cart.clear();
      notify.success("Cart cleared");
    } catch (err) {
      notify.error("Could not clear cart: " + err.message);
    }
  });
}

async function changeQty(itemId, qty) {
  try {
    await cart.update(itemId, qty);
    loadCart();
  } catch (err) {
    notify.error("Could not update quantity: " + err.message);
  }
}

async function removeItem(itemId) {
  try {
    await cart.remove(itemId);
    notify.success("Item removed");
    loadCart();
  } catch (err) {
    notify.error("Could not remove item: " + err.message);
  }
}
