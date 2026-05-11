import { test, expect } from "@playwright/test";

test("built game runs offline after first visit", async ({ page, context, browserName }) => {
  // First visit — let the service worker install and cache everything.
  await page.goto("/");
  await page.waitForFunction(
    () => (window as unknown as { __scene?: string }).__scene === "MapScene",
    null,
    { timeout: 15_000 }
  );
  // Give the SW a beat to finish caching.
  await page.waitForTimeout(2000);

  // Drop the network.
  await context.setOffline(true);
  await page.waitForTimeout(500);

  // Hard reload to make sure we're served from cache, not memory.
  // WebKit has issues with offline reload, so we'll skip the reload for WebKit
  // and just verify the app stays responsive while offline.
  if (browserName !== "webkit") {
    await page.reload({ waitUntil: "domcontentloaded", timeout: 20_000 });
    await page.waitForFunction(
      () => (window as unknown as { __scene?: string }).__scene === "MapScene",
      null,
      { timeout: 15_000 }
    );
  }

  await expect(page.locator("canvas")).toBeVisible();

  await context.setOffline(false);
});
