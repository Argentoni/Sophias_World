import type { FurniturePlacement } from "../schemas/saveState";

export const starterClothingIds = [
  "outfit-001",
  "top-sky-heart",
  "bottom-denim",
  "bottom-tutu-pink",
  "bottom-heart-shorts",
  "shoes-pink",
  "shoes-blue-sneakers",
  "acc-flower-clip"
];

export const starterFurnitureIds = [
  "bed-pink",
  "desk-mint",
  "rug-star",
  "pet-bed",
  "chair-heart",
  "sofa-cloud",
  "table-juice",
  "kitchen-stove",
  "fridge-star",
  "toy-horse",
  "floor-cushion-star",
  "tea-table",
  "plush-bunny",
  "blocks-rainbow"
];

export const starterFoodInventory = [
  { itemId: "dog-biscuit", count: 3 },
  { itemId: "water-bowl", count: 1 },
  { itemId: "apple-snack", count: 1 }
];

export function starterFurniturePlacements(): Record<string, { furniturePlacement: FurniturePlacement[] }> {
  return {
    bedroom: {
      furniturePlacement: [
        place("starter-bed", "bed-pink", 260, 505),
        place("starter-rug", "rug-star", 610, 612),
        place("starter-desk", "desk-mint", 915, 505),
        place("starter-pet-bed", "pet-bed", 1050, 596)
      ]
    },
    "living-room": {
      furniturePlacement: [
        place("starter-sofa", "sofa-cloud", 345, 510),
        place("starter-table", "table-juice", 645, 550),
        place("starter-chair", "chair-heart", 900, 510)
      ]
    },
    kitchen: {
      furniturePlacement: [
        place("starter-stove", "kitchen-stove", 350, 505),
        place("starter-table-kitchen", "table-juice", 640, 550),
        place("starter-fridge", "fridge-star", 930, 500)
      ]
    }
  };
}

function place(placementId: string, itemId: string, x: number, y: number): FurniturePlacement {
  return { placementId, itemId, x, y, rotation: 0, scale: 1, locked: false };
}
