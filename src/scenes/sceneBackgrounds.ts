import Phaser from "phaser";

export function drawMapBackground(scene: Phaser.Scene): void {
  scene.add.rectangle(640, 360, 1280, 720, 0xfaf4e8);
  scene.add.circle(640, 380, 250, 0xb5e6c5, 0.5);
  scene.add.circle(320, 280, 170, 0xa0d8f0, 0.45);
  scene.add.circle(980, 300, 170, 0xffb6d5, 0.42);
  scene.add.rectangle(640, 612, 1280, 110, 0xb5e6c5);
}

export function drawRoomBackground(scene: Phaser.Scene, roomId: string): void {
  const wall = roomId === "kitchen" ? 0xfff1c7 : roomId === "living-room" ? 0xdff5ff : 0xffe8f1;
  const floor = roomId === "kitchen" ? 0xf2d69b : roomId === "living-room" ? 0xcdeac0 : 0xf5d7b5;
  scene.add.rectangle(640, 360, 1280, 720, wall);
  scene.add.rectangle(640, 565, 1280, 310, floor);
  scene.add.rectangle(640, 410, 1280, 14, 0x6e4a2c, 0.22);
  for (let x = 80; x < 1280; x += 160) {
    scene.add.line(x, 580, 0, 0, 100, 42, 0x6e4a2c, 0.08).setLineWidth(3);
  }
  scene.add.circle(118, 102, 52, 0xffffff, 0.42);
  scene.add.circle(1170, 120, 44, 0xffffff, 0.35);
}

export function drawParkBackground(scene: Phaser.Scene): void {
  scene.add.rectangle(640, 360, 1280, 720, 0xcff3ff);
  scene.add.circle(1080, 105, 62, 0xffe8a8);
  scene.add.rectangle(640, 542, 1280, 356, 0xb5e6c5);
  scene.add.rectangle(640, 620, 1280, 198, 0x9bd89e);
  for (let x = 80; x < 1280; x += 210) {
    scene.add.circle(x, 300, 54, 0x89c879);
    scene.add.rectangle(x, 390, 28, 130, 0xa6754f);
  }
}

export function drawShopBackground(scene: Phaser.Scene): void {
  scene.add.rectangle(640, 360, 1280, 720, 0xffe8f1);
  scene.add.rectangle(640, 598, 1280, 244, 0xf5d7b5);
  scene.add.rectangle(640, 188, 780, 120, 0xfaf4e8).setStrokeStyle(6, 0x6e4a2c);
  scene.add.text(640, 188, "Shopping das Estrelinhas", {
    fontFamily: "Arial, sans-serif",
    fontSize: "44px",
    color: "#6E4A2C",
    fontStyle: "bold"
  }).setOrigin(0.5);
}
