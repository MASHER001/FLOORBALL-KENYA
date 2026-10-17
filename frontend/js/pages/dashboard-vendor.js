/**
 * Vendor dashboard
 * =================
 * Sections: Overview, My Store, Products, Orders, Earnings
 */

import { api } from "../api.js";
import { getSession, requireRole } from "../auth.js";
import { CONFIG } from "../config.js";
import {
  escapeHtml, formatKES, formatDateTime,
  showLoading, showError, showEmpty,
} from "../ui.js";
import { statusBadge } from "../utils.js";

let USER = null;
let VENDOR = null;

export async function initVendorDashboard() {
  if (!requireRole(["vendor"], CONFIG.ROUTES.LOGIN)) return;

  const { user } = getSession();
  USER = user;

  renderShell();
  wireSidebar();

  // Load vendor profile once
  try {
    VENDOR = await api.get("/vendors/me");
  } catch {
    VENDOR = null;
  }

  switchSection("overview");
}

function renderShell() {
  const host = document.getElementById("dashboard-root");
  if (!host) return;

  host.innerHTML =
    '<div class="container">' +
      '<div class="dashboard">' +
        '<aside class="dashboard-sidebar">' +
          '<div style="padding: var(--sp-3) var(--sp-4); margin-bottom: var(--sp-3);">' +
            '<div style="font-size: var(--fs-xs); color: var(--fk-gray-500); text-transform: uppercase; letter-spacing: var(--ls-wide);">Vendor</div>' +
            '<div style="font-weight: var(--fw-semibold);">' + escapeHtml(VENDOR ? VENDOR.business_name : (USER.full_name || USER.email)) + '</div>' +
            '<span class="badge badge-green" style="margin-top: var(--sp-2);">' +
              (VENDOR ? escapeHtml(VENDOR.status) : "Vendor") +
            '</span>' +
          '</div>' +
          '<div class="divider" style="margin: 0 var(--sp-4);"></div>' +
          '<nav class="sidebar-nav">' +
            '<a href="#overview" class="sidebar-link active" data-section="overview">Overview</a>' +
            '<a href="#store" class="sidebar-link" data-section="store">My Store</a>' +
            '<a href="#products" class="sidebar-link" data-section="products">Products</a>' +
            '<a href="#orders" class="sidebar-link" data-section="orders">Orders</a>' +
            '<a href="#earnings" class="sidebar-link" data-section="earnings">Earnings</a>' +
          '</nav>' +
        '</aside>' +
        '<section class="dashboard-content" id="dashboard-content"></section>' +
      '</div>' +
    '</div>';
}

function wireSidebar() {
  document.querySelectorAll(".sidebar-link[data-section]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".sidebar-link").forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      switchSection(link.dataset.section);
    });
  });
}

async function switchSection(section) {
  const content = document.getElementById("dashboard-content");
  content.innerHTML = "";
  showLoading(content, "Loading...");

  try {
    switch (section) {
      case "overview": return renderOverview(content);
      case "store":    return renderStore(content);
      case "products": return renderProducts(content);
      case "orders":   return renderOrders(content);
      case "earnings": return renderEarnings(content);
    }
  } catch (err) {
    showError(content, err.message);
  }
}

async function renderOverview(content) {
  if (!VENDOR) {
    content.innerHTML =
      '<div class="section-header"><h2 class="section-title">Welcome</h2></div>' +
      '<div class="alert alert-warning">' +
        'You don\\'t have a vendor profile yet. ' +
        '<a href="#" onclick="alert(\\'Vendor application coming soon\\')">Apply to become a vendor</a>.' +
      '</div>';
    return;
  }

  content.innerHTML =
    '<div class="section-header"><h2 class="section-title">Welcome, ' + escapeHtml(VENDOR.business_name) + '</h2>' +
    '<p class="section-subtitle">Manage your store, products, and orders.</p></div>' +
    '<div class="grid grid-3">' +
      '<div class="stat-card"><div class="stat-card-label">Status</div><div class="stat-card-value">' + escapeHtml(VENDOR.status) + '</div></div>' +
      '<div class="stat-card"><div class="stat-card-label">Products</div><div class="stat-card-value">—</div></div>' +
      '<div class="stat-card"><div class="stat-card-label">Orders</div><div class="stat-card-value">—</div></div>' +
    '</div>';
}

async function renderStore(content) {
  if (!VENDOR) {
    showEmpty(content, { title: "No store yet" });
    return;
  }
  content.innerHTML =
    '<div class="section-header"><h2 class="section-title">My store</h2></div>' +
    '<div class="card"><div class="card-body">' +
      '<h3 class="card-title">' + escapeHtml(VENDOR.business_name) + '</h3>' +
      '<p class="card-text">' + escapeHtml(VENDOR.description || "No description yet.") + '</p>' +
      '<div class="divider"></div>' +
      '<div class="grid grid-2" style="gap: var(--sp-3); font-size: var(--fs-sm);">' +
        '<div><small>Email</small><div>' + escapeHtml(VENDOR.email || "—") + '</div></div>' +
        '<div><small>Phone</small><div>' + escapeHtml(VENDOR.phone || "—") + '</div></div>' +
        '<div><small>County</small><div>' + escapeHtml(VENDOR.county || "—") + '</div></div>' +
        '<div><small>Address</small><div>' + escapeHtml(VENDOR.address || "—") + '</div></div>' +
      '</div>' +
    '</div></div>';
}

async function renderProducts(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Products</h2></div>' +
                     '<div id="products-container"></div>';
  const container = document.getElementById("products-container");
  showLoading(container, "Loading products...");

  if (!VENDOR) {
    showEmpty(container, { title: "No vendor profile", text: "Set up your store first." });
    return;
  }

  try {
    const products = await api.get("/vendors/" + encodeURIComponent(VENDOR.id) + "/products");
    if (!products || !products.length) {
      showEmpty(container, { title: "No products yet", text: "Add your first product to appear on the marketplace." });
      return;
    }

    let html = '<div class="flex-between mb-4"><div>' + products.length + ' products</div>' +
               '<button class="btn btn-primary btn-sm" onclick="alert(\\'Add product coming soon\\')">+ Add product</button></div>';
    html += '<div class="grid grid-3">';
    for (const p of products) {
      html += '<div class="card"><div class="card-body">' +
        '<h4 class="card-title">' + escapeHtml(p.name) + '</h4>' +
        '<div class="product-price" style="font-size: var(--fs-lg);">' + formatKES(p.price) + '</div>' +
        '<div style="font-size: var(--fs-xs); color: var(--fk-gray-500); margin-top: var(--sp-2);">Stock: ' + (p.stock ?? 0) + '</div>' +
      '</div></div>';
    }
    html += '</div>';
    container.innerHTML = html;
  } catch (err) {
    showError(container, err.message);
  }
}

async function renderOrders(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Orders</h2></div>' +
                     '<div id="orders-container"></div>';
  const container = document.getElementById("orders-container");
  showLoading(container, "Loading orders...");

  if (!VENDOR) {
    showEmpty(container, { title: "No vendor profile" });
    return;
  }

  try {
    const orders = await api.get("/vendors/" + encodeURIComponent(VENDOR.id) + "/orders");
    if (!orders || !orders.length) {
      showEmpty(container, { title: "No orders yet", text: "Orders for your products will appear here." });
      return;
    }
    let html = '<div class="grid">';
    for (const entry of orders) {
      const o = entry.order || {};
      html += '<div class="card"><div class="card-body">' +
        '<div class="flex-between"><div>' +
          '<div style="font-family: var(--fk-font-mono); font-size: var(--fs-xs); color: var(--fk-gray-500);">Order #' +
            escapeHtml((o.id || "").slice(0, 8).toUpperCase()) +
          '</div>' +
          '<div style="font-size: var(--fs-xs); color: var(--fk-gray-500); margin-top: 2px;">' +
            (o.created_at ? formatDateTime(o.created_at) : "") +
          '</div>' +
        '</div>' +
        '<span class="badge ' + statusBadge(o.status || "pending") + '">' + escapeHtml(o.status || "pending") + '</span>' +
        '</div>' +
        '<div class="divider"></div>' +
        '<div style="font-size: var(--fs-sm); color: var(--fk-gray-600);">' + entry.items.length + ' item(s) · Vendor subtotal: ' +
          formatKES(entry.vendor_subtotal || 0) + '</div>' +
      '</div></div>';
    }
    html += '</div>';
    container.innerHTML = html;
  } catch (err) {
    showError(container, err.message);
  }
}

async function renderEarnings(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Earnings</h2></div>' +
                     '<div id="earnings-container"></div>';
  const container = document.getElementById("earnings-container");
  showLoading(container, "Loading earnings...");

  if (!VENDOR) {
    showEmpty(container, { title: "No vendor profile" });
    return;
  }

  try {
    const data = await api.get("/commissions/vendors/" + encodeURIComponent(VENDOR.id) + "/earnings");
    const summary = data.summary || {};
    container.innerHTML =
      '<div class="grid grid-3">' +
        '<div class="stat-card"><div class="stat-card-label">Total Gross</div><div class="stat-card-value">' + formatKES(summary.total_gross || 0) + '</div></div>' +
        '<div class="stat-card"><div class="stat-card-label">Commission Paid</div><div class="stat-card-value">' + formatKES(summary.total_commission || 0) + '</div></div>' +
        '<div class="stat-card"><div class="stat-card-label">Net Earnings</div><div class="stat-card-value" style="color: var(--fk-green);">' + formatKES(summary.total_earnings || 0) + '</div></div>' +
      '</div>' +
      '<div class="section-header" style="margin-top: var(--sp-8);"><h3 class="section-title">Recent transactions</h3></div>' +
      '<div id="recent-container"></div>';

    const recentContainer = document.getElementById("recent-container");
    const recent = data.recent || [];
    if (!recent.length) {
      showEmpty(recentContainer, { title: "No transactions yet" });
    } else {
      let rows = "";
      for (const r of recent) {
        rows += '<tr>' +
          '<td>' + formatDateTime(r.created_at) + '</td>' +
          '<td>' + formatKES(r.gross_amount) + '</td>' +
          '<td>' + formatKES(r.commission_amt) + '</td>' +
          '<td><strong>' + formatKES(r.vendor_earning) + '</strong></td>' +
        '</tr>';
      }
      recentContainer.innerHTML =
        '<div class="table-wrapper"><table class="table">' +
          '<thead><tr><th>Date</th><th>Gross</th><th>Commission</th><th>Earning</th></tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table></div>';
    }
  } catch (err) {
    showError(container, err.message);
  }
}