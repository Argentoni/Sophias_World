import Phaser from "phaser";
import { clothes, foodItems, furniture } from "../data";
import { gameStore } from "../store/gameStore";
import { addButton, addSmallText, addTitle } from "../ui/phaserUi";
import { drawClothingIcon } from "../ui/chibiPreview";
import { fitFurniturePreview } from "../ui/itemPreview";

type ShopTab = "clothes" | "furniture" | "food";
type ShopInit = { tab?: ShopTab; page?: number };

export class ShopScene extends Phaser.Scene {
  private tab: ShopTab = "clothes";
  private page = 0;

  constructor() {
    super("ShopScene");
  }

  init(data: ShopInit): void {
    this.tab = data.tab ?? "clothes";
    this.page = data.page ?? 0;
  }

  create(): void {
    this.add.rectangle(640, 390, 1080, 560, 0xfaf4e8, 0.98).setStrokeStyle(3, 0xffffff, 0.85).setDepth(4000);
    addTitle(this, 790, 150, "Loja").setDepth(4001);
    addButton(this, 250, 150, "Roupas", () => this.scene.restart({ tab: "clothes", page: 0 }), { width: 150, height: 46, fontSize: 18, fill: this.tab === "clothes" ? 0xffb6d5 : 0xfaf4e8 }).setDepth(4001);
    addButton(this, 420, 150, "Móveis", () => this.scene.restart({ tab: "furniture", page: 0 }), { width: 150, height: 46, fontSize: 18, fill: this.tab === "furniture" ? 0xb5e6c5 : 0xfaf4e8 }).setDepth(4001);
    addButton(this, 590, 150, "Comidas", () => this.scene.restart({ tab: "food", page: 0 }), { width: 150, height: 46, fontSize: 18, fill: this.tab === "food" ? 0xffe8a8 : 0xfaf4e8 }).setDepth(4001);
    addButton(this, 1040, 150, "Fechar", () => this.scene.stop(), { width: 140, height: 46, fontSize: 18 }).setDepth(4001);

    if (this.tab === "clothes") this.renderClothes();
    if (this.tab === "furniture") this.renderFurniture();
    if (this.tab === "food") this.renderFood();
  }

  private renderClothes(): void {
    const owned = gameStore.getState().save.inventory.clothes;
    const pageSize = 15;
    const visible = clothes.slice(this.page * pageSize, this.page * pageSize + pageSize);
    visible.forEach((item, index) => {
      const x = 210 + (index % 5) * 205;
      const y = 245 + Math.floor(index / 5) * 104;
      this.add.rectangle(x, y, 178, 92, 0xffffff, 0.68).setStrokeStyle(2, 0xffffff, 0.9).setDepth(4001);
      drawClothingIcon(this, x - 56, y - 4, item.id, item.category, 0.66, 4002);
      addSmallText(this, x + 28, y - 22, item.name, 104).setDepth(4002);
      addButton(this, x + 28, y + 30, owned.includes(item.id) ? "Tenho" : `${item.price} ★`, () => {
        const canUse = owned.includes(item.id) || gameStore.getState().purchaseClothing(item.id);
        if (!canUse) {
          this.scene.restart({ tab: "clothes", page: this.page });
          return;
        }
        if (item.category === "accessory") {
          gameStore.getState().toggleAccessory(item.id);
        } else {
          gameStore.getState().setOutfitSlot(item.category, item.id);
        }
        this.scene.restart({ tab: "clothes", page: this.page });
      }, { width: 106, height: 32, fontSize: 14, fill: owned.includes(item.id) ? 0xb5e6c5 : 0xffe8a8 }).setDepth(4002);
    });
    this.renderPager(clothes.length, pageSize);
  }

  private renderFurniture(): void {
    const owned = gameStore.getState().save.inventory.furniture;
    const pageSize = 15;
    const visible = furniture.slice(this.page * pageSize, this.page * pageSize + pageSize);
    visible.forEach((item, index) => {
      const x = 210 + (index % 5) * 205;
      const y = 245 + Math.floor(index / 5) * 104;
      this.add.rectangle(x, y, 178, 92, 0xffffff, 0.68).setStrokeStyle(2, 0xffffff, 0.9).setDepth(4001);
      fitFurniturePreview(this.add.image(x - 56, y - 8, item.id).setDepth(4002), item.width, item.height, 74, 62);
      addSmallText(this, x + 28, y - 22, item.name, 104).setDepth(4002);
      addButton(this, x + 28, y + 30, owned.includes(item.id) ? "Tenho" : `${item.price} ★`, () => {
        gameStore.getState().purchaseFurniture(item.id);
        this.scene.restart({ tab: "furniture", page: this.page });
      }, { width: 106, height: 32, fontSize: 14, fill: owned.includes(item.id) ? 0xb5e6c5 : 0xffe8a8 }).setDepth(4002);
    });
    this.renderPager(furniture.length, pageSize);
  }

  private renderFood(): void {
    const save = gameStore.getState().save;
    const pageSize = 8;
    const visible = foodItems.slice(this.page * pageSize, this.page * pageSize + pageSize);
    visible.forEach((item, index) => {
      const x = 260 + (index % 4) * 250;
      const y = 285 + Math.floor(index / 4) * 168;
      const count = save.inventory.food.find((entry) => entry.itemId === item.id)?.count ?? 0;
      this.add.rectangle(x, y, 210, 132, 0xffffff, 0.68).setStrokeStyle(2, 0xffffff, 0.9).setDepth(4001);
      this.add.image(x, y - 34, item.id).setDisplaySize(84, 68).setDepth(4002);
      addSmallText(this, x, y + 20, `${item.name}\nTenho: ${count}`, 150).setDepth(4002);
      addButton(this, x, y + 70, `${item.price} ★`, () => {
        gameStore.getState().purchaseFood(item.id);
        this.scene.restart({ tab: "food", page: this.page });
      }, { width: 120, height: 38, fontSize: 16, fill: 0xffe8a8 }).setDepth(4002);
    });
    this.renderPager(foodItems.length, pageSize);
  }

  private renderPager(total: number, pageSize: number): void {
    const pageCount = Math.ceil(total / pageSize);
    if (pageCount <= 1) return;
    addButton(this, 840, 640, "<", () => {
      this.scene.restart({ tab: this.tab, page: Math.max(0, this.page - 1) });
    }, { width: 58, height: 40, fontSize: 18, fill: 0xfaf4e8 }).setDepth(4002);
    addSmallText(this, 925, 640, `${this.page + 1}/${pageCount}`, 80).setDepth(4002);
    addButton(this, 1010, 640, ">", () => {
      this.scene.restart({ tab: this.tab, page: Math.min(pageCount - 1, this.page + 1) });
    }, { width: 58, height: 40, fontSize: 18, fill: 0xfaf4e8 }).setDepth(4002);
  }
}
