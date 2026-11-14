#!/usr/bin/env python3
"""Chroma-key green-screen renders into trimmed transparent PNGs.

Usage: python3 tools/keying.py <src> <dst> [--fuzz 90] [--despill 0.55]
Keeps soft alpha edges, removes green spill, trims to the visible bounding box,
and re-exports at a capped width for web.
"""
import sys
from PIL import Image
import numpy as np


def key(src: str, dst: str, fuzz: float = 88.0, despill: float = 0.55, max_w: int = 1400) -> None:
    im = Image.open(src).convert("RGBA")
    a = np.asarray(im).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]

    # How green is this pixel relative to the other channels?
    excess = g - np.maximum(r, b)
    # alpha ramps to 0 as green dominance approaches the key colour
    alpha = np.clip(1.0 - (excess / fuzz) * 1.45, 0.0, 1.0)

    # near-background pixels (which are pure green) -> fully transparent
    bg = (g > 120) & (r < 110) & (b < 110)
    alpha[bg] = 0.0

    # despill: cap green at the level of the other channels so edges don't glow green
    spill = g > np.maximum(r, b)
    g2 = np.where(spill, np.maximum(r, b) + (g - np.maximum(r, b)) * (1.0 - despill), g)
    a[..., 1] = g2
    a[..., 3] = alpha * 255.0

    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")
    bbox = out.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if bbox:
        out = out.crop(bbox)
    if out.width > max_w:
        h = round(out.height * max_w / out.width)
        out = out.resize((max_w, h), Image.LANCZOS)
    out.save(dst, "PNG", optimize=True)
    print(f"{dst}  {out.width}x{out.height}")


if __name__ == "__main__":
    args = sys.argv[1:]
    flags = {"--fuzz": 88.0, "--despill": 0.55, "--maxw": 1400}
    pos = []
    i = 0
    while i < len(args):
        if args[i] in flags:
            flags[args[i]] = float(args[i + 1])
            i += 2
        else:
            pos.append(args[i])
            i += 1
    key(pos[0], pos[1], flags["--fuzz"], flags["--despill"], int(flags["--maxw"]))
