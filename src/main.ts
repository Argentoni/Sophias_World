import Phaser from "phaser";
import { setupPwaUpdates } from "./ui/updateScreen";
import { APP_VERSION } from "./version";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { MapScene } from "./scenes/MapScene";
import { HouseScene } from "./scenes/HouseScene";
import { ParkScene } from "./scenes/ParkScene";
import { ShoppingScene } from "./scenes/ShoppingScene";
import { HUDScene } from "./scenes/HUDScene";
import { WardrobeScene } from "./scenes/WardrobeScene";
import { InventoryScene } from "./scenes/InventoryScene";
import { ShopScene } from "./scenes/ShopScene";
import {
  defaultSaveState,
  loadState,
  requestPersistentStorage,
  saveState,
  setupAutoSave
} from "./systems/saveSystem";
import { applyDailyBonus, gameStore } from "./store/gameStore";

console.log(`Sophia's World ${APP_VERSION} boot`);

setupPwaUpdates();

void boot().catch((err) => {
  console.warn("[boot] failed", err);
});

async function boot(): Promise<void> {
  let current = await loadState();
  if (!current) {
    current = defaultSaveState();
    await saveState(current);
  }
  gameStore.getState().setSave(current);
  applyDailyBonus();
  setupAutoSave(gameStore);
  await requestPersistentStorage();

  new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game",
    backgroundColor: "#FAF4E8",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 720
    },
    scene: [
      BootScene,
      PreloadScene,
      MapScene,
      HouseScene,
      ParkScene,
      ShoppingScene,
      HUDScene,
      WardrobeScene,
      InventoryScene,
      ShopScene
    ]
  });
}
