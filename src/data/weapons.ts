import staffOfHoma from '../assets/weapons/staff-of-homa.png'
import primordialJade from '../assets/weapons/primordial-jade.png'
import dragonsBane from '../assets/weapons/dragons-bane.png'
import deathmatch from '../assets/weapons/deathmatch.png'
import balladFjords from '../assets/weapons/ballad-fjords.png'
import blackcliffPole from '../assets/weapons/blackcliff-pole.png'

export type Weapon = {
  id: string
  name: string
  rarity: 4 | 5
  type: 'Polearm'
  image: string
  baseAtk: number
  subStat: { name: string; value: string }
  passiveName: string
  passive: string
  lore: string
  bestFor: string
  accent: 'gold' | 'jade' | 'ember' | 'steel' | 'frost' | 'obsidian'
}

/**
 * Level 90 values and Refinement 1 passives, verified against the in-game
 * weapon archive. Base ATK at Lv. 90: Homa 608, Jade 674, Dragon's Bane 454,
 * Deathmatch 454, Ballad 510, Blackcliff 510.
 */
export const weapons: Weapon[] = [
  {
    id: 'staff-of-homa',
    name: 'Staff of Homa',
    rarity: 5,
    type: 'Polearm',
    image: staffOfHoma,
    baseAtk: 608,
    subStat: { name: 'CRIT DMG', value: '66.2%' },
    passiveName: 'Reckless Cinnabar',
    passive:
      'HP increased by 20%. Additionally, provides an ATK Bonus based on 0.8% of the wielder\'s Max HP. When the wielder\'s HP is less than 50%, this ATK Bonus is increased by an additional 1% of Max HP.',
    lore: 'A "firewood staff" that was once used in ancient and long-lost rituals.',
    bestFor: 'Signature weapon — the single largest damage increase available to Hu Tao.',
    accent: 'gold',
  },
  {
    id: 'primordial-jade',
    name: 'Primordial Jade Winged-Spear',
    rarity: 5,
    type: 'Polearm',
    image: primordialJade,
    baseAtk: 674,
    subStat: { name: 'CRIT Rate', value: '22.1%' },
    passiveName: 'Eagle Spear of Justice',
    passive:
      'On hit, increases ATK by 3.2% for 6s. Max 7 stacks. This effect can only occur once every 0.3s. While in possession of the maximum possible stacks, DMG dealt is increased by 12%.',
    lore: 'A jade polearm made by the archons, capable of slaying ancient beasts.',
    bestFor: 'Highest raw base ATK; a strong generalist pick when Homa is unavailable.',
    accent: 'jade',
  },
  {
    id: 'dragons-bane',
    name: "Dragon's Bane",
    rarity: 4,
    type: 'Polearm',
    image: dragonsBane,
    baseAtk: 454,
    subStat: { name: 'Elemental Mastery', value: '221' },
    passiveName: 'Bane of Flame and Water',
    passive: 'Increases DMG against opponents affected by Hydro or Pyro by 20%.',
    lore: 'A spear that once pierced the heart of a dragon. Its tip still smoulders.',
    bestFor: 'The classic vaporize workhorse — massive Elemental Mastery for reactions.',
    accent: 'ember',
  },
  {
    id: 'deathmatch',
    name: 'Deathmatch',
    rarity: 4,
    type: 'Polearm',
    image: deathmatch,
    baseAtk: 454,
    subStat: { name: 'CRIT Rate', value: '36.8%' },
    passiveName: 'Gladiator',
    passive:
      'If there are at least 2 opponents nearby, ATK is increased by 16% and DEF is increased by 16%. If there are fewer than 2 opponents nearby, ATK is increased by 24%.',
    lore: 'A bloodstained spear used in the deathmatches of the gladiator arena.',
    bestFor: 'Huge CRIT Rate cushion that makes artifact farming far more forgiving.',
    accent: 'steel',
  },
  {
    id: 'ballad-of-the-fjords',
    name: 'Ballad of the Fjords',
    rarity: 4,
    type: 'Polearm',
    image: balladFjords,
    baseAtk: 510,
    subStat: { name: 'CRIT Rate', value: '27.6%' },
    passiveName: 'Tales of the Tundra',
    passive: 'When there are at least 3 different Elemental Types in your party, Elemental Mastery will be increased by 120.',
    lore: 'A spear carved with the songs of a frozen north, carried by those who remember.',
    bestFor: 'Battle Pass option with a clean CRIT Rate stat and free Elemental Mastery.',
    accent: 'frost',
  },
  {
    id: 'blackcliff-pole',
    name: 'Blackcliff Pole',
    rarity: 4,
    type: 'Polearm',
    image: blackcliffPole,
    baseAtk: 510,
    subStat: { name: 'CRIT DMG', value: '55.1%' },
    passiveName: 'Press the Advantage',
    passive:
      'After defeating an enemy, ATK is increased by 12% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.',
    lore: 'A spear forged from blackcliff stone, said to drink the light around it.',
    bestFor: 'Budget CRIT DMG stick for players who can already sustain high CRIT Rate.',
    accent: 'obsidian',
  },
]

export const weaponById = (id: string) => weapons.find((w) => w.id === id)
