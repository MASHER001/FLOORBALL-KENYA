/**
 * News listing page
 * =================
 * Fetches /news and renders cards.
 */

import { api } from "../api.js";
import {
  escapeHtml, formatDate, truncate,
  showLoading, showError, showEmpty,
} from "../ui.js";

export async function initNews() {
  const el = document.getElementById("news-list");
  if (!el) return;

  showLoading(el, "Loading news…");

  try {
    const news = await api.get("/news?page_size=50");
    if (!news || !news.length) {
      showEmpty(el, {
        title: "No news yet",
        text: "Check back soon for the latest from the floor.",
      });
      return;
    }

    el.innerHTML = `
      <div class="grid grid-3">
        ${news.map(card).join("")}
      </div>
    `;
  } catch (err) {
    showError(el, "Unable to load news. " + err.message);
  }
}

function card(n) {
  const image = n.cover_image
    ? `<img class="card-image" src="${escapeHtml(n.cover_image)}" alt="" loading="lazy" />`
    : `<div class="card-image" style="background: linear-gradient(135deg, var(--fk-green), var(--fk-green-dark));"></div>`;

  return `
    <a href="/pages/public/news-detail.html?id=${encodeURIComponent(n.id)}"
       class="card card-hover" style="display:block;">
      ${image}
      <div class="card-body">
        <div style="font-size: var(--fs-xs); color: var(--fk-gray-500); text-transform: uppercase; letter-spacing: var(--ls-wide); margin-bottom: var(--sp-2);">
          ${formatDate(n.published_at || n.created_at)}
        </div>
        <div class="card-title">${escapeHtml(n.title)}</div>
        <p class="card-text">${escapeHtml(truncate(n.excerpt || "", 120))}</p>
      </div>
    </a>
  `;
}
