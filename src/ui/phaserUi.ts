import Phaser from "phaser";

export type Button = Phaser.GameObjects.Container & {
  setEnabled: (enabled: boolean) => void;
};

type ButtonOptions = {
  width?: number;
  height?: number;
  fill?: number;
  stroke?: number;
  textColor?: string;
  fontSize?: number;
};

export function addButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  options: ButtonOptions = {}
): Button {
  const width = options.width ?? 180;
  const height = options.height ?? 54;
  const fill = options.fill ?? 0xffb6d5;
  const stroke = options.stroke ?? 0x6e4a2c;
  const textColor = options.textColor ?? "#6E4A2C";
  const fontSize = options.fontSize ?? 22;
  const container = scene.add.container(x, y) as Button;
  const shadow = scene.add.graphics();
  const bg = scene.add.graphics();
  drawButtonBg(shadow, width, height, 0x6e4a2c, 0.18, 12, 4);
  drawButtonBg(bg, width, height, fill, 0.95, 12, 0, stroke);
  const hit = scene.add
    .zone(0, 0, width, height)
    .setInteractive({ useHandCursor: true });
  const text = scene.add
    .text(0, 0, label, {
      fontFamily: "Arial, sans-serif",
      fontSize: `${fontSize}px`,
      color: textColor,
      align: "center",
      wordWrap: { width: width - 18 }
    })
    .setOrigin(0.5);

  hit.on("pointerdown", () => {
    if (hit.input?.enabled) onClick();
  });
  hit.on("pointerover", () => {
    bg.clear();
    drawButtonBg(bg, width, height, lighten(fill), 0.98, 12, 0, stroke);
  });
  hit.on("pointerout", () => {
    bg.clear();
    drawButtonBg(bg, width, height, fill, 0.95, 12, 0, stroke);
  });
  container.add([shadow, bg, text, hit]);
  container.setSize(width, height);
  container.setEnabled = (enabled: boolean) => {
    hit.disableInteractive();
    if (enabled) hit.setInteractive({ useHandCursor: true });
    bg.setAlpha(enabled ? 1 : 0.45);
    text.setAlpha(enabled ? 1 : 0.45);
  };
  return container;
}

export function addPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  fill = 0xfaf4e8
): Phaser.GameObjects.Rectangle {
  return scene.add
    .rectangle(x, y, width, height, fill, 0.9)
    .setStrokeStyle(3, 0xffffff, 0.65);
}

export function addTitle(scene: Phaser.Scene, x: number, y: number, text: string): Phaser.GameObjects.Text {
  return scene.add
    .text(x, y, text, {
      fontFamily: "Arial, sans-serif",
      fontSize: "38px",
      color: "#70462E",
      fontStyle: "bold",
      shadow: { offsetX: 0, offsetY: 2, color: "#FFFFFF", blur: 5, fill: true }
    })
    .setOrigin(0.5);
}

export function addSmallText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  width = 220
): Phaser.GameObjects.Text {
  return scene.add
    .text(x, y, text, {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#6E4A2C",
      align: "center",
      wordWrap: { width }
    })
    .setOrigin(0.5);
}

function lighten(color: number): number {
  const r = Math.min(255, ((color >> 16) & 255) + 16);
  const g = Math.min(255, ((color >> 8) & 255) + 16);
  const b = Math.min(255, (color & 255) + 16);
  return (r << 16) + (g << 8) + b;
}

function drawButtonBg(
  graphics: Phaser.GameObjects.Graphics,
  width: number,
  height: number,
  fill: number,
  alpha: number,
  radius: number,
  yOffset: number,
  stroke?: number
): void {
  graphics.fillStyle(fill, alpha);
  graphics.fillRoundedRect(-width / 2, -height / 2 + yOffset, width, height, radius);
  if (stroke !== undefined) {
    graphics.lineStyle(3, stroke, 0.7);
    graphics.strokeRoundedRect(-width / 2, -height / 2 + yOffset, width, height, radius);
  }
}
