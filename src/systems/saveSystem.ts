import { get, set } from "idb-keyval";
import type { StoreApi } from "zustand/vanilla";
import { SaveStateSchema, type SaveState } from "../schemas/saveState";
import { APP_VERSION } from "../version";
import { localDateKey, migrateSave } from "./saveMigrations";
import type { GameStoreState } from "../store/gameStore";

const SAVE_KEY = "sophias-world:save";

export function defaultSaveState(): SaveState {
  return {
    version: 2,
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
      park: { x: 660, y: 500 }
    },
    inventory: {
      clothes: ["outfit-001", "top-sky-heart", "bottom-denim", "shoes-pink"],
      furniture: ["bed-pink", "desk-mint", "rug-star", "pet-bed"],
      food: [{ itemId: "dog-biscuit", count: 3 }]
    },
    scenes: {
      bedroom: {
        furniturePlacement: [
          {
            placementId: "starter-bed",
            itemId: "bed-pink",
            x: 250,
            y: 455,
            rotation: 0,
            scale: 1,
            locked: false
          },
          {
            placementId: "starter-rug",
            itemId: "rug-star",
            x: 620,
            y: 565,
            rotation: 0,
            scale: 1,
            locked: false
          },
          {
            placementId: "starter-pet-bed",
            itemId: "pet-bed",
            x: 960,
            y: 545,
            rotation: 0,
            scale: 1,
            locked: false
          }
        ]
      }
    },
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
  if (migrated !== raw) {
    await saveState(result.data);
  }
  return result.data;
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
