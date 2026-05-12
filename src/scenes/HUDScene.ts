import Phaser from "phaser";
import { addButton } from "../ui/phaserUi";
import { gameStore } from "../store/gameStore";

export class HUDScene extends Phaser.Scene {
  private currencyText!: Phaser.GameObjects.Text;
  private statusBg!: Phaser.GameObjects.Rectangle;
  private statusText!: Phaser.GameObjects.Text;
  private petText!: Phaser.GameObjects.Text;
  private portraitOverlay!: Phaser.GameObjects.Container;
  private lastStatus = "";
  private clearStatusEvent?: Phaser.Time.TimerEvent;

  constructor() {
    super("HUDScene");
  }

  create(): void {
    this.add.rectangle(64, 34, 110, 48, 0xfaf4e8, 0.78).setStrokeStyle(2, 0xffffff, 0.75).setDepth(3000);
    this.add.rectangle(366, 34, 330, 48, 0xfaf4e8, 0.72).setStrokeStyle(2, 0xffffff, 0.65).setDepth(3000);
    this.currencyText = this.add.text(24, 18, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "24px",
      color: "#6E4A2C",
      fontStyle: "bold"
    }).setDepth(3001);
    this.petText = this.add.text(220, 20, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "17px",
      color: "#6E4A2C"
    }).setDepth(3001);
    this.statusBg = this.add.rectangle(640, 88, 430, 42, 0xfaf4e8, 0.86)
      .setStrokeStyle(2, 0xffffff, 0.75)
      .setDepth(3000)
      .setVisible(false);
    this.statusText = this.add.text(640, 74, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      color: "#6E4A2C",
      align: "center"
    }).setOrigin(0.5, 0).setDepth(3001);

    addButton(this, 890, 34, "Mapa", () => this.goMap(), { width: 104, height: 42, fontSize: 17, fill: 0xfaf4e8 }).setDepth(3001);
    addButton(this, 1015, 34, "Roupas", () => this.scene.launch("WardrobeScene"), { width: 118, height: 42, fontSize: 17, fill: 0xffd2e5 }).setDepth(3001);
    addButton(this, 1150, 34, "Mochila", () => this.scene.launch("InventoryScene"), { width: 126, height: 42, fontSize: 17, fill: 0xd5f3e0 }).setDepth(3001);

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
    this.updateStatus(state.statusMessage);
    this.portraitOverlay.setVisible(window.innerHeight > window.innerWidth);
  }

  private updateStatus(message: string): void {
    if (message !== this.lastStatus) {
      this.lastStatus = message;
      this.clearStatusEvent?.remove(false);
      if (message) {
        this.clearStatusEvent = this.time.delayedCall(2600, () => {
          if (gameStore.getState().statusMessage === message) gameStore.getState().setStatusMessage("");
        });
      }
    }
    this.statusBg.setVisible(Boolean(message));
    this.statusText.setVisible(Boolean(message));
    this.statusText.setText(message);
  }

  private goMap(): void {
    for (const key of ["HouseScene", "ParkScene", "ShoppingScene", "WardrobeScene", "InventoryScene", "ShopScene"]) {
      if (this.scene.isActive(key)) this.scene.stop(key);
    }
    if (!this.scene.isActive("MapScene")) this.scene.launch("MapScene");
  }
}
