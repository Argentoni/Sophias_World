import Phaser from "phaser";
import { addButton } from "../ui/phaserUi";
import { gameStore } from "../store/gameStore";

export class HUDScene extends Phaser.Scene {
  private currencyText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private petText!: Phaser.GameObjects.Text;
  private portraitOverlay!: Phaser.GameObjects.Container;

  constructor() {
    super("HUDScene");
  }

  create(): void {
    this.add.rectangle(640, 34, 1280, 68, 0xfaf4e8, 0.92).setDepth(3000);
    this.currencyText = this.add.text(24, 18, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "24px",
      color: "#6E4A2C",
      fontStyle: "bold"
    }).setDepth(3001);
    this.petText = this.add.text(235, 18, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#6E4A2C"
    }).setDepth(3001);
    this.statusText = this.add.text(640, 18, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "22px",
      color: "#6E4A2C",
      align: "center"
    }).setOrigin(0.5, 0).setDepth(3001);

    addButton(this, 885, 34, "Mapa", () => this.goMap(), { width: 112, height: 44, fontSize: 18 }).setDepth(3001);
    addButton(this, 1015, 34, "Roupas", () => this.scene.launch("WardrobeScene"), { width: 122, height: 44, fontSize: 18 }).setDepth(3001);
    addButton(this, 1152, 34, "Mochila", () => this.scene.launch("InventoryScene"), { width: 128, height: 44, fontSize: 18 }).setDepth(3001);

    this.portraitOverlay = this.add.container(640, 360).setDepth(5000);
    this.portraitOverlay.add([
      this.add.rectangle(0, 0, 1280, 720, 0xfaf4e8, 0.98),
      this.add.text(0, -18, "Vire o aparelho", {
        fontFamily: "Arial, sans-serif",
        fontSize: "46px",
        color: "#6E4A2C",
        fontStyle: "bold"
      }).setOrigin(0.5),
      this.add.text(0, 46, "Sophia's World fica melhor deitado, igual um livrinho aberto.", {
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        color: "#6E4A2C",
        align: "center",
        wordWrap: { width: 760 }
      }).setOrigin(0.5)
    ]);

    this.time.addEvent({ delay: 250, loop: true, callback: () => this.refresh() });
    this.refresh();
  }

  private refresh(): void {
    const state = gameStore.getState();
    const pet = state.save.pet.state;
    this.currencyText.setText(`★ ${state.save.currency}`);
    this.petText.setText(`Pet  Fome ${pet.hunger}  Energia ${pet.energy}  Alegria ${pet.happiness}`);
    this.statusText.setText(state.statusMessage);
    this.portraitOverlay.setVisible(window.innerHeight > window.innerWidth);
  }

  private goMap(): void {
    for (const key of ["HouseScene", "ParkScene", "ShoppingScene", "WardrobeScene", "InventoryScene", "ShopScene"]) {
      if (this.scene.isActive(key)) this.scene.stop(key);
    }
    if (!this.scene.isActive("MapScene")) this.scene.launch("MapScene");
  }
}
