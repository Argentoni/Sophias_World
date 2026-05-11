import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload(): void {
    this.load.image("body-base", "/assets/sprites/body-base.png");
  }

  create(): void {
    this.scene.start("MainScene");
  }
}
