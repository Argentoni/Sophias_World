# Art tools

## Setup (one time)

```bash
python3 -m venv ~/.virtualenvs/sophias-art
source ~/.virtualenvs/sophias-art/bin/activate
pip install 'rembg[cli]' Pillow
```

## Per-outfit pipeline

1. Generate via Gemini Nano Banana (web UI) with the style sheet prompt + anti-IP rules from `art-source/STYLE.md`.
2. Download the raw PNG to `art-source/raw/<item-id>.png`.
3. Remove background:

   ```bash
   source ~/.virtualenvs/sophias-art/bin/activate
   rembg i art-source/raw/<item-id>.png art-source/cut/<item-id>.png
   ```

4. Align to body base:

   ```bash
   python tools/align-outfit.py \
     --body public/assets/sprites/body-base.png \
     --outfit art-source/cut/<item-id>.png \
     --out public/assets/sprites/<item-id>.png
   ```

5. Add entry to `src/data/clothes.json` (Fase 1) or wire into MainScene directly (Fase 0).
