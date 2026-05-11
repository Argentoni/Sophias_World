import { test, expect } from "@playwright/test";

test("game boots and reaches MainScene", async ({ page }) => {
  await page.goto("/");
  // MainScene sets window.__scene on create; wait for it.
  await page.waitForFunction(
    () => (window as unknown as { __scene?: string }).__scene === "MainScene",
    null,
    { timeout: 15_000 }
  );
  await expect(page.locator("canvas")).toBeVisible();
});
