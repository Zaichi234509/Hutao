import { useMemo, type CSSProperties } from 'react'

/* ------------------------------------------------------------------ */
/*  Butterfly — ornamental crimson pyro butterfly                      */
/* ------------------------------------------------------------------ */
export function Butterfly({
  className = '',
  style,
  variant = 'crimson',
  flip = false,
}: {
  className?: string
  style?: CSSProperties
  variant?: 'crimson' | 'gold' | 'ghost'
  flip?: boolean
}) {
  const id = useMemo(() => `bfly-${Math.random().toString(36).slice(2, 8)}`, [])
  const palette = {
    crimson: { a: '#F2A07A', b: '#C0334A', c: '#7A1526', glow: '#FF6B5A' },
    gold: { a: '#FBE7BE', b: '#D9AE69', c: '#8A5A25', glow: '#F0CE8F' },
    ghost: { a: '#E8F6F2', b: '#A8D8CE', c: '#5C8C86', glow: '#CFF3EA' },
  }[variant]

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-w`} cx="60%" cy="40%" r="75%">
          <stop offset="0%" stopColor={palette.a} stopOpacity="0.95" />
          <stop offset="55%" stopColor={palette.b} stopOpacity="0.9" />
          <stop offset="100%" stopColor={palette.c} stopOpacity="0.85" />
        </radialGradient>
        <filter id={`${id}-g`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        filter={`url(#${id}-g)`}
        transform={flip ? 'translate(100,0) scale(-1,1)' : undefined}
        opacity="0.96"
      >
        {/* left wings */}
        <path
          d="M49 50C36 26 18 14 10 22c-9 9 4 30 22 34-10 3-15 12-10 19 6 9 22 2 27-15Z"
          fill={`url(#${id}-w)`}
        />
        {/* right wings */}
        <path
          d="M51 50c13-24 31-36 39-28 9 9-4 30-22 34 10 3 15 12 10 19-6 9-22 2-27-15Z"
          fill={`url(#${id}-w)`}
        />
        {/* veins */}
        <g stroke={palette.a} strokeWidth="0.9" fill="none" opacity="0.55">
          <path d="M49 50C40 40 28 26 14 23" />
          <path d="M49 50C38 52 24 66 23 73" />
          <path d="M51 50c9-10 21-24 35-27" />
          <path d="M51 50c11 2 25 16 26 23" />
        </g>
        <path d="M50 28c3 8 3 30 0 40-3-10-3-32 0-40Z" fill={palette.a} opacity="0.9" />
        <path d="M50 28c-5-8-9-12-13-14M50 28c5-8 9-12 13-14" stroke={palette.a} strokeWidth="1.2" fill="none" opacity="0.8" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Plum blossom                                                       */
/* ------------------------------------------------------------------ */
export function PlumBlossom({
  className = '',
  style,
  tone = 'crimson',
}: {
  className?: string
  style?: CSSProperties
  tone?: 'crimson' | 'ivory' | 'gold'
}) {
  const colors = { crimson: '#B8394B', ivory: '#EDE0CC', gold: '#D9AE69' }[tone]
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="20"
          cy="11"
          rx="6.2"
          ry="8"
          fill={colors}
          opacity="0.82"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="2.6" fill="#F0CE8F" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line
          key={deg}
          x1="20"
          y1="20"
          x2="20"
          y2="15"
          stroke="#3A1119"
          strokeWidth="0.5"
          opacity="0.5"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Ghost spirit (Ghosty-inspired companion)                           */
/* ------------------------------------------------------------------ */
export function GhostSpirit({
  className = '',
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  const id = useMemo(() => `ghost-${Math.random().toString(36).slice(2, 8)}`, [])
  return (
    <svg viewBox="0 0 120 150" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-b`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFFDF6" />
          <stop offset="60%" stopColor="#F0E6D6" />
          <stop offset="100%" stopColor="#CDBFAE" stopOpacity="0.75" />
        </radialGradient>
        <filter id={`${id}-g`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id}-g)`} opacity="0.95">
        <path
          d="M60 14c22 0 38 17 38 40v52c0 6-6 9-11 6l-9-6-8 7c-2 2-6 2-8 0l-8-7-8 7c-2 2-6 2-8 0l-8-7-9 6c-5 3-11 0-11-6V54c0-23 16-40 38-40Z"
          fill={`url(#${id}-b)`}
          stroke="#E8DCC8"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        <ellipse cx="47" cy="62" rx="5.4" ry="7" fill="#241A22" />
        <ellipse cx="77" cy="62" rx="5.4" ry="7" fill="#241A22" />
        <ellipse cx="45.6" cy="59.6" rx="1.7" ry="2.3" fill="#FFF8EC" />
        <ellipse cx="75.6" cy="59.6" rx="1.7" ry="2.3" fill="#FFF8EC" />
        <ellipse cx="62" cy="77" rx="4.6" ry="3.4" fill="#8D2636" opacity="0.8" />
        <ellipse cx="38" cy="74" rx="4" ry="2.4" fill="#C97C86" opacity="0.35" />
        <ellipse cx="84" cy="74" rx="4" ry="2.4" fill="#C97C86" opacity="0.35" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Elemental sigil — Pyro                                             */
/* ------------------------------------------------------------------ */
export function PyroSigil({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="pyro-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7C78C" />
          <stop offset="45%" stopColor="#D9563F" />
          <stop offset="100%" stopColor="#8D2636" />
        </linearGradient>
      </defs>
      <path
        d="M32 6c9 10 16 17 16 27 0 11-7 17-16 20-9-3-16-9-16-20 0-10 7-17 16-27Z"
        fill="none"
        stroke="url(#pyro-grad)"
        strokeWidth="2.2"
      />
      <path
        d="M32 18c4.5 5 8 9 8 14.5 0 6-3.7 9.6-8 11.5-4.3-1.9-8-5.5-8-11.5C24 27 27.5 23 32 18Z"
        fill="url(#pyro-grad)"
        opacity="0.9"
      />
      <circle cx="32" cy="56" r="1.8" fill="#D9AE69" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Ornamental corner brackets & divider                               */
/* ------------------------------------------------------------------ */
export function CornerFrame({ className = '' }: { className?: string }) {
  return (
    <span className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {[
        'left-0 top-0 border-l border-t',
        'right-0 top-0 border-r border-t',
        'left-0 bottom-0 border-l border-b',
        'right-0 bottom-0 border-r border-b',
      ].map((pos) => (
        <span key={pos} className={`absolute h-4 w-4 border-gold/55 ${pos}`} />
      ))}
    </span>
  )
}

export function Divider({ className = '', icon = true }: { className?: string; icon?: boolean }) {
  return (
    <div className={`divider-ornament ${className}`} aria-hidden="true">
      {icon ? (
        <span className="flex items-center gap-2">
          <span className="h-1 w-1 rotate-45 bg-gold/70" />
          <PlumBlossom className="h-3.5 w-3.5 opacity-80" />
          <span className="h-1 w-1 rotate-45 bg-gold/70" />
        </span>
      ) : (
        <span className="h-px w-full bg-gold/20" />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Ambient fields: butterflies, petals, embers                        */
/* ------------------------------------------------------------------ */
type Fly = { top: string; left: string; size: number; delay: string; dur: string; variant: 'crimson' | 'gold' | 'ghost'; flip: boolean }

const BUTTERFLIES: Fly[] = [
  { top: '16%', left: '7%', size: 42, delay: '-2s', dur: '13s', variant: 'crimson', flip: false },
  { top: '30%', left: '88%', size: 34, delay: '-6s', dur: '16s', variant: 'gold', flip: true },
  { top: '62%', left: '14%', size: 26, delay: '-9s', dur: '18s', variant: 'crimson', flip: true },
  { top: '72%', left: '78%', size: 46, delay: '-4s', dur: '15s', variant: 'crimson', flip: false },
  { top: '44%', left: '46%', size: 22, delay: '-11s', dur: '20s', variant: 'gold', flip: false },
  { top: '8%', left: '62%', size: 28, delay: '-7s', dur: '17s', variant: 'ghost', flip: true },
]

export function ButterflyField({
  className = '',
  density = 'normal',
}: {
  className?: string
  density?: 'sparse' | 'normal'
}) {
  const list = density === 'sparse' ? BUTTERFLIES.slice(0, 3) : BUTTERFLIES
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {list.map((b, i) => (
        <span
          key={i}
          className="anim-flutter absolute opacity-70"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: b.delay,
            animationDuration: b.dur,
          }}
        >
          <Butterfly className="h-full w-full drop-shadow-[0_0_12px_rgba(200,60,60,0.45)]" variant={b.variant} flip={b.flip} />
        </span>
      ))}
    </div>
  )
}

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 7.3 + 4) % 96}%`,
  delay: `-${(i * 1.7) % 14}s`,
  dur: `${13 + (i % 5) * 2.4}s`,
  size: 8 + (i % 4) * 3,
  drift: `${(i % 2 ? 1 : -1) * (30 + (i % 5) * 18)}px`,
}))

export function PetalField({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="absolute top-0"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animation: `petal-fall ${p.dur} linear infinite`,
            animationDelay: p.delay,
            ['--drift' as string]: p.drift,
          }}
        >
          <PlumBlossom className="h-full w-full" tone={i % 3 === 0 ? 'ivory' : 'crimson'} />
        </span>
      ))}
    </div>
  )
}

const EMBERS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 5.7 + 9) % 94}%`,
  bottom: `${(i * 11) % 40}%`,
  size: 2 + (i % 4),
  delay: `-${(i * 0.9) % 9}s`,
  dur: `${6 + (i % 5)}s`,
  drift: `${(i % 2 ? 1 : -1) * (10 + (i % 4) * 14)}px`,
}))

export function EmberField({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: e.left,
            bottom: e.bottom,
            width: e.size,
            height: e.size,
            background: i % 3 === 0 ? '#F0CE8F' : '#D9563F',
            boxShadow: '0 0 8px 2px rgba(217,86,63,.5)',
            animation: `ember-rise ${e.dur} ease-in infinite`,
            animationDelay: e.delay,
            ['--drift' as string]: e.drift,
          }}
        />
      ))}
    </div>
  )
}
