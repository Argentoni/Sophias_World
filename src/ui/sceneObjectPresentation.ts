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
  "chair-heart": { width: 112, height: 132 },
  "strawberry-milk": { width: 58, height: 76 },
  "orange-juice-box": { width: 58, height: 76 },
  "cupcake-heart": { width: 68, height: 62 },
  "sandwich-star": { width: 92, height: 62 },
  "plush-bunny": { width: 96, height: 118 },
  "blocks-rainbow": { width: 124, height: 92 },
  "tea-set": { width: 106, height: 72 },
  "bubble-wand": { width: 70, height: 100 },
  "star-ball": { width: 76, height: 76 },
  "art-easel": { width: 128, height: 162 },
  "dollhouse-pastel": { width: 156, height: 156 },
  "toy-kitchen": { width: 150, height: 170 },
  "play-tent": { width: 162, height: 174 }
};

export function applySceneObjectDisplay(
  sprite: Phaser.GameObjects.Image,
  objectId: string,
  scale = 1
): Phaser.GameObjects.Image {
  const size = sceneObjectSizes[objectId] ?? { width: 92, height: 92 };
  return sprite.setDisplaySize(size.width * scale, size.height * scale);
}
