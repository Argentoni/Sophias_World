import { test, expect } from "@playwright/test";

test("drag moves the character", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "Phaser drag events not synthesizable in Playwright webkit; verified manually on iPad in Task 21");

  await page.goto("/");

  // Wait until MainScene has registered the character.
  await page.waitForFunction(
    () => (window as unknown as { __character?: unknown }).__character !== undefined,
    null,
    { timeout: 15_000 }
  );

  // Give Phaser a frame to wire input handlers.
  await page.waitForTimeout(200);

  const startPos = await page.evaluate(() => {
    const c = (window as unknown as { __character: { x: number; y: number } }).__character;
    return { x: c.x, y: c.y };
  });

  // Compute scale: game runs at 1280x720, canvas is FIT-scaled in the viewport.
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return null;
    const r = canvas.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  });
  if (!canvasInfo) throw new Error("no canvas");

  const sx = canvasInfo.width / 1280;
  const sy = canvasInfo.height / 720;
  const toViewport = (gx: number, gy: number) => ({
    x: canvasInfo.left + gx * sx,
    y: canvasInfo.top + gy * sy
  });

  // Character is at game-coord (640, 360). Press there, move +150 right, +100 down.
  const start = toViewport(startPos.x, startPos.y);
  const mid = toViewport(startPos.x + 75, startPos.y + 50);
  const end = toViewport(startPos.x + 150, startPos.y + 100);

  // Phaser drag requires move BEFORE down on some browsers, then down,
  // then move(s) over the hit-area, then up.
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  // Multiple intermediate moves so Phaser sees real "drag" frames.
  await page.mouse.move(mid.x, mid.y, { steps: 5 });
  await page.mouse.move(end.x, end.y, { steps: 5 });
  await page.mouse.up();

  // Give Phaser a frame to settle the final position.
  await page.waitForTimeout(200);

  const endPos = await page.evaluate(() => {
    const c = (window as unknown as { __character: { x: number; y: number } }).__character;
    return { x: c.x, y: c.y };
  });

  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;

  // The character should have moved roughly in the direction of the drag.
  // Tolerance is generous because Phaser's drag may stop slightly short of
  // the final pointer position. The key assertion is "moved noticeably".
  expect(Math.abs(dx)).toBeGreaterThan(50);
  expect(Math.abs(dy)).toBeGreaterThan(30);
});
