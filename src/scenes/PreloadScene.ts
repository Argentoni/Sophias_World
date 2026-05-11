import Phaser from "phaser";
import { clothes, foodItems, furniture, petDefinition, sceneDefinitions } from "../data";
import { loadSpriteAsset, sceneObjectKey } from "../utils/assets";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload(): void {
    loadSpriteAsset(this, "body-base", "body-base.png");
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
