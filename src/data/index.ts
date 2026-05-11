import clothesJson from "./clothes.json";
import foodJson from "./food.json";
import furnitureJson from "./furniture.json";
import objectsJson from "./objects.json";
import petsJson from "./pets.json";
import scenesJson from "./scenes.json";
import {
  ClothingItemSchema,
  FoodItemSchema,
  FurnitureItemSchema,
  InteractiveObjectSchema,
  PetDefinitionSchema,
  SceneDefinitionSchema
} from "../schemas/content";

export const clothes = ClothingItemSchema.array().parse(clothesJson);
export const furniture = FurnitureItemSchema.array().parse(furnitureJson);
export const foodItems = FoodItemSchema.array().parse(foodJson);
export const interactiveObjects = InteractiveObjectSchema.array().parse(objectsJson);
export const petDefinition = PetDefinitionSchema.parse(petsJson);
export const sceneDefinitions = SceneDefinitionSchema.array().parse(scenesJson);

export const clothesById = new Map(clothes.map((item) => [item.id, item]));
export const furnitureById = new Map(furniture.map((item) => [item.id, item]));
export const foodById = new Map(foodItems.map((item) => [item.id, item]));
export const objectsById = new Map(interactiveObjects.map((item) => [item.id, item]));
export const scenesById = new Map(sceneDefinitions.map((item) => [item.id, item]));

export function assertUniqueIds(ids: string[], label: string): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`Duplicate ${label} id: ${id}`);
    seen.add(id);
  }
}
