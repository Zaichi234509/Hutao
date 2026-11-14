#!/usr/bin/env python3
"""Downscale + palette-quantize raster assets for the web.

Backgrounds/gallery are shown at <= 1920px wide, works in browsers at <= 1400px.
Quantizing to a rich palette (256 colours) keeps the painterly look at a fraction
of the weight.
"""
from PIL import Image
import glob, os, sys

def optimize(path, max_w, colors=256, quality=84):
    im = Image.open(path)
    had_alpha = im.mode in ('RGBA', 'LA') or 'transparency' in im.info
    im = im.convert('RGBA' if had_alpha else 'RGB')
    if im.width > max_w:
        h = round(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    before = os.path.getsize(path)
    if had_alpha:
        # quantize while preserving alpha
        alpha = im.getchannel('A')
        q = im.convert('RGB').quantize(colors=colors, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG)
        q = q.convert('RGBA')
        q.putalpha(alpha)
        q.save(path, 'PNG', optimize=True)
    else:
        im.convert('RGB').save(path, 'JPEG', quality=quality, optimize=True, progressive=True) if path.endswith('.jpg') else im.quantize(colors=colors, dither=Image.FLOYDSTEINBERG).save(path, 'PNG', optimize=True)
    after = os.path.getsize(path)
    print(f'{path:52s} {before/1024:7.0f}K -> {after/1024:6.0f}K')

for p in glob.glob('src/assets/backgrounds/*.png'):
    optimize(p, 1920, 256)
for p in glob.glob('src/assets/gallery/*.png'):
    optimize(p, 1500, 256)
for p in glob.glob('src/assets/artifacts/*.png'):
    optimize(p, 800, 256)
for p in glob.glob('src/assets/characters/raw-portrait.png'):
    optimize(p, 1000, 256)
for p in glob.glob('src/assets/characters/hutao-hero.png'):
    optimize(p, 1100, 256)
for p in glob.glob('src/assets/weapons/*.png'):
    optimize(p, 860, 256)
