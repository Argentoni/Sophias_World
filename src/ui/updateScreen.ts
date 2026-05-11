import { Workbox } from "workbox-window";

/**
 * Registers the service worker and shows a minimal DOM "Atualizando..."
 * overlay when a new version is waiting. We control the swap explicitly so
 * the player never sees the game reload mid-action.
 */
export function setupPwaUpdates(): void {
  if (!("serviceWorker" in navigator)) return;

  const wb = new Workbox("/sw.js");

  wb.addEventListener("waiting", () => {
    showUpdateOverlay();
    // Wait one tick so the overlay is visible, then activate the new SW.
    setTimeout(() => {
      wb.messageSkipWaiting();
    }, 800);
  });

  wb.addEventListener("controlling", () => {
    window.location.reload();
  });

  wb.register().catch((err) => {
    console.warn("[pwa] sw register failed", err);
  });
}

function showUpdateOverlay(): void {
  if (document.getElementById("update-overlay")) return;
  const el = document.createElement("div");
  el.id = "update-overlay";
  Object.assign(el.style, {
    position: "fixed",
    inset: "0",
    background: "#FAF4E8",
    color: "#6E4A2C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    zIndex: "10000"
  });
  el.textContent = "Atualizando…";
  document.body.appendChild(el);
}
