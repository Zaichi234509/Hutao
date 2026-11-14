import type { LucideIcon } from 'lucide-react'
import { Sword, Flame, Ghost } from 'lucide-react'
import combatNormal from '../assets/gallery/combat-normal.png'
import combatSkill from '../assets/gallery/combat-skill.png'
import combatBurst from '../assets/gallery/combat-burst.png'

export type SkillRow = { label: string; values: [string, string, string] }

export type Talent = {
  id: 'normal' | 'skill' | 'burst'
  tier: string
  name: string
  subtitle: string
  icon: LucideIcon
  art: string
  element: 'Physical' | 'Pyro'
  description: string[]
  detailLabel: string
  detailRows: SkillRow[]
  levelLabels: [string, string, string]
}

/**
 * Descriptions are the in-game talent text. Multipliers are the official
 * values at talent levels 1 / 6 / 10, extracted from the game data tables.
 */
export const talents: Talent[] = [
  {
    id: 'normal',
    tier: 'Normal Attack',
    name: 'Secret Spear of Wangsheng',
    subtitle: 'Six consecutive strikes that end in a flourish of sparks.',
    icon: Sword,
    art: combatNormal,
    element: 'Physical',
    description: [
      'Normal Attack — Performs up to 6 consecutive spear strikes.',
      'Charged Attack — Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the way.',
      'Plunging Attack — Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.',
    ],
    detailLabel: 'Talent Multipliers',
    levelLabels: ['Lv. 1', 'Lv. 6', 'Lv. 10'],
    detailRows: [
      { label: '1-Hit DMG', values: ['46.9%', '64.5%', '83.6%'] },
      { label: '2-Hit DMG', values: ['48.3%', '66.3%', '86.1%'] },
      { label: '3-Hit DMG', values: ['61.1%', '83.9%', '108.9%'] },
      { label: '4-Hit DMG', values: ['65.6%', '90.3%', '117.1%'] },
      { label: '5-Hit DMG', values: ['33.3%+35.2%', '45.8%+48.4%', '59.4%+62.8%'] },
      { label: '6-Hit DMG', values: ['86.0%', '118.2%', '153.4%'] },
      { label: 'Charged Attack DMG', values: ['136.0%', '186.9%', '242.6%'] },
      { label: 'Charged Attack Stamina', values: ['25', '25', '25'] },
      { label: 'Plunge DMG', values: ['65.4%', '90.0%', '116.7%'] },
      { label: 'Low / High Plunge DMG', values: ['130.8% / 163.4%', '179.9% / 224.7%', '233.4% / 291.5%'] },
    ],
  },
  {
    id: 'skill',
    tier: 'Elemental Skill',
    name: 'Guide to Afterlife',
    subtitle: 'Paramita Papilio — burn vitality to clad the spear in Pyro.',
    icon: Flame,
    art: combatSkill,
    element: 'Pyro',
    description: [
      'Only an unwavering flame can cleanse the impurities of this world. Hu Tao consumes a set portion of her HP to knock the surrounding enemies back and enter the Paramita Papilio state.',
      'Paramita Papilio — Increases ATK based on Max HP (up to 400% of Base ATK), converts attack DMG to Pyro DMG that cannot be overridden, applies Blood Blossom on Charged Attacks, and increases resistance to interruption.',
      'Blood Blossom — Affected enemies take Pyro DMG every 4s. This is considered Elemental Skill DMG, and each enemy can only carry one Blood Blossom at a time.',
    ],
    detailLabel: 'Skill Attributes',
    levelLabels: ['Lv. 1', 'Lv. 6', 'Lv. 10'],
    detailRows: [
      { label: 'Activation Cost', values: ['30% Current HP', '30% Current HP', '30% Current HP'] },
      { label: 'ATK Increase (Max HP)', values: ['3.84%', '5.06%', '6.26%'] },
      { label: 'Blood Blossom DMG', values: ['64.0%', '89.6%', '115.2%'] },
      { label: 'Blood Blossom Duration', values: ['8s', '8s', '8s'] },
      { label: 'Paramita Papilio Duration', values: ['9s', '9s', '9s'] },
      { label: 'Cooldown', values: ['16s', '16s', '16s'] },
    ],
  },
  {
    id: 'burst',
    tier: 'Elemental Burst',
    name: 'Spirit Soother',
    subtitle: 'A blazing spirit that mends the wielder as it consumes the field.',
    icon: Ghost,
    art: combatBurst,
    element: 'Pyro',
    description: [
      'Commands a blazing spirit to attack, dealing Pyro DMG in a large AoE.',
      'Upon striking an enemy, regenerates a percentage of Hu Tao\'s Max HP. This effect can be triggered up to 5 times, based on the number of enemies hit.',
      'If Hu Tao\'s HP is below or equal to 50% when the enemy is hit, both the DMG and HP Regeneration are increased.',
    ],
    detailLabel: 'Burst Attributes',
    levelLabels: ['Lv. 1', 'Lv. 6', 'Lv. 10'],
    detailRows: [
      { label: 'Skill DMG', values: ['303.3%', '399.5%', '494.0%'] },
      { label: 'Low HP Skill DMG', values: ['379.1%', '499.4%', '617.4%'] },
      { label: 'HP Regeneration (Max HP)', values: ['6.26%', '8.25%', '10.20%'] },
      { label: 'Low HP Regeneration', values: ['8.35%', '11.00%', '13.60%'] },
      { label: 'Cooldown', values: ['15s', '15s', '15s'] },
      { label: 'Energy Cost', values: ['60', '60', '60'] },
    ],
  },
]

export type Passive = {
  name: string
  unlock: string
  description: string
  kind: 'Ascension' | 'Utility'
}

export const passives: Passive[] = [
  {
    name: 'Flutter By',
    unlock: 'Unlocks at Ascension 1',
    kind: 'Ascension',
    description:
      'When a Paramita Papilio state activated by Guide to Afterlife ends, all allies in the party (excluding Hu Tao herself) will have their CRIT Rate increased by 12% for 8s.',
  },
  {
    name: 'Sanguine Rouge',
    unlock: 'Unlocks at Ascension 4',
    kind: 'Ascension',
    description:
      'When Hu Tao\'s HP is equal to or less than 50%, her Pyro DMG Bonus is increased by 33%.',
  },
  {
    name: 'The More the Merrier',
    unlock: 'Unlocked at start',
    kind: 'Utility',
    description:
      'When Hu Tao cooks a dish perfectly, she has an 18% chance to receive an additional "Suspicious" dish of the same type.',
  },
]
