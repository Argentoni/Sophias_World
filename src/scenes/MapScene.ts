import Phaser from "phaser";
import { addButton, addTitle } from "../ui/phaserUi";
import { gameStore } from "../store/gameStore";
import { drawMapBackground } from "./sceneBackgrounds";

export class MapScene extends Phaser.Scene {
  constructor() {
    super("MapScene");
  }

  create(): void {
    gameStore.getState().setCurrentScene("map");
    drawMapBackground(this);
    this.add.rectangle(640, 94, 520, 72, 0xfaf4e8, 0.76).setStrokeStyle(2, 0xffffff, 0.8);
    addTitle(this, 640, 94, "Sophia's World");

    this.addLocation(330, 360, "Casa", 0xffb6d5, () => this.scene.start("HouseScene", { roomId: "bedroom" }));
    this.addLocation(640, 480, "Parque", 0xb5e6c5, () => this.scene.start("ParkScene"));
    this.addLocation(960, 420, "Shopping", 0xa0d8f0, () => this.scene.start("ShoppingScene"));

    addButton(this, 640, 625, "Guarda-roupa", () => this.scene.launch("WardrobeScene"), {
      width: 240,
      fill: 0xffe8a8
    });

    if (!this.scene.isActive("HUDScene")) this.scene.launch("HUDScene");
    setSceneMarker("MapScene");
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => clearSceneMarker());
  }

  private addLocation(x: number, y: number, label: string, color: number, onClick: () => void): void {
    this.add.ellipse(x, y + 42, 240, 98, color, 0.24).setStrokeStyle(3, 0xffffff, 0.65);
    addButton(this, x, y + 42, label, onClick, { width: 190, fill: color });
    this.add.zone(x, y + 42, 260, 150).setInteractive({ useHandCursor: true }).on("pointerdown", onClick);
  }
}

function setSceneMarker(scene: string): void {
  (window as unknown as { __scene?: string }).__scene = scene;
}

function clearSceneMarker(): void {
  delete (window as unknown as { __scene?: string }).__scene;
}
