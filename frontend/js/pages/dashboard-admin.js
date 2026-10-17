/**
 * Admin / Super Admin dashboard
 * ==============================
 * Sections: Overview, Users, Teams, Vendors, Orders, Payments, Reports
 */

import { api } from "../api.js";
import { getSession, requireRole, isSuperAdmin } from "../auth.js";
import { CONFIG } from "../config.js";
import {
  escapeHtml, formatKES, formatDateTime,
  showLoading, showError, showEmpty, notify,
} from "../ui.js";
import { statusBadge } from "../utils.js";

let USER = null;

export async function initAdminDashboard() {
  if (!requireRole(["admin", "super_admin"], CONFIG.ROUTES.LOGIN)) return;

  const { user } = getSession();
  USER = user;

  renderShell();
  wireSidebar();
  switchSection("overview");
}

function renderShell() {
  const host = document.getElementById("dashboard-root");
  if (!host) return;

  const roleLabel = isSuperAdmin(USER) ? "Super Admin" : "Admin";
  const roleBadge = isSuperAdmin(USER) ? "badge-gold" : "badge-green";

  host.innerHTML =
    '<div class="container">' +
      '<div class="dashboard">' +
        '<aside class="dashboard-sidebar">' +
          '<div style="padding: var(--sp-3) var(--sp-4); margin-bottom: var(--sp-3);">' +
            '<div style="font-size: var(--fs-xs); color: var(--fk-gray-500); text-transform: uppercase; letter-spacing: var(--ls-wide);">' +
              escapeHtml(roleLabel) +
            '</div>' +
            '<div style="font-weight: var(--fw-semibold);">' + escapeHtml(USER.full_name || USER.email) + '</div>' +
            '<span class="badge ' + roleBadge + '" style="margin-top: var(--sp-2);">' + escapeHtml(roleLabel) + '</span>' +
          '</div>' +
          '<div class="divider" style="margin: 0 var(--sp-4);"></div>' +
          '<nav class="sidebar-nav">' +
            '<a href="#overview" class="sidebar-link active" data-section="overview">Overview</a>' +
            '<a href="#users" class="sidebar-link" data-section="users">Users</a>' +
            '<a href="#teams" class="sidebar-link" data-section="teams">Teams</a>' +
            '<a href="#vendors" class="sidebar-link" data-section="vendors">Vendors</a>' +
            '<a href="#orders" class="sidebar-link" data-section="orders">Orders</a>' +
            '<a href="#payments" class="sidebar-link" data-section="payments">Payments</a>' +
            '<a href="#reports" class="sidebar-link" data-section="reports">Reports</a>' +
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
      case "users":    return renderUsers(content);
      case "teams":    return renderTeams(content);
      case "vendors":  return renderVendors(content);
      case "orders":   return renderOrders(content);
      case "payments": return renderPayments(content);
      case "reports":  return renderReports(content);
    }
  } catch (err) {
    showError(content, err.message);
  }
}

async function renderOverview(content) {
  const dash = await api.get("/admin/dashboard");
  content.innerHTML =
    '<div class="section-header"><h2 class="section-title">Platform overview</h2>' +
    '<p class="section-subtitle">Live counts across the whole platform.</p></div>' +
    '<div class="grid grid-4">' +
      '<div class="stat-card"><div class="stat-card-label">Users</div><div class="stat-card-value">' + (dash.users || 0) + '</div></div>' +
      '<div class="stat-card"><div class="stat-card-label">Teams</div><div class="stat-card-value">' + (dash.teams || 0) + '</div></div>' +
      '<div class="stat-card"><div class="stat-card-label">Players</div><div class="stat-card-value">' + (dash.players || 0) + '</div></div>' +
      '<div class="stat-card"><div class="stat-card-label">Leagues</div><div class="stat-card-value">' + (dash.leagues || 0) + '</div></div>' +
      '<div class="stat-card"><div class="stat-card-label">Tournaments</div><div class="stat-card-value">' + (dash.tournaments || 0) + '</div></div>' +
      '<div class="stat-card"><div class="stat-card-label">Vendors</div><div class="stat-card-value">' + (dash.vendors || 0) + '</div></div>' +
      '<div class="stat-card"><div class="stat-card-label">Products</div><div class="stat-card-value">' + (dash.products || 0) + '</div></div>' +
      '<div class="stat-card"><div class="stat-card-label">Orders</div><div class="stat-card-value">' + (dash.orders || 0) + '</div></div>' +
    '</div>';
}

async function renderUsers(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Users</h2></div>' +
                     '<div id="users-container"></div>';
  const container = document.getElementById("users-container");
  showLoading(container, "Loading users...");

  try {
    const res = await api.get("/admin/users?page_size=50");
    const users = res.items || [];
    if (!users.length) {
      showEmpty(container, { title: "No users" });
      return;
    }
    let rows = "";
    for (const u of users) {
      rows += '<tr>' +
        '<td>' + escapeHtml(u.full_name || "—") + '</td>' +
        '<td>' + escapeHtml(u.email) + '</td>' +
        '<td><span class="badge badge-gray">' + escapeHtml(u.role) + '</span></td>' +
        '<td>' + (u.is_active ? "Active" : "Inactive") + '</td>' +
        '<td>' + formatDateTime(u.created_at) + '</td>' +
      '</tr>';
    }
    container.innerHTML =
      '<div class="table-wrapper"><table class="table table-stack">' +
        '<thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table></div>';
  } catch (err) {
    showError(container, err.message);
  }
}

async function renderTeams(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Teams</h2></div>' +
                     '<div id="teams-container"></div>';
  const container = document.getElementById("teams-container");
  showLoading(container, "Loading teams...");

  try {
    const res = await api.get("/teams?page_size=100");
    const teams = res.items || [];
    if (!teams.length) {
      showEmpty(container, { title: "No teams" });
      return;
    }
    let rows = "";
    for (const t of teams) {
      rows += '<tr>' +
        '<td><a href="/pages/sports/team-detail.html?id=' + encodeURIComponent(t.id) + '">' + escapeHtml(t.name) + '</a></td>' +
        '<td>' + escapeHtml(t.county || "—") + '</td>' +
        '<td>' + (t.founded_year || "—") + '</td>' +
        '<td>' + (t.is_active ? "Active" : "Inactive") + '</td>' +
      '</tr>';
    }
    container.innerHTML =
      '<div class="table-wrapper"><table class="table">' +
        '<thead><tr><th>Team</th><th>County</th><th>Founded</th><th>Status</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table></div>';
  } catch (err) {
    showError(container, err.message);
  }
}

async function renderVendors(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Vendors</h2>' +
                     '<p class="section-subtitle">Approve, suspend, or review vendors.</p></div>' +
                     '<div id="vendors-container"></div>';
  const container = document.getElementById("vendors-container");
  showLoading(container, "Loading vendors...");

  try {
    const res = await api.get("/admin/vendors?page_size=50");
    const vendors = res.items || [];
    if (!vendors.length) {
      showEmpty(container, { title: "No vendors yet" });
      return;
    }
    let rows = "";
    for (const v of vendors) {
      const approveBtn = v.status !== "approved"
        ? '<button class="btn btn-primary btn-sm" data-action="approve" data-id="' + escapeHtml(v.id) + '">Approve</button>'
        : '';
      const suspendBtn = v.status === "approved"
        ? '<button class="btn btn-secondary btn-sm" data-action="suspend" data-id="' + escapeHtml(v.id) + '">Suspend</button>'
        : '';
      rows += '<tr>' +
        '<td>' + escapeHtml(v.business_name) + '</td>' +
        '<td>' + escapeHtml(v.email || "—") + '</td>' +
        '<td><span class="badge ' + statusBadge(v.status) + '">' + escapeHtml(v.status) + '</span></td>' +
        '<td class="flex gap-2">' + approveBtn + suspendBtn + '</td>' +
      '</tr>';
    }
    container.innerHTML =
      '<div class="table-wrapper"><table class="table">' +
        '<thead><tr><th>Business</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table></div>';

    container.querySelectorAll("button[data-action]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        try {
          if (action === "approve") await api.patch("/vendors/" + id + "/approve", {});
          if (action === "suspend") await api.patch("/vendors/" + id + "/suspend", {});
          notify.success("Vendor " + action + "d");
          renderVendors(content);
        } catch (err) {
          notify.error("Action failed: " + err.message);
        }
      });
    });
  } catch (err) {
    showError(container, err.message);
  }
}

async function renderOrders(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Orders</h2></div>' +
                     '<div id="orders-container"></div>';
  const container = document.getElementById("orders-container");
  showLoading(container, "Loading orders...");

  try {
    const res = await api.get("/admin/orders?page_size=50");
    const orders = res.items || [];
    if (!orders.length) {
      showEmpty(container, { title: "No orders yet" });
      return;
    }
    let rows = "";
    for (const o of orders) {
      rows += '<tr>' +
        '<td>#' + escapeHtml(o.id.slice(0, 8).toUpperCase()) + '</td>' +
        '<td><span class="badge ' + statusBadge(o.status) + '">' + escapeHtml(o.status) + '</span></td>' +
        '<td>' + formatKES(o.total) + '</td>' +
        '<td>' + formatDateTime(o.created_at) + '</td>' +
      '</tr>';
    }
    container.innerHTML =
      '<div class="table-wrapper"><table class="table">' +
        '<thead><tr><th>Order</th><th>Status</th><th>Total</th><th>Date</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table></div>';
  } catch (err) {
    showError(container, err.message);
  }
}

async function renderPayments(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Payments</h2></div>' +
                     '<div id="payments-container"></div>';
  const container = document.getElementById("payments-container");
  showLoading(container, "Loading payments...");

  try {
    const res = await api.get("/admin/payments?page_size=50");
    const payments = res.items || [];
    if (!payments.length) {
      showEmpty(container, { title: "No payments yet" });
      return;
    }
    let rows = "";
    for (const p of payments) {
      rows += '<tr>' +
        '<td>' + escapeHtml(p.mpesa_receipt || "—") + '</td>' +
        '<td><span class="badge ' + statusBadge(p.status) + '">' + escapeHtml(p.status) + '</span></td>' +
        '<td>' + formatKES(p.amount) + '</td>' +
        '<td>' + formatDateTime(p.created_at) + '</td>' +
      '</tr>';
    }
    container.innerHTML =
      '<div class="table-wrapper"><table class="table">' +
        '<thead><tr><th>Receipt</th><th>Status</th><th>Amount</th><th>Date</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table></div>';
  } catch (err) {
    showError(container, err.message);
  }
}

async function renderReports(content) {
  content.innerHTML = '<div class="section-header"><h2 class="section-title">Reports</h2></div>' +
                     '<div id="reports-container"></div>';
  const container = document.getElementById("reports-container");
  showLoading(container, "Loading reports...");

  try {
    const r = await api.get("/admin/reports");
    container.innerHTML =
      '<div class="grid grid-2">' +
        '<div class="stat-card"><div class="stat-card-label">Gross Sales</div><div class="stat-card-value">' + formatKES(r.gross_sales || 0) + '</div></div>' +
        '<div class="stat-card"><div class="stat-card-label">Successful Payments</div><div class="stat-card-value">' + formatKES(r.successful_payments || 0) + '</div></div>' +
        '<div class="stat-card"><div class="stat-card-label">Platform Commission</div><div class="stat-card-value" style="color: var(--fk-gold-dark);">' + formatKES(r.platform_commission || 0) + '</div></div>' +
        '<div class="stat-card"><div class="stat-card-label">Vendor Payouts</div><div class="stat-card-value" style="color: var(--fk-green);">' + formatKES(r.vendor_payouts || 0) + '</div></div>' +
      '</div>';
  } catch (err) {
    showError(container, err.message);
  }
}