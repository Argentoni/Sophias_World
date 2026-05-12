import Phaser from "phaser";

const sceneObjectSizes: Record<string, { width: number; height: number }> = {
  "juice-cup": { width: 58, height: 78 },
  "book-blue": { width: 88, height: 70 },
  "mirror-flower": { width: 118, height: 180 },
  "pet-bowl": { width: 82, height: 58 },
  "water-bowl": { width: 82, height: 58 },
  "pet-toy": { width: 72, height: 72 },
  swing: { width: 190, height: 170 },
  slide: { width: 190, height: 170 },
  "toy-horse": { width: 160, height: 132 },
  "chair-heart": { width: 112, height: 132 }
};

export function applySceneObjectDisplay(
  sprite: Phaser.GameObjects.Image,
  objectId: string,
  scale = 1
): Phaser.GameObjects.Image {
  const size = sceneObjectSizes[objectId] ?? { width: 92, height: 92 };
  return sprite.setDisplaySize(size.width * scale, size.height * scale);
}
