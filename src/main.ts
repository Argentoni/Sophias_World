import Phaser from "phaser";
import { setupPwaUpdates } from "./ui/updateScreen";
import { APP_VERSION } from "./version";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { MainScene } from "./scenes/MainScene";
import { requestPersistentStorage, saveState, loadState, defaultSaveState } from "./systems/saveSystem";

console.log(`Sophia's World ${APP_VERSION} boot`);

setupPwaUpdates();

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
  scene: [BootScene, PreloadScene, MainScene]
});

// Ensure there is a save row in IndexedDB on first run, then request persist().
(async () => {
  let current = await loadState();
  if (!current) {
    current = defaultSaveState();
    await saveState(current);
  }
  await requestPersistentStorage();
})().catch((err) => {
  console.warn("[boot] save seed / persist failed", err);
});
