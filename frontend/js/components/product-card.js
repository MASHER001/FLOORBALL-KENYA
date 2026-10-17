/**
 * Product card — reusable markup for the marketplace.
 */

import { escapeHtml, formatKES } from "../ui.js";

export function productCard(product) {
  const image = Array.isArray(product.image_urls) && product.image_urls.length
    ? product.image_urls[0]
    : "/assets/img/placeholder/product.png";
  const inStock = (product.stock ?? 0) > 0;

  return `
    <div class="product-card">
      <a href="/pages/shop/product-detail.html?id=${encodeURIComponent(product.id)}"
         class="product-image">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" loading="lazy"
             onerror="this.src='/assets/img/placeholder/product.png';" />
        ${!inStock ? '<span class="badge badge-red product-badge">Out of stock</span>' : ""}
      </a>
      <div class="product-body">
        <a href="/pages/shop/product-detail.html?id=${encodeURIComponent(product.id)}"
           class="product-name">
          ${escapeHtml(product.name)}
        </a>
        <div class="product-price">
          <span class="currency">KSh</span>${formatKES(product.price).replace("KSh ", "").replace("KSh","")}
        </div>
      </div>
      <div class="product-actions">
        <button type="button"
                class="btn btn-primary btn-sm btn-full add-to-cart"
                data-product-id="${escapeHtml(product.id)}"
                ${!inStock ? "disabled" : ""}>
          ${inStock ? "Add to cart" : "Unavailable"}
        </button>
      </div>
    </div>
  `;
}

export function productCardGrid(products = []) {
  if (!products.length) return "";
  return `<div class="grid grid-4">${products.map(productCard).join("")}</div>`;
}

/**
 * Wire up "add to cart" buttons in a container.
 * Call this after injecting productCardGrid.
 */
export function wireAddToCart(container, onAdd) {
  if (!container) return;
  container.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.dataset.productId;
      if (id) onAdd(id);
    });
  });
}
