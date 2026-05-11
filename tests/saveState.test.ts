import { describe, it, expect } from "vitest";
import { SaveStateSchema, type SaveState } from "../src/schemas/saveState";
import { defaultSaveState } from "../src/systems/saveSystem";
import { migrateSave } from "../src/systems/saveMigrations";

describe("SaveStateSchema", () => {
  const validSave: SaveState = defaultSaveState();

  it("accepts a valid MVP save", () => {
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

  it("migrates a v1 save to v2 preserving character and currency floor", () => {
    const migrated = migrateSave({
      version: 1,
      appVersion: "0.1.0-fase0",
      character: validSave.character,
      currency: 7,
      lastPlayed: 1715000000000
    });
    const parsed = SaveStateSchema.parse(migrated);
    expect(parsed.version).toBe(2);
    expect(parsed.character).toEqual(validSave.character);
    expect(parsed.currency).toBe(100);
    expect(parsed.pet.breed).toBe("dog");
  });
});
