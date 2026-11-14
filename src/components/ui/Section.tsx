import type { ReactNode } from 'react'

export function Stars({
  count = 5,
  className = '',
  size = 14,
}: {
  count?: number
  className?: string
  size?: number
}) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`${count} star rarity`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" className="rarity-star" aria-hidden="true">
          <path
            d="M12 2.6l2.75 6.2 6.75.62-5.1 4.5 1.5 6.62L12 17.1l-5.9 3.44 1.5-6.62-5.1-4.5 6.75-.62L12 2.6z"
            fill="currentColor"
          />
        </svg>
      ))}
    </span>
  )
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
  children,
  className = '',
}: {
  index: string
  eyebrow: string
  title: ReactNode
  accent?: string
  description?: string
  align?: 'left' | 'center'
  children?: ReactNode
  className?: string
}) {
  return (
    <header
      className={`relative ${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}
    >
      <div
        className={`flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}
        data-reveal
      >
        <span className="font-display text-[11px] tracking-[0.3em] text-gold/60">{index}</span>
        <span className="h-px w-8 bg-gold/40" />
        <span className="eyebrow">{eyebrow}</span>
      </div>

      <h2
        className="display-title mt-5 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.4rem]"
        data-reveal
      >
        {title}
        {accent ? (
          <>
            {' '}
            <span className="script-accent gold-text">{accent}</span>
          </>
        ) : null}
      </h2>

      {description ? (
        <p
          className={`mt-5 font-serif text-lg leading-relaxed text-ivory/65 sm:text-xl ${
            align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-xl'
          }`}
          data-reveal
        >
          {description}
        </p>
      ) : null}

      {children}
    </header>
  )
}

export function SectionShell({
  id,
  children,
  className = '',
  as: Tag = 'section',
}: {
  id: string
  children: ReactNode
  className?: string
  as?: 'section' | 'div'
}) {
  return (
    <Tag id={id} className={`relative scroll-mt-20 px-5 py-24 sm:px-8 sm:py-28 lg:py-36 ${className}`}>
      <div className="mx-auto w-full max-w-[1440px]">{children}</div>
    </Tag>
  )
}

export function MetaChip({
  icon,
  label,
  value,
}: {
  icon?: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      {icon ? <span className="text-gold/80">{icon}</span> : null}
      <span className="flex flex-col leading-tight">
        <span className="stat-label">{label}</span>
        <span className="font-sans text-sm text-ivory/90">{value}</span>
      </span>
    </div>
  )
}
