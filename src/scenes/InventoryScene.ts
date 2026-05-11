import Phaser from "phaser";
import { clothesById, foodById, furnitureById } from "../data";
import { gameStore } from "../store/gameStore";
import { exportBackup, importBackup } from "../ui/backup";
import { addButton, addPanel, addSmallText, addTitle } from "../ui/phaserUi";

export class InventoryScene extends Phaser.Scene {
  constructor() {
    super("InventoryScene");
  }

  create(): void {
    const save = gameStore.getState().save;
    addPanel(this, 640, 390, 1040, 540, 0xfaf4e8).setDepth(4100);
    addTitle(this, 640, 150, "Mochila").setDepth(4101);
    addButton(this, 1040, 150, "Fechar", () => this.scene.stop(), { width: 140, height: 46, fontSize: 18 }).setDepth(4101);
    addButton(this, 870, 150, "Backup", () => void exportBackup(), { width: 130, height: 46, fontSize: 17, fill: 0xffe8a8 }).setDepth(4101);
    addButton(this, 720, 150, "Restaurar", () => void importBackup(), { width: 140, height: 46, fontSize: 17, fill: 0xb5e6c5 }).setDepth(4101);

    this.add.text(185, 215, "Roupas", headerStyle()).setDepth(4101);
    save.inventory.clothes.slice(0, 10).forEach((id, index) => {
      const item = clothesById.get(id);
      if (!item) return;
      const x = 190 + index * 82;
      this.add.image(x, 285, item.id).setDisplaySize(48, 70).setDepth(4102);
    });

    this.add.text(185, 380, "Móveis", headerStyle()).setDepth(4101);
    save.inventory.furniture.slice(0, 10).forEach((id, index) => {
      const item = furnitureById.get(id);
      if (!item) return;
      const x = 190 + index * 82;
      this.add.image(x, 455, item.id).setDisplaySize(56, 44).setDepth(4102);
    });

    this.add.text(185, 535, "Petiscos", headerStyle()).setDepth(4101);
    save.inventory.food.forEach((entry, index) => {
      const item = foodById.get(entry.itemId);
      if (!item) return;
      const x = 215 + index * 190;
      this.add.image(x - 42, 604, item.id).setDisplaySize(54, 42).setDepth(4102);
      addSmallText(this, x + 28, 604, `${item.name}\n${entry.count}x`, 118).setDepth(4102);
    });
  }
}

function headerStyle(): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: "Arial, sans-serif",
    fontSize: "24px",
    color: "#6E4A2C",
    fontStyle: "bold"
  };
}
