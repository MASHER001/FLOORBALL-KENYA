/**
 * News detail page
 * =================
 * Reads ?id=... from query string and displays the article.
 */

import { api } from "../api.js";
import {
  escapeHtml, formatDate, qs,
  showLoading, showError,
} from "../ui.js";

export async function initNewsDetail() {
  const el = document.getElementById("news-detail");
  if (!el) return;

  const id = qs("id");
  if (!id) {
    showError(el, "No article specified.");
    return;
  }

  showLoading(el, "Loading article…");

  try {
    const n = await api.get(`/news/${encodeURIComponent(id)}`);
    document.title = `${n.title} — FloorballKenya`;

    const image = n.cover_image
      ? `<img src="${escapeHtml(n.cover_image)}" alt=""
              style="width:100%; max-height:480px; object-fit:cover; border-radius: var(--radius-lg); margin-bottom: var(--sp-8);" />`
      : "";

    el.innerHTML = `
      <article style="max-width: 760px; margin-inline: auto;">
        <div style="font-size: var(--fs-xs); color: var(--fk-gray-500); text-transform: uppercase; letter-spacing: var(--ls-wide); margin-bottom: var(--sp-3);">
          ${formatDate(n.published_at || n.created_at)}
        </div>
        <h1 style="margin-bottom: var(--sp-6);">${escapeHtml(n.title)}</h1>
        ${image}
        <div class="article-body" style="font-size: var(--fs-md); line-height: var(--lh-relaxed); color: var(--fk-gray-700);">
          ${(n.content || "").split(/\n\n+/).map(p => `<p style="margin-bottom: var(--sp-4);">${escapeHtml(p)}</p>`).join("")}
        </div>
        <div class="divider"></div>
        <a href="/pages/public/news.html" class="btn btn-secondary">← Back to all news</a>
      </article>
    `;
  } catch (err) {
    showError(el, "Unable to load article. " + err.message);
  }
}
