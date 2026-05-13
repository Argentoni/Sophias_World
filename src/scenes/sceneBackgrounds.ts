import Phaser from "phaser";

export function drawMapBackground(scene: Phaser.Scene): void {
  addBackground(scene, "bg-map");
  scene.add.rectangle(640, 360, 1280, 720, 0xffffff, 0.08);
}

export function drawRoomBackground(scene: Phaser.Scene, roomId: string): void {
  const palette = roomPalette(roomId);
  drawEmptyRoom(scene, palette);
  if (roomId === "bedroom") drawSoftWindow(scene, 270, 170, palette.accent);
  if (roomId === "living-room") drawSoftWindow(scene, 1010, 166, palette.accent);
  if (roomId === "kitchen") drawKitchenWall(scene, palette.accent);
}

export function drawParkBackground(scene: Phaser.Scene): void {
  const g = scene.add.graphics().setDepth(-1000);
  g.fillGradientStyle(0xb9edff, 0xb9edff, 0xf7ffe9, 0xf7ffe9, 1);
  g.fillRect(0, 0, 1280, 720);
  drawCloud(g, 140, 85, 1.15);
  drawCloud(g, 980, 78, 0.9);
  g.fillGradientStyle(0xcaf2a8, 0xcaf2a8, 0x8fd27c, 0x8fd27c, 1);
  g.fillRect(0, 290, 1280, 430);
  g.fillStyle(0xf7dfb5, 1);
  g.fillEllipse(655, 540, 980, 180);
  g.lineStyle(4, 0xffffff, 0.42);
  g.strokeEllipse(655, 540, 980, 180);
  drawTree(g, 120, 300, 0.9);
  drawTree(g, 1120, 300, 0.8);
  drawBushes(g);
  scene.add.rectangle(640, 360, 1280, 720, 0xffffff, 0.03).setDepth(-999);
}

export function drawShopBackground(scene: Phaser.Scene): void {
  const g = scene.add.graphics().setDepth(-1000);
  g.fillGradientStyle(0xffd6e7, 0xccefff, 0xfff4df, 0xfff4df, 1);
  g.fillRect(0, 0, 1280, 720);
  g.fillStyle(0xffffff, 0.55);
  g.fillRoundedRect(96, 96, 1088, 198, 36);
  g.lineStyle(5, 0xffffff, 0.7);
  g.strokeRoundedRect(96, 96, 1088, 198, 36);
  for (let i = 0; i < 4; i += 1) {
    const x = 185 + i * 300;
    g.fillStyle(i % 2 === 0 ? 0xfff3bd : 0xcdf0e1, 0.55);
    g.fillRoundedRect(x, 134, 180, 112, 24);
    g.lineStyle(4, 0xffffff, 0.7);
    g.strokeRoundedRect(x, 134, 180, 112, 24);
  }
  drawFloor(scene, 0xf6d19c, 0xeebd84);
  scene.add.rectangle(640, 360, 1280, 720, 0xffffff, 0.05).setDepth(-999);
}

function addBackground(scene: Phaser.Scene, key: string): void {
  scene.add.image(640, 360, key).setDisplaySize(1280, 720).setDepth(-1000);
}

type RoomPalette = {
  top: number;
  bottom: number;
  panel: number;
  floor: number;
  floorLine: number;
  accent: number;
};

function roomPalette(roomId: string): RoomPalette {
  if (roomId === "living-room") {
    return { top: 0xf7ead8, bottom: 0xd8f1df, panel: 0xc4e5cf, floor: 0xecc390, floorLine: 0xdba66e, accent: 0x9bd9cb };
  }
  if (roomId === "kitchen") {
    return { top: 0xf5fbff, bottom: 0xd6eff7, panel: 0xc7e9f2, floor: 0xf0cfa4, floorLine: 0xd9ab77, accent: 0x8ec8ff };
  }
  return { top: 0xffedf5, bottom: 0xffc8dc, panel: 0xf8aac7, floor: 0xefbd82, floorLine: 0xdca166, accent: 0xff9fc8 };
}

function drawEmptyRoom(scene: Phaser.Scene, palette: RoomPalette): void {
  const g = scene.add.graphics().setDepth(-1000);
  g.fillGradientStyle(palette.top, palette.top, palette.bottom, palette.bottom, 1);
  g.fillRect(0, 0, 1280, 390);
  g.fillStyle(palette.panel, 0.88);
  g.fillRect(0, 285, 1280, 122);
  g.lineStyle(5, 0xffffff, 0.45);
  g.lineBetween(0, 286, 1280, 286);
  g.lineBetween(0, 406, 1280, 406);
  for (let x = 30; x < 1280; x += 42) {
    g.lineStyle(1, 0xffffff, 0.2);
    g.lineBetween(x, 302, x, 402);
  }
  drawTinyWallMotifs(g);
  drawFloor(scene, palette.floor, palette.floorLine);
  scene.add.rectangle(640, 360, 1280, 720, 0xffffff, 0.04).setDepth(-999);
}

function drawFloor(scene: Phaser.Scene, fill: number, line: number): void {
  const g = scene.add.graphics().setDepth(-998);
  g.fillGradientStyle(0xffdfab, 0xffdfab, fill, fill, 1);
  g.fillRect(0, 390, 1280, 330);
  g.lineStyle(2, line, 0.38);
  for (let y = 430; y < 720; y += 44) g.lineBetween(0, y, 1280, y);
  for (let row = 0; row < 7; row += 1) {
    const y = 430 + row * 44;
    const offset = row % 2 === 0 ? 0 : 84;
    for (let x = -offset; x < 1280; x += 168) g.lineBetween(x, y, x + 64, y - 44);
  }
}

function drawSoftWindow(scene: Phaser.Scene, x: number, y: number, accent: number): void {
  const g = scene.add.graphics().setDepth(-997);
  g.fillStyle(0xffffff, 0.88);
  g.fillRoundedRect(x - 142, y - 74, 284, 158, 18);
  g.lineStyle(6, 0xffffff, 0.9);
  g.strokeRoundedRect(x - 142, y - 74, 284, 158, 18);
  g.fillGradientStyle(0xaee8ff, 0xaee8ff, 0xe9ffd2, 0xe9ffd2, 1);
  g.fillRoundedRect(x - 125, y - 58, 250, 126, 12);
  g.lineStyle(4, 0xffffff, 0.85);
  g.lineBetween(x, y - 58, x, y + 68);
  g.lineBetween(x - 125, y + 4, x + 125, y + 4);
  g.fillStyle(accent, 0.45);
  g.fillRoundedRect(x - 171, y - 80, 36, 192, 18);
  g.fillRoundedRect(x + 135, y - 80, 36, 192, 18);
  g.fillStyle(0xffe176, 0.75);
  g.fillCircle(x - 136, y + 20, 14);
  g.fillCircle(x + 136, y + 20, 14);
}

function drawKitchenWall(scene: Phaser.Scene, accent: number): void {
  const g = scene.add.graphics().setDepth(-997);
  g.fillStyle(0xffffff, 0.32);
  for (let y = 82; y < 260; y += 42) {
    for (let x = 90; x < 1190; x += 78) {
      g.fillRoundedRect(x, y, 68, 32, 8);
    }
  }
  g.fillStyle(accent, 0.24);
  g.fillRoundedRect(120, 106, 1040, 130, 28);
  g.lineStyle(5, 0xffffff, 0.6);
  g.strokeRoundedRect(120, 106, 1040, 130, 28);
}

function drawTinyWallMotifs(g: Phaser.GameObjects.Graphics): void {
  const colors = [0xffb6d5, 0xffe176, 0x9bd9cb, 0xc9a4ff];
  for (let i = 0; i < 42; i += 1) {
    const x = 36 + (i * 97) % 1200;
    const y = 82 + (i * 53) % 178;
    g.fillStyle(colors[i % colors.length], 0.28);
    if (i % 3 === 0) g.fillCircle(x, y, 5);
    else drawSimpleStar(g, x, y, 7);
  }
}

function drawCloud(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
  g.fillStyle(0xffffff, 0.78);
  g.fillCircle(x - 45 * scale, y + 12 * scale, 32 * scale);
  g.fillCircle(x, y, 42 * scale);
  g.fillCircle(x + 45 * scale, y + 13 * scale, 30 * scale);
  g.fillRoundedRect(x - 76 * scale, y + 9 * scale, 152 * scale, 35 * scale, 18 * scale);
}

function drawTree(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
  g.fillStyle(0xb98556, 1);
  g.fillRoundedRect(x - 15 * scale, y + 58 * scale, 30 * scale, 100 * scale, 14 * scale);
  g.fillStyle(0x88cc74, 1);
  g.fillCircle(x - 42 * scale, y + 48 * scale, 46 * scale);
  g.fillCircle(x + 8 * scale, y + 16 * scale, 58 * scale);
  g.fillCircle(x + 54 * scale, y + 56 * scale, 44 * scale);
  g.fillStyle(0xffffff, 0.4);
  g.fillCircle(x - 20 * scale, y + 28 * scale, 10 * scale);
  g.fillCircle(x + 42 * scale, y + 42 * scale, 8 * scale);
}

function drawBushes(g: Phaser.GameObjects.Graphics): void {
  const colors = [0x7ccf78, 0x95d982, 0x6ec58a];
  for (let i = 0; i < 24; i += 1) {
    const x = 30 + i * 55;
    const y = 660 + Math.sin(i) * 16;
    g.fillStyle(colors[i % colors.length], 1);
    g.fillCircle(x, y, 38);
    g.fillStyle(i % 2 === 0 ? 0xffb6d5 : 0xffe176, 0.7);
    g.fillCircle(x + 6, y - 12, 5);
  }
}

function drawSimpleStar(g: Phaser.GameObjects.Graphics, x: number, y: number, radius: number): void {
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
