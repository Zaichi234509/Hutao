export type Constellation = {
  id: string
  level: number
  name: string
  description: string
  /** Position on the 0..100 constellation canvas (percent) */
  x: number
  y: number
  /** Key mechanical summary shown as a chip */
  chip: string
}

/**
 * Six stars traced over the four wings of the Papilio Charontis butterfly.
 * Coordinates are percentages of an 100x100 canvas.
 */
export const constellations: Constellation[] = [
  {
    id: 'crimson-bouquet',
    level: 1,
    name: 'Crimson Bouquet',
    description:
      "While in a Paramita Papilio state activated by Guide to Afterlife, Hu Tao's Charged Attacks do not consume Stamina.",
    x: 19,
    y: 24,
    chip: 'Free charged attacks',
  },
  {
    id: 'ominous-rainfall',
    level: 2,
    name: 'Ominous Rainfall',
    description:
      "Increases the Blood Blossom DMG by an amount equal to 10% of Hu Tao's Max HP at the time the effect is applied. Additionally, Spirit Soother will also apply the Blood Blossom effect.",
    x: 27,
    y: 66,
    chip: '+10% Max HP on Blood Blossom',
  },
  {
    id: 'lingering-carmine',
    level: 3,
    name: 'Lingering Carmine',
    description: 'Increases the Level of Guide to Afterlife by 3. Maximum upgrade level is 15.',
    x: 41,
    y: 44,
    chip: 'Skill Lv. +3',
  },
  {
    id: 'garden-of-eternal-rest',
    level: 4,
    name: 'Garden of Eternal Rest',
    description:
      'Upon defeating an enemy affected by a Blood Blossom that Hu Tao applied herself, all nearby allies in the party (excluding Hu Tao herself) will have their CRIT Rate increased by 12% for 15s.',
    x: 59,
    y: 44,
    chip: '+12% party CRIT Rate',
  },
  {
    id: 'floral-incense',
    level: 5,
    name: 'Floral Incense',
    description: 'Increases the Level of Spirit Soother by 3. Maximum upgrade level is 15.',
    x: 73,
    y: 66,
    chip: 'Burst Lv. +3',
  },
  {
    id: 'butterflys-embrace',
    level: 6,
    name: "Butterfly's Embrace",
    description:
      "Triggers when Hu Tao's HP drops below 25%, or when she suffers a lethal strike: Hu Tao will not fall as a result of the DMG sustained. Additionally, for the next 10s, her All Elemental and Physical RES is increased by 200%, her CRIT Rate is increased by 100%, and her resistance to interruption is greatly increased. This effect triggers automatically when Hu Tao has 1 HP left. Can only occur once every 60s.",
    x: 81,
    y: 24,
    chip: 'Survive at 1 HP · +100% CRIT Rate',
  },
]

/** Decorative (non-interactive) stardust nodes for density. */
export const dustNodes: { x: number; y: number; r: number }[] = [
  { x: 50, y: 12, r: 0.7 },
  { x: 34, y: 20, r: 0.5 },
  { x: 66, y: 20, r: 0.5 },
  { x: 12, y: 48, r: 0.6 },
  { x: 88, y: 48, r: 0.6 },
  { x: 45, y: 78, r: 0.45 },
  { x: 55, y: 78, r: 0.45 },
  { x: 37, y: 58, r: 0.4 },
  { x: 63, y: 58, r: 0.4 },
  { x: 22, y: 12, r: 0.4 },
  { x: 78, y: 12, r: 0.4 },
  { x: 50, y: 92, r: 0.5 },
]

/**
 * Butterfly wing outlines, drawn as mirrored cubic bezier paths that pass
 * through each star node. The body runs vertically down the centre.
 */
/**
 * Butterfly wings, drawn to read clearly as *wings* rather than petals:
 * each side has a long, sharply-angled forewing that sweeps up and outward
 * (tip near C1 / C6) and a rounded hindwing below it. Curves are asymmetric and
 * elongated along the horizontal axis so the silhouette is unmistakable.
 */
export const wingPaths: string[] = [
  // LEFT forewing: thorax -> up-left to a pointed tip at (~17,20) -> back down
  'M49 38 C 43 30, 33 20, 22 17 C 13 15, 11 24, 18 33 C 25 42, 38 47, 47 45',
  // LEFT hindwing: smaller, rounded, tucked below and behind the forewing
  'M48 46 C 40 45, 29 51, 26 62 C 23 73, 33 79, 42 71 C 47 66, 49 56, 49 50',
  // RIGHT forewing (mirrored)
  'M51 38 C 57 30, 67 20, 78 17 C 87 15, 89 24, 82 33 C 75 42, 62 47, 53 45',
  // RIGHT hindwing (mirrored)
  'M52 46 C 60 45, 71 51, 74 62 C 77 73, 67 79, 58 71 C 53 66, 51 56, 51 50',
]

/** The butterfly's body and antennae. */
export const bodyPaths: string[] = [
  'M50 20 C 53 26, 53 44, 50 54 C 47 44, 47 26, 50 20 Z',
  'M50 20 C 46 12, 40 8, 34 6',
  'M50 20 C 54 12, 60 8, 66 6',
]
