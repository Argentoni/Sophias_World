import { z } from "zod";

const PositionSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite()
});

export const CharacterSchema = z.object({
  body: z.object({
    skinTone: z.enum(["1", "2", "3", "4", "5"]),
    bodyType: z.literal("kid")
  }),
  hair: z.object({
    styleId: z.string().min(1),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/)
  }),
  face: z.object({
    eyes: z.string().min(1),
    mouth: z.string().min(1)
  }),
  outfit: z.object({
    top: z.string().optional(),
    bottom: z.string().optional(),
    dress: z.string().optional(),
    shoes: z.string().optional(),
    accessories: z.array(z.string()).default([])
  })
});

export const PetSchema = z.object({
  breed: z.literal("dog"),
  color: z.enum(["cream", "caramel", "cocoa"]),
  accessories: z.array(z.string()),
  state: z.object({
    hunger: z.number().int().min(0).max(100),
    energy: z.number().int().min(0).max(100),
    happiness: z.number().int().min(0).max(100)
  })
});

export const FurniturePlacementSchema = z.object({
  placementId: z.string().min(1),
  itemId: z.string().min(1),
  x: z.number().finite(),
  y: z.number().finite(),
  rotation: z.union([z.literal(0), z.literal(90), z.literal(180), z.literal(270)]),
  variant: z.string().optional(),
  scale: z.number().positive(),
  locked: z.boolean()
});

export const SaveStateSchema = z.object({
  version: z.literal(4),
  appVersion: z.string().min(1),
  character: CharacterSchema,
  pet: PetSchema,
  currency: z.number().int().min(0),
  currentScene: z.string().min(1),
  characterPositionByScene: z.record(PositionSchema),
  petPositionByScene: z.record(PositionSchema),
  objectPositionByScene: z.record(z.record(PositionSchema)),
  inventory: z.object({
    clothes: z.array(z.string().min(1)),
    furniture: z.array(z.string().min(1)),
    food: z.array(z.object({
      itemId: z.string().min(1),
      count: z.number().int().min(0)
    }))
  }),
  scenes: z.record(z.object({
    furniturePlacement: z.array(FurniturePlacementSchema)
  })),
  discoveredInteractions: z.array(z.string().min(1)),
  settings: z.object({
    sfxVolume: z.number().min(0).max(1),
    parentalLockEnabled: z.boolean()
  }),
  flags: z.object({
    welcomeBonusGiven: z.boolean(),
    dailyBonusLastDate: z.string()
  }),
  lastPlayed: z.number().int().min(0)
});

export type Character = z.infer<typeof CharacterSchema>;
export type Pet = z.infer<typeof PetSchema>;
export type FurniturePlacement = z.infer<typeof FurniturePlacementSchema>;
export type SaveState = z.infer<typeof SaveStateSchema>;
export type Position = z.infer<typeof PositionSchema>;
