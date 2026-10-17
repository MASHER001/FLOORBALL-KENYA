/**
 * Shop page — product grid with filters.
 */

import { api } from "../api.js";
import {
  escapeHtml, debounce, qs,
  showLoading, showError, showEmpty, notify,
} from "../ui.js";
import { productCard, wireAddToCart } from "../components/product-card.js";
import { isLoggedIn } from "../auth.js";
import { cart } from "../cart.js";

let STATE = {
  page: 1,
  pageSize: 24,
  q: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  inStock: false,
};

export async function initShop() {
  const el = document.getElementById("shop-grid");
  if (!el) return;

  // Read from URL
  const q = qs("q");
  const cat = qs("category");
  if (q) STATE.q = q;
  if (cat) STATE.categoryId = cat;

  // Populate category dropdown
  await loadCategories();

  // Wire search
  const search = document.getElementById("shop-search");
  if (search) {
    search.value = STATE.q;
    search.addEventListener("input", debounce((e) => {
      STATE.q = e.target.value.trim();
      STATE.page = 1;
      loadProducts();
    }, 300));
  }

  // Wire category filter
  const catFilter = document.getElementById("shop-category");
  if (catFilter) {
    catFilter.value = STATE.categoryId;
    catFilter.addEventListener("change", (e) => {
      STATE.categoryId = e.target.value;
      STATE.page = 1;
      loadProducts();
    });
  }

  // Wire price filters
  const minPrice = document.getElementById("shop-min-price");
  const maxPrice = document.getElementById("shop-max-price");
  if (minPrice) minPrice.addEventListener("input", debounce((e) => {
    STATE.minPrice = e.target.value;
    STATE.page = 1;
    loadProducts();
  }, 400));
  if (maxPrice) maxPrice.addEventListener("input", debounce((e) => {
    STATE.maxPrice = e.target.value;
    STATE.page = 1;
    loadProducts();
  }, 400));

  // Wire in-stock toggle
  const inStockToggle = document.getElementById("shop-in-stock");
  if (inStockToggle) {
    inStockToggle.addEventListener("change", (e) => {
      STATE.inStock = e.target.checked;
      STATE.page = 1;
      loadProducts();
    });
  }

  loadProducts();
}

async function loadCategories() {
  const el = document.getElementById("shop-category");
  if (!el) return;
  try {
    const cats = await api.get("/products/categories");
    el.innerHTML = `<option value="">All categories</option>` +
      (cats || []).map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("");
  } catch {
    el.innerHTML = `<option value="">All categories</option>`;
  }
}

async function loadProducts() {
  const el = document.getElementById("shop-grid");
  showLoading(el, "Loading products…");

  try {
    const params = new URLSearchParams();
    params.set("page", STATE.page);
    params.set("page_size", STATE.pageSize);
    if (STATE.q) params.set("q", STATE.q);
    if (STATE.categoryId) params.set("category_id", STATE.categoryId);
    if (STATE.minPrice) params.set("min_price", STATE.minPrice);
    if (STATE.maxPrice) params.set("max_price", STATE.maxPrice);
    if (STATE.inStock) params.set("in_stock", "true");

    const res = await api.get(`/products?${params}`);
    const products = res.items || [];

    if (!products.length) {
      showEmpty(el, {
        title: "No products found",
        text: STATE.q ? `No results for "${STATE.q}".` : "Products will appear here soon.",
      });
      return;
    }

    el.innerHTML = `<div class="grid grid-4">${products.map(productCard).join("")}</div>`;
    wireAddToCart(el, handleAddToCart);
    renderPagination(res.total || 0);
  } catch (err) {
    showError(el, "Unable to load products. " + err.message);
  }
}

async function handleAddToCart(productId) {
  try {
    if (isLoggedIn()) {
      await api.post("/cart/items", { product_id: productId, quantity: 1 });
    } else {
      cart.addLocal(productId, 1);
    }
    notify.success("Added to cart");
    updateCartBadge();
  } catch (err) {
    notify.error("Could not add to cart: " + err.message);
  }
}

function updateCartBadge() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  const count = isLoggedIn() ? null : cart.countLocal();
  if (count !== null) {
    el.textContent = String(count);
    el.style.display = count > 0 ? "" : "none";
  }
}

function renderPagination(total) {
  const pages = Math.ceil(total / STATE.pageSize);
  if (pages <= 1) return;
  const container = document.getElementById("shop-pagination");
  if (!container) return;

  container.innerHTML = `
    <div class="pagination">
      <button ${STATE.page <= 1 ? "disabled" : ""} data-page="${STATE.page - 1}">‹</button>
      ${Array.from({ length: pages }, (_, i) => i + 1).map((p) => `
        <button class="${p === STATE.page ? "active" : ""}" data-page="${p}">${p}</button>
      `).join("")}
      <button ${STATE.page >= pages ? "disabled" : ""} data-page="${STATE.page + 1}">›</button>
    </div>
  `;

  container.querySelectorAll("button[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      STATE.page = parseInt(btn.dataset.page);
      loadProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}
