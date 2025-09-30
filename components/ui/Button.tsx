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
    'bg-[var(--accent)] text-white shadow-[0_18px_34px_-22px_rgba(225,29,42,0.55)] hover:shadow-[0_22px_40px_-20px_rgba(225,29,42,0.75)] hover:brightness-110 active:scale-95 focus:ring-2 focus:ring-[color:var(--ring)] focus:ring-offset-2 focus:ring-offset-[color:var(--bg)]',
  secondary:
    'glass-card hover:border-white/25 hover:bg-white/8 hover:shadow-[0_0_20px_-8px_rgba(225,29,42,0.15)] active:scale-95 focus:ring-2 focus:ring-[color:var(--ring)] focus:ring-offset-2 focus:ring-offset-[color:var(--bg)] text-[var(--fg)]',
  ghost:
    'border border-white/20 text-[var(--fg)] hover:border-brand-red/40 hover:bg-white/8 hover:shadow-[0_0_16px_-6px_rgba(225,29,42,0.2)] active:scale-95 focus:ring-2 focus:ring-[color:var(--ring)] focus:ring-offset-2 focus:ring-offset-[color:var(--bg)]',
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
