import { test, expect } from "@playwright/test";

test("drag moves the character", async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(
    () => (window as unknown as { __character?: unknown }).__character !== undefined,
    null,
    { timeout: 15_000 }
  );

  // Give Phaser multiple frames to fully initialize input handlers and scene.
  await page.waitForTimeout(500);

  const startPos = await page.evaluate(() => {
    const c = (window as unknown as { __character: { x: number; y: number } }).__character;
    return { x: c.x, y: c.y };
  });

  // The game canvas occupies the full viewport (1280x720).
  // The character is at (640, 360).
  const startX = 640;
  const startY = 360;
  const endX = 760;
  const endY = 440;

  // First, move over the character to establish pointer position.
  await page.mouse.move(startX, startY);
  await page.waitForTimeout(50);

  // Press the mouse button.
  await page.mouse.down();
  await page.waitForTimeout(50);

  // Drag the mouse to the target position with many steps so Phaser's input
  // system sees frequent pointermove events.
  await page.mouse.move(endX, endY, { steps: 20 });
  await page.waitForTimeout(50);

  // Release the mouse button.
  await page.mouse.up();

  // Give Phaser a frame to process the drag end.
  await page.waitForTimeout(200);

  const endPos = await page.evaluate(() => {
    const c = (window as unknown as { __character: { x: number; y: number } }).__character;
    return { x: c.x, y: c.y };
  });

  // The character should have moved by approximately the drag delta.
  // Allow tolerance for any rounding/scaling issues.
  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;

  expect(Math.abs(dx)).toBeGreaterThan(50);
  expect(Math.abs(dy)).toBeGreaterThan(30);
});
