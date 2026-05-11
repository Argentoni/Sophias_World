import { createStore } from "zustand/vanilla";
import { defaultSaveState } from "../systems/saveSystem";
import type { Character } from "../schemas/saveState";

type OutfitSlot = "top" | "bottom" | "dress" | "shoes";

export interface CharacterStoreState {
  character: Character;
  setOutfitSlot: (slot: OutfitSlot, value: string | undefined) => void;
  replaceCharacter: (next: Character) => void;
}

export const characterStore = createStore<CharacterStoreState>((set) => ({
  character: defaultSaveState().character,
  setOutfitSlot: (slot, value) =>
    set((state) => ({
      character: {
        ...state.character,
        outfit: { ...state.character.outfit, [slot]: value }
      }
    })),
  replaceCharacter: (next) => set({ character: next })
}));
