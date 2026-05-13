import Phaser from "phaser";

const outline = 0x70462e;

export function drawClothingIcon(
  scene: Phaser.Scene,
  x: number,
  y: number,
  itemId: string,
  category: string,
  scale = 1,
  depth = 1
): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y).setScale(scale).setDepth(depth);
  const spritePreview = clothingSpritePreview(scene, itemId, category);
  if (spritePreview) {
    container.add(spritePreview);
    return container;
  }
  const g = scene.add.graphics();
  if (category === "bottom") drawBottom(g, itemId);
  else if (category === "dress") drawDress(g, itemId);
  else if (category === "shoes") drawShoes(g, itemId);
  else if (category === "accessory") drawAccessory(g, itemId);
  else drawTop(g, itemId);
  container.add(g);
  return container;
}

function clothingSpritePreview(
  scene: Phaser.Scene,
  itemId: string,
  category: string
): Phaser.GameObjects.Image | null {
  if (!scene.textures.exists(itemId) || category === "accessory") return null;
  const image = scene.add.image(0, 0, itemId);
  if (category === "top") {
    return image.setCrop(118, 230, 276, 240).setDisplaySize(240, 360).setPosition(0, -8);
  }
  if (category === "bottom") {
    return image.setCrop(145, 382, 222, 235).setDisplaySize(250, 360).setPosition(0, -42);
  }
  if (category === "dress") {
    return image.setCrop(120, 218, 290, 455).setDisplaySize(220, 300).setPosition(0, -26);
  }
  if (category === "shoes") {
    return image.setCrop(120, 586, 274, 106).setDisplaySize(250, 420).setPosition(0, -118);
  }
  image.destroy();
  return null;
}

export function drawPetAccessoryIcon(
  scene: Phaser.Scene,
  x: number,
  y: number,
  itemId: string,
  scale = 1,
  depth = 1
): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y).setScale(scale).setDepth(depth);
  const g = scene.add.graphics();
  drawAccessory(g, itemId);
  container.add(g);
  return container;
}

function drawTop(g: Phaser.GameObjects.Graphics, id: string): void {
  const palette = topPalette(id);
  g.lineStyle(5, outline, 1);
  g.fillStyle(palette.fill, 1);
  g.beginPath();
  g.moveTo(-34, -24);
  g.lineTo(-16, -37);
  g.lineTo(0, -41);
  g.lineTo(16, -37);
  g.lineTo(34, -24);
  g.lineTo(50, 13);
  g.lineTo(30, 25);
  g.lineTo(24, 4);
  g.lineTo(24, 42);
  g.lineTo(-24, 42);
  g.lineTo(-24, 4);
  g.lineTo(-30, 25);
  g.lineTo(-50, 13);
  g.closePath();
  g.fillPath();
  g.strokePath();
  g.lineStyle(4, 0xffffff, 0.48);
  g.beginPath();
  g.arc(0, -22, 20, Math.PI * 0.1, Math.PI * 0.9, false);
  g.strokePath();
  if (id.includes("cat")) drawCatPocket(g, 0, 10);
  else if (id.includes("cloud")) drawCloud(g, 0, 10, 0.7);
  else if (id.includes("strawberry")) drawStrawberry(g, 0, 10, 0.7);
  else if (id.includes("sailor")) drawBow(g, 0, 10, 10, 0xff9fc8);
  else if (id.includes("heart")) drawHeart(g, 0, 9, 12, palette.detail);
  else if (id.includes("ribbon")) drawBow(g, 0, 10, 10, palette.detail);
  else if (id.includes("sunflower")) drawFlower(g, 0, 9, 0xffe176, 0x8fb968);
  else if (id.includes("rainbow")) drawRainbow(g, 0, 19);
  else drawStar(g, 0, 9, 14, 0xffffff);
}

function drawBottom(g: Phaser.GameObjects.Graphics, id: string): void {
  const color = bottomColor(id);
  g.lineStyle(5, outline, 1);
  g.fillStyle(color, 1);
  if (id.includes("skirt") || id.includes("lilac") || id.includes("tutu")) {
    g.beginPath();
    g.moveTo(-34, -24);
    g.lineTo(34, -24);
    g.lineTo(49, 39);
    g.lineTo(-49, 39);
    g.closePath();
    g.fillPath();
    g.strokePath();
    if (id.includes("star")) drawStar(g, 0, 9, 12, 0xffffff);
    if (id.includes("cloud")) drawCloud(g, 0, 8, 0.55);
    if (id.includes("tutu")) {
      g.lineStyle(4, 0xffffff, 0.45);
      g.beginPath();
      g.arc(0, 14, 28, 0.2, Math.PI - 0.2, false);
      g.strokePath();
    }
    return;
  }
  g.fillRoundedRect(-43, -22, 86, 54, 14);
  g.strokeRoundedRect(-43, -22, 86, 54, 14);
  g.lineStyle(3, 0xffffff, 0.42);
  g.lineBetween(0, -16, 0, 31);
  if (id.includes("heart")) drawHeart(g, -16, 6, 7, 0xffffff);
  if (id.includes("rainbow")) {
    [0xff9bb1, 0xffe176, 0x90d7b6, 0x83c7eb].forEach((stripe, index) => {
      g.lineStyle(4, stripe, 1);
      g.lineBetween(-34, -6 + index * 10, 34, -6 + index * 10);
    });
  }
}

function drawDress(g: Phaser.GameObjects.Graphics, id: string): void {
  const color = dressColor(id);
  g.lineStyle(5, outline, 1);
  g.fillStyle(color, 1);
  g.beginPath();
  g.moveTo(-32, -38);
  g.lineTo(-15, -51);
  g.lineTo(0, -55);
  g.lineTo(15, -51);
  g.lineTo(32, -38);
  g.lineTo(52, 44);
  g.lineTo(27, 61);
  g.lineTo(0, 68);
  g.lineTo(-27, 61);
  g.lineTo(-52, 44);
  g.closePath();
  g.fillPath();
  g.strokePath();
  g.lineStyle(4, 0xffffff, 0.46);
  g.beginPath();
  g.arc(0, -34, 20, Math.PI * 0.12, Math.PI * 0.88, false);
  g.strokePath();
  if (id.includes("cupcake")) drawCupcake(g, 0, 14, 0.66);
  else if (id.includes("rainbow")) drawRainbow(g, 0, 16);
  else if (id.includes("rose")) {
    drawHeart(g, 0, 6, 13, 0xffffff);
    drawFlower(g, 0, 36, 0xff9fc8, 0x8fb968);
  } else if (id.includes("starry")) {
    drawStar(g, -15, 5, 9, 0xffffff);
    drawStar(g, 20, 23, 7, 0xffe176);
  } else if (id.includes("flower")) drawFlower(g, 0, 14, 0xffffff, 0xff9bb1);
  else drawMoon(g, 4, 13, 15);
}

function drawShoes(g: Phaser.GameObjects.Graphics, id: string): void {
  const color = shoeColor(id);
  g.lineStyle(5, outline, 1);
  g.fillStyle(color, 1);
  g.fillEllipse(-24, 0, 49, 24);
  g.fillEllipse(24, 0, 49, 24);
  g.strokeEllipse(-24, 0, 49, 24);
  g.strokeEllipse(24, 0, 49, 24);
  g.lineStyle(3, 0xffffff, 0.55);
  g.lineBetween(-39, -3, -17, -3);
  g.lineBetween(17, -3, 39, -3);
}

function drawAccessory(g: Phaser.GameObjects.Graphics, id: string): void {
  if (id.includes("bow") || id.includes("pet-bow")) {
    drawBow(g, 0, 0, 17, id.includes("blue") ? 0x83c7eb : 0xff9fc8);
    return;
  }
  if (id.includes("glasses")) {
    g.lineStyle(5, 0xffe176, 1);
    g.strokeCircle(-18, 0, 18);
    g.strokeCircle(18, 0, 18);
    g.lineBetween(0, 0, 0, 0);
    drawStar(g, -37, -20, 7, 0xffe176);
    return;
  }
  if (id.includes("bag")) {
    g.lineStyle(5, outline, 1);
    g.fillStyle(0xffb6d5, 1);
    g.fillRoundedRect(-22, -12, 44, 47, 13);
    g.strokeRoundedRect(-22, -12, 44, 47, 13);
    g.beginPath();
    g.arc(0, -12, 20, Math.PI, 0, false);
    g.strokePath();
    g.fillStyle(0xfff8e8, 1);
    g.fillCircle(-8, 8, 5);
    g.fillCircle(8, 8, 5);
    return;
  }
  if (id.includes("crown")) {
    g.lineStyle(5, outline, 1);
    g.fillStyle(0xffe176, 1);
    g.beginPath();
    g.moveTo(-34, 20);
    g.lineTo(-22, -18);
    g.lineTo(0, 3);
    g.lineTo(22, -18);
    g.lineTo(34, 20);
    g.closePath();
    g.fillPath();
    g.strokePath();
    return;
  }
  if (id.includes("necklace") || id.includes("collar")) {
    g.lineStyle(5, outline, 1);
    g.beginPath();
    g.arc(0, -6, 31, 0.1, Math.PI - 0.1, false);
    g.strokePath();
    drawHeart(g, 0, 16, 10, 0xff7aa7);
    return;
  }
  if (id.includes("bandana")) {
    g.lineStyle(5, outline, 1);
    g.fillStyle(0xa6e7c2, 1);
    g.beginPath();
    g.moveTo(-32, -16);
    g.lineTo(32, -16);
    g.lineTo(0, 28);
    g.closePath();
    g.fillPath();
    g.strokePath();
    return;
  }
  if (id.includes("cape")) {
    g.lineStyle(5, outline, 1);
    g.fillStyle(0x8ec8ff, 0.9);
    g.beginPath();
    g.moveTo(-25, -24);
    g.lineTo(30, -10);
    g.lineTo(24, 34);
    g.lineTo(-30, 18);
    g.closePath();
    g.fillPath();
    g.strokePath();
    drawStar(g, 12, 10, 9, 0xffe176);
    return;
  }
  if (id.includes("scarf")) {
    g.lineStyle(5, outline, 1);
    g.fillStyle(0xfaf4e8, 1);
    g.fillRoundedRect(-31, -8, 62, 18, 9);
    g.strokeRoundedRect(-31, -8, 62, 18, 9);
    [0xff9bb1, 0xffe176, 0x90d7b6, 0x83c7eb].forEach((stripe, index) => {
      g.lineStyle(4, stripe, 1);
      g.lineBetween(-24 + index * 14, 1, -8 + index * 14, 1);
    });
    return;
  }
  if (id.includes("flower")) {
    drawFlower(g, 0, 0, 0xff9fc8, 0xffe176);
    return;
  }
  if (id.includes("hat-bear") || id.includes("star-hat")) {
    g.lineStyle(5, outline, 1);
    g.fillStyle(id.includes("star") ? 0xffe176 : 0xd8aa82, 1);
    g.fillEllipse(0, 0, 74, 32);
    if (id.includes("bear")) {
      g.fillCircle(-26, -17, 12);
      g.fillCircle(26, -17, 12);
    } else {
      drawStar(g, 0, -4, 13, 0xff9fc8);
    }
    return;
  }
  if (id.includes("wing")) {
    g.lineStyle(4, outline, 1);
    g.fillStyle(0xffffff, 0.88);
    g.fillEllipse(-24, 5, 34, 54);
    g.fillEllipse(24, 5, 34, 54);
    g.strokeEllipse(-24, 5, 34, 54);
    g.strokeEllipse(24, 5, 34, 54);
    return;
  }
  if (id.includes("wand")) {
    g.lineStyle(5, outline, 1);
    g.lineBetween(-22, 30, 20, -25);
    drawStar(g, 24, -30, 13, 0xffe176);
    return;
  }
  if (id.includes("kitty")) {
    g.lineStyle(5, outline, 1);
    g.fillStyle(0xffb6d5, 1);
    g.fillTriangle(-34, 10, -18, -30, 0, 10);
    g.fillTriangle(34, 10, 18, -30, 0, 10);
    return;
  }
  drawHeart(g, 0, 0, 15, 0xff7aa7);
}

function drawRainbow(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  [0xff9bb1, 0xffe176, 0x90d7b6, 0x83c7eb].forEach((color, index) => {
    g.lineStyle(4, color, 1);
    g.beginPath();
    g.arc(x, y, 23 - index * 5, Math.PI, 0, false);
    g.strokePath();
  });
}

function drawStar(g: Phaser.GameObjects.Graphics, x: number, y: number, radius: number, color: number): void {
  g.fillStyle(color, 1);
  g.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    const r = i % 2 === 0 ? radius : radius * 0.45;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) g.moveTo(px, py);
    else g.lineTo(px, py);
  }
  g.closePath();
  g.fillPath();
}

function drawHeart(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number): void {
  g.fillStyle(color, 1);
  g.fillCircle(x - size * 0.45, y - size * 0.18, size * 0.58);
  g.fillCircle(x + size * 0.45, y - size * 0.18, size * 0.58);
  g.fillTriangle(x - size * 1.05, y, x + size * 1.05, y, x, y + size * 1.18);
}

function drawBow(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number): void {
  g.lineStyle(4, outline, 1);
  g.fillStyle(color, 1);
  g.fillTriangle(x - 4, y, x - size * 1.8, y - size, x - size * 1.8, y + size);
  g.fillTriangle(x + 4, y, x + size * 1.8, y - size, x + size * 1.8, y + size);
  g.fillCircle(x, y, size * 0.55);
  g.strokeTriangle(x - 4, y, x - size * 1.8, y - size, x - size * 1.8, y + size);
  g.strokeTriangle(x + 4, y, x + size * 1.8, y - size, x + size * 1.8, y + size);
  g.strokeCircle(x, y, size * 0.55);
}

function drawFlower(g: Phaser.GameObjects.Graphics, x: number, y: number, petal: number, center: number): void {
  g.fillStyle(petal, 1);
  for (let i = 0; i < 6; i += 1) {
    const angle = i * Math.PI / 3;
    g.fillEllipse(x + Math.cos(angle) * 10, y + Math.sin(angle) * 10, 14, 10);
  }
  g.fillStyle(center, 1);
  g.fillCircle(x, y, 7);
}

function drawCatPocket(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  g.lineStyle(4, outline, 1);
  g.fillStyle(0xffffff, 1);
  g.fillRoundedRect(x - 19, y - 16, 38, 35, 10);
  g.strokeRoundedRect(x - 19, y - 16, 38, 35, 10);
  g.fillStyle(outline, 1);
  g.fillCircle(x - 7, y, 3);
  g.fillCircle(x + 7, y, 3);
}

function drawCloud(g: Phaser.GameObjects.Graphics, x: number, y: number, scale = 1): void {
  g.fillStyle(0xffffff, 1);
  g.fillCircle(x - 18 * scale, y + 2 * scale, 12 * scale);
  g.fillCircle(x, y - 7 * scale, 16 * scale);
  g.fillCircle(x + 18 * scale, y + 2 * scale, 12 * scale);
  g.fillRoundedRect(x - 30 * scale, y, 60 * scale, 20 * scale, 10 * scale);
}

function drawStrawberry(g: Phaser.GameObjects.Graphics, x: number, y: number, scale = 1): void {
  g.lineStyle(4, outline, 1);
  g.fillStyle(0xf75b73, 1);
  g.fillEllipse(x, y + 5 * scale, 30 * scale, 36 * scale);
  g.strokeEllipse(x, y + 5 * scale, 30 * scale, 36 * scale);
  g.fillStyle(0x8fb968, 1);
  g.fillTriangle(x - 12 * scale, y - 8 * scale, x, y - 22 * scale, x + 12 * scale, y - 8 * scale);
}

function drawCupcake(g: Phaser.GameObjects.Graphics, x: number, y: number, scale = 1): void {
  g.lineStyle(4, outline, 1);
  g.fillStyle(0xffe176, 1);
  g.fillRoundedRect(x - 22 * scale, y + 3 * scale, 44 * scale, 29 * scale, 7 * scale);
  g.strokeRoundedRect(x - 22 * scale, y + 3 * scale, 44 * scale, 29 * scale, 7 * scale);
  g.fillStyle(0xff9fc8, 1);
  g.fillEllipse(x, y, 46 * scale, 31 * scale);
  g.strokeEllipse(x, y, 46 * scale, 31 * scale);
}

function drawMoon(g: Phaser.GameObjects.Graphics, x: number, y: number, radius: number): void {
  g.fillStyle(0xffe176, 1);
  g.fillCircle(x, y, radius);
  g.fillStyle(0xffd36f, 1);
  g.fillCircle(x + 8, y - 3, radius);
}

function topPalette(id: string): { fill: number; detail: number } {
  if (id.includes("cat")) return { fill: 0xffd7e8, detail: 0xff82a8 };
  if (id.includes("cloud")) return { fill: 0xcfefff, detail: 0xffe176 };
  if (id.includes("strawberry")) return { fill: 0xffb6d5, detail: 0xf75b73 };
  if (id.includes("sailor")) return { fill: 0xfaf4e8, detail: 0x83c7eb };
  if (id.includes("sky")) return { fill: 0xaee3ff, detail: 0xff82a8 };
  if (id.includes("mint")) return { fill: 0xbcefd0, detail: 0xff9fc8 };
  if (id.includes("sunflower")) return { fill: 0xffd27a, detail: 0xffe176 };
  if (id.includes("rainbow")) return { fill: 0xffc2d9, detail: 0x83c7eb };
  return { fill: 0xffb6d5, detail: 0xffffff };
}

function bottomColor(id: string): number {
  if (id.includes("tutu")) return 0xffb6d5;
  if (id.includes("heart")) return 0xff9fc8;
  if (id.includes("cloud")) return 0xcfefff;
  if (id.includes("rainbow")) return 0xfaf4e8;
  if (id.includes("lilac")) return 0xc9a4ff;
  if (id.includes("mint")) return 0x9bdc9d;
  if (id.includes("star")) return 0x84c5e8;
  return 0x5fa3d8;
}

function dressColor(id: string): number {
  if (id.includes("cupcake")) return 0xd4b8ff;
  if (id.includes("rainbow")) return 0xfaf4e8;
  if (id.includes("rose")) return 0xff8dae;
  if (id.includes("starry")) return 0x7fc5e8;
  if (id.includes("moon")) return 0xffd36f;
  return 0xff9fc8;
}

function shoeColor(id: string): number {
  if (id.includes("lilac")) return 0xc9a4ff;
  if (id.includes("blue")) return 0x83c7eb;
  if (id.includes("yellow")) return 0xffd36f;
  if (id.includes("mint")) return 0x95dfb8;
  return 0xff9fc8;
}
