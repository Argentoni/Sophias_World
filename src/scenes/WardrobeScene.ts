import Phaser from "phaser";
import { clothes, petDefinition } from "../data";
import { CharacterComposer, eyeStyles, hairColors, hairStyles, mouthStyles } from "../systems/characterComposer";
import { PetComposer } from "../systems/petComposer";
import { gameStore } from "../store/gameStore";
import { addButton, addPanel, addSmallText, addTitle } from "../ui/phaserUi";
import type { Character } from "../schemas/saveState";

type WardrobeTab = "skin" | "hair" | "face" | "clothes" | "pet";
type WardrobeInit = { tab?: WardrobeTab };

const skinOptions: Character["body"]["skinTone"][] = ["1", "2", "3", "4", "5"];

export class WardrobeScene extends Phaser.Scene {
  private tab: WardrobeTab = "clothes";

  constructor() {
    super("WardrobeScene");
  }

  init(data: WardrobeInit): void {
    this.tab = data.tab ?? "clothes";
  }

  create(): void {
    addPanel(this, 640, 390, 1120, 580, 0xfaf4e8).setDepth(4200);
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
      addButton(this, 185 + index * 128, 190, label, () => this.scene.restart({ tab }), {
        width: 112,
        height: 42,
        fontSize: 16,
        fill: this.tab === tab ? 0xffb6d5 : 0xfaf4e8
      }).setDepth(4201);
    });
  }

  private renderPreview(): void {
    const save = gameStore.getState().save;
    const character = new CharacterComposer(this, 260, 435, 0.5);
    character.render(save.character);
    const pet = new PetComposer(this, 260, 625);
    pet.render(save.pet);
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
      addButton(this, 510 + (index % 3) * 165, 305 + Math.floor(index / 3) * 72, hairLabel(style), () => {
        const current = gameStore.getState().save.character.hair.color;
        gameStore.getState().setHair(style, current);
        this.scene.restart({ tab: "hair" });
      }, { width: 142, height: 48, fontSize: 17 }).setDepth(4202);
    });
    hairColors.forEach((color, index) => {
      const swatch = this.add.circle(520 + index * 80, 500, 24, Phaser.Display.Color.HexStringToColor(color).color)
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
      addButton(this, 500 + index * 128, 310, eyeLabel(eyes), () => {
        const mouth = gameStore.getState().save.character.face.mouth;
        gameStore.getState().setFace(eyes, mouth);
        this.scene.restart({ tab: "face" });
      }, { width: 112, height: 48, fontSize: 16 }).setDepth(4202);
    });
    mouthStyles.forEach((mouth, index) => {
      addButton(this, 500 + index * 128, 420, mouthLabel(mouth), () => {
        const eyes = gameStore.getState().save.character.face.eyes;
        gameStore.getState().setFace(eyes, mouth);
        this.scene.restart({ tab: "face" });
      }, { width: 112, height: 48, fontSize: 16, fill: 0xb5e6c5 }).setDepth(4202);
    });
  }

  private renderClothes(): void {
    const save = gameStore.getState().save;
    const owned = clothes.filter((item) => save.inventory.clothes.includes(item.id));
    owned.forEach((item, index) => {
      const x = 470 + (index % 5) * 140;
      const y = 285 + Math.floor(index / 5) * 105;
      this.add.image(x, y, item.id).setDisplaySize(62, 90).setDepth(4202);
      addButton(this, x, y + 62, item.category === "accessory" ? "Usar" : "Vestir", () => {
        if (item.category === "accessory") gameStore.getState().toggleAccessory(item.id);
        else gameStore.getState().setOutfitSlot(item.category, item.id);
        this.scene.restart({ tab: "clothes" });
      }, { width: 92, height: 34, fontSize: 15, fill: 0xffe8a8 }).setDepth(4202);
    });
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
      this.add.image(x, y - 16, item.id).setDisplaySize(62, 48).setDepth(4202);
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
}

function hairLabel(style: string): string {
  if (style === "pigtails") return "Maria";
  if (style === "braids") return "Tranças";
  if (style === "curly") return "Cacheado";
  if (style === "long") return "Longo";
  return "Curto";
}

function eyeLabel(style: string): string {
  if (style === "round") return "Redondo";
  if (style === "smile") return "Feliz";
  if (style === "star") return "Estrela";
  if (style === "sleepy") return "Sono";
  return "Brilho";
}

function mouthLabel(style: string): string {
  if (style === "open") return "Surpresa";
  if (style === "yum") return "Gostei";
  if (style === "curious") return "Curiosa";
  if (style === "sleepy") return "Sono";
  return "Sorriso";
}
