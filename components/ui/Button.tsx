import Link from 'next/link'
import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  children: React.ReactNode
}

const base =
  'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-[0.2em] transition-all duration-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed'

const variants = {
  primary:
    'bg-[var(--accent)] text-[var(--bg)] shadow-[0_18px_34px_-22px_rgba(255,45,85,0.45)] hover:brightness-95 active:scale-95 focus:ring-2 focus:ring-[color:var(--ring)] focus:ring-offset-2 focus:ring-offset-[color:var(--bg)]',
  secondary:
    'glass-card hover:border-white/20 hover:bg-white/12 active:scale-95 focus:ring-2 focus:ring-[color:var(--ring)] focus:ring-offset-2 focus:ring-offset-[color:var(--bg)] text-[var(--fg)]',
  ghost:
    'border border-white/20 text-[var(--fg)] hover:border-white/30 hover:bg-white/10 active:scale-95 focus:ring-2 focus:ring-[color:var(--ring)] focus:ring-offset-2 focus:ring-offset-[color:var(--bg)]',
} as const

export default function Button({ href, variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
