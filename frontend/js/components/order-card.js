/**
 * Order card — reusable markup for order listings.
 */

import { escapeHtml, formatKES, formatDateTime } from "../ui.js";
import { statusBadge } from "../utils.js";

export function orderCard(order) {
  const status = order.status || "pending";
  const date = formatDateTime(order.created_at);
  const itemCount = order.items ? order.items.length : (order.item_count || 0);

  return `
    <a href="/pages/shop/order-confirmation.html?id=${encodeURIComponent(order.id)}"
       class="card card-hover" style="display:block;">
      <div class="card-body">
        <div class="flex-between flex-wrap gap-3" style="margin-bottom: var(--sp-4);">
          <div>
            <div style="font-family: var(--fk-font-mono); font-size: var(--fs-xs); color: var(--fk-gray-500);">
              Order #${escapeHtml(order.id.slice(0, 8).toUpperCase())}
            </div>
            <div style="font-size: var(--fs-xs); color: var(--fk-gray-500); margin-top: 2px;">
              ${date}
            </div>
          </div>
          <span class="badge ${statusBadge(status)}">${escapeHtml(status)}</span>
        </div>

        <div class="flex-between flex-wrap gap-3">
          <div>
            <div style="font-weight: var(--fw-semibold); color: var(--fk-black);">
              ${itemCount} item${itemCount === 1 ? "" : "s"}
            </div>
            ${order.delivery_address ? `
              <div style="font-size: var(--fs-xs); color: var(--fk-gray-500); margin-top: 2px;">
                ${escapeHtml(order.delivery_address.slice(0, 60))}${order.delivery_address.length > 60 ? "…" : ""}
              </div>
            ` : ""}
          </div>
          <div style="font-family: var(--fk-font-display); font-size: var(--fs-xl); font-weight: 700; color: var(--fk-green);">
            ${formatKES(order.total)}
          </div>
        </div>
      </div>
    </a>
  `;
}