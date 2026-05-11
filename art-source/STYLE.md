# Style sheet — Sophia's World

Reference used in every art generation. The art pipeline must include this style sheet (text or image reference) in every prompt.

## Genre and vibe

Children's "digital dollhouse" / sandbox of make-believe. The target player is an 8-year-old who loves anime-style cute media.

## Style

- **Manga kawaii / chibi fofinho** — soft lines, large eyes, simple shapes
- **Flat colors with soft shadows** — no painterly detail, no realism
- **Originality** — never replicate specific characters, brands, or franchise looks

## Proportions

- Character height ~3–4 heads tall (chibi)
- Large eyes occupying ~1/3 of face height
- Round, soft silhouettes

## Lighting

- Top-light
- Soft translucent gray shadows
- No hard rim light, no dramatic contrast

## Background

- All sprites must be on transparent background (PNG with alpha channel)

## Palette (pastel saturated)

| Slot | Name | Hex |
|---|---|---|
| Skin 1 | Light peach | `#F5D7B5` |
| Skin 2 | Warm tan | `#D8AA82` |
| Skin 3 | Medium brown | `#A6754F` |
| Skin 4 | Deep brown | `#6E4A2C` |
| Skin 5 | Cool fair | `#F0D5C0` |
| Hair black | Soft black | `#1A1A24` |
| Accent pink | Bubblegum | `#FFB6D5` |
| Accent blue | Sky | `#A0D8F0` |
| Accent yellow | Butter | `#FFE8A8` |
| Accent green | Mint | `#B5E6C5` |
| Neutral bg | Cream | `#FAF4E8` |
| Shadow gray | Gentle | `#B0B0C0` |

## Anti-IP prompt rules (INCLUDE IN EVERY GENERATION)

Append to every Nano Banana / Midjourney / image prompt:

> "in original kawaii manga style, soft pastel palette, NOT Avatar World style, NOT Toca Boca style, NOT any copyrighted character, NOT a specific anime character or franchise, original character design only, transparent background, flat colors with soft shadows"

This negative prompt reduces accidental similarity to known IPs.

## Pose convention for the body base

Body base is in neutral T-pose (arms slightly down, not full T), facing camera, head straight, slight smile. All clothing pieces will be aligned against this base.

## Asset specifications

- Output format: PNG with alpha channel
- Default canvas: 512×512 px
- Character body base canvas: 512×768 px (taller for full body)
- Pivot/anchor: hip center, located at (256, 600) on the 512×768 canvas
