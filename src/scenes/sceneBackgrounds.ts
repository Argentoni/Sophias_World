import Phaser from "phaser";

export function drawMapBackground(scene: Phaser.Scene): void {
  addBackground(scene, "bg-map");
  scene.add.rectangle(640, 360, 1280, 720, 0xffffff, 0.08);
}

export function drawRoomBackground(scene: Phaser.Scene, roomId: string): void {
  addBackground(scene, `bg-${roomId}`);
  scene.add.rectangle(640, 360, 1280, 720, 0xffffff, 0.04);
}

export function drawParkBackground(scene: Phaser.Scene): void {
  addBackground(scene, "bg-park");
  scene.add.rectangle(640, 360, 1280, 720, 0xffffff, 0.04);
}

export function drawShopBackground(scene: Phaser.Scene): void {
  addBackground(scene, "bg-shopping");
  scene.add.rectangle(640, 360, 1280, 720, 0xffffff, 0.05);
}

function addBackground(scene: Phaser.Scene, key: string): void {
  scene.add.image(640, 360, key).setDisplaySize(1280, 720).setDepth(-1000);
}
