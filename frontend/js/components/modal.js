/**
 * Modal
 * =====
 * Simple promise-based modal helper.
 *
 * Usage:
 *   const ok = await confirmModal({ title: "Delete?", body: "..." });
 *   const data = await formModal({ title: "New Team", fields: [...] });
 */

export function confirmModal({ title = "Are you sure?", body = "", confirmLabel = "Confirm", cancelLabel = "Cancel" } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "fk-modal-overlay";
    overlay.innerHTML = `
      <div class="fk-modal" role="dialog" aria-modal="true">
        <h3>${esc(title)}</h3>
        <p>${esc(body)}</p>
        <div class="fk-modal-actions">
          <button class="btn btn-outline" data-act="cancel">${esc(cancelLabel)}</button>
          <button class="btn" data-act="ok">${esc(confirmLabel)}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000;";
    overlay.querySelector(".fk-modal").style.cssText = "background:#fff;border-radius:10px;padding:24px;min-width:320px;max-width:520px;box-shadow:0 20px 60px rgba(0,0,0,.3);";

    const close = (v) => {
      overlay.remove();
      resolve(v);
    };
    overlay.querySelector('[data-act="cancel"]').onclick = () => close(false);
    overlay.querySelector('[data-act="ok"]').onclick = () => close(true);
    overlay.onclick = (e) => { if (e.target === overlay) close(false); };
    document.addEventListener("keydown", function onEsc(e) {
      if (e.key === "Escape") { document.removeEventListener("keydown", onEsc); close(false); }
    });
  });
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}
