# Tooling

| Script | Purpose |
| --- | --- |
| `keying.py` | Chroma-key green-screen renders into trimmed, spill-suppressed transparent PNGs. `python3 tools/keying.py <src> <dst> --fuzz 70 --despill 0.92 --maxw 1100` |
| `optimize.py` | Resize + palette-quantize `src/assets` rasters for the web (run after adding/replacing art). |
| `scripts/smoke.mjs` | Builds and renders the whole app in jsdom; asserts it mounts with no React errors. |
| `scripts/interact.mjs` | 45 headless assertions covering every interactive control. |
| `scripts/screenshot.mjs` | Section screenshots (requires `npx playwright install chromium`). |

Python dependencies: `pillow`, `numpy` (`pip install --break-system-packages pillow numpy`).
