import { describe, it, expect, beforeEach, vi } from "vitest";
import { saveState, loadState, defaultSaveState } from "../src/systems/saveSystem";
import * as idb from "idb-keyval";

vi.mock("idb-keyval", async () => {
  let store: Record<string, unknown> = {};
  return {
    get: vi.fn(async (k: string) => store[k]),
    set: vi.fn(async (k: string, v: unknown) => { store[k] = v; }),
    del: vi.fn(async (k: string) => { delete store[k]; }),
    __reset: () => { store = {}; }
  };
});

describe("saveSystem", () => {
  beforeEach(() => {
    (idb as unknown as { __reset: () => void }).__reset();
  });

  it("round-trips a save", async () => {
    const initial = defaultSaveState();
    expect(initial.version).toBe(4);
    expect(initial.objectPositionByScene).toEqual({});
    expect(initial.petPositionByScene.park).toEqual({ x: 760, y: 520 });
    expect(initial.scenes.bedroom.furniturePlacement.length).toBeGreaterThan(0);
    await saveState(initial);
    const loaded = await loadState();
    expect(loaded).toEqual(initial);
  });

  it("returns null when no save exists", async () => {
    const loaded = await loadState();
    expect(loaded).toBeNull();
  });

  it("rejects writing an invalid save (caught at boundary)", async () => {
    const broken = { foo: "bar" } as unknown as Parameters<typeof saveState>[0];
    await expect(saveState(broken)).rejects.toThrow();
  });

  it("returns null on corrupted load (does not throw, does not delete)", async () => {
    await idb.set("sophias-world:save", { corrupted: true });
    const loaded = await loadState();
    expect(loaded).toBeNull();
    const raw = await idb.get("sophias-world:save");
    expect(raw).toEqual({ corrupted: true });
  });
});
