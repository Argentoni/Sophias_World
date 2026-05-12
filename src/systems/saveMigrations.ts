import type { Character, SaveState } from "../schemas/saveState";
import { APP_VERSION } from "../version";

type LegacySaveV1 = {
  version: 1;
  appVersion?: string;
  character?: Character;
  currency?: number;
  lastPlayed?: number;
};

type SaveStateV2 = Omit<SaveState, "version"> & { version: 2 };

export const CURRENT_SAVE_VERSION = 3;

export function migrateSave(raw: unknown): unknown {
  if (!isRecord(raw)) return raw;
  if (raw.version === CURRENT_SAVE_VERSION) return raw;
  if (raw.version === 1) return migrateV2ToV3(migrateV1ToV2(raw as LegacySaveV1));
  if (raw.version === 2) return migrateV2ToV3(raw as SaveStateV2);
  return raw;
}

function migrateV1ToV2(old: LegacySaveV1): SaveStateV2 {
  const now = Date.now();
  return {
    version: 2,
    appVersion: APP_VERSION,
    character: old.character ?? defaultCharacter(),
    pet: {
      breed: "dog",
      color: "cream",
      accessories: [],
      state: { hunger: 60, energy: 70, happiness: 70 }
    },
    currency: Math.max(100, old.currency ?? 0),
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
    flags: { welcomeBonusGiven: true, dailyBonusLastDate: localDateKey(now) },
    lastPlayed: old.lastPlayed ?? now
  };
}

function migrateV2ToV3(old: SaveStateV2): SaveState {
  return {
    ...old,
    version: 3,
    scenes: {
      ...old.scenes,
      bedroom: {
        furniturePlacement: (old.scenes.bedroom?.furniturePlacement ?? []).filter(
          (placement) => !placement.placementId.startsWith("starter-")
        )
      },
      "living-room": old.scenes["living-room"] ?? { furniturePlacement: [] },
      kitchen: old.scenes.kitchen ?? { furniturePlacement: [] }
    }
  };
}

function defaultCharacter(): Character {
  return {
    body: { skinTone: "1", bodyType: "kid" },
    hair: { styleId: "bob", color: "#1A1A24" },
    face: { eyes: "sparkle", mouth: "smile" },
    outfit: {
      top: "outfit-001",
      bottom: "bottom-denim",
      shoes: "shoes-pink",
      accessories: []
    }
  };
}

export function localDateKey(time = Date.now()): string {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
