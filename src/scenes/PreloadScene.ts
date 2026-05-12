import Phaser from "phaser";
import { clothes, foodItems, furniture, petDefinition, sceneDefinitions } from "../data";
import { backgroundUrl, loadSpriteAsset, publicAssetUrl, sceneObjectKey } from "../utils/assets";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload(): void {
    this.load.image("bg-map", backgroundUrl("map-kawaii.jpg"));
    this.load.image("bg-bedroom", backgroundUrl("bedroom-kawaii.jpg"));
    this.load.image("bg-living-room", backgroundUrl("living-room-kawaii.jpg"));
    this.load.image("bg-kitchen", backgroundUrl("kitchen-kawaii.jpg"));
    this.load.image("bg-park", backgroundUrl("park-kawaii.jpg"));
    this.load.image("bg-shopping", backgroundUrl("shop-kawaii.jpg"));
    this.load.image("doll-base", publicAssetUrl("assets/avatar/doll-base-trimmed.png"));
    loadSpriteAsset(this, "body-base", "body-base.png");
    for (const skinTone of ["1", "2", "3", "4", "5"]) {
      loadSpriteAsset(this, `body-base-${skinTone}`, `body-base-${skinTone}.png`);
    }
    for (const item of clothes) loadSpriteAsset(this, item.id, item.asset);
    for (const item of furniture) loadSpriteAsset(this, item.id, item.asset);
    for (const item of foodItems) loadSpriteAsset(this, item.id, item.asset);
    for (const color of petDefinition.colors) loadSpriteAsset(this, `pet-${color.id}`, color.asset);
    for (const accessory of petDefinition.accessories) loadSpriteAsset(this, accessory.id, accessory.asset);
    for (const scene of sceneDefinitions) {
      for (const object of scene.objects) {
        loadSpriteAsset(this, sceneObjectKey(object.id), object.asset);
      }
    }
  }

  create(): void {
    this.scene.start("MapScene");
  }
}
