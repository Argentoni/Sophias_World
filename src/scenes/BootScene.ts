import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    // Hide the DOM loading overlay; Phaser is alive.
    const loading = document.getElementById("loading");
    if (loading) loading.remove();

    this.scene.start("PreloadScene");
  }
}
