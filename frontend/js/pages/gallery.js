/**
 * Gallery page
 * ============
 * Fetches published gallery media from /api/v1/gallery/media, renders it
 * into #gallery-grid, and wires up the category filter tabs in
 * #gallery-filters (buttons with data-filter="all|matches|tournaments|teams|events").
 */

import { api } from "../api.js";
import { escapeHtml, notify } from "../ui.js";

let allItems = [];
let activeFilter = "all";

/** Resolve whichever URL field the API actually returns for a media item. */
function mediaUrl(item) {
  return item.url || item.image_url || item.storage_path || "";
}

function matchesFilter(item, filter) {
  if (filter === "all") return true;
  const tags = (item.tags || []).map((t) => String(t).toLowerCase());
  return tags.includes(filter);
}

function galleryItemHtml(item) {
  const src = mediaUrl(item);
  const caption = item.caption || "";
  return `
    <figure class="gallery-item" data-id="${escapeHtml(String(item.id))}">
      <img src="${escapeHtml(src)}" alt="${escapeHtml(caption)}" loading="lazy" />
      ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}
    </figure>
  `;
}

function render() {
  const grid = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");
  if (!grid) return;

  const filtered = allItems.filter((item) => matchesFilter(item, activeFilter));

  if (filtered.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.hidden = false;
    return;
  }

  if (empty) empty.hidden = true;
  grid.innerHTML = filtered.map(galleryItemHtml).join("");
}

function setActiveFilter(filter) {
  activeFilter = filter;

  const tabs = document.querySelectorAll("#gallery-filters .filter-tab");
  tabs.forEach((tab) => {
    const isActive = tab.dataset.filter === filter;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  render();
}

function wireFilters() {
  const container = document.getElementById("gallery-filters");
  if (!container) return;

  container.addEventListener("click", (event) => {
    const tab = event.target.closest(".filter-tab");
    if (!tab) return;
    setActiveFilter(tab.dataset.filter || "all");
  });
}

async function loadGallery() {
  const grid = document.getElementById("gallery-grid");
  if (grid) grid.innerHTML = `<p class="gallery-loading">Loading photos…</p>`;

  try {
    const res = await api.get("/gallery/media?page_size=48");
    allItems = res.items || res || [];
  } catch (err) {
    notify.error("Could not load the gallery right now.");
    allItems = [];
  }

  render();
}

export function initGallery() {
  wireFilters();
  loadGallery();
}