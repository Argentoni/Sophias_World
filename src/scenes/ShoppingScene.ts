import Phaser from "phaser";
import { addButton } from "../ui/phaserUi";
import { gameStore } from "../store/gameStore";
import { drawShopBackground } from "./sceneBackgrounds";

export class ShoppingScene extends Phaser.Scene {
  constructor() {
    super("ShoppingScene");
  }

  create(): void {
    gameStore.getState().setCurrentScene("shopping");
    drawShopBackground(this);
    addButton(this, 110, 96, "Mapa", () => this.scene.start("MapScene"), { width: 118, height: 48, fontSize: 18 });
    addButton(this, 370, 390, "Roupas", () => this.scene.launch("ShopScene", { tab: "clothes" }), { width: 230, height: 82, fill: 0xffb6d5 });
    addButton(this, 640, 390, "Decoração", () => this.scene.launch("ShopScene", { tab: "furniture" }), { width: 230, height: 82, fill: 0xb5e6c5 });
    addButton(this, 910, 390, "Comidas", () => this.scene.launch("ShopScene", { tab: "food" }), { width: 230, height: 82, fill: 0xffe8a8 });

    if (!this.scene.isActive("HUDScene")) this.scene.launch("HUDScene");
    (window as unknown as { __scene?: string }).__scene = "ShoppingScene";
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      delete (window as unknown as { __scene?: string }).__scene;
    });
  }
}
