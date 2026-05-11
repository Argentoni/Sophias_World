import { get, set } from "idb-keyval";
import { SaveStateSchema, type SaveState } from "../schemas/saveState";
import { APP_VERSION } from "../version";

const SAVE_KEY = "sophias-world:save";

export function defaultSaveState(): SaveState {
  return {
    version: 1,
    appVersion: APP_VERSION,
    character: {
      body: { skinTone: "1", bodyType: "kid" },
      hair: { styleId: "default", color: "#1A1A24" },
      face: { eyes: "eyes-default", mouth: "mouth-default" },
      outfit: { accessories: [] }
    },
    currency: 0,
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
  const result = SaveStateSchema.safeParse(raw);
  if (!result.success) {
     
    console.warn("[save] corruption detected, keeping raw for recovery");
    return null;
  }
  return result.data;
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
