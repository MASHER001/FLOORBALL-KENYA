/**
 * Payment page — M-Pesa STK Push + polling
 * =========================================
 */

import { api } from "../api.js";
import { isLoggedIn } from "../auth.js";
import {
  escapeHtml, formatKES, qs,
  showLoading, showError, notify,
} from "../ui.js";

let POLL_TIMER = null;

export async function initPayment() {
  const host = document.getElementById("payment-content");
  if (!host) return;

  if (!isLoggedIn()) {
    notify.info("Please sign in to continue.");
    setTimeout(() => { window.location.href = "/pages/auth/login.html"; }, 600);
    return;
  }

  const orderId = qs("order");
  if (!orderId) {
    showError(host, "No order specified.");
    return;
  }

  showLoading(host, "Loading order...");

  try {
    const order = await api.get("/orders/" + encodeURIComponent(orderId));
    render(host, order);
  } catch (err) {
    showError(host, "Unable to load order. " + err.message);
  }
}

function render(host, order) {
  host.innerHTML =
    '<div class="container" style="max-width: 560px; padding-top: var(--sp-10);">' +
      '<div class="card">' +
        '<div class="card-header"><h3 style="margin: 0;">M-Pesa payment</h3></div>' +
        '<div class="card-body">' +
          '<div style="text-align: center; margin-bottom: var(--sp-6);">' +
            '<div style="font-size: var(--fs-sm); color: var(--fk-gray-500);">Amount to pay</div>' +
            '<div style="font-family: var(--fk-font-display); font-size: var(--fs-4xl); font-weight: 800; color: var(--fk-green); margin: var(--sp-2) 0;">' +
              formatKES(order.total) +
            '</div>' +
            '<div style="font-size: var(--fs-xs); color: var(--fk-gray-500);">Order #' +
              escapeHtml(order.id.slice(0, 8).toUpperCase()) +
            '</div>' +
          '</div>' +
          '<form id="payment-form">' +
            '<div class="form-group">' +
              '<label class="form-label" for="phone">M-Pesa phone number <span class="required">*</span></label>' +
              '<input type="tel" id="phone" class="form-control" required value="' +
                escapeHtml(order.delivery_phone || "") + '" placeholder="0712345678" />' +
              '<div class="form-help">You will receive an STK Push on this number.</div>' +
            '</div>' +
            '<button id="pay-btn" type="submit" class="btn btn-primary btn-lg btn-full">Pay ' +
              formatKES(order.total) + '</button>' +
          '</form>' +
          '<div id="payment-status" style="margin-top: var(--sp-6);"></div>' +
          '<div style="margin-top: var(--sp-6); text-align: center;">' +
            '<a href="/pages/shop/my-orders.html" class="btn btn-ghost">Pay later - view my orders</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.getElementById("payment-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    await initiatePayment(order, document.getElementById("phone").value);
  });

  if (order.status === "paid" || order.status === "completed") {
    showPaymentSuccess();
  }
}

async function initiatePayment(order, phone) {
  const btn = document.getElementById("pay-btn");
  const status = document.getElementById("payment-status");

  btn.disabled = true;
  btn.textContent = "Sending STK Push...";
  status.innerHTML = "";

  try {
    const result = await api.post("/payments/mpesa/initiate", {
      order_id: order.id,
      phone: phone.trim(),
    });

    btn.textContent = "Awaiting confirmation...";

    status.innerHTML =
      '<div class="alert alert-info">' +
        '<div>' +
          '<strong>STK Push sent</strong><br />' +
          'Enter your M-Pesa PIN on your phone to complete payment.<br />' +
          '<small>Waiting for confirmation...</small>' +
        '</div>' +
      '</div>';

    startPolling(result.payment_id, order.id);
  } catch (err) {
    notify.error("Could not initiate payment: " + err.message);
    btn.disabled = false;
    btn.textContent = "Pay " + formatKES(order.total);
    status.innerHTML = '<div class="alert alert-error">' + escapeHtml(err.message) + '</div>';
  }
}

function startPolling(paymentId, orderId) {
  let attempts = 0;
  const maxAttempts = 60;

  POLL_TIMER = setInterval(async () => {
    attempts++;
    if (attempts > maxAttempts) {
      clearInterval(POLL_TIMER);
      notify.warning("Payment is taking longer than expected. Check My Orders later.");
      return;
    }

    try {
      const payment = await api.get("/payments/" + paymentId);
      if (payment.status === "success") {
        clearInterval(POLL_TIMER);
        onPaymentSuccess(orderId);
      } else if (payment.status === "failed") {
        clearInterval(POLL_TIMER);
        onPaymentFailed(payment);
      }
    } catch {
      // ignore transient errors
    }
  }, 2000);
}

function onPaymentSuccess(orderId) {
  const status = document.getElementById("payment-status");
  status.innerHTML =
    '<div class="alert alert-success">' +
      '<div><strong>Payment confirmed!</strong><br />Redirecting...</div>' +
    '</div>';
  notify.success("Payment successful!");
  setTimeout(() => {
    window.location.href = "/pages/shop/order-confirmation.html?id=" + orderId;
  }, 1200);
}

function onPaymentFailed(payment) {
  const status = document.getElementById("payment-status");
  const btn = document.getElementById("pay-btn");

  status.innerHTML =
    '<div class="alert alert-error">' +
      '<div><strong>Payment failed</strong><br />' +
      escapeHtml(payment.result_desc || "Transaction could not be completed.") +
      '</div></div>';

  btn.disabled = false;
  btn.textContent = "Try again";
}

function showPaymentSuccess() {
  const status = document.getElementById("payment-status");
  status.innerHTML =
    '<div class="alert alert-success"><div>This order is already paid.</div></div>';
}