import { createStore, type StoreApi } from "zustand/vanilla";
import { defaultSaveState } from "../systems/saveSystem";
import { localDateKey } from "../systems/saveMigrations";
import type { Character, FurniturePlacement, Position, SaveState } from "../schemas/saveState";
import { clothes, foodItems, furniture } from "../data";

type OutfitSlot = "top" | "bottom" | "dress" | "shoes";
type PetNeed = "hunger" | "energy" | "happiness";

export interface GameStoreState {
  save: SaveState;
  statusMessage: string;
  setSave: (save: SaveState) => void;
  updateCharacter: (character: Character) => void;
  setSkinTone: (skinTone: Character["body"]["skinTone"]) => void;
  setHair: (styleId: string, color: string) => void;
  setFace: (eyes: string, mouth: string) => void;
  setOutfitSlot: (slot: OutfitSlot, value: string | undefined) => void;
  toggleAccessory: (itemId: string) => void;
  setCurrentScene: (sceneId: string) => void;
  setCharacterPosition: (sceneId: string, position: Position) => void;
  setPetPosition: (sceneId: string, position: Position) => void;
  discoverInteraction: (interactionId: string, reward: number) => boolean;
  purchaseClothing: (itemId: string) => boolean;
  purchaseFurniture: (itemId: string) => boolean;
  purchaseFood: (itemId: string) => boolean;
  consumeFood: (itemId: string) => boolean;
  petCare: (needs: Partial<Record<PetNeed, number>>, message: string) => void;
  setPetStyle: (color: SaveState["pet"]["color"], accessories: string[]) => void;
  placeFurniture: (sceneId: string, itemId: string, position: Position) => void;
  moveFurniture: (sceneId: string, placementId: string, position: Position) => void;
  removeFurniture: (sceneId: string, placementId: string) => void;
  rotateFurniture: (sceneId: string, placementId: string) => void;
  setStatusMessage: (message: string) => void;
}

export const gameStore = createStore<GameStoreState>((set, get) => ({
  save: defaultSaveState(),
  statusMessage: "",
  setSave: (save) => set({ save }),
  updateCharacter: (character) => updateSave(set, (save) => ({ ...save, character })),
  setSkinTone: (skinTone) =>
    updateSave(set, (save) => ({
      ...save,
      character: { ...save.character, body: { ...save.character.body, skinTone } }
    })),
  setHair: (styleId, color) =>
    updateSave(set, (save) => ({
      ...save,
      character: { ...save.character, hair: { styleId, color } }
    })),
  setFace: (eyes, mouth) =>
    updateSave(set, (save) => ({
      ...save,
      character: { ...save.character, face: { eyes, mouth } }
    })),
  setOutfitSlot: (slot, value) =>
    updateSave(set, (save) => {
      const outfit = { ...save.character.outfit, [slot]: value };
      if (slot === "dress" && value) {
        delete outfit.top;
        delete outfit.bottom;
      }
      if ((slot === "top" || slot === "bottom") && value) {
        delete outfit.dress;
      }
      return {
        ...save,
        character: { ...save.character, outfit }
      };
    }),
  toggleAccessory: (itemId) =>
    updateSave(set, (save) => {
      const current = save.character.outfit.accessories;
      const accessories = current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId].slice(-4);
      return {
        ...save,
        character: {
          ...save.character,
          outfit: { ...save.character.outfit, accessories }
        }
      };
    }),
  setCurrentScene: (sceneId) => updateSave(set, (save) => ({ ...save, currentScene: sceneId })),
  setCharacterPosition: (sceneId, position) =>
    updateSave(set, (save) => ({
      ...save,
      characterPositionByScene: { ...save.characterPositionByScene, [sceneId]: position }
    })),
  setPetPosition: (sceneId, position) =>
    updateSave(set, (save) => ({
      ...save,
      petPositionByScene: { ...save.petPositionByScene, [sceneId]: position }
    })),
  discoverInteraction: (interactionId, reward) => {
    if (get().save.discoveredInteractions.includes(interactionId)) return false;
    updateSave(set, (save) => ({
      ...save,
      currency: save.currency + reward,
      discoveredInteractions: [...save.discoveredInteractions, interactionId]
    }));
    set({ statusMessage: reward > 0 ? `+${reward} estrelinhas` : "Descoberto!" });
    return true;
  },
  purchaseClothing: (itemId) => purchase(set, get, "clothes", itemId),
  purchaseFurniture: (itemId) => purchase(set, get, "furniture", itemId),
  purchaseFood: (itemId) => {
    const item = foodItems.find((entry) => entry.id === itemId);
    if (!item) return false;
    const save = get().save;
    if (save.currency < item.price) {
      set({ statusMessage: "Faltam estrelinhas" });
      return false;
    }
    updateSave(set, (state) => {
      const existing = state.inventory.food.find((entry) => entry.itemId === itemId);
      const food = existing
        ? state.inventory.food.map((entry) =>
            entry.itemId === itemId ? { ...entry, count: entry.count + 1 } : entry
          )
        : [...state.inventory.food, { itemId, count: 1 }];
      return {
        ...state,
        currency: state.currency - item.price,
        inventory: { ...state.inventory, food }
      };
    });
    set({ statusMessage: `${item.name} comprado` });
    return true;
  },
  consumeFood: (itemId) => {
    const save = get().save;
    const existing = save.inventory.food.find((entry) => entry.itemId === itemId);
    if (!existing || existing.count <= 0) return false;
    updateSave(set, (state) => ({
      ...state,
      inventory: {
        ...state.inventory,
        food: state.inventory.food
          .map((entry) => entry.itemId === itemId ? { ...entry, count: entry.count - 1 } : entry)
          .filter((entry) => entry.count > 0)
      }
    }));
    return true;
  },
  petCare: (needs, message) => {
    updateSave(set, (save) => ({
      ...save,
      pet: {
        ...save.pet,
        state: {
          hunger: clampNeed(save.pet.state.hunger + (needs.hunger ?? 0)),
          energy: clampNeed(save.pet.state.energy + (needs.energy ?? 0)),
          happiness: clampNeed(save.pet.state.happiness + (needs.happiness ?? 0))
        }
      }
    }));
    set({ statusMessage: message });
  },
  setPetStyle: (color, accessories) =>
    updateSave(set, (save) => ({
      ...save,
      pet: { ...save.pet, color, accessories }
    })),
  placeFurniture: (sceneId, itemId, position) =>
    updateSave(set, (save) => {
      const scene = save.scenes[sceneId] ?? { furniturePlacement: [] };
      const placement: FurniturePlacement = {
        placementId: `${itemId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        itemId,
        x: snap(position.x),
        y: snap(position.y),
        rotation: 0,
        scale: 1,
        locked: false
      };
      return {
        ...save,
        scenes: {
          ...save.scenes,
          [sceneId]: { furniturePlacement: [...scene.furniturePlacement, placement] }
        }
      };
    }),
  moveFurniture: (sceneId, placementId, position) =>
    updateSave(set, (save) => {
      const scene = save.scenes[sceneId] ?? { furniturePlacement: [] };
      return {
        ...save,
        scenes: {
          ...save.scenes,
          [sceneId]: {
            furniturePlacement: scene.furniturePlacement.map((placement) =>
              placement.placementId === placementId
                ? { ...placement, x: snap(position.x), y: snap(position.y) }
                : placement
            )
          }
        }
      };
    }),
  removeFurniture: (sceneId, placementId) =>
    updateSave(set, (save) => {
      const scene = save.scenes[sceneId] ?? { furniturePlacement: [] };
      return {
        ...save,
        scenes: {
          ...save.scenes,
          [sceneId]: {
            furniturePlacement: scene.furniturePlacement.filter(
              (placement) => placement.placementId !== placementId || placement.locked
            )
          }
        }
      };
    }),
  rotateFurniture: (sceneId, placementId) =>
    updateSave(set, (save) => {
      const scene = save.scenes[sceneId] ?? { furniturePlacement: [] };
      return {
        ...save,
        scenes: {
          ...save.scenes,
          [sceneId]: {
            furniturePlacement: scene.furniturePlacement.map((placement) =>
              placement.placementId === placementId
                ? { ...placement, rotation: nextRotation(placement.rotation) }
                : placement
            )
          }
        }
      };
    }),
  setStatusMessage: (message) => set({ statusMessage: message })
}));

export function applyDailyBonus(store: StoreApi<GameStoreState> = gameStore): void {
  const today = localDateKey();
  const save = store.getState().save;
  if (save.flags.dailyBonusLastDate === today) return;
  updateSave(store.setState, (state) => ({
    ...state,
    currency: state.currency + 5,
    flags: { ...state.flags, dailyBonusLastDate: today }
  }));
  store.setState({ statusMessage: "+5 estrelinhas de hoje" });
}

function purchase(
  set: StoreApi<GameStoreState>["setState"],
  get: StoreApi<GameStoreState>["getState"],
  bucket: "clothes" | "furniture",
  itemId: string
): boolean {
  const list = bucket === "clothes" ? clothes : furniture;
  const item = list.find((entry) => entry.id === itemId);
  if (!item) return false;
  const save = get().save;
  if (save.inventory[bucket].includes(itemId)) {
    set({ statusMessage: "Já está no inventário" });
    return true;
  }
  if (save.currency < item.price) {
    set({ statusMessage: "Faltam estrelinhas" });
    return false;
  }
  updateSave(set, (state) => ({
    ...state,
    currency: state.currency - item.price,
    inventory: {
      ...state.inventory,
      [bucket]: [...state.inventory[bucket], itemId]
    }
  }));
  set({ statusMessage: `${item.name} comprado` });
  return true;
}

function updateSave(
  set: StoreApi<GameStoreState>["setState"],
  updater: (save: SaveState) => SaveState
): void {
  set((state) => ({
    save: { ...updater(state.save), lastPlayed: Date.now() }
  }));
}

function clampNeed(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function snap(value: number): number {
  return Math.round(value / 32) * 32;
}

function nextRotation(rotation: FurniturePlacement["rotation"]): FurniturePlacement["rotation"] {
  if (rotation === 0) return 90;
  if (rotation === 90) return 180;
  if (rotation === 180) return 270;
  return 0;
}
