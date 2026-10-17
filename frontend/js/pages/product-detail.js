/**
 * Product detail page
 * ====================
 */

import { api } from "../api.js";
import {
  escapeHtml, formatKES, qs,
  showLoading, showError, notify,
} from "../ui.js";
import { cart } from "../cart.js";
import { isLoggedIn } from "../auth.js";

let PRODUCT = null;

export async function initProductDetail() {
  const host = document.getElementById("product-detail");
  if (!host) return;

  const id = qs("id");
  if (!id) {
    showError(host, "No product specified.");
    return;
  }

  showLoading(host, "Loading product…");

  try {
    PRODUCT = await api.get(`/products/${encodeURIComponent(id)}`);
    document.title = `${PRODUCT.name} — FloorballKenya`;
    render();
    wireAddToCart();
  } catch (err) {
    showError(host, "Unable to load product. " + err.message);
  }
}

function render() {
  const host = document.getElementById("product-detail");
  const images = Array.isArray(PRODUCT.image_urls) && PRODUCT.image_urls.length
    ? PRODUCT.image_urls
    : ["/assets/img/placeholder/product.svg"];
  const inStock = (PRODUCT.stock ?? 0) > 0;
  const vendorName = PRODUCT.vendors?.business_name || "Vendor";

  host.innerHTML = `
    <div class="container" style="padding-top: var(--sp-8);">
      <div class="breadcrumbs">
        <a href="/index.html">Home</a> <span>/</span>
        <a href="/pages/shop/shop.html">Shop</a> <span>/</span>
        <span>${escapeHtml(PRODUCT.name)}</span>
      </div>

      <div class="grid grid-2" style="gap: var(--sp-10); margin-top: var(--sp-6); align-items: start;">
        <div>
          <div class="card" style="overflow:hidden;">
            <img id="main-image" src="${escapeHtml(images[0])}"
                 alt="${escapeHtml(PRODUCT.name)}"
                 style="width:100%; aspect-ratio:1; object-fit:cover; background: var(--fk-gray-100);"
                 onerror="this.src='/assets/img/placeholder/product.svg';" />
          </div>
          ${images.length > 1 ? `
            <div class="flex gap-3 mt-4 flex-wrap">
              ${images.map((src, i) => `
                <button class="thumb-btn" data-src="${escapeHtml(src)}"
                        style="width:72px;height:72px;padding:0;border:2px solid ${i === 0 ? "var(--fk-green)" : "var(--fk-gray-200)"};border-radius: var(--radius-md);overflow:hidden;cursor:pointer;background:none;">
                  <img src="${escapeHtml(src)}" alt="" style="width:100%;height:100%;object-fit:cover;" />
                </button>
              `).join("")}
            </div>
          ` : ""}
        </div>

        <div>
          <div style="font-size: var(--fs-xs); color: var(--fk-gray-500); text-transform: uppercase; letter-spacing: var(--ls-wide); margin-bottom: var(--sp-2);">
            ${escapeHtml(vendorName)}
          </div>
          <h1 style="margin-bottom: var(--sp-4);">${escapeHtml(PRODUCT.name)}</h1>

          <div style="font-family: var(--fk-font-display); font-size: var(--fs-4xl); font-weight: 800; color: var(--fk-green); margin-bottom: var(--sp-6);">
            ${formatKES(PRODUCT.price)}
          </div>

          ${inStock
            ? `<span class="badge badge-green">In stock (${PRODUCT.stock})</span>`
            : `<span class="badge badge-red">Out of stock</span>`}

          <div style="margin-top: var(--sp-6); margin-bottom: var(--sp-6);">
            <p>${escapeHtml(PRODUCT.description || "No description available.")}</p>
          </div>

          <div class="flex gap-4 flex-wrap" style="align-items:center;">
            <div class="flex gap-2" style="align-items:center; border: 1.5px solid var(--fk-gray-300); border-radius: var(--radius-md); padding: var(--sp-1);">
              <button id="qty-minus" class="btn btn-ghost btn-sm" ${!inStock ? "disabled" : ""}>−</button>
              <input id="qty-input" type="number" value="1" min="1" max="${PRODUCT.stock || 1}"
                     style="width:50px;text-align:center;border:none;background:none;font-weight:600;" ${!inStock ? "disabled" : ""} />
              <button id="qty-plus" class="btn btn-ghost btn-sm" ${!inStock ? "disabled" : ""}>+</button>
            </div>

            <button id="add-to-cart-btn" class="btn btn-primary btn-lg" ${!inStock ? "disabled" : ""}>
              ${inStock ? "Add to cart" : "Out of stock"}
            </button>
          </div>

          <div class="divider" style="margin-top: var(--sp-8);"></div>

          <div class="grid grid-2" style="gap: var(--sp-4); font-size: var(--fs-sm); color: var(--fk-gray-600);">
            <div>🚚 Delivery across Kenya</div>
            <div>🔒 Secure M-Pesa checkout</div>
            <div>↩️ 7-day returns</div>
            <div>✅ Verified vendor</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Quantity controls
  const qtyInput = document.getElementById("qty-input");
  document.getElementById("qty-minus")?.addEventListener("click", () => {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
  });
  document.getElementById("qty-plus")?.addEventListener("click", () => {
    qtyInput.value = Math.min(PRODUCT.stock || 1, parseInt(qtyInput.value) + 1);
  });

  // Image thumbnails
  document.querySelectorAll(".thumb-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("main-image").src = btn.dataset.src;
      document.querySelectorAll(".thumb-btn").forEach((b) => b.style.borderColor = "var(--fk-gray-200)");
      btn.style.borderColor = "var(--fk-green)";
    });
  });
}

function wireAddToCart() {
  const btn = document.getElementById("add-to-cart-btn");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const qty = parseInt(document.getElementById("qty-input").value);
    btn.disabled = true;
    btn.textContent = "Adding…";
    try {
      await cart.add(PRODUCT.id, qty);
      notify.success(`Added ${qty} to cart`);
      // Refresh navbar count if guest
      window.dispatchEvent(new CustomEvent("cart:changed"));
    } catch (err) {
      notify.error("Could not add to cart: " + err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = "Add to cart";
    }
  });
}
