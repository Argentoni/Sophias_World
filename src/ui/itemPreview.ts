import Phaser from "phaser";

type ClothingPreviewSize = "wardrobe" | "shop" | "inventory";

export function fitClothingPreview(
  image: Phaser.GameObjects.Image,
  category: string,
  size: ClothingPreviewSize = "shop"
): Phaser.GameObjects.Image {
  const sizes = {
    wardrobe: { top: [86, 84], bottom: [82, 82], dress: [76, 96], shoes: [88, 42], accessory: [76, 76] },
    shop: { top: [78, 76], bottom: [74, 74], dress: [64, 84], shoes: [78, 38], accessory: [68, 68] },
    inventory: { top: [58, 58], bottom: [56, 56], dress: [50, 64], shoes: [58, 30], accessory: [52, 52] }
  }[size];

  if (category === "top") return setSize(image.setCrop(128, 220, 256, 250), sizes.top);
  if (category === "bottom") return setSize(image.setCrop(146, 382, 220, 210), sizes.bottom);
  if (category === "dress") return setSize(image.setCrop(126, 220, 260, 420), sizes.dress);
  if (category === "shoes") return setSize(image.setCrop(126, 585, 260, 120), sizes.shoes);
  return setSize(image, sizes.accessory);
}

export function fitFurniturePreview(
  image: Phaser.GameObjects.Image,
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): Phaser.GameObjects.Image {
  const scale = Math.min(maxWidth / width, maxHeight / height);
  return image.setDisplaySize(width * scale, height * scale);
}

export function fitPetAccessoryPreview(image: Phaser.GameObjects.Image, id: string): Phaser.GameObjects.Image {
  if (id === "pet-collar-pink") return image.setCrop(45, 80, 130, 40).setDisplaySize(88, 28);
  if (id === "pet-bow-blue") return image.setCrop(36, 10, 126, 70).setDisplaySize(88, 50);
  if (id === "pet-cape-star") return image.setCrop(42, 86, 142, 78).setDisplaySize(92, 52);
  if (id === "pet-glasses-round") return image.setCrop(55, 42, 104, 48).setDisplaySize(88, 40);
  if (id === "pet-bandana-mint") return image.setCrop(46, 84, 130, 58).setDisplaySize(88, 42);
  return image.setDisplaySize(76, 56);
}

function setSize(image: Phaser.GameObjects.Image, size: number[]): Phaser.GameObjects.Image {
  return image.setDisplaySize(size[0], size[1]);
}
