import { z } from "zod";

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

export const SaveStateSchema = z.object({
  version: z.literal(1),
  appVersion: z.string().min(1),
  character: CharacterSchema,
  currency: z.number().int().min(0),
  lastPlayed: z.number().int().min(0)
});

export type Character = z.infer<typeof CharacterSchema>;
export type SaveState = z.infer<typeof SaveStateSchema>;
