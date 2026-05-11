# Fase 0 — Device verification

This checklist exists to confirm the Fase 0 exit criteria on real hardware. Sofia is the ultimate user and must be able to install, open, and play the prototype on her iPad and on an Android phone.

## Preconditions

- [ ] Branch `fase-0` is checked out and the working tree is clean
- [ ] `npm run build && npm run preview` works locally and the LAN URL prints in the terminal
- [ ] Both devices are on the same Wi-Fi as the dev machine

## iPad

1. [ ] Run `npm run dev` on the dev machine. Copy the LAN URL (e.g., `http://192.168.x.x:5173`).
2. [ ] Open the URL in Safari on the iPad.
3. [ ] Tap share → "Add to Home Screen". Name: "Sophia".
4. [ ] Close Safari. Tap the new home-screen icon.
5. [ ] App opens fullscreen in landscape. If portrait, rotate the iPad and confirm landscape lock.
6. [ ] **Touch the character anywhere on the body and drag** — verify smooth movement, no stutter, no lag.
7. [ ] **Hit-area sanity** — try dragging from:
   - The character's head (top of body sprite) — should drag
   - The character's feet — should drag
   - Empty floor below the feet — should NOT drag (the character should NOT teleport when you tap empty space below it)
   - Far off to the side, near the background edge — should NOT drag
8. [ ] Lock the iPad. Wait 30 seconds. Unlock and reopen the icon. Game resumes from where it was.
9. [ ] Enable Airplane Mode. Reopen the icon. Game loads fully from cache.
10. [ ] Open Settings → General → Date & Time → set manual date +7 days forward. Reopen the icon. Game loads, save survives.
11. [ ] Reset Date & Time to automatic.

## Android phone

Repeat steps 1–9 above in Chrome on the Android phone. For step 10, perform a softer longevity check: leave the app un-opened for ≥24h, then reopen and confirm the save survives.

## Outfit visual check

- [ ] On both devices, the pink star t-shirt (`outfit-001`) is layered on top of the body silhouette at the torso, centered, and stays attached as the character is dragged.

## Sign-off

- [ ] Tested on iPad model: ____________
- [ ] Tested on Android model: ____________
- [ ] Date: ____________
- [ ] All steps green: yes / no
- [ ] Surprises / issues encountered:
  ____________________________________________________________
  ____________________________________________________________

If all steps green, return to Claude Code and say "Fase 0 device tests passed" so we can tag `fase-0-complete` and update memory.
