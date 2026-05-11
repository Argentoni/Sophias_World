import { beforeEach, describe, expect, it } from "vitest";
import { gameStore, applyDailyBonus } from "../src/store/gameStore";
import { defaultSaveState } from "../src/systems/saveSystem";

describe("gameStore", () => {
  beforeEach(() => {
    gameStore.setState({ save: defaultSaveState(), statusMessage: "" });
  });

  it("purchases clothing with stars and adds it to inventory", () => {
    const before = gameStore.getState().save.currency;
    const ok = gameStore.getState().purchaseClothing("dress-starry-blue");
    expect(ok).toBe(true);
    expect(gameStore.getState().save.inventory.clothes).toContain("dress-starry-blue");
    expect(gameStore.getState().save.currency).toBe(before - 25);
  });

  it("does not apply pet decay between sessions", () => {
    const before = gameStore.getState().save.pet.state;
    gameStore.getState().setSave({
      ...gameStore.getState().save,
      lastPlayed: Date.now() - 1000 * 60 * 60 * 24 * 30
    });
    expect(gameStore.getState().save.pet.state).toEqual(before);
  });

  it("applies daily bonus only once per local date", () => {
    const before = gameStore.getState().save.currency;
    gameStore.setState({
      save: {
        ...gameStore.getState().save,
        flags: { ...gameStore.getState().save.flags, dailyBonusLastDate: "2000-01-01" }
      }
    });
    applyDailyBonus(gameStore);
    applyDailyBonus(gameStore);
    expect(gameStore.getState().save.currency).toBe(before + 5);
  });

  it("places and moves furniture in a room", () => {
    gameStore.getState().placeFurniture("bedroom", "chair-heart", { x: 501, y: 499 });
    const placement = gameStore.getState().save.scenes.bedroom.furniturePlacement.at(-1);
    expect(placement?.itemId).toBe("chair-heart");
    expect(placement?.x).toBe(512);
    if (!placement) throw new Error("missing placement");
    gameStore.getState().moveFurniture("bedroom", placement.placementId, { x: 604, y: 522 });
    const moved = gameStore.getState().save.scenes.bedroom.furniturePlacement.find(
      (item) => item.placementId === placement.placementId
    );
    expect(moved?.x).toBe(608);
    expect(moved?.y).toBe(512);
  });
});
