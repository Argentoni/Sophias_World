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
    addTitle(this, 640, 76, "Sophia's World");

    this.addLocation(330, 300, "Casa", 0xffb6d5, () => this.scene.start("HouseScene", { roomId: "bedroom" }));
    this.addLocation(640, 410, "Parque", 0xb5e6c5, () => this.scene.start("ParkScene"));
    this.addLocation(960, 300, "Shopping", 0xa0d8f0, () => this.scene.start("ShoppingScene"));

    addButton(this, 640, 625, "Guarda-roupa", () => this.scene.launch("WardrobeScene"), {
      width: 240,
      fill: 0xffe8a8
    });

    if (!this.scene.isActive("HUDScene")) this.scene.launch("HUDScene");
    setSceneMarker("MapScene");
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => clearSceneMarker());
  }

  private addLocation(x: number, y: number, label: string, color: number, onClick: () => void): void {
    this.add.circle(x, y, 108, color, 0.9).setStrokeStyle(7, 0x6e4a2c);
    addButton(this, x, y + 135, label, onClick, { width: 190, fill: color });
  }
}

function setSceneMarker(scene: string): void {
  (window as unknown as { __scene?: string }).__scene = scene;
}

function clearSceneMarker(): void {
  delete (window as unknown as { __scene?: string }).__scene;
}
