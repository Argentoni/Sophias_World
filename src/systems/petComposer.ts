import Phaser from "phaser";
import type { Pet } from "../schemas/saveState";

const outline = 0x70462e;
const furColors: Record<Pet["color"], { body: number; ear: number; patch: number }> = {
  cream: { body: 0xfff0d8, ear: 0xe8b68e, patch: 0xf7d2a6 },
  caramel: { body: 0xd99a5c, ear: 0x9b6338, patch: 0xffe2b8 },
  cocoa: { body: 0x8a5a3b, ear: 0x5a3828, patch: 0xf4c49b }
};

export class PetComposer {
  readonly container: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number, scaleFactor = 0.8) {
    this.scene = scene;
    this.container = scene.add.container(x, y);
    this.container.setSize(148, 118);
    this.container.setScale(scaleFactor);
    this.container.setDepth(y);
  }

  render(pet: Pet): void {
    this.container.removeAll(true);
    const shadow = this.scene.add.ellipse(0, 50, 106, 24, 0x6e4a2c, 0.16);
    const body = this.drawDog(pet);
    const accessories = this.drawAccessories(pet.accessories);
    this.container.add([shadow, body, accessories]);
    this.container.setDepth(this.container.y);
  }

  setPosition(x: number, y: number): void {
    this.container.setPosition(x, y);
    this.container.setDepth(y);
  }

  enableDrag(onMove: (x: number, y: number) => void, onDrop: (x: number, y: number) => void): void {
    this.container.setInteractive(
      new Phaser.Geom.Rectangle(-74, -72, 148, 140),
      Phaser.Geom.Rectangle.Contains
    );
    this.scene.input.setDraggable(this.container);
    this.scene.input.on(
      "drag",
      (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
        if (obj !== this.container) return;
        this.setPosition(dragX, dragY);
        onMove(dragX, dragY);
      }
    );
    this.scene.input.on(
      "dragend",
      (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject) => {
        if (obj !== this.container) return;
        onDrop(this.container.x, this.container.y);
      }
    );
  }

  private drawDog(pet: Pet): Phaser.GameObjects.Graphics {
    const color = furColors[pet.color];
    const g = this.scene.add.graphics();
    g.lineStyle(8, outline, 1);
    g.beginPath();
    g.arc(58, 9, 42, Math.PI * 1.08, Math.PI * 1.86, false);
    g.strokePath();

    g.lineStyle(5, outline, 1);
    g.fillStyle(color.ear, 1);
    g.beginPath();
    g.moveTo(-42, -51);
    g.lineTo(-72, -70);
    g.lineTo(-72, -34);
    g.lineTo(-56, -4);
    g.lineTo(-36, -1);
    g.closePath();
    g.fillPath();
    g.strokePath();
    g.beginPath();
    g.moveTo(42, -51);
    g.lineTo(72, -70);
    g.lineTo(72, -34);
    g.lineTo(56, -4);
    g.lineTo(36, -1);
    g.closePath();
    g.fillPath();
    g.strokePath();

    g.fillStyle(color.body, 1);
    g.fillEllipse(0, 19, 110, 70);
    g.strokeEllipse(0, 19, 110, 70);
    g.fillStyle(color.patch, 0.42);
    g.fillEllipse(18, 16, 46, 32);
    g.fillStyle(color.body, 1);
    g.fillEllipse(-37, 51, 24, 35);
    g.fillEllipse(34, 51, 24, 35);
    g.strokeEllipse(-37, 51, 24, 35);
    g.strokeEllipse(34, 51, 24, 35);

    g.fillStyle(color.body, 1);
    g.fillCircle(0, -30, 58);
    g.strokeCircle(0, -30, 58);
    g.fillStyle(color.patch, 1);
    g.fillEllipse(0, -10, 58, 39);
    g.fillEllipse(-20, -39, 28, 24);

    g.fillStyle(0x3f2a1c, 1);
    g.fillCircle(-20, -34, 6.5);
    g.fillCircle(20, -34, 6.5);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(-22, -37, 2.3);
    g.fillCircle(18, -37, 2.3);
    g.fillStyle(0x3f2a1c, 1);
    g.fillRoundedRect(-7, -18, 14, 9, 5);
    g.lineStyle(3, outline, 1);
    g.beginPath();
    g.arc(-8, -8, 10, 0.05, Math.PI * 0.88, false);
    g.arc(8, -8, 10, Math.PI * 0.12, Math.PI - 0.05, false);
    g.strokePath();

    g.fillStyle(0xff9bb1, 0.36);
    g.fillEllipse(-35, -18, 18, 10);
    g.fillEllipse(35, -18, 18, 10);
    g.fillStyle(0xffffff, 0.42);
    g.fillEllipse(-20, 2, 34, 18);
    return g;
  }

  private drawAccessories(accessories: string[]): Phaser.GameObjects.Graphics {
    const g = this.scene.add.graphics();
    for (const id of accessories) {
      if (id === "pet-collar-pink") drawCollar(g, 0xff9fc8);
      if (id === "pet-bandana-mint") drawBandana(g);
      if (id === "pet-bow-blue") drawBow(g, -31, -62, 12, 0x83c7eb);
      if (id === "pet-glasses-round") drawGlasses(g);
      if (id === "pet-cape-star") drawCape(g);
      if (id === "pet-flower-clip") drawFlower(g, -40, -55);
      if (id === "pet-star-hat") drawStarHat(g);
      if (id === "pet-rainbow-scarf") drawRainbowScarf(g);
    }
    return g;
  }
}

function drawCollar(g: Phaser.GameObjects.Graphics, color: number): void {
  g.lineStyle(5, outline, 1);
  g.strokeRoundedRect(-29, 11, 58, 13, 7);
  g.fillStyle(color, 1);
  g.fillRoundedRect(-29, 10, 58, 14, 7);
  g.strokeRoundedRect(-29, 10, 58, 14, 7);
  g.fillStyle(0xffe176, 1);
  g.fillCircle(0, 25, 6);
}

function drawBandana(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(5, outline, 1);
  g.fillStyle(0xa6e7c2, 1);
  g.beginPath();
  g.moveTo(-31, 10);
  g.lineTo(31, 10);
  g.lineTo(0, 43);
  g.closePath();
  g.fillPath();
  g.strokePath();
}

function drawCape(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(5, outline, 1);
  g.fillStyle(0x8ec8ff, 0.88);
  g.beginPath();
  g.moveTo(28, 10);
  g.lineTo(67, 19);
  g.lineTo(72, 63);
  g.lineTo(24, 46);
  g.closePath();
  g.fillPath();
  g.strokePath();
  drawStar(g, 55, 42, 9, 0xffe176);
}

function drawFlower(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  g.lineStyle(3, outline, 1);
  g.fillStyle(0xff9fc8, 1);
  for (let i = 0; i < 6; i += 1) {
    const angle = i * Math.PI / 3;
    g.fillEllipse(x + Math.cos(angle) * 10, y + Math.sin(angle) * 10, 14, 10);
  }
  g.fillStyle(0xffe176, 1);
  g.fillCircle(x, y, 7);
}

function drawStarHat(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(4, outline, 1);
  g.fillStyle(0xffe176, 1);
  g.fillEllipse(0, -70, 64, 26);
  g.strokeEllipse(0, -70, 64, 26);
  drawStar(g, 0, -76, 14, 0xff9fc8);
}

function drawRainbowScarf(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(4, outline, 1);
  g.fillStyle(0xfaf4e8, 1);
  g.fillRoundedRect(-34, 8, 68, 16, 8);
  g.strokeRoundedRect(-34, 8, 68, 16, 8);
  [0xff9bb1, 0xffe176, 0x90d7b6, 0x83c7eb].forEach((color, index) => {
    g.lineStyle(4, color, 1);
    g.lineBetween(-28 + index * 15, 16, -10 + index * 15, 16);
  });
  g.lineStyle(8, 0x83c7eb, 1);
  g.lineBetween(23, 20, 49, 44);
}

function drawGlasses(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(4, 0xffe176, 1);
  g.strokeCircle(-19, -30, 14);
  g.strokeCircle(19, -30, 14);
  g.lineBetween(-5, -30, 5, -30);
}

function drawBow(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number): void {
  g.lineStyle(4, outline, 1);
  g.fillStyle(color, 1);
  g.fillTriangle(x - 3, y, x - size * 1.8, y - size, x - size * 1.8, y + size);
  g.fillTriangle(x + 3, y, x + size * 1.8, y - size, x + size * 1.8, y + size);
  g.fillCircle(x, y, size * 0.55);
  g.strokeTriangle(x - 3, y, x - size * 1.8, y - size, x - size * 1.8, y + size);
  g.strokeTriangle(x + 3, y, x + size * 1.8, y - size, x + size * 1.8, y + size);
  g.strokeCircle(x, y, size * 0.55);
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
