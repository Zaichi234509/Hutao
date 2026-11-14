export type ArtifactSet = {
  id: string
  name: string
  pieces: '4-Piece' | '2-Piece'
  twoPiece: string
  fourPiece?: string
  role: string
  accent: 'ember' | 'gold' | 'violet' | 'crimson'
}

export type BuildPreset = {
  id: 'vaporize' | 'pyro' | 'general'
  name: string
  tagline: string
  summary: string
  elementReaction: string
  sets: ArtifactSet[]
  mainStats: { slot: string; stat: string; note: string }[]
  substats: { stat: string; priority: 'High' | 'Medium' | 'Low' }[]
  weapons: { name: string; note: string; rank: 'BiS' | 'Strong' | 'F2P' }[]
  teams: { name: string; members: string[]; note: string }[]
}

/**
 * Set effects and main-stat priorities follow the in-game artifact descriptions
 * (effect text verified against the game archive). Build advice reflects the
 * widely used Hu Tao theorycrafting priorities.
 */
export const artifactsBySet: Record<string, ArtifactSet> = {
  crimson: {
    id: 'crimson',
    name: 'Crimson Witch of Flames',
    pieces: '4-Piece',
    twoPiece: 'Pyro DMG Bonus +15%',
    fourPiece:
      'Increases Overloaded, Burning, and Burgeon DMG by 40%. Increases Vaporize and Melt DMG by 15%. Using Elemental Skill increases the 2-Piece Set Bonus by 50% of its starting value for 10s. Max 3 stacks.',
    role: 'Reaction-focused Pyro',
    accent: 'ember',
  },
  shimenawa: {
    id: 'shimenawa',
    name: "Shimenawa's Reminiscence",
    pieces: '4-Piece',
    twoPiece: 'ATK +18%',
    fourPiece:
      'When casting an Elemental Skill, if the character has 15 or more Energy, they lose 15 Energy and Normal/Charged/Plunging Attack DMG is increased by 50% for 10s.',
    role: 'Charged-attack carry',
    accent: 'gold',
  },
  gilded: {
    id: 'gilded',
    name: 'Gilded Dreams',
    pieces: '4-Piece',
    twoPiece: 'Increases Elemental Mastery by 80.',
    fourPiece:
      'Within 8s of triggering an Elemental Reaction, the equipping character obtains buffs based on party Elemental Types: ATK +14% per matching ally, Elemental Mastery +50 per different ally (max 3 each).',
    role: 'Elemental Mastery / reactions',
    accent: 'violet',
  },
  marechaussee: {
    id: 'marechaussee',
    name: 'Marechaussee Hunter',
    pieces: '4-Piece',
    twoPiece: 'Normal and Charged Attack DMG +15%',
    fourPiece:
      'When current HP increases or decreases, CRIT Rate is increased by 12% for 5s. Max 3 stacks.',
    role: 'HP-fluctuation CRIT engine',
    accent: 'crimson',
  },
  wanderer: {
    id: 'wanderer',
    name: "Wanderer's Troupe",
    pieces: '2-Piece',
    twoPiece: 'Increases Elemental Mastery by 80.',
    role: 'Splash 2-piece',
    accent: 'violet',
  },
  noblesse: {
    id: 'noblesse',
    name: 'Noblesse Oblige',
    pieces: '2-Piece',
    twoPiece: 'Elemental Burst DMG +20%.',
    role: 'Splash 2-piece',
    accent: 'gold',
  },
}

const mainStatsBase = [
  { slot: 'Sands', stat: 'HP%', note: 'HP scales Hu Tao\'s ATK through Paramita Papilio.' },
  { slot: 'Goblet', stat: 'Pyro DMG Bonus', note: 'Multiplies every point of Pyro damage she deals.' },
  { slot: 'Circlet', stat: 'CRIT Rate / CRIT DMG', note: 'Balance to a 1:2 ratio with your weapon substat.' },
]

export const buildPresets: BuildPreset[] = [
  {
    id: 'vaporize',
    name: 'Vaporize DPS',
    tagline: 'Hydro appliers turn every charged attack into a reaction nuke.',
    summary:
      'Pair Hu Tao with reliable off-field Hydro so her Pyro-infused Charged Attacks vaporize. Elemental Mastery and CRIT share priority, and Crimson Witch of Flames amplifies the reaction itself.',
    elementReaction: 'Vaporize · Pyro on Hydro (1.5×)',
    sets: [artifactsBySet.crimson, artifactsBySet.wanderer, artifactsBySet.noblesse],
    mainStats: [
      { slot: 'Sands', stat: 'Elemental Mastery / HP%', note: 'EM sands wins once Hydro uptime is high; HP% is the safe default.' },
      { slot: 'Goblet', stat: 'Pyro DMG Bonus', note: 'Irreplaceable — reactions scale with the Pyro bonus.' },
      { slot: 'Circlet', stat: 'CRIT Rate / CRIT DMG', note: 'Aim for roughly 1:2 with Staff of Homa\'s CRIT DMG.' },
    ],
    substats: [
      { stat: 'CRIT Rate / CRIT DMG', priority: 'High' },
      { stat: 'Elemental Mastery', priority: 'High' },
      { stat: 'HP%', priority: 'Medium' },
      { stat: 'ATK%', priority: 'Medium' },
      { stat: 'Energy Recharge', priority: 'Low' },
    ],
    weapons: [
      { name: 'Staff of Homa', note: 'Signature; HP-to-ATK conversion stacks with Paramita Papilio.', rank: 'BiS' },
      { name: "Dragon's Bane", note: 'Bonus damage against Hydro-affected foes plus 221 EM.', rank: 'Strong' },
      { name: 'Ballad of the Fjords', note: 'CRIT Rate with free EM in mixed teams.', rank: 'F2P' },
    ],
    teams: [
      { name: 'Double Hydro Vape', members: ['Hu Tao', 'Yelan', 'Xingqiu', 'Zhongli'], note: 'The gold standard: Hydro resonance plus a shield that prevents interruption.' },
      { name: 'Furina Vape', members: ['Hu Tao', 'Furina', 'Yelan', 'Jean'], note: 'Fanfare stacks supercharge Hu Tao\'s HP-scaling damage.' },
      { name: 'Budget Vape', members: ['Hu Tao', 'Xingqiu', 'Thoma', 'Sucrose'], note: 'Accessible Hydro application and Elemental Mastery sharing.' },
    ],
  },
  {
    id: 'pyro',
    name: 'Pure Pyro DPS',
    tagline: 'No reactions needed — raw Pyro output and charged-attack pressure.',
    summary:
      'When reactions are impractical, lean into attack damage and CRIT. Shimenawa\'s Reminiscence rewards the charged-attack loop, and Pyro resonance keeps the flame burning.',
    elementReaction: 'Pure Pyro · Mono-Pyro resonance',
    sets: [artifactsBySet.shimenawa, artifactsBySet.crimson, artifactsBySet.noblesse],
    mainStats: [...mainStatsBase],
    substats: [
      { stat: 'CRIT Rate / CRIT DMG', priority: 'High' },
      { stat: 'HP%', priority: 'High' },
      { stat: 'ATK%', priority: 'Medium' },
      { stat: 'Elemental Mastery', priority: 'Low' },
      { stat: 'Energy Recharge', priority: 'Low' },
    ],
    weapons: [
      { name: 'Staff of Homa', note: 'The HP stack is unmatched for pure damage.', rank: 'BiS' },
      { name: 'Deathmatch', note: 'Massive CRIT Rate lets you run a CRIT DMG circlet.', rank: 'Strong' },
      { name: 'Blackcliff Pole', note: 'Free CRIT DMG for a straightforward stat line.', rank: 'F2P' },
    ],
    teams: [
      { name: 'Mono Pyro', members: ['Hu Tao', 'Bennett', 'Kazuha', 'Zhongli'], note: 'Pyro resonance, resistance shred and an unbroken shield.' },
      { name: 'Burn Vape', members: ['Hu Tao', 'Nahida', 'Yelan', 'Zhongli'], note: 'Dendro adds Burning while Hydro keeps vaporize available.' },
      { name: 'Shielded Carry', members: ['Hu Tao', 'Zhongli', 'Albedo', 'Bennett'], note: 'Geo resonance plus Bennett for a comfortable, high-DEF run.' },
    ],
  },
  {
    id: 'general',
    name: 'General Purpose',
    tagline: 'A flexible, overworld-friendly build for every situation.',
    summary:
      'Balanced HP and CRIT with generous Energy Recharge so Spirit Soother is always ready. Marechaussee Hunter turns her constant HP drain into free CRIT Rate.',
    elementReaction: 'Adaptive · works in any team',
    sets: [artifactsBySet.marechaussee, artifactsBySet.shimenawa, artifactsBySet.gilded],
    mainStats: [
      { slot: 'Sands', stat: 'HP%', note: 'The simplest, most consistent scaling for Hu Tao.' },
      { slot: 'Goblet', stat: 'Pyro DMG Bonus', note: 'Swap to HP% only if your Pyro goblet has far better substats.' },
      { slot: 'Circlet', stat: 'CRIT Rate', note: 'Marechaussee stacks add CRIT on top, so start with rate.' },
    ],
    substats: [
      { stat: 'HP%', priority: 'High' },
      { stat: 'CRIT Rate / CRIT DMG', priority: 'High' },
      { stat: 'Energy Recharge', priority: 'Medium' },
      { stat: 'ATK%', priority: 'Medium' },
      { stat: 'Elemental Mastery', priority: 'Low' },
    ],
    weapons: [
      { name: 'Staff of Homa', note: 'Still best in slot, even in a comfort build.', rank: 'BiS' },
      { name: 'Primordial Jade Winged-Spear', note: '674 base ATK plus CRIT Rate — great all-rounder.', rank: 'Strong' },
      { name: 'Deathmatch', note: 'Simplifies the CRIT balance while you learn her loop.', rank: 'F2P' },
    ],
    teams: [
      { name: 'Comfort Vape', members: ['Hu Tao', 'Xingqiu', 'Zhongli', 'Kokomi'], note: 'Healing that keeps her above the low-HP threshold when needed.' },
      { name: 'Overworld Crew', members: ['Hu Tao', 'Yelan', 'Kazuha', 'Zhongli'], note: 'Fast traversal, big bursts, zero friction.' },
      { name: 'Reaction Soup', members: ['Hu Tao', 'Furina', 'Nahida', 'Baizhu'], note: 'Burgeon-adjacent chaos for players who like variety.' },
    ],
  },
]

export const artifactSlots = [
  { slot: 'Flower', stat: 'Flat HP', icon: 'flower' },
  { slot: 'Plume', stat: 'Flat ATK', icon: 'plume' },
  { slot: 'Sands', stat: 'HP% / EM', icon: 'sands' },
  { slot: 'Goblet', stat: 'Pyro DMG', icon: 'goblet' },
  { slot: 'Circlet', stat: 'CRIT', icon: 'circlet' },
] as const
