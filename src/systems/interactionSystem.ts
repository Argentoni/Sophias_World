import Phaser from "phaser";
import { gameStore } from "../store/gameStore";
import { audioSystem } from "./audioSystem";
import type { Interaction } from "../schemas/content";
import { objectsById } from "../data";

export type InteractiveTarget = {
  objectId: string;
  bounds: Phaser.Geom.Rectangle;
  x: number;
  y: number;
};

export function findInteraction(
  targets: InteractiveTarget[],
  x: number,
  y: number,
  trigger: Interaction["trigger"]
): { target: InteractiveTarget; interaction: Interaction } | null {
  for (const target of targets) {
    if (!Phaser.Geom.Rectangle.Contains(target.bounds, x, y)) continue;
    const object = objectsById.get(target.objectId);
    const interaction = object?.interactions.find((entry) => entry.trigger === trigger);
    if (interaction) return { target, interaction };
  }
  return null;
}

export async function runInteraction(
  scene: Phaser.Scene,
  target: InteractiveTarget,
  interaction: Interaction
): Promise<void> {
  const id = `${target.objectId}:${interaction.trigger}`;
  for (const action of interaction.actions) {
    if (action.type === "play-sound") {
      audioSystem.play(action.sound, gameStore.getState().save.settings.sfxVolume);
    }
    if (action.type === "set-expression") {
      const save = gameStore.getState().save;
      gameStore.getState().setFace(save.character.face.eyes, expressionToMouth(action.expression));
    }
    if (action.type === "give-currency") {
      if (!action.firstTimeOnly || !gameStore.getState().save.discoveredInteractions.includes(id)) {
        gameStore.getState().discoverInteraction(id, action.amount);
      }
    }
    if (action.type === "spawn-particle") {
      spawnParticle(scene, target.x, target.y - 80, action.particle);
    }
    if (action.type === "wait") {
      await new Promise((resolve) => window.setTimeout(resolve, action.ms));
    }
    if (action.type === "pet-care") {
      gameStore.getState().petCare(
        { hunger: action.hunger, energy: action.energy, happiness: action.happiness },
        action.message
      );
    }
  }
}

function expressionToMouth(expression: string): string {
  if (expression === "yum") return "yum";
  if (expression === "sleepy") return "sleepy";
  if (expression === "curious") return "curious";
  if (expression === "surprise") return "open";
  return "smile";
}

function spawnParticle(scene: Phaser.Scene, x: number, y: number, particle: string): void {
  const text = particle === "hearts" ? "♥" : "★";
  const color = particle === "hearts" ? "#FF7AA7" : "#FFE176";
  const item = scene.add.text(x, y, text, {
    fontFamily: "Arial, sans-serif",
    fontSize: "38px",
    color
  }).setOrigin(0.5).setDepth(2000);
  scene.tweens.add({
    targets: item,
    y: y - 60,
    alpha: 0,
    duration: 850,
    ease: "Sine.easeOut",
    onComplete: () => item.destroy()
  });
}
