import gallery01 from '../assets/gallery/gallery-01.png'
import gallery02 from '../assets/gallery/gallery-02.png'
import gallery03 from '../assets/gallery/gallery-03.png'
import gallery04 from '../assets/gallery/gallery-04.png'
import gallery05 from '../assets/gallery/gallery-05.png'
import combatNormal from '../assets/gallery/combat-normal.png'
import combatSkill from '../assets/gallery/combat-skill.png'
import combatBurst from '../assets/gallery/combat-burst.png'
import portrait from '../assets/characters/hutao-portrait.png'

export type GalleryItem = {
  id: string
  src: string
  title: string
  caption: string
  tag: 'Portrait' | 'Combat' | 'Atmosphere' | 'Story'
  /** Masonry footprint. `tall` = 2 rows, `wide` = 2 columns. */
  span?: 'tall' | 'wide' | 'normal'
  /** CSS object-position for art whose subject sits off-centre. */
  focus?: string
}

/**
 * Nine artworks arranged as a 4-column masonry on desktop:
 *
 *  [03 tall] [02 wide      ] [04 normal]
 *  [03 tall] [01 normal][05 normal][04]
 *  [06 wide        ] [07 normal] [08 normal]
 *
 * Portrait/character art is tall, harbour vistas are wide.
 */
export const galleryItems: GalleryItem[] = [
  {
    id: 'g1',
    src: gallery03,
    title: 'Fragrance in Thaw',
    caption: 'A quiet moment between duties — the Director of the Parlor at rest.',
    tag: 'Portrait',
    span: 'tall',
    focus: '50% 30%',
  },
  {
    id: 'g2',
    src: gallery02,
    title: 'Lantern Vigil',
    caption: 'Lanterns rise over Liyue, each one a name remembered.',
    tag: 'Atmosphere',
    span: 'wide',
    focus: '62% 40%',
  },
  {
    id: 'g3',
    src: combatSkill,
    title: 'Guide to Afterlife',
    caption: 'Paramita Papilio: burn vitality, kindle the crimson flame.',
    tag: 'Combat',
    span: 'normal',
    focus: '50% 42%',
  },
  {
    id: 'g4',
    src: gallery01,
    title: 'Night Procession',
    caption: 'Crimson butterflies lead the way along the rain-slick harbor steps.',
    tag: 'Atmosphere',
    span: 'normal',
    focus: '50% 45%',
  },
  {
    id: 'g5',
    src: gallery05,
    title: 'Moonlit Archive',
    caption: 'Records of every soul the parlor has guided home.',
    tag: 'Story',
    span: 'normal',
    focus: '50% 40%',
  },
  {
    id: 'g6',
    src: combatBurst,
    title: 'Spirit Soother',
    caption: 'A blazing spirit answers the call, and the field falls silent.',
    tag: 'Combat',
    span: 'tall',
    focus: '50% 38%',
  },
  {
    id: 'g7',
    src: combatNormal,
    title: 'Secret Spear of Wangsheng',
    caption: 'Six strikes, no wasted motion — the parlor spear art.',
    tag: 'Combat',
    span: 'normal',
    focus: '50% 40%',
  },
  {
    id: 'g8',
    src: gallery04,
    title: 'The Threshold',
    caption: 'Where the parlor lamps end and the far shore begins.',
    tag: 'Story',
    span: 'wide',
    focus: '50% 45%',
  },
  {
    id: 'g9',
    src: portrait,
    title: 'Talisman & Blossom',
    caption: 'The talisman on her hat bears a single, mischievous word.',
    tag: 'Portrait',
    span: 'normal',
    focus: '50% 22%',
  },
]
