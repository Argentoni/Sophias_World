import { get, set } from "idb-keyval";
import type { StoreApi } from "zustand/vanilla";
import { SaveStateSchema, type SaveState } from "../schemas/saveState";
import { APP_VERSION } from "../version";
import { localDateKey, migrateSave } from "./saveMigrations";
import type { GameStoreState } from "../store/gameStore";
import {
  starterClothingIds,
  starterFoodInventory,
  starterFurnitureIds,
  starterFurniturePlacements
} from "../data/starterWorld";

const SAVE_KEY = "sophias-world:save";

export function defaultSaveState(): SaveState {
  return {
    version: 4,
    appVersion: APP_VERSION,
    character: {
      body: { skinTone: "1", bodyType: "kid" },
      hair: { styleId: "bob", color: "#1A1A24" },
      face: { eyes: "sparkle", mouth: "smile" },
      outfit: {
        top: "outfit-001",
        bottom: "bottom-denim",
        shoes: "shoes-pink",
        accessories: []
      }
    },
    pet: {
      breed: "dog",
      color: "cream",
      accessories: [],
      state: { hunger: 60, energy: 70, happiness: 70 }
    },
    currency: 100,
    currentScene: "map",
    characterPositionByScene: {
      house: { x: 640, y: 470 },
      park: { x: 520, y: 470 }
    },
    petPositionByScene: {
      house: { x: 760, y: 500 },
      park: { x: 760, y: 520 }
    },
    objectPositionByScene: {},
    inventory: {
      clothes: [...starterClothingIds],
      furniture: [...starterFurnitureIds],
      food: starterFoodInventory.map((entry) => ({ ...entry }))
    },
    scenes: starterFurniturePlacements(),
    discoveredInteractions: [],
    settings: { sfxVolume: 0.7, parentalLockEnabled: true },
    flags: { welcomeBonusGiven: true, dailyBonusLastDate: localDateKey() },
    lastPlayed: Date.now()
  };
}

export async function saveState(state: SaveState): Promise<void> {
  // Validate at the boundary. Caller bugs surface here, not in IndexedDB.
  const validated = SaveStateSchema.parse(state);
  try {
    await set(SAVE_KEY, validated);
  } catch (err) {
    if (err instanceof Error && err.name === "QuotaExceededError") {
      // Surface as a custom error the UI layer recognizes; keep prior save intact.
      const wrapped = new Error("SAVE_QUOTA_EXCEEDED");
      wrapped.cause = err;
      throw wrapped;
    }
    throw err;
  }
}

/**
 * Returns parsed SaveState, or null if no save exists or it fails validation.
 * On corruption: returns null WITHOUT deleting the raw blob — the parental
 * recovery flow can still export it later.
 */
export async function loadState(): Promise<SaveState | null> {
  const raw = await get(SAVE_KEY);
  if (raw === undefined) return null;
  const migrated = migrateSave(raw);
  const result = SaveStateSchema.safeParse(migrated);
  if (!result.success) {
    console.warn("[save] corruption detected, keeping raw for recovery");
    return null;
  }
  const hydrated = hydrateStarterContent(result.data);
  if (migrated !== raw || hydrated !== result.data) {
    await saveState(hydrated);
  }
  return hydrated;
}

export async function exportRawSave(): Promise<unknown> {
  return get(SAVE_KEY);
}

export async function importSave(state: unknown): Promise<SaveState> {
  const migrated = migrateSave(state);
  const parsed = SaveStateSchema.parse(migrated);
  await saveState(parsed);
  return parsed;
}

export function setupAutoSave(store: StoreApi<GameStoreState>): () => void {
  let timeout: number | undefined;
  return store.subscribe((state, previous) => {
    if (state.save === previous.save) return;
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      void saveState(state.save).catch((err) => {
        console.warn("[save] autosave failed", err);
      });
    }, 1000);
  });
}

function hydrateStarterContent(save: SaveState): SaveState {
  const clothes = mergeIds(save.inventory.clothes, starterClothingIds);
  const furniture = mergeIds(save.inventory.furniture, starterFurnitureIds);
  const food = mergeFood(save.inventory.food, starterFoodInventory);
  if (clothes === save.inventory.clothes && furniture === save.inventory.furniture && food === save.inventory.food) {
    return save;
  }
  return {
    ...save,
    inventory: { ...save.inventory, clothes, furniture, food }
  };
}

function mergeIds(current: string[], starters: string[]): string[] {
  const merged = Array.from(new Set([...current, ...starters]));
  return merged.length === current.length ? current : merged;
}

function mergeFood(
  current: SaveState["inventory"]["food"],
  starters: SaveState["inventory"]["food"]
): SaveState["inventory"]["food"] {
  let changed = false;
  const counts = new Map(current.map((entry) => [entry.itemId, entry.count]));
  for (const entry of starters) {
    if (counts.has(entry.itemId)) continue;
    counts.set(entry.itemId, entry.count);
    changed = true;
  }
  return changed ? Array.from(counts, ([itemId, count]) => ({ itemId, count })) : current;
}

/**
 * Request OS-level persistent storage so WebKit/iOS does not evict
 * IndexedDB after long inactivity. Idempotent and safe to call repeatedly.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === "undefined") return false;
  if (!navigator.storage || !navigator.storage.persist) return false;
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}
