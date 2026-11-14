# Asset Inventory — Papilio Charontis

Every image referenced by the site lives under `src/assets/` and is imported through Vite, so
filenames are content-hashed at build time (no broken paths, no remote hotlinks).

All character artwork is **original, generated for this project** in a Genshin-inspired style.
No official game art is redistributed.

Generation pipeline:

1. Model render on a chroma-key plate → `tools/keying.py` (green-dominance matte, spill
   suppression, alpha feather, trim, downscale) → transparent PNG.
2. Atmospheric passes, plates and composites → `tools/optimize.py` (resize + palette
   quantization, progressive output) to keep payloads small.

---

## Character assets — generated

| File | Dimensions | Description |
| --- | --- | --- |
| `characters/hutao-hero.png` | 726 × 1255 | Full-body hero cutout, transparent (used in hero and closing scene) |
| `characters/hutao-portrait.png` | 1000 × 1000 | Bust portrait with talisman hat detail (profile card, gallery) |

## Weapon assets — generated

All six are transparent PNGs produced from chroma-key renders via `tools/keying.py`.

| File | Weapon | Rarity |
| --- | --- | --- |
| `weapons/staff-of-homa.png` | Staff of Homa | ★★★★★ |
| `weapons/primordial-jade.png` | Primordial Jade Winged-Spear | ★★★★★ |
| `weapons/dragons-bane.png` | Dragon's Bane | ★★★★ |
| `weapons/deathmatch.png` | Deathmatch | ★★★★ |
| `weapons/ballad-fjords.png` | Ballad of the Fjords | ★★★★ |
| `weapons/blackcliff-pole.png` | Blackcliff Pole | ★★★★ |

## Background assets — generated

| File | Description |
| --- | --- |
| `backgrounds/liyue-night.png` | Liyue Harbor at night with lanterns and moon — hero backdrop |
| `backgrounds/parlor.png` | Wangsheng Funeral Parlor courtyard at dusk — profile + ending |
| `backgrounds/weapon-archive.png` | Liyue weapons shrine / archive hall — weapon chapter |
| `backgrounds/celestial.png` | Constellation night sky with butterfly stars — constellation chapter |
| `backgrounds/celestial-low.png` | Soft crimson/obsidian atmosphere plate for the chapter transition |

## Combat & gallery artwork — generated

| File | Description |
| --- | --- |
Portrait-framed illustrations (768 × 1376) shown in the talent showcase and gallery.

| File | Description |
| --- | --- |
| `gallery/combat-normal.png` | *Secret Spear of Wangsheng* — lunging spear thrust with trailing sparks |
| `gallery/combat-skill.png` | *Guide to Afterlife* — kneeling skill activation, fire halo, spirit companions |
| `gallery/combat-burst.png` | *Spirit Soother* — colossal flame spirit erupting from the rooftops |

Landscape artworks (≈ 1408 × 768) used in the gallery grid, filmstrip and lightbox.

| File | Description |
| --- | --- |
| `gallery/gallery-01.png` | *Night Procession* — rain-slick harbor steps and lantern light |
| `gallery/gallery-02.png` | *Lantern Vigil* — Lantern Rite night market, released lanterns |
| `gallery/gallery-03.png` | *Fragrance in Thaw* — character portrait plate |
| `gallery/gallery-04.png` | *The Threshold* — gates of the afterlife, river of gold light |
| `gallery/gallery-05.png` | *Moonlit Archive* — parlor archive shelves in lantern light |

## Artifact plate

| File | Description |
| --- | --- |
| `artifacts/crimson-witch.png` | Crimson Witch of Flames relic plate (portrait-derived composition with ornamental relic rings) |

## Decorative assets — hand-authored SVG (no raster)

Crisper at any resolution, animatable, and tiny. All live in
`src/components/ui/Decorations.tsx` and `ArtifactIcons.tsx`.

| Component | Use |
| --- | --- |
| `Butterfly` | Pyro butterfly ornament (crimson / gold / ghost variants) |
| `PlumBlossom` | Five-petal blossom for decor + falling-petal field |
| `GhostSpirit` | Ghosty-inspired companion spirit (hero + profile) |
| `PyroSigil` | Pyro element emblem (hero badge, profile) |
| `ButterflyField` / `PetalField` / `EmberField` | Ambient particle fields |
| `Divider` / `CornerFrame` | Ornamental hairlines and corner brackets |
| `ArtifactIcon` | Flower / Plume / Sands / Goblet / Circlet slot sigils |
| `Stars` | Rarity indicator (SVG stars, gold glow) |

## Interface icons

[NLucide React](https://lucide.dev) — navigation, element, talent, gallery and lightbox controls.
No custom icon font, no sprites.

## Asset checklist

- [x] Hero full-body character artwork (transparent)
- [x] Character portrait
- [x] Combat artwork for all three talents
- [x] Liyue atmospheric background
- [x] Wangsheng Funeral Parlor background
- [x] Celestial / constellation background
- [x] Weapon archive background
- [x] Gallery background atmosphere
- [x] All six weapon renders (transparent)
- [x] Artifact set plate
- [x] Butterflies, blossoms, ghosts, embers, stars (SVG)
- [x] Ornamental frames and dividers (SVG/CSS)
- [x] Element, talent, artifact and rarity icons
- [x] Five gallery artworks + four combat/portrait plates
- [x] No placeholder boxes, no broken `<img src>`, no remote dependencies

## Optimization

- Chroma-key sources and chroma plates removed from the repo after keying.
- `tools/optimize.py` palette-quantizes backgrounds and gallery art (≤ 1920 px) and trims
  characters/weapons, cutting total asset weight roughly in half while preserving the painterly
  look.
- Below-the-fold imagery uses `loading="lazy"`; only hero art and the hero backdrop use
  `fetchPriority="high"`.
