import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload(): void {
    this.load.image("body-base", "/assets/sprites/body-base.png");
    this.load.image("outfit-001", "/assets/sprites/outfit-001.png");
  }

  create(): void {
    this.scene.start("MainScene");
  }
}
