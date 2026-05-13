import Phaser from "phaser";
import type { Character } from "../schemas/saveState";

const outline = 0x8f4a32;
const dollWidth = 406;
const dollHeight = 844;
const centerX = dollWidth / 2;

const hairColors = ["#1A1A24", "#6E4A2C", "#D8AA82", "#FFB6D5"];
const hairColorNumbers = [0x211c2c, 0x6e4a2c, 0xd8aa82, 0xffa9cf];
const hairHighlightNumbers = [0x5b4a62, 0xa9784f, 0xffd2a5, 0xffd8e8];

export const hairStyles = ["bob", "pigtails", "braids", "curly", "long", "buns", "ponytail", "waves"];
export const eyeStyles = ["sparkle", "round", "smile", "star", "sleepy", "wink", "heart", "gentle"];
export const mouthStyles = ["smile", "open", "yum", "curious", "sleepy", "laugh", "tiny", "kiss"];
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
    this.scene.tweens.killTweensOf(this.container.list);
    this.container.removeAll(true);
    const visual = this.scene.add.container(0, 0);
    const shadow = this.scene.add.ellipse(0, 3, 158 * this.scaleFactor, 30 * this.scaleFactor, 0x6e4a2c, 0.15);
    const backHair = this.drawHair(character, "back");
    const doll = this.scene.add.image(0, 0, "doll-base").setOrigin(0.5, 1).setScale(this.scaleFactor);
    const outfit = this.drawOutfit(character);
    const faceBase = this.drawFaceBase();
    const face = this.drawFace(character);
    const frontHair = this.drawHair(character, "front");
    const accessories = this.drawAccessories(character);
    const mood = this.drawMood(character);
    visual.add([shadow, backHair, doll, outfit, faceBase, face, frontHair, accessories, mood]);
    this.container.add(visual);
    this.container.setDepth(this.container.y);
    this.scene.tweens.add({ targets: visual, y: -4, duration: 1700, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
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
      if (id === "acc-hat-bear") drawBearHat(g);
      if (id === "acc-flower-clip") drawFlower(g, 106, 150, 0xff9fc8, 0xffe176);
      if (id === "acc-wing-backpack") drawWings(g);
      if (id === "acc-magic-wand") drawWand(g);
      if (id === "acc-kitty-ear") drawCatEars(g);
    }
    return g;
  }

  private drawFaceBase(): Phaser.GameObjects.Graphics {
    const g = this.layer();
    g.fillStyle(0xffd8ba, 1);
    g.fillEllipse(lx(143), ly(223), 72, 84);
    g.fillEllipse(lx(263), ly(223), 72, 84);
    g.fillEllipse(lx(203), ly(286), 86, 40);
    g.fillStyle(0xffddc2, 0.9);
    g.fillEllipse(lx(143), ly(184), 76, 36);
    g.fillEllipse(lx(263), ly(184), 76, 36);
    g.fillStyle(0xffb7a4, 0.32);
    g.fillEllipse(lx(105), ly(256), 47, 25);
    g.fillEllipse(lx(302), ly(256), 47, 25);
    return g;
  }

  private drawFace(character: Character): Phaser.GameObjects.Container {
    const face = this.scene.add.container(0, 0);
    const features = this.layer();
    drawEyes(features, character.face.eyes);
    drawMouth(features, character.face.mouth);
    face.add(features);
    if (!["sleepy", "smile"].includes(character.face.eyes)) {
      const blink = this.layer().setAlpha(0);
      drawBlink(blink);
      face.add(blink);
      this.scene.tweens.add({
        targets: blink,
        alpha: 1,
        duration: 90,
        yoyo: true,
        repeat: -1,
        repeatDelay: 2900,
        ease: "Sine.easeInOut"
      });
    }
    return face;
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
  g.lineStyle(5, outline, 0.68);
  g.fillStyle(color, 1);
  if (style === "bob") {
    g.fillRoundedRect(lx(64), ly(86), 278, 270, 104);
    g.strokeRoundedRect(lx(64), ly(86), 278, 270, 104);
    g.fillEllipse(lx(112), ly(270), 52, 128);
    g.fillEllipse(lx(294), ly(270), 52, 128);
    g.strokeEllipse(lx(112), ly(270), 52, 128);
    g.strokeEllipse(lx(294), ly(270), 52, 128);
    return;
  }
  if (style === "pigtails") {
    g.fillEllipse(lx(76), ly(250), 66, 140);
    g.fillEllipse(lx(330), ly(250), 66, 140);
    g.strokeEllipse(lx(76), ly(250), 66, 140);
    g.strokeEllipse(lx(330), ly(250), 66, 140);
    return;
  }
  if (style === "buns") {
    g.fillCircle(lx(75), ly(139), 40);
    g.fillCircle(lx(331), ly(139), 40);
    g.strokeCircle(lx(75), ly(139), 40);
    g.strokeCircle(lx(331), ly(139), 40);
    return;
  }
  if (style === "ponytail") {
    g.fillEllipse(lx(342), ly(236), 82, 214);
    g.strokeEllipse(lx(342), ly(236), 82, 214);
    return;
  }
  if (style === "braids") {
    for (const x of [74, 332]) {
      g.fillCircle(lx(x), ly(220), 22);
      g.fillCircle(lx(x), ly(258), 24);
      g.fillCircle(lx(x), ly(300), 21);
      g.strokeCircle(lx(x), ly(220), 22);
      g.strokeCircle(lx(x), ly(258), 24);
      g.strokeCircle(lx(x), ly(300), 21);
    }
    return;
  }
  const height = style === "long" ? 350 : 385;
  const width = style === "waves" ? 318 : 292;
  g.fillRoundedRect(lx(203 - width / 2), ly(78), width, height, 96);
  g.strokeRoundedRect(lx(203 - width / 2), ly(78), width, height, 96);
}

function drawFrontHair(g: Phaser.GameObjects.Graphics, style: string, color: number, highlight: number): void {
  g.lineStyle(5, outline, 0.82);
  g.fillStyle(color, 1);
  g.fillEllipse(lx(203), ly(122), 254, 150);
  g.strokeEllipse(lx(203), ly(122), 254, 150);
  g.fillRoundedRect(lx(80), ly(88), 246, 80, 40);
  if (style === "bob") {
    g.fillEllipse(lx(111), ly(222), 34, 108);
    g.fillEllipse(lx(295), ly(222), 34, 108);
    g.strokeEllipse(lx(111), ly(222), 34, 108);
    g.strokeEllipse(lx(295), ly(222), 34, 108);
    g.fillCircle(lx(124), ly(156), 24);
    g.fillCircle(lx(157), ly(171), 24);
    g.fillCircle(lx(194), ly(176), 23);
    g.fillCircle(lx(232), ly(171), 24);
    g.fillCircle(lx(272), ly(156), 24);
    g.lineStyle(6, highlight, 0.35);
    g.beginPath();
    g.arc(lx(158), ly(116), 48, Math.PI * 1.05, Math.PI * 1.65, false);
    g.arc(lx(244), ly(118), 44, Math.PI * 1.1, Math.PI * 1.58, false);
    g.strokePath();
    return;
  }
  if (style === "curly") {
    for (let x = 92; x <= 314; x += 32) {
      g.fillCircle(lx(x), ly(156 + Math.abs(203 - x) / 22), 24);
      g.strokeCircle(lx(x), ly(156 + Math.abs(203 - x) / 22), 24);
    }
  } else {
    g.fillTriangle(lx(91), ly(142), lx(155), ly(137), lx(122), ly(205));
    g.fillTriangle(lx(139), ly(132), lx(217), ly(130), lx(180), ly(206));
    g.fillTriangle(lx(208), ly(132), lx(315), ly(142), lx(264), ly(207));
  }
  if (style === "long" || style === "curly" || style === "waves") {
    g.fillEllipse(lx(76), ly(226), 42, style === "waves" ? 190 : 154);
    g.fillEllipse(lx(330), ly(226), 42, style === "waves" ? 190 : 154);
    g.strokeEllipse(lx(76), ly(226), 42, style === "waves" ? 190 : 154);
    g.strokeEllipse(lx(330), ly(226), 42, style === "waves" ? 190 : 154);
  }
  if (style === "buns") {
    drawBow(g, 78, 150, 12, 0xff9fc8);
    drawBow(g, 328, 150, 12, 0xff9fc8);
  }
  if (style === "ponytail") drawBow(g, 313, 168, 12, 0xff9fc8);
  if (style === "waves") {
    g.lineStyle(6, highlight, 0.3);
    g.beginPath();
    g.arc(lx(96), ly(224), 34, Math.PI * 0.55, Math.PI * 1.4, false);
    g.arc(lx(310), ly(224), 34, Math.PI * 1.6, Math.PI * 0.45, false);
    g.strokePath();
  }
  g.lineStyle(6, highlight, 0.35);
  g.beginPath();
  g.arc(lx(178), ly(112), 48, Math.PI * 1.05, Math.PI * 1.65, false);
  g.arc(lx(244), ly(114), 40, Math.PI * 1.08, Math.PI * 1.58, false);
  g.strokePath();
}

function drawTop(g: Phaser.GameObjects.Graphics, id: string): void {
  const palette = topPalette(id);
  g.lineStyle(5, outline, 1);
  g.fillStyle(palette.fill, 1);
  g.beginPath();
  g.moveTo(lx(137), ly(346));
  g.lineTo(lx(102), ly(407));
  g.lineTo(lx(70), ly(507));
  g.lineTo(lx(105), ly(523));
  g.lineTo(lx(145), ly(430));
  g.lineTo(lx(143), ly(458));
  g.lineTo(lx(164), ly(474));
  g.lineTo(lx(242), ly(474));
  g.lineTo(lx(263), ly(458));
  g.lineTo(lx(261), ly(430));
  g.lineTo(lx(301), ly(523));
  g.lineTo(lx(336), ly(507));
  g.lineTo(lx(304), ly(407));
  g.lineTo(lx(269), ly(346));
  g.lineTo(lx(232), ly(336));
  g.lineTo(lx(203), ly(356));
  g.lineTo(lx(174), ly(336));
  g.closePath();
  g.fillPath();
  g.strokePath();
  g.lineStyle(6, 0xffffff, 0.46);
  g.beginPath();
  g.arc(lx(203), ly(346), 37, 0.15, Math.PI - 0.15, false);
  g.strokePath();
  g.lineStyle(4, 0xffffff, 0.25);
  g.lineBetween(lx(148), ly(455), lx(258), ly(455));
  if (id.includes("cat")) drawCatPocket(g, 203, 410);
  else if (id.includes("cloud")) drawCloud(g, 203, 412, 1.08);
  else if (id.includes("strawberry")) drawStrawberry(g, 203, 410, 1.1);
  else if (id.includes("sailor")) drawBow(g, 203, 410, 16, 0xff9fc8);
  else if (id.includes("heart")) drawHeart(g, 203, 410, 22, palette.detail);
  else if (id.includes("ribbon")) drawBow(g, 203, 410, 16, palette.detail);
  else if (id.includes("sunflower")) drawFlower(g, 203, 410, 0xffe176, 0x8fb968);
  else if (id.includes("rainbow")) drawRainbow(g, 203, 430);
  else drawStar(g, 203, 413, 30, 0xffffff);
}

function drawBottom(g: Phaser.GameObjects.Graphics, id: string): void {
  const color = bottomColor(id);
  g.lineStyle(5, outline, 1);
  g.fillStyle(color, 1);
  if (id.includes("skirt") || id.includes("lilac") || id.includes("tutu")) {
    g.beginPath();
    g.moveTo(lx(132), ly(466));
    g.lineTo(lx(274), ly(466));
    g.lineTo(lx(306), ly(572));
    g.lineTo(lx(248), ly(598));
    g.lineTo(lx(158), ly(598));
    g.lineTo(lx(100), ly(572));
    g.closePath();
    g.fillPath();
    g.strokePath();
    if (id.includes("star")) drawStar(g, 203, 526, 20, 0xffffff);
    if (id.includes("cloud")) drawCloud(g, 203, 522, 0.86);
    if (id.includes("tutu")) {
      g.lineStyle(6, 0xffffff, 0.45);
      g.beginPath();
      g.arc(lx(203), ly(526), 70, 0.18, Math.PI - 0.18, false);
      g.strokePath();
    }
    return;
  }
  g.beginPath();
  g.moveTo(lx(132), ly(464));
  g.lineTo(lx(274), ly(464));
  g.lineTo(lx(286), ly(548));
  g.lineTo(lx(242), ly(560));
  g.lineTo(lx(203), ly(506));
  g.lineTo(lx(164), ly(560));
  g.lineTo(lx(120), ly(548));
  g.closePath();
  g.fillPath();
  g.strokePath();
  g.lineStyle(4, 0xffffff, 0.38);
  g.lineBetween(lx(203), ly(486), lx(203), ly(543));
  g.lineBetween(lx(142), ly(486), lx(264), ly(486));
  if (id.includes("heart")) drawHeart(g, 170, 505, 12, 0xffffff);
  if (id.includes("rainbow")) {
    [0xff9bb1, 0xffe176, 0x90d7b6, 0x83c7eb].forEach((color, index) => {
      g.lineStyle(6, color, 1);
      g.lineBetween(lx(138), ly(492 + index * 18), lx(268), ly(492 + index * 18));
    });
  }
}

function drawDress(g: Phaser.GameObjects.Graphics, id: string): void {
  const color = dressColor(id);
  g.lineStyle(5, outline, 1);
  g.fillStyle(color, 1);
  g.beginPath();
  g.moveTo(lx(136), ly(345));
  g.lineTo(lx(101), ly(412));
  g.lineTo(lx(71), ly(506));
  g.lineTo(lx(105), ly(523));
  g.lineTo(lx(141), ly(433));
  g.lineTo(lx(113), ly(620));
  g.lineTo(lx(160), ly(646));
  g.lineTo(lx(203), ly(656));
  g.lineTo(lx(246), ly(646));
  g.lineTo(lx(293), ly(620));
  g.lineTo(lx(265), ly(433));
  g.lineTo(lx(301), ly(523));
  g.lineTo(lx(335), ly(506));
  g.lineTo(lx(305), ly(412));
  g.lineTo(lx(270), ly(345));
  g.lineTo(lx(232), ly(336));
  g.lineTo(lx(203), ly(356));
  g.lineTo(lx(174), ly(336));
  g.closePath();
  g.fillPath();
  g.strokePath();
  g.lineStyle(6, 0xffffff, 0.44);
  g.beginPath();
  g.arc(lx(203), ly(347), 36, 0.15, Math.PI - 0.15, false);
  g.strokePath();
  g.lineStyle(5, 0xffffff, 0.25);
  g.beginPath();
  g.arc(lx(203), ly(526), 92, 0.14, Math.PI - 0.14, false);
  g.strokePath();
  if (id.includes("cupcake")) {
    drawCupcake(g, 203, 515, 1.06);
  } else if (id.includes("rainbow")) {
    drawRainbow(g, 203, 504);
  } else if (id.includes("rose")) {
    drawHeart(g, 203, 510, 24, 0xffffff);
    drawFlower(g, 203, 565, 0xff9fc8, 0x8fb968);
  } else if (id.includes("starry")) {
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

function drawEyes(g: Phaser.GameObjects.Graphics, style: string): void {
  drawBrows(g, style);
  if (style === "sleepy" || style === "smile" || style === "gentle") {
    g.lineStyle(7, 0x5a3022, 1);
    const lift = style === "gentle" ? 3 : 0;
    g.beginPath();
    g.arc(lx(143), ly(222 - lift), 27, 0.08, Math.PI - 0.08, false);
    g.arc(lx(263), ly(222 - lift), 27, 0.08, Math.PI - 0.08, false);
    g.strokePath();
    return;
  }
  if (style === "wink") {
    drawGlossyEye(g, 143, 223, 0.86);
    g.lineStyle(7, 0x5a3022, 1);
    g.beginPath();
    g.arc(lx(263), ly(222), 25, 0.08, Math.PI - 0.08, false);
    g.strokePath();
    return;
  }
  if (style === "star") {
    drawStar(g, 143, 222, 27, 0x5a3022);
    drawStar(g, 263, 222, 27, 0x5a3022);
    drawStar(g, 143, 222, 13, 0xffe176);
    drawStar(g, 263, 222, 13, 0xffe176);
    return;
  }
  if (style === "heart") {
    drawHeart(g, 143, 222, 24, 0x70462e);
    drawHeart(g, 263, 222, 24, 0x70462e);
    drawHeart(g, 143, 220, 14, 0xff82a8);
    drawHeart(g, 263, 220, 14, 0xff82a8);
    return;
  }
  drawGlossyEye(g, 143, 223, style === "round" ? 0.88 : 1);
  drawGlossyEye(g, 263, 223, style === "round" ? 0.88 : 1);
}

function drawBrows(g: Phaser.GameObjects.Graphics, style: string): void {
  g.lineStyle(5, 0x8f4a32, 0.84);
  const curious = style === "star" || style === "heart";
  g.beginPath();
  g.arc(lx(131), ly(curious ? 178 : 184), 31, Math.PI * 1.08, Math.PI * 1.86, false);
  g.arc(lx(275), ly(curious ? 178 : 184), 31, Math.PI * 1.14, Math.PI * 1.92, false);
  g.strokePath();
}

function drawGlossyEye(g: Phaser.GameObjects.Graphics, x: number, y: number, scale = 1): void {
  g.lineStyle(5, 0x5a3022, 1);
  g.fillStyle(0x5a3022, 1);
  g.fillEllipse(lx(x), ly(y), 45 * scale, 59 * scale);
  g.strokeEllipse(lx(x), ly(y), 45 * scale, 59 * scale);
  g.fillStyle(0x8b4b2d, 1);
  g.fillEllipse(lx(x + 3), ly(y + 6), 24 * scale, 31 * scale);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(lx(x - 9), ly(y - 13), 8 * scale);
  g.fillCircle(lx(x + 8), ly(y - 2), 4 * scale);
}

function drawBlink(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0xffd8ba, 1);
  g.fillEllipse(lx(143), ly(223), 58, 70);
  g.fillEllipse(lx(263), ly(223), 58, 70);
  g.lineStyle(6, 0x5a3022, 1);
  g.beginPath();
  g.arc(lx(143), ly(222), 25, 0.08, Math.PI - 0.08, false);
  g.arc(lx(263), ly(222), 25, 0.08, Math.PI - 0.08, false);
  g.strokePath();
}

function drawMouth(g: Phaser.GameObjects.Graphics, style: string): void {
  g.lineStyle(5, 0x8f4a32, 1);
  if (style === "open") {
    g.fillStyle(0x70462e, 1);
    g.fillEllipse(lx(203), ly(287), 25, 31);
    g.fillStyle(0xff9bb1, 1);
    g.fillEllipse(lx(203), ly(294), 14, 8);
    return;
  }
  if (style === "laugh") {
    g.fillStyle(0x70462e, 1);
    g.fillRoundedRect(lx(185), ly(278), 36, 28, 12);
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(lx(189), ly(281), 28, 8, 4);
    return;
  }
  if (style === "yum") {
    g.fillStyle(0xff82a8, 1);
    g.fillCircle(lx(203), ly(288), 12);
    return;
  }
  if (style === "sleepy") {
    g.lineBetween(lx(187), ly(286), lx(219), ly(286));
    return;
  }
  if (style === "curious") {
    g.beginPath();
    g.arc(lx(203), ly(289), 16, Math.PI * 0.06, Math.PI * 0.82, false);
    g.strokePath();
    return;
  }
  if (style === "tiny") {
    g.fillCircle(lx(203), ly(287), 4);
    return;
  }
  if (style === "kiss") {
    g.beginPath();
    g.arc(lx(196), ly(287), 9, Math.PI * 1.2, Math.PI * 0.25, true);
    g.arc(lx(210), ly(287), 9, Math.PI * 0.75, Math.PI * 1.8, true);
    g.strokePath();
    return;
  }
  g.beginPath();
  g.arc(lx(203), ly(279), 23, 0.18, Math.PI - 0.18, false);
  g.strokePath();
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

function drawBearHat(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(5, outline, 1);
  g.fillStyle(0xd8aa82, 1);
  g.fillEllipse(lx(203), ly(120), 190, 78);
  g.strokeEllipse(lx(203), ly(120), 190, 78);
  g.fillCircle(lx(138), ly(92), 24);
  g.fillCircle(lx(268), ly(92), 24);
  g.strokeCircle(lx(138), ly(92), 24);
  g.strokeCircle(lx(268), ly(92), 24);
}

function drawWings(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(5, outline, 0.9);
  g.fillStyle(0xffffff, 0.88);
  g.fillEllipse(lx(82), ly(438), 78, 126);
  g.fillEllipse(lx(324), ly(438), 78, 126);
  g.strokeEllipse(lx(82), ly(438), 78, 126);
  g.strokeEllipse(lx(324), ly(438), 78, 126);
  g.lineStyle(4, 0xffb6d5, 0.65);
  g.lineBetween(lx(82), ly(394), lx(110), ly(478));
  g.lineBetween(lx(324), ly(394), lx(296), ly(478));
}

function drawWand(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(7, outline, 1);
  g.lineBetween(lx(322), ly(520), lx(376), ly(430));
  drawStar(g, 382, 420, 20, 0xffe176);
}

function drawCatEars(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(5, outline, 1);
  g.fillStyle(0xffb6d5, 1);
  g.fillTriangle(lx(120), ly(132), lx(154), ly(72), lx(180), ly(140));
  g.fillTriangle(lx(286), ly(140), lx(252), ly(72), lx(226), ly(132));
  g.strokeTriangle(lx(120), ly(132), lx(154), ly(72), lx(180), ly(140));
  g.strokeTriangle(lx(286), ly(140), lx(252), ly(72), lx(226), ly(132));
}

function drawCatPocket(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  g.lineStyle(4, outline, 1);
  g.fillStyle(0xffffff, 1);
  g.fillRoundedRect(lx(x - 28), ly(y - 22), 56, 50, 14);
  g.strokeRoundedRect(lx(x - 28), ly(y - 22), 56, 50, 14);
  g.fillTriangle(lx(x - 21), ly(y - 20), lx(x - 12), ly(y - 42), lx(x - 2), ly(y - 20));
  g.fillTriangle(lx(x + 21), ly(y - 20), lx(x + 12), ly(y - 42), lx(x + 2), ly(y - 20));
  g.fillStyle(outline, 1);
  g.fillCircle(lx(x - 11), ly(y), 4);
  g.fillCircle(lx(x + 11), ly(y), 4);
}

function drawCloud(g: Phaser.GameObjects.Graphics, x: number, y: number, scale = 1): void {
  g.lineStyle(4, outline, 0.75);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(lx(x - 26 * scale), ly(y + 4 * scale), 17 * scale);
  g.fillCircle(lx(x), ly(y - 8 * scale), 23 * scale);
  g.fillCircle(lx(x + 27 * scale), ly(y + 3 * scale), 18 * scale);
  g.fillRoundedRect(lx(x - 43 * scale), ly(y), 86 * scale, 28 * scale, 13 * scale);
}

function drawStrawberry(g: Phaser.GameObjects.Graphics, x: number, y: number, scale = 1): void {
  g.lineStyle(4, outline, 1);
  g.fillStyle(0xf75b73, 1);
  g.fillEllipse(lx(x), ly(y + 8 * scale), 42 * scale, 50 * scale);
  g.strokeEllipse(lx(x), ly(y + 8 * scale), 42 * scale, 50 * scale);
  g.fillStyle(0x8fb968, 1);
  g.fillTriangle(lx(x - 18 * scale), ly(y - 12 * scale), lx(x), ly(y - 30 * scale), lx(x + 18 * scale), ly(y - 12 * scale));
  g.fillStyle(0xffe176, 1);
  g.fillCircle(lx(x - 8 * scale), ly(y + 6 * scale), 3 * scale);
  g.fillCircle(lx(x + 9 * scale), ly(y + 17 * scale), 3 * scale);
}

function drawCupcake(g: Phaser.GameObjects.Graphics, x: number, y: number, scale = 1): void {
  g.lineStyle(4, outline, 1);
  g.fillStyle(0xffe176, 1);
  g.fillRoundedRect(lx(x - 28 * scale), ly(y + 3 * scale), 56 * scale, 39 * scale, 8 * scale);
  g.strokeRoundedRect(lx(x - 28 * scale), ly(y + 3 * scale), 56 * scale, 39 * scale, 8 * scale);
  g.fillStyle(0xff9fc8, 1);
  g.fillEllipse(lx(x), ly(y), 62 * scale, 42 * scale);
  g.strokeEllipse(lx(x), ly(y), 62 * scale, 42 * scale);
  drawHeart(g, x, y - 6 * scale, 9 * scale, 0xffffff);
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

function moodText(mouth: string): string {
  if (mouth === "yum") return "♥";
  if (mouth === "curious") return "?";
  if (mouth === "sleepy") return "Z";
  if (mouth === "open") return "!";
  return "";
}
