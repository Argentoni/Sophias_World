import Phaser from "phaser";
import { furnitureById, objectsById, sceneDefinitions } from "../data";
import { CharacterComposer } from "../systems/characterComposer";
import { PetComposer } from "../systems/petComposer";
import { findInteraction, runInteraction, type InteractiveTarget } from "../systems/interactionSystem";
import { gameStore } from "../store/gameStore";
import { addButton, addPanel, addSmallText, addTitle } from "../ui/phaserUi";
import { drawRoomBackground } from "./sceneBackgrounds";
import { sceneObjectKey } from "../utils/assets";

type HouseInit = { roomId?: string; decorate?: boolean };

export class HouseScene extends Phaser.Scene {
  private roomId = "bedroom";
  private decorate = false;
  private targets: InteractiveTarget[] = [];
  private selectedPlacementId: string | null = null;

  constructor() {
    super("HouseScene");
  }

  init(data: HouseInit): void {
    this.roomId = data.roomId ?? "bedroom";
    this.decorate = data.decorate ?? false;
  }

  create(): void {
    gameStore.getState().setCurrentScene(this.roomId);
    this.targets = [];
    drawRoomBackground(this, this.roomId);
    const sceneData = sceneDefinitions.find((entry) => entry.id === this.roomId);
    addTitle(this, 640, 95, sceneData?.name ?? "Casa");

    this.addRoomNav();
    this.renderFixedObjects();
    this.renderFurniture();
    this.renderFoodDrag();
    this.renderCharacters();
    this.renderDecorPanel();

    setSceneMarker("HouseScene");
    if (!this.scene.isActive("HUDScene")) this.scene.launch("HUDScene");
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => clearSceneMarker());
  }

  private addRoomNav(): void {
    addButton(this, 110, 96, "Mapa", () => this.scene.start("MapScene"), { width: 118, height: 48, fontSize: 18 });
    addButton(this, 270, 96, "Quarto", () => this.scene.start("HouseScene", { roomId: "bedroom", decorate: this.decorate }), { width: 118, height: 48, fontSize: 18 });
    addButton(this, 410, 96, "Sala", () => this.scene.start("HouseScene", { roomId: "living-room", decorate: this.decorate }), { width: 108, height: 48, fontSize: 18 });
    addButton(this, 540, 96, "Cozinha", () => this.scene.start("HouseScene", { roomId: "kitchen", decorate: this.decorate }), { width: 130, height: 48, fontSize: 18 });
    addButton(this, 1120, 96, this.decorate ? "Brincar" : "Decorar", () => {
      this.scene.start("HouseScene", { roomId: this.roomId, decorate: !this.decorate });
    }, { width: 150, height: 48, fontSize: 18, fill: this.decorate ? 0xb5e6c5 : 0xffe8a8 });
  }

  private renderFixedObjects(): void {
    const sceneData = sceneDefinitions.find((entry) => entry.id === this.roomId);
    if (!sceneData) return;
    for (const object of sceneData.objects) {
      const sprite = this.add.image(object.x, object.y, sceneObjectKey(object.id)).setScale(object.scale);
      sprite.setDepth(object.depth ?? object.y);
      sprite.setInteractive({ useHandCursor: true });
      sprite.on("pointerdown", () => this.runTap(object.objectId, sprite));
      this.targets.push({
        objectId: object.objectId,
        bounds: sprite.getBounds(),
        x: object.x,
        y: object.y
      });
    }
  }

  private renderFurniture(): void {
    const placements = gameStore.getState().save.scenes[this.roomId]?.furniturePlacement ?? [];
    for (const placement of placements) {
      const item = furnitureById.get(placement.itemId);
      if (!item) continue;
      const sprite = this.add.image(placement.x, placement.y, item.id);
      sprite.setDisplaySize(item.width * placement.scale, item.height * placement.scale);
      sprite.setAngle(placement.rotation);
      sprite.setDepth(placement.y);
      sprite.setInteractive({ useHandCursor: true });
      if (this.decorate && !placement.locked) {
        this.input.setDraggable(sprite);
        sprite.on("pointerdown", () => {
          this.selectedPlacementId = placement.placementId;
          gameStore.getState().setStatusMessage(item.name);
        });
        this.input.on(
          "drag",
          (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
            if (obj !== sprite) return;
            sprite.setPosition(dragX, dragY);
            sprite.setDepth(dragY);
          }
        );
        this.input.on("dragend", (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject) => {
          if (obj !== sprite) return;
          gameStore.getState().moveFurniture(this.roomId, placement.placementId, { x: sprite.x, y: sprite.y });
        });
      }
      if (objectsById.has(item.id)) {
        this.targets.push({
          objectId: item.id,
          bounds: sprite.getBounds(),
          x: placement.x,
          y: placement.y
        });
      }
    }
  }

  private renderFoodDrag(): void {
    const food = gameStore.getState().save.inventory.food[0];
    if (!food || food.count <= 0) return;
    const item = this.add.image(1160, 640, food.itemId).setScale(0.82).setDepth(2500);
    item.setInteractive({ useHandCursor: true });
    this.input.setDraggable(item);
    addSmallText(this, 1160, 695, `${food.count}x`, 70).setDepth(2500);
    this.input.on(
      "drag",
      (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
        if (obj !== item) return;
        item.setPosition(dragX, dragY);
      }
    );
    this.input.on("dragend", (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject) => {
      if (obj !== item) return;
      const found = findInteraction(this.targets, item.x, item.y, "drop-item:food");
      if (found && gameStore.getState().consumeFood(food.itemId)) {
        void runInteraction(this, found.target, found.interaction);
        this.time.delayedCall(450, () => this.scene.restart({ roomId: this.roomId, decorate: this.decorate }));
        return;
      }
      item.setPosition(1160, 640);
    });
  }

  private renderCharacters(): void {
    const save = gameStore.getState().save;
    const characterPosition = save.characterPositionByScene.house ?? { x: 640, y: 470 };
    const character = new CharacterComposer(this, characterPosition.x, characterPosition.y);
    character.render(save.character);
    character.enableDrag(
      (x, y) => gameStore.getState().setCharacterPosition("house", { x, y }),
      (x, y) => {
        const found = findInteraction(this.targets, x, y, "drop-character");
        if (found) void runInteraction(this, found.target, found.interaction);
      }
    );

    const petPosition = save.petPositionByScene.house ?? { x: 760, y: 500 };
    const pet = new PetComposer(this, petPosition.x, petPosition.y);
    pet.render(save.pet);
    pet.enableDrag(
      (x, y) => gameStore.getState().setPetPosition("house", { x, y }),
      (x, y) => {
        const found = findInteraction(this.targets, x, y, "drop-pet");
        if (found) void runInteraction(this, found.target, found.interaction);
      }
    );

    (window as unknown as { __character?: Phaser.GameObjects.Container }).__character = character.container;
  }

  private renderDecorPanel(): void {
    if (!this.decorate) return;
    addPanel(this, 640, 650, 980, 118, 0xfaf4e8).setDepth(2200);
    const owned = gameStore.getState().save.inventory.furniture
      .map((id) => furnitureById.get(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .slice(0, 8);
    owned.forEach((item, index) => {
      const x = 240 + index * 96;
      const image = this.add.image(x, 636, item.id).setDisplaySize(62, 48).setDepth(2201);
      image.setInteractive({ useHandCursor: true });
      image.on("pointerdown", () => {
        gameStore.getState().placeFurniture(this.roomId, item.id, { x: 560 + index * 32, y: 520 });
        this.scene.restart({ roomId: this.roomId, decorate: true });
      });
    });
    addButton(this, 1035, 650, "Girar", () => {
      if (!this.selectedPlacementId) return;
      gameStore.getState().rotateFurniture(this.roomId, this.selectedPlacementId);
      this.scene.restart({ roomId: this.roomId, decorate: true });
    }, { width: 112, height: 46, fontSize: 17, fill: 0xa0d8f0 }).setDepth(2201);
    addButton(this, 1160, 650, "Remover", () => {
      if (!this.selectedPlacementId) return;
      gameStore.getState().removeFurniture(this.roomId, this.selectedPlacementId);
      this.scene.restart({ roomId: this.roomId, decorate: true });
    }, { width: 128, height: 46, fontSize: 17, fill: 0xffb6d5 }).setDepth(2201);
  }

  private runTap(objectId: string, sprite: Phaser.GameObjects.Image): void {
    const object = objectsById.get(objectId);
    const interaction = object?.interactions.find((entry) => entry.trigger === "tap");
    if (!interaction) return;
    void runInteraction(this, { objectId, bounds: sprite.getBounds(), x: sprite.x, y: sprite.y }, interaction);
  }
}

function setSceneMarker(scene: string): void {
  (window as unknown as { __scene?: string }).__scene = scene;
}

function clearSceneMarker(): void {
  const target = window as unknown as { __scene?: string; __character?: Phaser.GameObjects.Container };
  delete target.__scene;
  delete target.__character;
}
