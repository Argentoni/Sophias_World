import { z } from "zod";

export const ClothingCategorySchema = z.enum(["top", "bottom", "dress", "shoes", "accessory"]);

export const ClothingItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: ClothingCategorySchema,
  price: z.number().int().min(0),
  asset: z.string().min(1),
  defaultOwned: z.boolean().default(false)
});

export const FurnitureItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().min(0),
  asset: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  defaultOwned: z.boolean().default(false)
});

export const FoodItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().min(0),
  asset: z.string().min(1),
  hunger: z.number().int().min(0).max(100),
  happiness: z.number().int().min(0).max(100)
});

export const SceneObjectSchema = z.object({
  id: z.string().min(1),
  objectId: z.string().min(1),
  asset: z.string().min(1),
  x: z.number().finite(),
  y: z.number().finite(),
  depth: z.number().optional(),
  scale: z.number().positive().default(1)
});

export const SceneDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(["map", "house", "park", "shop"]),
  background: z.string().min(1),
  decorationArea: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number().positive(),
    height: z.number().positive(),
    grid: z.number().positive()
  }).optional(),
  objects: z.array(SceneObjectSchema)
});

const ActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("play-animation"),
    target: z.enum(["character", "pet", "object"]),
    anim: z.string().min(1)
  }),
  z.object({ type: z.literal("play-sound"), sound: z.string().min(1) }),
  z.object({
    type: z.literal("set-expression"),
    target: z.literal("character"),
    expression: z.string().min(1)
  }),
  z.object({ type: z.literal("swap-sprite"), sprite: z.string().min(1) }),
  z.object({ type: z.literal("give-item"), itemId: z.string().min(1) }),
  z.object({
    type: z.literal("give-currency"),
    amount: z.number().int().min(0),
    firstTimeOnly: z.boolean().default(true)
  }),
  z.object({ type: z.literal("spawn-particle"), particle: z.string().min(1) }),
  z.object({ type: z.literal("wait"), ms: z.number().int().min(0).max(5000) }),
  z.object({
    type: z.literal("pet-care"),
    hunger: z.number().int().optional(),
    energy: z.number().int().optional(),
    happiness: z.number().int().optional(),
    message: z.string().min(1)
  })
]);

export const InteractionSchema = z.object({
  trigger: z.enum(["tap", "drop-character", "drop-pet", "drop-item:food", "drop-item:toy"]),
  label: z.string().min(1),
  icon: z.string().min(1),
  reward: z.number().int().min(0).default(0),
  actions: z.array(ActionSchema)
});

export const InteractiveObjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  interactions: z.array(InteractionSchema)
});

export const PetAccessorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  asset: z.string().min(1)
});

export const PetDefinitionSchema = z.object({
  colors: z.array(z.object({
    id: z.enum(["cream", "caramel", "cocoa"]),
    name: z.string().min(1),
    asset: z.string().min(1)
  })),
  accessories: z.array(PetAccessorySchema)
});

export type ClothingItem = z.infer<typeof ClothingItemSchema>;
export type FurnitureItem = z.infer<typeof FurnitureItemSchema>;
export type FoodItem = z.infer<typeof FoodItemSchema>;
export type SceneDefinition = z.infer<typeof SceneDefinitionSchema>;
export type InteractiveObject = z.infer<typeof InteractiveObjectSchema>;
export type Interaction = z.infer<typeof InteractionSchema>;
