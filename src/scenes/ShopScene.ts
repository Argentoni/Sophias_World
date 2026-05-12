import Phaser from "phaser";
import { clothes, foodItems, furniture } from "../data";
import { gameStore } from "../store/gameStore";
import { addButton, addSmallText, addTitle } from "../ui/phaserUi";
import { drawClothingIcon } from "../ui/chibiPreview";
import { fitFurniturePreview } from "../ui/itemPreview";

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
    this.add.rectangle(640, 390, 1080, 560, 0xfaf4e8, 0.98).setStrokeStyle(3, 0xffffff, 0.85).setDepth(4000);
    addTitle(this, 790, 150, "Loja").setDepth(4001);
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
      const x = 210 + (index % 5) * 205;
      const y = 245 + Math.floor(index / 5) * 104;
      this.add.rectangle(x, y, 178, 92, 0xffffff, 0.68).setStrokeStyle(2, 0xffffff, 0.9).setDepth(4001);
      drawClothingIcon(this, x - 56, y - 4, item.id, item.category, 0.58, 4002);
      addSmallText(this, x + 28, y - 22, item.name, 104).setDepth(4002);
      addButton(this, x + 28, y + 30, owned.includes(item.id) ? "Tenho" : `${item.price} ★`, () => {
        if (!owned.includes(item.id)) gameStore.getState().purchaseClothing(item.id);
        if (item.category === "accessory") {
          gameStore.getState().toggleAccessory(item.id);
        } else {
          gameStore.getState().setOutfitSlot(item.category, item.id);
        }
        this.scene.restart({ tab: "clothes" });
      }, { width: 106, height: 32, fontSize: 14, fill: owned.includes(item.id) ? 0xb5e6c5 : 0xffe8a8 }).setDepth(4002);
    });
  }

  private renderFurniture(): void {
    const owned = gameStore.getState().save.inventory.furniture;
    furniture.forEach((item, index) => {
      const x = 210 + (index % 5) * 205;
      const y = 245 + Math.floor(index / 5) * 104;
      this.add.rectangle(x, y, 178, 92, 0xffffff, 0.68).setStrokeStyle(2, 0xffffff, 0.9).setDepth(4001);
      fitFurniturePreview(this.add.image(x - 56, y - 8, item.id).setDepth(4002), item.width, item.height, 74, 62);
      addSmallText(this, x + 28, y - 22, item.name, 104).setDepth(4002);
      addButton(this, x + 28, y + 30, owned.includes(item.id) ? "Tenho" : `${item.price} ★`, () => {
        gameStore.getState().purchaseFurniture(item.id);
        this.scene.restart({ tab: "furniture" });
      }, { width: 106, height: 32, fontSize: 14, fill: owned.includes(item.id) ? 0xb5e6c5 : 0xffe8a8 }).setDepth(4002);
    });
  }

  private renderFood(): void {
    const save = gameStore.getState().save;
    foodItems.forEach((item, index) => {
      const x = 320 + index * 260;
      const y = 315;
      const count = save.inventory.food.find((entry) => entry.itemId === item.id)?.count ?? 0;
      this.add.rectangle(x, y, 210, 132, 0xffffff, 0.68).setStrokeStyle(2, 0xffffff, 0.9).setDepth(4001);
      this.add.image(x, y - 34, item.id).setDisplaySize(84, 68).setDepth(4002);
      addSmallText(this, x, y + 20, `${item.name}\nTenho: ${count}`, 150).setDepth(4002);
      addButton(this, x, y + 70, `${item.price} ★`, () => {
        gameStore.getState().purchaseFood(item.id);
        this.scene.restart({ tab: "food" });
      }, { width: 120, height: 38, fontSize: 16, fill: 0xffe8a8 }).setDepth(4002);
    });
  }
}
