import React from 'react'

type SpacingVariant = 'compact' | 'normal' | 'relaxed' | 'generous'

const spacingClasses: Record<SpacingVariant, string> = {
  compact: 'py-8 md:py-12',
  normal: 'py-12 md:py-16', 
  relaxed: 'py-16 md:py-24',
  generous: 'py-20 md:py-32'
}

export default function Section({
  title,
  subtitle,
  children,
  className = '',
  spacing = 'normal',
  animationDelay = 0,
}: {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  spacing?: SpacingVariant
  animationDelay?: number
}) {
  const sectionClasses = `mx-auto max-w-6xl px-4 ${spacingClasses[spacing]} ${className}`

  return (
    <section className={sectionClasses}>
      {(title || subtitle) && (
        <header className="mb-8 md:mb-12">
          {title && (
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-2 text-white/70 max-w-prose">
              {subtitle}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  )
}

