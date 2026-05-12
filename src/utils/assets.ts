import Phaser from "phaser";

export function assetUrl(path: string): string {
  return publicAssetUrl(`assets/sprites/${path}`);
}

export function backgroundUrl(path: string): string {
  return publicAssetUrl(`assets/backgrounds/${path}`);
}

export function publicAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${path}`;
}

export function loadSpriteAsset(scene: Phaser.Scene, key: string, path: string): void {
  const url = assetUrl(path);
  if (path.endsWith(".svg")) {
    scene.load.svg(key, url);
    return;
  }
  scene.load.image(key, url);
}

export function sceneObjectKey(id: string): string {
  return `scene-object:${id}`;
}
