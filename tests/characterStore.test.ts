import { describe, it, expect, beforeEach } from "vitest";
import { characterStore } from "../src/store/characterStore";
import { defaultSaveState } from "../src/systems/saveSystem";

describe("characterStore", () => {
  beforeEach(() => {
    characterStore.setState({ character: defaultSaveState().character });
  });

  it("exposes the default character on first read", () => {
    const c = characterStore.getState().character;
    expect(c.body.skinTone).toBe("1");
  });

  it("updates outfit.top via setOutfitSlot", () => {
    characterStore.getState().setOutfitSlot("top", "outfit-001");
    expect(characterStore.getState().character.outfit.top).toBe("outfit-001");
  });

  it("clears outfit slot when value is undefined", () => {
    characterStore.getState().setOutfitSlot("top", "outfit-001");
    characterStore.getState().setOutfitSlot("top", undefined);
    expect(characterStore.getState().character.outfit.top).toBeUndefined();
  });
});
