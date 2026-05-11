import { describe, it, expect } from "vitest";
import { SaveStateSchema, type SaveState } from "../src/schemas/saveState";

describe("SaveStateSchema (Fase 0)", () => {
  const validSave: SaveState = {
    version: 1,
    appVersion: "0.1.0-fase0",
    character: {
      body: { skinTone: "1", bodyType: "kid" },
      hair: { styleId: "default", color: "#1A1A24" },
      face: { eyes: "eyes-default", mouth: "mouth-default" },
      outfit: { accessories: [] }
    },
    currency: 0,
    lastPlayed: 1715000000000
  };

  it("accepts a valid minimal save", () => {
    expect(SaveStateSchema.parse(validSave)).toEqual(validSave);
  });

  it("rejects a save with wrong version type", () => {
    const bad = { ...validSave, version: "1" as unknown as number };
    expect(() => SaveStateSchema.parse(bad)).toThrow();
  });

  it("rejects a save missing character", () => {
    const { character: _omit, ...bad } = validSave;
    expect(() => SaveStateSchema.parse(bad)).toThrow();
  });

  it("rejects negative currency", () => {
    const bad = { ...validSave, currency: -1 };
    expect(() => SaveStateSchema.parse(bad)).toThrow();
  });

  it("accepts outfit with multiple accessories", () => {
    const save = {
      ...validSave,
      character: {
        ...validSave.character,
        outfit: { top: "top-01", accessories: ["acc-1", "acc-2"] }
      }
    };
    expect(SaveStateSchema.parse(save).character.outfit.accessories.length).toBe(2);
  });
});
