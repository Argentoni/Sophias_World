import Phaser from "phaser";
import type { Character } from "../schemas/saveState";
import { clothesById } from "../data";

const hairColors = ["#1A1A24", "#6E4A2C", "#D8AA82", "#FFB6D5"];
const hairColorNumbers = [0x2f2633, 0x6e4a2c, 0xd8aa82, 0xffb6d5];
const hairHighlightNumbers = [0x5b4a62, 0xa9784f, 0xffd2a5, 0xffd8e8];

export const hairStyles = ["bob", "pigtails", "braids", "curly", "long"];
export const eyeStyles = ["sparkle", "round", "smile", "star", "sleepy"];
export const mouthStyles = ["smile", "open", "yum", "curious", "sleepy"];
export { hairColors };

export class CharacterComposer {
  readonly container: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;
  private scaleFactor: number;

  constructor(scene: Phaser.Scene, x: number, y: number, scaleFactor = 0.42) {
    this.scene = scene;
    this.scaleFactor = scaleFactor;
    this.container = scene.add.container(x, y);
    this.container.setSize(215, 320);
    this.container.setDepth(y);
  }

  render(character: Character): void {
    this.container.removeAll(true);
    const shadow = this.scene.add.ellipse(0, 112, 150, 34, 0x6e4a2c, 0.18);
    const body = this.scene.add.image(0, 0, `body-base-${character.body.skinTone}`).setOrigin(0.5, 0.6);
    body.setScale(this.scaleFactor);

    const backHair = this.drawHair(character, true);
    const frontHair = this.drawHair(character, false);
    const face = this.drawFace(character);
    const mood = this.drawMood(character);
    const clothing = this.clothingLayers([
      character.outfit.top,
      character.outfit.bottom,
      character.outfit.dress,
      character.outfit.shoes
    ]);
    const accessories = this.clothingLayers(character.outfit.accessories);
    this.container.add([shadow, backHair, body, ...clothing, frontHair, face, ...accessories, mood]);
    this.container.setDepth(this.container.y);
  }

  setPosition(x: number, y: number): void {
    this.container.setPosition(x, y);
    this.container.setDepth(y);
  }

  enableDrag(onMove: (x: number, y: number) => void, onDrop: (x: number, y: number) => void): void {
    this.container.setInteractive();
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

  private clothingLayers(sourceIds: Array<string | undefined>): Phaser.GameObjects.Image[] {
    const ids = sourceIds.filter((id): id is string => Boolean(id));
    return ids
      .filter((id) => clothesById.has(id))
      .map((id) => this.scene.add.image(0, 0, id).setOrigin(0.5, 0.6).setScale(this.scaleFactor));
  }

  private drawHair(character: Character, back: boolean): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();
    const colorIndex = hairColors.indexOf(character.hair.color);
    const color = hairColorNumbers[colorIndex] ?? 0x1a1a24;
    const highlight = hairHighlightNumbers[colorIndex] ?? 0x5b4a62;
    graphics.lineStyle(4, 0x6e4a2c, 0.35);
    graphics.fillStyle(color, 1);
    if (back) {
      if (character.hair.styleId === "long") {
        graphics.fillRoundedRect(-60, -158, 120, 136, 46);
        graphics.strokeRoundedRect(-60, -158, 120, 136, 46);
      }
      if (character.hair.styleId === "bob" || character.hair.styleId === "curly") {
        graphics.fillRoundedRect(-58, -156, 116, 94, 42);
        graphics.strokeRoundedRect(-58, -156, 116, 94, 42);
      }
      if (character.hair.styleId === "pigtails") {
        graphics.fillCircle(-68, -106, 28);
        graphics.fillCircle(68, -106, 28);
        graphics.strokeCircle(-68, -106, 28);
        graphics.strokeCircle(68, -106, 28);
      }
      if (character.hair.styleId === "braids") {
        graphics.fillRoundedRect(-76, -120, 26, 124, 16);
        graphics.fillRoundedRect(50, -120, 26, 124, 16);
        graphics.strokeRoundedRect(-76, -120, 26, 124, 16);
        graphics.strokeRoundedRect(50, -120, 26, 124, 16);
        graphics.lineStyle(4, highlight, 0.45);
        for (let y = -98; y <= -14; y += 26) {
          graphics.lineBetween(-73, y, -53, y + 13);
          graphics.lineBetween(53, y, 73, y + 13);
        }
      }
      return graphics;
    }
    graphics.fillEllipse(0, -149, 116, 58);
    graphics.strokeEllipse(0, -149, 116, 58);
    graphics.fillRoundedRect(-58, -136, 24, 66, 15);
    graphics.fillRoundedRect(34, -136, 24, 66, 15);
    graphics.strokeRoundedRect(-58, -136, 24, 66, 15);
    graphics.strokeRoundedRect(34, -136, 24, 66, 15);
    if (character.hair.styleId === "curly") {
      for (let i = -50; i <= 50; i += 20) {
        graphics.fillCircle(i, -128 + Math.abs(i / 12), 16);
      }
    } else {
      graphics.fillTriangle(-42, -128, -12, -126, -34, -106);
      graphics.fillTriangle(8, -126, 42, -128, 32, -106);
    }
    graphics.lineStyle(5, highlight, 0.38);
    graphics.beginPath();
    graphics.arc(-18, -153, 28, Math.PI * 1.05, Math.PI * 1.65, false);
    graphics.arc(22, -150, 22, Math.PI * 1.12, Math.PI * 1.55, false);
    graphics.strokePath();
    return graphics;
  }

  private drawFace(character: Character): Phaser.GameObjects.Container {
    const container = this.scene.add.container(0, 0);
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xff9bb1, 0.3);
    graphics.fillEllipse(-28, -105, 18, 10);
    graphics.fillEllipse(28, -105, 18, 10);
    this.drawEyes(graphics, character.face.eyes);
    this.drawMouth(graphics, character.face.mouth);
    container.add(graphics);
    return container;
  }

  private drawEyes(graphics: Phaser.GameObjects.Graphics, style: string): void {
    graphics.lineStyle(3, 0x6e4a2c, 1);
    graphics.fillStyle(0x3f2a1c, 1);
    if (style === "sleepy" || style === "smile") {
      graphics.beginPath();
      graphics.arc(-20, -119, 9, 0.1, Math.PI - 0.1, false);
      graphics.arc(20, -119, 9, 0.1, Math.PI - 0.1, false);
      graphics.strokePath();
      return;
    }
    if (style === "star") {
      this.drawSparkle(graphics, -20, -119, 11);
      this.drawSparkle(graphics, 20, -119, 11);
      return;
    }
    graphics.fillCircle(-20, -119, style === "round" ? 7 : 8);
    graphics.fillCircle(20, -119, style === "round" ? 7 : 8);
    if (style === "sparkle") {
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(-17, -122, 3);
      graphics.fillCircle(23, -122, 3);
    }
  }

  private drawMouth(graphics: Phaser.GameObjects.Graphics, style: string): void {
    graphics.lineStyle(3, 0x6e4a2c, 1);
    if (style === "open" || style === "yum") {
      graphics.fillStyle(style === "yum" ? 0xff8fb0 : 0x6e4a2c, 1);
      graphics.fillCircle(0, -100, style === "yum" ? 6 : 7);
      return;
    }
    if (style === "sleepy") {
      graphics.beginPath();
      graphics.moveTo(-9, -100);
      graphics.lineTo(9, -100);
      graphics.strokePath();
      return;
    }
    if (style === "curious") {
      graphics.beginPath();
      graphics.arc(0, -101, 7, Math.PI * 0.1, Math.PI * 0.85, false);
      graphics.strokePath();
      return;
    }
    graphics.beginPath();
    graphics.arc(0, -106, 12, 0.2, Math.PI - 0.2, false);
    graphics.strokePath();
  }

  private drawSparkle(graphics: Phaser.GameObjects.Graphics, x: number, y: number, radius: number): void {
    graphics.fillStyle(0x6e4a2c, 1);
    graphics.beginPath();
    graphics.moveTo(x, y - radius);
    graphics.lineTo(x + radius * 0.33, y - radius * 0.33);
    graphics.lineTo(x + radius, y);
    graphics.lineTo(x + radius * 0.33, y + radius * 0.33);
    graphics.lineTo(x, y + radius);
    graphics.lineTo(x - radius * 0.33, y + radius * 0.33);
    graphics.lineTo(x - radius, y);
    graphics.lineTo(x - radius * 0.33, y - radius * 0.33);
    graphics.closePath();
    graphics.fillPath();
  }

  private drawMood(character: Character): Phaser.GameObjects.Container {
    const mood = moodText(character.face.mouth);
    const container = this.scene.add.container(70, -182);
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
}

function moodText(mouth: string): string {
  if (mouth === "yum") return "♥";
  if (mouth === "curious") return "?";
  if (mouth === "sleepy") return "Z";
  if (mouth === "open") return "!";
  return "";
}
