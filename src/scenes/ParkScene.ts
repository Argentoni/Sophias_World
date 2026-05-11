import Phaser from "phaser";
import { sceneDefinitions } from "../data";
import { CharacterComposer } from "../systems/characterComposer";
import { PetComposer } from "../systems/petComposer";
import { findInteraction, runInteraction, type InteractiveTarget } from "../systems/interactionSystem";
import { gameStore } from "../store/gameStore";
import { addButton, addTitle } from "../ui/phaserUi";
import { drawParkBackground } from "./sceneBackgrounds";
import { sceneObjectKey } from "../utils/assets";

export class ParkScene extends Phaser.Scene {
  private targets: InteractiveTarget[] = [];

  constructor() {
    super("ParkScene");
  }

  create(): void {
    gameStore.getState().setCurrentScene("park");
    this.targets = [];
    drawParkBackground(this);
    addTitle(this, 640, 90, "Parque");
    addButton(this, 110, 96, "Mapa", () => this.scene.start("MapScene"), { width: 118, height: 48, fontSize: 18 });

    const sceneData = sceneDefinitions.find((entry) => entry.id === "park");
    for (const object of sceneData?.objects ?? []) {
      const sprite = this.add.image(object.x, object.y, sceneObjectKey(object.id)).setScale(object.scale);
      sprite.setDepth(object.depth ?? object.y);
      this.targets.push({ objectId: object.objectId, bounds: sprite.getBounds(), x: object.x, y: object.y });
    }

    const save = gameStore.getState().save;
    const characterPosition = save.characterPositionByScene.park ?? { x: 520, y: 470 };
    const character = new CharacterComposer(this, characterPosition.x, characterPosition.y);
    character.render(save.character);
    character.enableDrag(
      (x, y) => gameStore.getState().setCharacterPosition("park", { x, y }),
      (x, y) => {
        const found = findInteraction(this.targets, x, y, "drop-character");
        if (found) void runInteraction(this, found.target, found.interaction);
      }
    );

    const petPosition = save.petPositionByScene.park ?? { x: 660, y: 500 };
    const pet = new PetComposer(this, petPosition.x, petPosition.y);
    pet.render(save.pet);
    pet.enableDrag(
      (x, y) => gameStore.getState().setPetPosition("park", { x, y }),
      (x, y) => {
        const found = findInteraction(this.targets, x, y, "drop-pet");
        if (found) void runInteraction(this, found.target, found.interaction);
      }
    );

    if (!this.scene.isActive("HUDScene")) this.scene.launch("HUDScene");
    (window as unknown as { __scene?: string; __character?: Phaser.GameObjects.Container }).__scene = "ParkScene";
    (window as unknown as { __character?: Phaser.GameObjects.Container }).__character = character.container;
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      const target = window as unknown as { __scene?: string; __character?: Phaser.GameObjects.Container };
      delete target.__scene;
      delete target.__character;
    });
  }
}
