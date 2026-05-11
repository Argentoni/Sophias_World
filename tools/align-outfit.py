"""Align an outfit PNG onto the body-base canvas.

Inputs:
  - body-base PNG (e.g., public/assets/sprites/body-base.png)
  - raw outfit PNG (background already removed by rembg)
  - target output path

The script trims the outfit's bounding box, scales it to fit the body's
torso width, and centers it at the hip pivot. Anchor convention from
art-source/STYLE.md: pivot (256, 600) on a 512x768 body canvas.
"""

import argparse
from pathlib import Path
from PIL import Image

BODY_CANVAS = (512, 768)
PIVOT = (256, 600)   # x, y of hip center on the body canvas
TORSO_WIDTH_PX = 220  # approximate; tune empirically


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--body", required=True, help="path to body-base PNG")
    parser.add_argument("--outfit", required=True, help="path to outfit PNG (alpha)")
    parser.add_argument("--out", required=True, help="output PNG path")
    args = parser.parse_args()

    outfit = Image.open(args.outfit).convert("RGBA")
    bbox = outfit.getbbox()
    if bbox is None:
        raise SystemExit("Outfit has no opaque pixels")
    outfit = outfit.crop(bbox)

    # Scale outfit so its width matches torso width.
    scale = TORSO_WIDTH_PX / outfit.width
    new_size = (TORSO_WIDTH_PX, max(1, int(outfit.height * scale)))
    outfit = outfit.resize(new_size, Image.LANCZOS)

    # Compose onto a fresh canvas at the pivot offset.
    canvas = Image.new("RGBA", BODY_CANVAS, (0, 0, 0, 0))
    paste_x = PIVOT[0] - outfit.width // 2
    paste_y = PIVOT[1] - outfit.height + 40  # 40px overlap below pivot
    canvas.paste(outfit, (paste_x, paste_y), outfit)

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_path, "PNG")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
