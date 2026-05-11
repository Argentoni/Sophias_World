import Phaser from "phaser";
import type { Character } from "../schemas/saveState";
import { clothesById } from "../data";

const skinTints: Record<Character["body"]["skinTone"], number> = {
  "1": 0xf5d7b5,
  "2": 0xd8aa82,
  "3": 0xa6754f,
  "4": 0x6e4a2c,
  "5": 0xf0d5c0
};

const hairColors = ["#1A1A24", "#6E4A2C", "#D8AA82", "#FFB6D5"];
const hairColorNumbers = [0x1a1a24, 0x6e4a2c, 0xd8aa82, 0xffb6d5];

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
    const body = this.scene.add.image(0, 0, "body-base").setOrigin(0.5, 0.6);
    body.setTint(skinTints[character.body.skinTone]);
    body.setScale(this.scaleFactor);

    const backHair = this.drawHair(character, true);
    const frontHair = this.drawHair(character, false);
    const face = this.drawFace(character);
    const clothing = this.clothingLayers(character);
    this.container.add([shadow, backHair, body, ...clothing, face, frontHair]);
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

  private clothingLayers(character: Character): Phaser.GameObjects.Image[] {
    const ids = [
      character.outfit.top,
      character.outfit.bottom,
      character.outfit.dress,
      character.outfit.shoes,
      ...character.outfit.accessories
    ].filter((id): id is string => Boolean(id));
    return ids
      .filter((id) => clothesById.has(id))
      .map((id) => this.scene.add.image(0, 0, id).setOrigin(0.5, 0.6).setScale(this.scaleFactor));
  }

  private drawHair(character: Character, back: boolean): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();
    const color = hairColorNumbers[hairColors.indexOf(character.hair.color)] ?? 0x1a1a24;
    graphics.fillStyle(color, 1);
    if (back) {
      if (character.hair.styleId === "long") graphics.fillRoundedRect(-62, -156, 124, 132, 50);
      if (character.hair.styleId === "pigtails") {
        graphics.fillCircle(-74, -92, 32);
        graphics.fillCircle(74, -92, 32);
      }
      if (character.hair.styleId === "braids") {
        graphics.fillRoundedRect(-82, -118, 28, 125, 18);
        graphics.fillRoundedRect(54, -118, 28, 125, 18);
      }
      return graphics;
    }
    graphics.fillRoundedRect(-55, -166, 110, 78, 42);
    if (character.hair.styleId === "curly") {
      for (let i = -48; i <= 48; i += 24) graphics.fillCircle(i, -96, 20);
    } else {
      graphics.fillTriangle(-48, -110, -10, -110, -44, -72);
      graphics.fillTriangle(8, -110, 50, -110, 42, -72);
    }
    return graphics;
  }

  private drawFace(character: Character): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x2f2430, 1);
    const eyesY = -108;
    if (character.face.eyes === "sleepy") {
      graphics.lineStyle(5, 0x2f2430, 1);
      graphics.beginPath();
      graphics.arc(-22, eyesY, 12, 0, Math.PI);
      graphics.arc(22, eyesY, 12, 0, Math.PI);
      graphics.strokePath();
    } else {
      graphics.fillCircle(-22, eyesY, character.face.eyes === "round" ? 8 : 10);
      graphics.fillCircle(22, eyesY, character.face.eyes === "round" ? 8 : 10);
      if (character.face.eyes === "sparkle" || character.face.eyes === "star") {
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(-26, eyesY - 4, 3);
        graphics.fillCircle(18, eyesY - 4, 3);
      }
    }
    graphics.lineStyle(5, 0x2f2430, 1);
    if (character.face.mouth === "open" || character.face.mouth === "yum") {
      graphics.fillStyle(0xff7aa7, 1);
      graphics.fillCircle(0, -76, 10);
    } else if (character.face.mouth === "sleepy") {
      graphics.strokeCircle(0, -76, 8);
    } else {
      graphics.beginPath();
      graphics.arc(0, -82, 18, 0, Math.PI);
      graphics.strokePath();
    }
    return graphics;
  }
}
