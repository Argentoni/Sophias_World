import Phaser from "phaser";
import { clothes, petDefinition } from "../data";
import { CharacterComposer, eyeStyles, hairColors, hairStyles, mouthStyles } from "../systems/characterComposer";
import { PetComposer } from "../systems/petComposer";
import { gameStore } from "../store/gameStore";
import { addButton, addSmallText, addTitle } from "../ui/phaserUi";
import { drawClothingIcon, drawPetAccessoryIcon } from "../ui/chibiPreview";
import type { Character } from "../schemas/saveState";

type WardrobeTab = "skin" | "hair" | "face" | "clothes" | "pet";
type WardrobeInit = { tab?: WardrobeTab; page?: number };

const skinOptions: Character["body"]["skinTone"][] = ["1", "2", "3", "4", "5"];

export class WardrobeScene extends Phaser.Scene {
  private tab: WardrobeTab = "clothes";
  private page = 0;

  constructor() {
    super("WardrobeScene");
  }

  init(data: WardrobeInit): void {
    this.tab = data.tab ?? "clothes";
    this.page = data.page ?? 0;
  }

  create(): void {
    this.add.rectangle(640, 390, 1120, 580, 0xfaf4e8, 0.98).setStrokeStyle(3, 0xffffff, 0.85).setDepth(4200);
    addTitle(this, 640, 135, "Guarda-roupa").setDepth(4201);
    addButton(this, 1045, 136, "Fechar", () => this.scene.stop(), { width: 140, height: 46, fontSize: 18 }).setDepth(4201);
    this.renderTabs();
    this.renderPreview();
    if (this.tab === "skin") this.renderSkin();
    if (this.tab === "hair") this.renderHair();
    if (this.tab === "face") this.renderFace();
    if (this.tab === "clothes") this.renderClothes();
    if (this.tab === "pet") this.renderPet();
  }

  private renderTabs(): void {
    const tabs: Array<[WardrobeTab, string]> = [
      ["skin", "Pele"],
      ["hair", "Cabelo"],
      ["face", "Rosto"],
      ["clothes", "Roupas"],
      ["pet", "Pet"]
    ];
    tabs.forEach(([tab, label], index) => {
      addButton(this, 185 + index * 128, 190, label, () => this.scene.restart({ tab, page: 0 }), {
        width: 112,
        height: 42,
        fontSize: 16,
        fill: this.tab === tab ? 0xffb6d5 : 0xfaf4e8
      }).setDepth(4201);
    });
  }

  private renderPreview(): void {
    const save = gameStore.getState().save;
    const character = new CharacterComposer(this, 260, 535, 0.39);
    character.render(save.character);
    character.container.setDepth(4202);
    const pet = new PetComposer(this, 260, 625, 0.72);
    pet.render(save.pet);
    pet.container.setDepth(4202);
  }

  private renderSkin(): void {
    skinOptions.forEach((skinTone, index) => {
      addButton(this, 500 + index * 120, 310, `Tom ${index + 1}`, () => {
        gameStore.getState().setSkinTone(skinTone);
        this.scene.restart({ tab: "skin" });
      }, { width: 104, fill: 0xffe8a8 }).setDepth(4202);
    });
  }

  private renderHair(): void {
    hairStyles.forEach((style, index) => {
      addButton(this, 485 + (index % 4) * 132, 295 + Math.floor(index / 4) * 62, hairLabel(style), () => {
        const current = gameStore.getState().save.character.hair.color;
        gameStore.getState().setHair(style, current);
        this.scene.restart({ tab: "hair" });
      }, { width: 116, height: 42, fontSize: 15 }).setDepth(4202);
    });
    hairColors.forEach((color, index) => {
      const swatch = this.add.circle(500 + index * 86, 530, 24, Phaser.Display.Color.HexStringToColor(color).color)
        .setStrokeStyle(4, 0x6e4a2c)
        .setDepth(4202)
        .setInteractive({ useHandCursor: true });
      swatch.on("pointerdown", () => {
        const current = gameStore.getState().save.character.hair.styleId;
        gameStore.getState().setHair(current, color);
        this.scene.restart({ tab: "hair" });
      });
    });
  }

  private renderFace(): void {
    eyeStyles.forEach((eyes, index) => {
      const x = 500 + (index % 4) * 135;
      const y = 285 + Math.floor(index / 4) * 62;
      addButton(this, x, y, eyeLabel(eyes), () => {
        const mouth = gameStore.getState().save.character.face.mouth;
        gameStore.getState().setFace(eyes, mouth);
        this.scene.restart({ tab: "face" });
      }, { width: 118, height: 44, fontSize: 15 }).setDepth(4202);
    });
    mouthStyles.forEach((mouth, index) => {
      const x = 500 + (index % 4) * 135;
      const y = 445 + Math.floor(index / 4) * 62;
      addButton(this, x, y, mouthLabel(mouth), () => {
        const eyes = gameStore.getState().save.character.face.eyes;
        gameStore.getState().setFace(eyes, mouth);
        this.scene.restart({ tab: "face" });
      }, { width: 118, height: 44, fontSize: 15, fill: 0xb5e6c5 }).setDepth(4202);
    });
  }

  private renderClothes(): void {
    const save = gameStore.getState().save;
    const owned = clothes.filter((item) => save.inventory.clothes.includes(item.id));
    const pageSize = 15;
    const visible = owned.slice(this.page * pageSize, this.page * pageSize + pageSize);
    visible.forEach((item, index) => {
      const x = 470 + (index % 5) * 140;
      const y = 300 + Math.floor(index / 5) * 112;
      this.add.rectangle(x, y, 116, 98, 0xffffff, 0.62).setStrokeStyle(2, 0xffffff, 0.9).setDepth(4201);
      drawClothingIcon(this, x, y - 12, item.id, item.category, 0.72, 4202);
      addButton(this, x, y + 38, item.category === "accessory" ? "Usar" : "Vestir", () => {
        if (item.category === "accessory") gameStore.getState().toggleAccessory(item.id);
        else gameStore.getState().setOutfitSlot(item.category, item.id);
        this.scene.restart({ tab: "clothes", page: this.page });
      }, { width: 88, height: 30, fontSize: 14, fill: 0xffe8a8 }).setDepth(4202);
    });
    this.renderPager(owned.length, pageSize);
  }

  private renderPet(): void {
    petDefinition.colors.forEach((color, index) => {
      addButton(this, 500 + index * 150, 310, color.name, () => {
        gameStore.getState().setPetStyle(color.id, gameStore.getState().save.pet.accessories);
        this.scene.restart({ tab: "pet" });
      }, { width: 125, height: 46, fontSize: 16, fill: 0xb5e6c5 }).setDepth(4202);
    });
    petDefinition.accessories.forEach((item, index) => {
      const x = 470 + (index % 5) * 130;
      const y = 430 + Math.floor(index / 5) * 86;
      drawPetAccessoryIcon(this, x, y - 16, item.id, 0.74, 4202);
      addSmallText(this, x, y + 34, item.name, 110).setDepth(4202);
      this.add.rectangle(x, y - 16, 92, 62, 0xffffff, 0.001)
        .setDepth(4203)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          const current = gameStore.getState().save.pet.accessories;
          const accessories = current.includes(item.id)
            ? current.filter((id) => id !== item.id)
            : [...current, item.id].slice(-2);
          gameStore.getState().setPetStyle(gameStore.getState().save.pet.color, accessories);
          this.scene.restart({ tab: "pet" });
        });
    });
  }

  private renderPager(total: number, pageSize: number): void {
    const pageCount = Math.ceil(total / pageSize);
    if (pageCount <= 1) return;
    addButton(this, 825, 628, "<", () => {
      this.scene.restart({ tab: this.tab, page: Math.max(0, this.page - 1) });
    }, { width: 54, height: 38, fontSize: 18, fill: 0xfaf4e8 }).setDepth(4202);
    addSmallText(this, 905, 628, `${this.page + 1}/${pageCount}`, 70).setDepth(4202);
    addButton(this, 985, 628, ">", () => {
      this.scene.restart({ tab: this.tab, page: Math.min(pageCount - 1, this.page + 1) });
    }, { width: 54, height: 38, fontSize: 18, fill: 0xfaf4e8 }).setDepth(4202);
  }
}

function hairLabel(style: string): string {
  if (style === "bob") return "Chanel";
  if (style === "soft-bangs") return "Franjinha";
  if (style === "pigtails") return "Maria";
  if (style === "braids") return "Tranças";
  if (style === "curly") return "Cacheado";
  if (style === "long") return "Longo";
  if (style === "buns") return "Coques";
  if (style === "space-buns") return "Coquinhos";
  if (style === "ponytail") return "Rabo";
  if (style === "waves") return "Ondulado";
  if (style === "side-braid") return "Trança lado";
  if (style === "pixie") return "Curtinho";
  return "Cabelo";
}

function eyeLabel(style: string): string {
  if (style === "round") return "Redondo";
  if (style === "smile") return "Feliz";
  if (style === "star") return "Estrela";
  if (style === "sleepy") return "Sono";
  if (style === "wink") return "Piscadinha";
  if (style === "heart") return "Coração";
  if (style === "gentle") return "Doce";
  return "Brilho";
}

function mouthLabel(style: string): string {
  if (style === "open") return "Surpresa";
  if (style === "yum") return "Gostei";
  if (style === "curious") return "Curiosa";
  if (style === "sleepy") return "Sono";
  if (style === "laugh") return "Rindo";
  if (style === "tiny") return "Pequena";
  if (style === "kiss") return "Beijinho";
  return "Sorriso";
}
