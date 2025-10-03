import React from 'react'

type SpacingVariant = 'compact' | 'normal' | 'relaxed' | 'generous'

const spacingClasses: Record<SpacingVariant, string> = {
  compact: 'py-8 md:py-12',
  normal: 'py-12 md:py-16',
  relaxed: 'py-16 md:py-24',
  generous: 'py-16 md:py-24',
}

type SectionProps = {
  title?: string
  subtitle?: string
  children: React.ReactNode
  spacing?: SpacingVariant
  className?: string
  animationDelay?: number
} & Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'className'>

export default function Section({
  title,
  subtitle,
  children,
  className = '',
  spacing = 'normal',
  animationDelay = 0,
  style,
  ...rest
}: SectionProps) {
  const sectionClasses = `mx-auto max-w-6xl px-4 ${spacingClasses[spacing]} ${className}`.trim()

  const computedStyle = animationDelay
    ? { ...(style ?? {}), animationDelay: `${animationDelay}ms` }
    : style

  return (
    <section {...rest} style={computedStyle} className={sectionClasses}>
      {(title || subtitle) && (
        <header className="mb-8 md:mb-12">
          {title && <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--fg)]">{title}</h2>}
          {subtitle && <p className="mt-2 max-w-prose text-[color:var(--muted)]">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  )
}
