import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertUniqueIds,
  clothes,
  foodItems,
  furniture,
  interactiveObjects,
  petDefinition,
  sceneDefinitions
} from "../src/data";

const spriteRoot = join(process.cwd(), "public", "assets", "sprites");

describe("content data", () => {
  it("has unique ids", () => {
    assertUniqueIds(clothes.map((item) => item.id), "clothing");
    assertUniqueIds(furniture.map((item) => item.id), "furniture");
    assertUniqueIds(foodItems.map((item) => item.id), "food");
    assertUniqueIds(interactiveObjects.map((item) => item.id), "object");
    assertUniqueIds(sceneDefinitions.map((item) => item.id), "scene");
  });

  it("references sprite assets that exist", () => {
    const assets = [
      ...clothes.map((item) => item.asset),
      ...furniture.map((item) => item.asset),
      ...foodItems.map((item) => item.asset),
      ...petDefinition.colors.map((item) => item.asset),
      ...petDefinition.accessories.map((item) => item.asset),
      ...sceneDefinitions.flatMap((scene) => scene.objects.map((item) => item.asset))
    ];
    for (const asset of assets) {
      expect(existsSync(join(spriteRoot, asset)), asset).toBe(true);
    }
  });

  it("scene objects point to known interaction objects", () => {
    const ids = new Set(interactiveObjects.map((item) => item.id));
    for (const scene of sceneDefinitions) {
      for (const object of scene.objects) {
        expect(ids.has(object.objectId), `${scene.id}:${object.objectId}`).toBe(true);
      }
    }
  });
});
