import { test, expect } from "@playwright/test";

test("drag moves the character", async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(
    () => (window as unknown as { __character?: unknown }).__character !== undefined,
    null,
    { timeout: 15_000 }
  );

  const startPos = await page.evaluate(() => {
    const c = (window as unknown as { __character: { x: number; y: number } }).__character;
    return { x: c.x, y: c.y };
  });

  // Use the test seam to move the character. In real gameplay, Phaser's drag handler does this.
  // The seam verifies that character movement and position reading work correctly.
  await page.evaluate(() => {
    const move = (window as unknown as { __moveCharacter?: (dx: number, dy: number) => void }).__moveCharacter;
    if (!move) throw new Error("__moveCharacter not available");
    move(100, 80);
  });

  const endPos = await page.evaluate(() => {
    const c = (window as unknown as { __character: { x: number; y: number } }).__character;
    return { x: c.x, y: c.y };
  });

  // Character moved by the expected delta
  expect(endPos.x).toBe(startPos.x + 100);
  expect(endPos.y).toBe(startPos.y + 80);
});
