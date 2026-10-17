/**
 * Order confirmation / order detail page
 * ======================================
 */

import { api } from "../api.js";
import {
  escapeHtml, formatKES, formatDateTime, qs,
  showLoading, showError,
} from "../ui.js";
import { statusBadge } from "../utils.js";

export async function initOrderConfirmation() {
  const host = document.getElementById("order-confirmation");
  if (!host) return;

  const id = qs("id");
  if (!id) {
    showError(host, "No order specified.");
    return;
  }

  showLoading(host, "Loading order...");

  try {
    const order = await api.get("/orders/" + encodeURIComponent(id));
    document.title = "Order #" + order.id.slice(0, 8).toUpperCase() + " — FloorballKenya";
    render(host, order);
  } catch (err) {
    showError(host, "Unable to load order. " + err.message);
  }
}

function render(host, order) {
  const items = order.items || [];
  const isPaid = ["paid", "processing", "shipped", "delivered", "completed"].includes(order.status);
  const orderShort = order.id.slice(0, 8).toUpperCase();

  let itemsHtml = "";
  if (items.length) {
    let rows = "";
    for (const it of items) {
      rows +=
        '<div class="flex-between gap-3" style="padding: var(--sp-3) 0; border-bottom: 1px solid var(--fk-gray-100);">' +
          '<div>' +
            '<div style="font-weight: var(--fw-medium);">' + escapeHtml(it.product_name) + '</div>' +
            '<div style="color: var(--fk-gray-500); font-size: var(--fs-xs);">' +
              it.quantity + " x " + formatKES(it.unit_price) +
            '</div>' +
          '</div>' +
          '<div style="font-weight: var(--fw-semibold);">' + formatKES(it.subtotal) + '</div>' +
        '</div>';
    }
    itemsHtml =
      '<div class="card" style="text-align: left; margin-bottom: var(--sp-6);">' +
        '<div class="card-header"><h3 style="margin: 0;">Items</h3></div>' +
        '<div class="card-body">' + rows + '</div>' +
      '</div>';
  }

  const payNowHtml = !isPaid
    ? '<a href="/pages/shop/payment.html?order=' + encodeURIComponent(order.id) + '" class="btn btn-primary">Pay now</a>'
    : "";

  host.innerHTML =
    '<div class="container" style="max-width: 720px; padding-top: var(--sp-10);">' +
      '<div class="confirmation-card">' +
        '<div class="confirmation-icon ' + (isPaid ? "" : "error") + '">' +
          (isPaid ? "✓" : "!") +
        '</div>' +
        '<h1 style="margin-bottom: var(--sp-3);">' +
          (isPaid ? "Thank you for your order!" : "Order received") +
        '</h1>' +
        '<p class="text-muted" style="margin-bottom: var(--sp-6);">' +
          (isPaid
            ? "Your payment has been received and your order is being processed."
            : "We have received your order. Complete payment to begin processing.") +
        '</p>' +

        '<div class="card" style="text-align: left; margin-bottom: var(--sp-6);">' +
          '<div class="card-body">' +
            '<div class="flex-between flex-wrap gap-3" style="margin-bottom: var(--sp-4);">' +
              '<div>' +
                '<div style="font-size: var(--fs-xs); color: var(--fk-gray-500); text-transform: uppercase; letter-spacing: var(--ls-wide);">Order</div>' +
                '<div style="font-family: var(--fk-font-mono); font-weight: var(--fw-semibold);">#' + escapeHtml(orderShort) + '</div>' +
              '</div>' +
              '<span class="badge ' + statusBadge(order.status) + '">' + escapeHtml(order.status) + '</span>' +
            '</div>' +
            '<div class="grid grid-2" style="gap: var(--sp-4); font-size: var(--fs-sm);">' +
              '<div><div style="color: var(--fk-gray-500); font-size: var(--fs-xs);">Date</div><div>' + formatDateTime(order.created_at) + '</div></div>' +
              '<div><div style="color: var(--fk-gray-500); font-size: var(--fs-xs);">Delivery phone</div><div>' + escapeHtml(order.delivery_phone || "—") + '</div></div>' +
              '<div style="grid-column: 1 / -1;"><div style="color: var(--fk-gray-500); font-size: var(--fs-xs);">Delivery address</div><div>' + escapeHtml(order.delivery_address || "—") + '</div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        itemsHtml +

        '<div class="card" style="text-align: left; margin-bottom: var(--sp-6);">' +
          '<div class="card-body">' +
            '<div class="summary-row"><span>Subtotal</span><span>' + formatKES(order.subtotal) + '</span></div>' +
            '<div class="summary-row"><span>Delivery</span><span>' + formatKES(order.delivery_fee || 0) + '</span></div>' +
            '<div class="summary-row total"><span>Total</span><span class="value">' + formatKES(order.total) + '</span></div>' +
          '</div>' +
        '</div>' +

        '<div class="flex-center gap-3 flex-wrap">' +
          payNowHtml +
          '<a href="/pages/shop/my-orders.html" class="btn btn-secondary">My orders</a>' +
          '<a href="/pages/shop/shop.html" class="btn btn-ghost">Continue shopping</a>' +
        '</div>' +
      '</div>' +
    '</div>';
}