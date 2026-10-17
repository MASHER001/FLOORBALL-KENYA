/**
 * Cart helpers
 * ============
 * Guest users: cart is stored in localStorage.
 * Logged-in users: cart is stored in the backend.
 *
 * The UI can call both transparently.
 */

import { api } from "./api.js";
import { CONFIG } from "./config.js";
import { isLoggedIn } from "./auth.js";

const KEY = CONFIG.STORAGE_KEYS.CART_GUEST;

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function writeLocal(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
  // Notify listeners (e.g. navbar badge)
  window.dispatchEvent(new CustomEvent("cart:changed"));
}

export const cart = {
  // ---------- Guest (localStorage) ----------
  addLocal(productId, qty = 1) {
    const c = readLocal();
    c[productId] = (c[productId] || 0) + qty;
    writeLocal(c);
  },

  removeLocal(productId) {
    const c = readLocal();
    delete c[productId];
    writeLocal(c);
  },

  updateLocal(productId, qty) {
    const c = readLocal();
    if (qty <= 0) delete c[productId];
    else c[productId] = qty;
    writeLocal(c);
  },

  getLocal() {
    return readLocal();
  },

  countLocal() {
    return Object.values(readLocal()).reduce((s, n) => s + n, 0);
  },

  clearLocal() {
    writeLocal({});
  },

  // ---------- Logged-in (backend) ----------
  async getRemote() {
    return api.get("/cart");
  },

  async addRemote(productId, qty = 1) {
    const res = await api.post("/cart/items", { product_id: productId, quantity: qty });
    window.dispatchEvent(new CustomEvent("cart:changed"));
    return res;
  },

  async updateRemote(itemId, qty) {
    const res = await api.patch(`/cart/items/${itemId}`, { quantity: qty });
    window.dispatchEvent(new CustomEvent("cart:changed"));
    return res;
  },

  async removeRemote(itemId) {
    const res = await api.delete(`/cart/items/${itemId}`);
    window.dispatchEvent(new CustomEvent("cart:changed"));
    return res;
  },

  async clearRemote() {
    const res = await api.delete("/cart");
    window.dispatchEvent(new CustomEvent("cart:changed"));
    return res;
  },

  // ---------- Unified interface ----------
  async get() {
    if (!isLoggedIn()) {
      // Guest cart: {product_id: qty}
      const local = readLocal();
      const productIds = Object.keys(local);
      if (!productIds.length) {
        return { items: [], subtotal: 0, item_count: 0 };
      }
      // Fetch product details
      const res = await api.get(`/products?page_size=100`);
      const products = (res.items || []).filter((p) => productIds.includes(p.id));
      const items = products.map((p) => ({
        id: `local-${p.id}`,
        product_id: p.id,
        quantity: local[p.id],
        product: p,
      }));
      const subtotal = items.reduce((s, it) => s + it.product.price * it.quantity, 0);
      const item_count = items.reduce((s, it) => s + it.quantity, 0);
      return { items, subtotal, item_count };
    }
    return cart.getRemote();
  },

  async add(productId, qty = 1) {
    if (isLoggedIn()) return cart.addRemote(productId, qty);
    cart.addLocal(productId, qty);
    return { success: true };
  },

  async update(itemId, qty) {
    if (isLoggedIn()) return cart.updateRemote(itemId, qty);
    const localId = itemId.replace(/^local-/, "");
    cart.updateLocal(localId, qty);
    return { success: true };
  },

  async remove(itemId) {
    if (isLoggedIn()) return cart.removeRemote(itemId);
    const localId = itemId.replace(/^local-/, "");
    cart.removeLocal(localId);
    return { success: true };
  },

  async clear() {
    if (isLoggedIn()) return cart.clearRemote();
    cart.clearLocal();
    return { success: true };
  },
};
