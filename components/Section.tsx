import React from 'react'

export default function Section({
  title,
  subtitle,
  children,
  className = '',
}: {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`mx-auto max-w-6xl px-4 ${className}`}>
      {(title || subtitle) && (
        <header className="mb-8">
          {title && <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>}
          {subtitle && <p className="mt-2 text-white/70 max-w-prose">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  )
}

