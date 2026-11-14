/**
 * Hu Tao — character profile data.
 * Source: Genshin Impact in-game character archive (verified via the
 * community dataset `genshin-db`, HoYoverse published values).
 */

export const profile = {
  name: 'Hu Tao',
  alias: 'Papilio Charontis',
  title: 'Fragrance in Thaw',
  role: 'The 77th Director of Wangsheng Funeral Parlor',
  tagline: 'A lively and mischievous girl who brings joy to everything she touches — even in the face of death.',
  bio: [
    'Hu Tao is the 77th Director of the Wangsheng Funeral Parlor, a position she inherited at a remarkably young age. Cheerful, eccentric and endlessly curious, she approaches her solemn duties with a poet\'s reverence for life and a prankster\'s delight in the absurd.',
    'She believes the boundary between this world and the next should be respected, never feared. Under her care the Parlor has become both a place of proper farewells and a stage for her more theatrical pursuits: poetry, ghost stories and the occasional persuasive sales pitch for "buy one, get one free" funeral packages.',
    'In battle, Hu Tao walks the line between life and death literally. She spends her own vitality to awaken flames, and grows deadlier as her health dwindles — a crimson butterfly dancing at the edge of the underworld.',
  ],
  element: {
    name: 'Pyro',
    label: 'Element',
    description:
      'Pyro resonates with the fires of life and transformation. Hu Tao channels it through her own lifeforce, trading vitality for devastating damage.',
  },
  weapon: { name: 'Polearm', label: 'Weapon' },
  region: { name: 'Liyue', label: 'Region', description: 'The nation of contracts, ruled by Morax, where Wangsheng Funeral Parlor has served for generations.' },
  rarity: 5,
  birthday: 'July 15',
  constellation: 'Papilio Charontis',
  affiliation: 'Wangsheng Funeral Parlor',
  vision: 'Pyro',
  specialty: 'Parlor Director',
  ascensionStat: 'CRIT DMG',
  baseStats: { hp: 15552, atk: 106, def: 876, critDmg: '38.4%' },
  releaseVersion: '1.3',
  stats: [
    { label: 'Base HP', value: '15,552', note: 'Lv. 90' },
    { label: 'Base ATK', value: '106', note: 'Lv. 90' },
    { label: 'Base DEF', value: '876', note: 'Lv. 90' },
    { label: 'Ascension Bonus', value: 'CRIT DMG +38.4%', note: 'Lv. 90' },
  ],
  attributes: [
    { label: 'Element', value: 'Pyro', icon: 'flame' },
    { label: 'Weapon', value: 'Polearm', icon: 'spear' },
    { label: 'Region', value: 'Liyue', icon: 'mountain' },
    { label: 'Constellation', value: 'Papilio Charontis', icon: 'stars' },
    { label: 'Birthday', value: 'July 15', icon: 'cake' },
    { label: 'Affiliation', value: 'Wangsheng Funeral Parlor', icon: 'building' },
  ],
} as const

export type Profile = typeof profile
