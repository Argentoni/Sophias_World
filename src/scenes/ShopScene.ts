import Phaser from "phaser";
import { clothes, foodItems, furniture } from "../data";
import { gameStore } from "../store/gameStore";
import { addButton, addPanel, addSmallText, addTitle } from "../ui/phaserUi";

type ShopTab = "clothes" | "furniture" | "food";
type ShopInit = { tab?: ShopTab };

export class ShopScene extends Phaser.Scene {
  private tab: ShopTab = "clothes";

  constructor() {
    super("ShopScene");
  }

  init(data: ShopInit): void {
    this.tab = data.tab ?? "clothes";
  }

  create(): void {
    addPanel(this, 640, 390, 1080, 560, 0xfaf4e8).setDepth(4000);
    addTitle(this, 640, 150, "Loja").setDepth(4001);
    addButton(this, 250, 150, "Roupas", () => this.scene.restart({ tab: "clothes" }), { width: 150, height: 46, fontSize: 18, fill: this.tab === "clothes" ? 0xffb6d5 : 0xfaf4e8 }).setDepth(4001);
    addButton(this, 420, 150, "Móveis", () => this.scene.restart({ tab: "furniture" }), { width: 150, height: 46, fontSize: 18, fill: this.tab === "furniture" ? 0xb5e6c5 : 0xfaf4e8 }).setDepth(4001);
    addButton(this, 590, 150, "Comidas", () => this.scene.restart({ tab: "food" }), { width: 150, height: 46, fontSize: 18, fill: this.tab === "food" ? 0xffe8a8 : 0xfaf4e8 }).setDepth(4001);
    addButton(this, 1040, 150, "Fechar", () => this.scene.stop(), { width: 140, height: 46, fontSize: 18 }).setDepth(4001);

    if (this.tab === "clothes") this.renderClothes();
    if (this.tab === "furniture") this.renderFurniture();
    if (this.tab === "food") this.renderFood();
  }

  private renderClothes(): void {
    const owned = gameStore.getState().save.inventory.clothes;
    clothes.forEach((item, index) => {
      const x = 195 + (index % 5) * 205;
      const y = 250 + Math.floor(index / 5) * 105;
      this.add.image(x - 64, y, item.id).setDisplaySize(58, 86).setDepth(4002);
      addSmallText(this, x + 20, y - 18, item.name, 118).setDepth(4002);
      addButton(this, x + 20, y + 34, owned.includes(item.id) ? "Tenho" : `${item.price} ★`, () => {
        if (!owned.includes(item.id)) gameStore.getState().purchaseClothing(item.id);
        if (item.category === "accessory") {
          gameStore.getState().toggleAccessory(item.id);
        } else {
          gameStore.getState().setOutfitSlot(item.category, item.id);
        }
        this.scene.restart({ tab: "clothes" });
      }, { width: 110, height: 34, fontSize: 15, fill: owned.includes(item.id) ? 0xb5e6c5 : 0xffe8a8 }).setDepth(4002);
    });
  }

  private renderFurniture(): void {
    const owned = gameStore.getState().save.inventory.furniture;
    furniture.forEach((item, index) => {
      const x = 195 + (index % 5) * 205;
      const y = 250 + Math.floor(index / 5) * 105;
      this.add.image(x - 64, y, item.id).setDisplaySize(66, 54).setDepth(4002);
      addSmallText(this, x + 20, y - 18, item.name, 118).setDepth(4002);
      addButton(this, x + 20, y + 34, owned.includes(item.id) ? "Tenho" : `${item.price} ★`, () => {
        gameStore.getState().purchaseFurniture(item.id);
        this.scene.restart({ tab: "furniture" });
      }, { width: 110, height: 34, fontSize: 15, fill: owned.includes(item.id) ? 0xb5e6c5 : 0xffe8a8 }).setDepth(4002);
    });
  }

  private renderFood(): void {
    const save = gameStore.getState().save;
    foodItems.forEach((item, index) => {
      const x = 280 + index * 280;
      const y = 305;
      const count = save.inventory.food.find((entry) => entry.itemId === item.id)?.count ?? 0;
      this.add.image(x - 78, y, item.id).setDisplaySize(74, 60).setDepth(4002);
      addSmallText(this, x + 20, y - 28, `${item.name}\nTenho: ${count}`, 150).setDepth(4002);
      addButton(this, x + 20, y + 42, `${item.price} ★`, () => {
        gameStore.getState().purchaseFood(item.id);
        this.scene.restart({ tab: "food" });
      }, { width: 120, height: 40, fontSize: 16, fill: 0xffe8a8 }).setDepth(4002);
    });
  }
}
