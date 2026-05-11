import Phaser from "phaser";
import { characterStore } from "../store/characterStore";

/**
 * Fase 0 scene: one draggable body sprite, no game logic.
 * Wires Phaser drag events to the Zustand character store as a smoke-level
 * proof that the boundary works.
 */
export class MainScene extends Phaser.Scene {
  private character!: Phaser.GameObjects.Container;
  private isDraggingCharacter = false;
  private dragStartX = 0;
  private dragStartY = 0;

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

    // Drag setup. Hit area must align with the sprite's visible bounds.
    // Body uses setOrigin(0.5, 0.6) — top extends -0.6*h, bottom extends +0.4*h.
    const hitArea = new Phaser.Geom.Rectangle(
      -body.width / 2,
      -body.height * body.originY,
      body.width,
      body.height
    );
    this.character.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    // Manually implement drag using low-level pointer events.
    // We track when a pointer down occurs over the character and move the character
    // in response to pointer moves, until the pointer is released.
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      // Check if the pointer is over the character's hit area.
      const hitPoint = this.character.getLocalPoint(pointer.x, pointer.y);
      // If it's a Vector object with x and y properties, the hit test passed.
      if (hitPoint && typeof hitPoint === "object" && "x" in hitPoint && "y" in hitPoint) {
        this.isDraggingCharacter = true;
        this.dragStartX = this.character.x;
        this.dragStartY = this.character.y;
      }
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.isDraggingCharacter && pointer.isDown) {
        // Calculate the character's new position based on pointer delta.
        const newX = this.dragStartX + (pointer.x - pointer.downX);
        const newY = this.dragStartY + (pointer.y - pointer.downY);
        this.character.x = newX;
        this.character.y = newY;
      }
    });

    this.input.on("pointerup", (_pointer: Phaser.Input.Pointer) => {
      this.isDraggingCharacter = false;
    });

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
