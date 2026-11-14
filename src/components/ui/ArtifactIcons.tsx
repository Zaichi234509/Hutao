import type { CSSProperties } from 'react'

/** Genshin-inspired artifact slot sigils, drawn as consistent SVG medals. */
type Slot = 'flower' | 'plume' | 'sands' | 'goblet' | 'circlet'

const ACCENTS: Record<Slot, { a: string; b: string }> = {
  flower: { a: '#E8DCC8', b: '#B8394B' },
  plume: { a: '#E8DCC8', b: '#D9AE69' },
  sands: { a: '#F0CE8F', b: '#8D2636' },
  goblet: { a: '#E8DCC8', b: '#7A3E6E' },
  circlet: { a: '#F0CE8F', b: '#531B29' },
}

function Glyph({ slot, color }: { slot: Slot; color: string }) {
  switch (slot) {
    case 'flower':
      return (
        <g fill="none" stroke={color} strokeWidth="1.6">
          {[0, 72, 144, 216, 288].map((d) => (
            <ellipse key={d} cx="32" cy="19" rx="6.5" ry="9" transform={`rotate(${d} 32 32)`} />
          ))}
          <circle cx="32" cy="32" r="3.2" fill={color} stroke="none" />
        </g>
      )
    case 'plume':
      return (
        <g fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
          <path d="M32 50c0-16 6-28 14-34-2 12-6 22-14 34Z" fill={color} fillOpacity="0.25" />
          <path d="M32 50c0-16-6-28-14-34 2 12 6 22 14 34Z" fill={color} fillOpacity="0.12" />
          <path d="M32 14v36" />
          <path d="M25 24h14M23 32h18M25 40h14" strokeOpacity="0.5" strokeWidth="1" />
        </g>
      )
    case 'sands':
      return (
        <g fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round">
          <path d="M22 18h20L32 32l10 14H22l10-14L22 18Z" fill={color} fillOpacity="0.15" />
          <path d="M19 16h26M19 48h26" strokeWidth="1.8" />
        </g>
      )
    case 'goblet':
      return (
        <g fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round">
          <path d="M21 18h22c0 9-4 15-11 15s-11-6-11-15Z" fill={color} fillOpacity="0.2" />
          <path d="M32 33v11" />
          <path d="M24 46h16" strokeWidth="1.8" />
          <path d="M21 18h22" />
        </g>
      )
    case 'circlet':
      return (
        <g fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round">
          <path d="M18 38l4-16 10 8 10-8 4 16c-8 4-20 4-28 0Z" fill={color} fillOpacity="0.18" />
          <circle cx="32" cy="26" r="2.2" fill={color} stroke="none" />
          <path d="M16 42c10 5 22 5 32 0" strokeOpacity="0.5" />
        </g>
      )
  }
}

export function ArtifactIcon({
  slot,
  className = '',
  style,
}: {
  slot: Slot
  className?: string
  style?: CSSProperties
}) {
  const { a, b } = ACCENTS[slot]
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id={`art-bg-${slot}`} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor={b} stopOpacity="0.55" />
          <stop offset="100%" stopColor="#140E14" stopOpacity="0.95" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#art-bg-${slot})`} stroke={a} strokeOpacity="0.25" />
      <circle cx="32" cy="32" r="25.5" fill="none" stroke={a} strokeOpacity="0.18" strokeDasharray="1.5 3" />
      <Glyph slot={slot} color={a} />
    </svg>
  )
}

/** Small rank chevrons used in the substat priority list. */
export function PriorityMark({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  const filled = level === 'High' ? 3 : level === 'Medium' ? 2 : 1
  return (
    <span className="flex items-center gap-1" aria-label={`${level} priority`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rotate-45 ${
            i < filled ? (level === 'High' ? 'bg-gold' : 'bg-gold/60') : 'bg-ivory/15'
          }`}
        />
      ))}
    </span>
  )
}
