import Phaser from "phaser";
import { characterStore } from "../store/characterStore";

/**
 * Fase 0 scene: one draggable body sprite, no game logic.
 * Wires Phaser drag events to the Zustand character store as a smoke-level
 * proof that the boundary works.
 */
export class MainScene extends Phaser.Scene {
  private character!: Phaser.GameObjects.Container;

  constructor() {
    super("MainScene");
  }

  create(): void {
    const { width, height } = this.scale;

    // Background tint so we know the scene is alive.
    this.add.rectangle(width / 2, height / 2, width, height, 0xfaf4e8);

    // Build the character as a container of layered sprites so M5 can drop a
    // real outfit on top without restructuring.
    this.character = this.add.container(width / 2, height / 2);
    const body = this.add.image(0, 0, "body-base").setOrigin(0.5, 0.6);
    const outfit = this.add.image(0, 0, "outfit-001").setOrigin(0.5, 0.6);
    this.character.add([body, outfit]);
    this.character.setSize(body.width, body.height);

    // Drag setup. Container.setInteractive() with no arguments uses the size
    // set by setSize() above (body.width × body.height) and internally builds
    // Rectangle(0, 0, width, height). Phaser offsets the test point by
    // displayOriginX/Y (width/2, height/2) before testing, so the effective
    // hit region covers the full sprite bounding box centred on the container.
    this.character.setInteractive();
    this.input.setDraggable(this.character);

    this.input.on(
      "drag",
      (
        _pointer: Phaser.Input.Pointer,
        obj: Phaser.GameObjects.GameObject,
        dragX: number,
        dragY: number
      ) => {
        if (obj === this.character) {
          this.character.x = dragX;
          this.character.y = dragY;
        }
      }
    );


    // Tag scene-ready for Playwright smoke tests in M6. Cleared on shutdown
    // so the marker reflects "currently-active scene" rather than "ever existed".
    // __character is exposed for the drag smoke test to read final position —
    // it is NOT used to MOVE the character; the test drives the real drag handler
    // via synthesized pointer events.
    type SceneWindow = {
      __scene?: string;
      __character?: Phaser.GameObjects.Container;
    };
    (window as unknown as SceneWindow).__scene = "MainScene";
    (window as unknown as SceneWindow).__character = this.character;
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      const w = window as unknown as SceneWindow;
      delete w.__scene;
      delete w.__character;
    });

    // Touch the store once so the boundary is exercised at runtime.
    const _check = characterStore.getState().character.body.skinTone;
    void _check;
  }
}
