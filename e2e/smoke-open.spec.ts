import { test, expect } from "@playwright/test";

test("game boots and reaches MapScene", async ({ page }) => {
  await page.goto("/");
  // MapScene sets window.__scene on create; wait for it.
  await page.waitForFunction(
    () => (window as unknown as { __scene?: string }).__scene === "MapScene",
    null,
    { timeout: 15_000 }
  );
  await expect(page.locator("canvas")).toBeVisible();
});
