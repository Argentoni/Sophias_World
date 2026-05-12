import Phaser from "phaser";
import type { Character } from "../schemas/saveState";

const outline = 0x8f4a32;
const dollWidth = 406;
const dollHeight = 844;
const centerX = dollWidth / 2;

const hairColors = ["#1A1A24", "#6E4A2C", "#D8AA82", "#FFB6D5"];
const hairColorNumbers = [0x211c2c, 0x6e4a2c, 0xd8aa82, 0xffa9cf];
const hairHighlightNumbers = [0x5b4a62, 0xa9784f, 0xffd2a5, 0xffd8e8];

export const hairStyles = ["bob", "pigtails", "braids", "curly", "long"];
export const eyeStyles = ["sparkle", "round", "smile", "star", "sleepy"];
export const mouthStyles = ["smile", "open", "yum", "curious", "sleepy"];
export { hairColors };

export class CharacterComposer {
  readonly container: Phaser.GameObjects.Container;
  private dragZone?: Phaser.GameObjects.Zone;

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    private scaleFactor = 0.38
  ) {
    this.container = scene.add.container(x, y);
    this.container.setSize(dollWidth * scaleFactor, dollHeight * scaleFactor);
    this.container.setDepth(y);
  }

  render(character: Character): void {
    this.container.removeAll(true);
    const shadow = this.scene.add.ellipse(0, 3, 158 * this.scaleFactor, 30 * this.scaleFactor, 0x6e4a2c, 0.15);
    const backHair = this.drawHair(character, "back");
    const doll = this.scene.add.image(0, 0, "doll-base").setOrigin(0.5, 1).setScale(this.scaleFactor);
    const outfit = this.drawOutfit(character);
    const frontHair = this.drawHair(character, "front");
    const accessories = this.drawAccessories(character);
    const mood = this.drawMood(character);
    this.container.add([shadow, backHair, doll, outfit, frontHair, accessories, mood]);
    this.container.setDepth(this.container.y);
  }

  setPosition(x: number, y: number): void {
    this.container.setPosition(x, y);
    this.container.setDepth(y);
    this.syncDragZone();
  }

  enableDrag(onMove: (x: number, y: number) => void, onDrop: (x: number, y: number) => void): void {
    const width = dollWidth * this.scaleFactor;
    const height = dollHeight * this.scaleFactor;
    this.container.disableInteractive();
    this.dragZone?.destroy();
    this.dragZone = this.scene.add.zone(0, 0, width + 72, height + 110)
      .setDepth(this.container.depth + 1)
      .setInteractive({ useHandCursor: true });
    this.syncDragZone();
    this.scene.input.setDraggable(this.dragZone);
    this.scene.input.on(
      "drag",
      (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
        if (obj !== this.dragZone) return;
        const nextX = dragX;
        const nextY = dragY + height / 2 - 20;
        this.setPosition(nextX, nextY);
        onMove(nextX, nextY);
      }
    );
    this.scene.input.on("dragend", (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject) => {
      if (obj !== this.dragZone) return;
      onDrop(this.container.x, this.container.y);
    });
  }

  private syncDragZone(): void {
    if (!this.dragZone) return;
    const height = dollHeight * this.scaleFactor;
    this.dragZone.setPosition(this.container.x, this.container.y - height / 2 + 20);
    this.dragZone.setDepth(this.container.depth + 1);
  }

  private drawOutfit(character: Character): Phaser.GameObjects.Graphics {
    const g = this.layer();
    const outfit = character.outfit;
    if (outfit.dress) {
      drawDress(g, outfit.dress);
    } else {
      drawTop(g, outfit.top ?? "outfit-001");
      drawBottom(g, outfit.bottom ?? "bottom-denim");
    }
    drawShoes(g, outfit.shoes ?? "shoes-pink");
    return g;
  }

  private drawHair(character: Character, layer: "back" | "front"): Phaser.GameObjects.Graphics {
    const g = this.layer();
    const colorIndex = hairColors.indexOf(character.hair.color);
    const color = hairColorNumbers[colorIndex] ?? hairColorNumbers[0];
    const highlight = hairHighlightNumbers[colorIndex] ?? hairHighlightNumbers[0];
    if (layer === "back") {
      drawBackHair(g, character.hair.styleId, color);
      return g;
    }
    drawFrontHair(g, character.hair.styleId, color, highlight);
    return g;
  }

  private drawAccessories(character: Character): Phaser.GameObjects.Graphics {
    const g = this.layer();
    for (const id of character.outfit.accessories) {
      if (id === "acc-bow-pink") drawBow(g, 104, 142, 17, 0xff9fc8);
      if (id === "acc-crown-soft") drawCrown(g, 203, 35);
      if (id === "acc-glasses-star") drawGlasses(g);
      if (id === "acc-necklace-heart") drawHeart(g, 203, 356, 10, 0xff7aa7);
      if (id === "acc-bag-bunny") drawBag(g);
    }
    return g;
  }

  private drawMood(character: Character): Phaser.GameObjects.Container {
    const mood = moodText(character.face.mouth);
    const container = this.scene.add.container(72 * this.scaleFactor, -790 * this.scaleFactor);
    if (!mood) return container;
    const bubble = this.scene.add.circle(0, 0, 25, 0xffffff, 0.82).setStrokeStyle(4, 0x6e4a2c, 0.75);
    const text = this.scene.add.text(0, -1, mood, {
      fontFamily: "Arial, sans-serif",
      fontSize: "25px",
      color: "#6E4A2C",
      fontStyle: "bold"
    }).setOrigin(0.5);
    container.add([bubble, text]);
    return container;
  }

  private layer(): Phaser.GameObjects.Graphics {
    return this.scene.add.graphics().setScale(this.scaleFactor);
  }
}

function lx(x: number): number {
  return x - centerX;
}

function ly(y: number): number {
  return y - dollHeight;
}

function drawBackHair(g: Phaser.GameObjects.Graphics, style: string, color: number): void {
  if (style === "bob") return;
  g.lineStyle(7, outline, 0.72);
  g.fillStyle(color, 1);
  if (style === "long") {
    g.fillRoundedRect(lx(47), ly(55), 312, 350, 106);
    g.strokeRoundedRect(lx(47), ly(55), 312, 350, 106);
  }
  if (style === "pigtails") {
    g.fillCircle(lx(64), ly(260), 48);
    g.fillCircle(lx(342), ly(260), 48);
    g.strokeCircle(lx(64), ly(260), 48);
    g.strokeCircle(lx(342), ly(260), 48);
  }
  if (style === "braids") {
    g.fillRoundedRect(lx(54), ly(238), 46, 190, 24);
    g.fillRoundedRect(lx(306), ly(238), 46, 190, 24);
    g.strokeRoundedRect(lx(54), ly(238), 46, 190, 24);
    g.strokeRoundedRect(lx(306), ly(238), 46, 190, 24);
  }
}

function drawFrontHair(g: Phaser.GameObjects.Graphics, style: string, color: number, highlight: number): void {
  if (style === "bob") return;
  g.lineStyle(7, outline, 0.82);
  g.fillStyle(color, 1);
  g.fillEllipse(lx(203), ly(85), 290, 112);
  g.strokeEllipse(lx(203), ly(85), 290, 112);
  if (style === "curly") {
    for (let x = 82; x <= 324; x += 34) g.fillCircle(lx(x), ly(136 + Math.abs(203 - x) / 18), 28);
  } else {
    g.fillTriangle(lx(78), ly(115), lx(152), ly(125), lx(112), ly(192));
    g.fillTriangle(lx(140), ly(110), lx(224), ly(116), lx(185), ly(190));
    g.fillTriangle(lx(218), ly(116), lx(322), ly(123), lx(276), ly(190));
  }
  if (style === "bob" || style === "long" || style === "curly") {
    g.fillRoundedRect(lx(52), ly(150), 48, 154, 25);
    g.fillRoundedRect(lx(306), ly(150), 48, 154, 25);
    g.strokeRoundedRect(lx(52), ly(150), 48, 154, 25);
    g.strokeRoundedRect(lx(306), ly(150), 48, 154, 25);
  }
  g.lineStyle(6, highlight, 0.35);
  g.beginPath();
  g.arc(lx(178), ly(92), 54, Math.PI * 1.05, Math.PI * 1.65, false);
  g.arc(lx(244), ly(94), 44, Math.PI * 1.08, Math.PI * 1.58, false);
  g.strokePath();
}

function drawTop(g: Phaser.GameObjects.Graphics, id: string): void {
  const palette = topPalette(id);
  g.lineStyle(5, outline, 1);
  g.fillStyle(palette.fill, 1);
  g.fillRoundedRect(lx(128), ly(340), 150, 125, 28);
  g.fillTriangle(lx(126), ly(350), lx(58), ly(504), lx(101), ly(523));
  g.fillTriangle(lx(280), ly(350), lx(348), ly(504), lx(305), ly(523));
  g.strokeRoundedRect(lx(128), ly(340), 150, 125, 28);
  g.strokeTriangle(lx(126), ly(350), lx(58), ly(504), lx(101), ly(523));
  g.strokeTriangle(lx(280), ly(350), lx(348), ly(504), lx(305), ly(523));
  g.lineStyle(6, 0xffffff, 0.5);
  g.beginPath();
  g.arc(lx(203), ly(346), 43, Math.PI * 0.1, Math.PI * 0.9, false);
  g.strokePath();
  if (id.includes("heart")) drawHeart(g, 203, 410, 22, palette.detail);
  else if (id.includes("ribbon")) drawBow(g, 203, 410, 16, palette.detail);
  else if (id.includes("sunflower")) drawFlower(g, 203, 410, 0xffe176, 0x8fb968);
  else if (id.includes("rainbow")) drawRainbow(g, 203, 430);
  else drawStar(g, 203, 413, 30, 0xffffff);
}

function drawBottom(g: Phaser.GameObjects.Graphics, id: string): void {
  const color = bottomColor(id);
  g.lineStyle(5, outline, 1);
  g.fillStyle(color, 1);
  if (id.includes("skirt") || id.includes("lilac")) {
    g.beginPath();
    g.moveTo(lx(129), ly(465));
    g.lineTo(lx(277), ly(465));
    g.lineTo(lx(301), ly(579));
    g.lineTo(lx(105), ly(579));
    g.closePath();
    g.fillPath();
    g.strokePath();
    if (id.includes("star")) drawStar(g, 203, 526, 20, 0xffffff);
    return;
  }
  g.fillRoundedRect(lx(130), ly(463), 146, 100, 26);
  g.strokeRoundedRect(lx(130), ly(463), 146, 100, 26);
  g.lineStyle(4, 0xffffff, 0.42);
  g.lineBetween(lx(203), ly(478), lx(203), ly(557));
}

function drawDress(g: Phaser.GameObjects.Graphics, id: string): void {
  const color = dressColor(id);
  g.lineStyle(5, outline, 1);
  g.fillStyle(color, 1);
  g.fillRoundedRect(lx(128), ly(338), 150, 120, 28);
  g.beginPath();
  g.moveTo(lx(128), ly(430));
  g.lineTo(lx(278), ly(430));
  g.lineTo(lx(318), ly(620));
  g.lineTo(lx(203), ly(655));
  g.lineTo(lx(88), ly(620));
  g.closePath();
  g.fillPath();
  g.strokeRoundedRect(lx(128), ly(338), 150, 120, 28);
  g.strokePath();
  if (id.includes("starry")) {
    drawStar(g, 178, 510, 20, 0xffffff);
    drawStar(g, 238, 555, 14, 0xffe176);
  } else if (id.includes("flower")) drawFlower(g, 203, 515, 0xffffff, 0xff9bb1);
  else drawMoon(g, 208, 515, 28);
}

function drawShoes(g: Phaser.GameObjects.Graphics, id: string): void {
  const color = shoeColor(id);
  g.lineStyle(5, outline, 1);
  g.fillStyle(color, 1);
  g.fillEllipse(lx(158), ly(815), 70, 28);
  g.fillEllipse(lx(248), ly(815), 70, 28);
  g.strokeEllipse(lx(158), ly(815), 70, 28);
  g.strokeEllipse(lx(248), ly(815), 70, 28);
  g.lineStyle(3, 0xffffff, 0.55);
  g.lineBetween(lx(134), ly(808), lx(177), ly(808));
  g.lineBetween(lx(229), ly(808), lx(272), ly(808));
}

function drawGlasses(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(5, 0xffe176, 1);
  g.strokeCircle(lx(146), ly(225), 34);
  g.strokeCircle(lx(260), ly(225), 34);
  g.lineBetween(lx(180), ly(225), lx(226), ly(225));
  drawStar(g, 102, 188, 10, 0xffe176);
}

function drawBag(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(5, outline, 1);
  g.fillStyle(0xffb6d5, 1);
  g.beginPath();
  g.arc(lx(330), ly(530), 45, Math.PI * 1.12, Math.PI * 1.88, false);
  g.strokePath();
  g.fillRoundedRect(lx(305), ly(548), 54, 62, 14);
  g.strokeRoundedRect(lx(305), ly(548), 54, 62, 14);
  g.fillStyle(0xfff8e8, 1);
  g.fillCircle(lx(323), ly(575), 6);
  g.fillCircle(lx(342), ly(575), 6);
}

function drawRainbow(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  [0xff9bb1, 0xffe176, 0x90d7b6, 0x83c7eb].forEach((color, index) => {
    g.lineStyle(5, color, 1);
    g.beginPath();
    g.arc(lx(x), ly(y), 34 - index * 7, Math.PI, 0, false);
    g.strokePath();
  });
}

function drawStar(g: Phaser.GameObjects.Graphics, x: number, y: number, radius: number, color: number): void {
  g.fillStyle(color, 1);
  g.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    const r = i % 2 === 0 ? radius : radius * 0.45;
    const px = lx(x) + Math.cos(angle) * r;
    const py = ly(y) + Math.sin(angle) * r;
    if (i === 0) g.moveTo(px, py);
    else g.lineTo(px, py);
  }
  g.closePath();
  g.fillPath();
}

function drawHeart(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number): void {
  g.fillStyle(color, 1);
  g.fillCircle(lx(x - size * 0.45), ly(y - size * 0.18), size * 0.58);
  g.fillCircle(lx(x + size * 0.45), ly(y - size * 0.18), size * 0.58);
  g.fillTriangle(lx(x - size * 1.05), ly(y), lx(x + size * 1.05), ly(y), lx(x), ly(y + size * 1.18));
}

function drawBow(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number): void {
  g.lineStyle(4, outline, 1);
  g.fillStyle(color, 1);
  g.fillTriangle(lx(x - 4), ly(y), lx(x - size * 1.8), ly(y - size), lx(x - size * 1.8), ly(y + size));
  g.fillTriangle(lx(x + 4), ly(y), lx(x + size * 1.8), ly(y - size), lx(x + size * 1.8), ly(y + size));
  g.fillCircle(lx(x), ly(y), size * 0.55);
}

function drawFlower(g: Phaser.GameObjects.Graphics, x: number, y: number, petal: number, center: number): void {
  g.fillStyle(petal, 1);
  for (let i = 0; i < 6; i += 1) {
    const angle = i * Math.PI / 3;
    g.fillEllipse(lx(x + Math.cos(angle) * 18), ly(y + Math.sin(angle) * 18), 25, 18);
  }
  g.fillStyle(center, 1);
  g.fillCircle(lx(x), ly(y), 12);
}

function drawMoon(g: Phaser.GameObjects.Graphics, x: number, y: number, radius: number): void {
  g.fillStyle(0xffe176, 1);
  g.fillCircle(lx(x), ly(y), radius);
  g.fillStyle(0xffd36f, 1);
  g.fillCircle(lx(x + 13), ly(y - 5), radius);
}

function drawCrown(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  g.lineStyle(5, outline, 1);
  g.fillStyle(0xffe176, 1);
  g.beginPath();
  g.moveTo(lx(x - 45), ly(y + 38));
  g.lineTo(lx(x - 26), ly(y - 4));
  g.lineTo(lx(x), ly(y + 20));
  g.lineTo(lx(x + 26), ly(y - 4));
  g.lineTo(lx(x + 45), ly(y + 38));
  g.closePath();
  g.fillPath();
  g.strokePath();
}

function topPalette(id: string): { fill: number; detail: number } {
  if (id.includes("sky")) return { fill: 0xaee3ff, detail: 0xff82a8 };
  if (id.includes("mint")) return { fill: 0xbcefd0, detail: 0xff9fc8 };
  if (id.includes("sunflower")) return { fill: 0xffd27a, detail: 0xffe176 };
  if (id.includes("rainbow")) return { fill: 0xffc2d9, detail: 0x83c7eb };
  return { fill: 0xffb6d5, detail: 0xffffff };
}

function bottomColor(id: string): number {
  if (id.includes("lilac")) return 0xc9a4ff;
  if (id.includes("mint")) return 0x9bdc9d;
  if (id.includes("star")) return 0x84c5e8;
  return 0x5fa3d8;
}

function dressColor(id: string): number {
  if (id.includes("starry")) return 0x7fc5e8;
  if (id.includes("moon")) return 0xffd36f;
  return 0xff9fc8;
}

function shoeColor(id: string): number {
  if (id.includes("yellow")) return 0xffd36f;
  if (id.includes("mint")) return 0x95dfb8;
  return 0xff9fc8;
}

function moodText(mouth: string): string {
  if (mouth === "yum") return "♥";
  if (mouth === "curious") return "?";
  if (mouth === "sleepy") return "Z";
  if (mouth === "open") return "!";
  return "";
}
