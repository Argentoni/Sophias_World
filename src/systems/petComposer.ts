import Phaser from "phaser";
import type { Pet } from "../schemas/saveState";

export class PetComposer {
  readonly container: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.container = scene.add.container(x, y);
    this.container.setSize(150, 115);
    this.container.setDepth(y);
  }

  render(pet: Pet): void {
    this.container.removeAll(true);
    const shadow = this.scene.add.ellipse(0, 42, 100, 24, 0x6e4a2c, 0.16);
    const body = this.scene.add.image(0, 0, `pet-${pet.color}`).setScale(0.72);
    const accessories = pet.accessories.map((id) => this.scene.add.image(0, 0, id).setScale(0.72));
    this.container.add([shadow, body, ...accessories]);
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
}
