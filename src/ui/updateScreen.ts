import { Workbox } from "workbox-window";

/**
 * Registers the service worker and shows a minimal DOM "Atualizando..."
 * overlay when a new version is waiting. We control the swap explicitly so
 * the player never sees the game reload mid-action. The controlling listener
 * is wired ONLY from inside the waiting handler so first-install activation
 * does not trigger a spurious reload.
 */
export function setupPwaUpdates(): void {
  if (!("serviceWorker" in navigator)) return;

  const wb = new Workbox("/sw.js");
  let refreshing = false;

  wb.addEventListener("waiting", () => {
    showUpdateOverlay();

    const onControlling = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    wb.addEventListener("controlling", onControlling);

    // Double rAF: wait until the overlay has actually painted before
    // triggering the SW activation swap.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      wb.messageSkipWaiting();
    }));
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
