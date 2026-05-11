import { describe, it, expect } from "vitest";

describe("dependency imports", () => {
  it("zustand package exists", async () => {
    const phaserPkg = await import("zustand/package.json");
    expect(phaserPkg.default.name).toBe("zustand");
  });

  it("idb-keyval", async () => {
    const idb = await import("idb-keyval");
    expect(typeof idb.set).toBe("function");
    expect(typeof idb.get).toBe("function");
  });

  it("zod", async () => {
    const { z } = await import("zod");
    expect(typeof z.object).toBe("function");
  });

  it("phaser is version 3.x", async () => {
    const phaserPkg = await import("phaser/package.json");
    expect(phaserPkg.default.version.startsWith("3.")).toBe(true);
  });
});
