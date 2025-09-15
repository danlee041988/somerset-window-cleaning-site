import Link from 'next/link'
import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  children: React.ReactNode
}

const base = 'inline-flex items-center justify-center rounded-md px-5 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-60 disabled:cursor-not-allowed'
const variants = {
  primary: 'bg-[var(--brand-red)] text-white hover:opacity-90 active:scale-95 focus:ring-brand-red',
  secondary: 'bg-white text-black hover:bg-neutral-200 active:scale-95 focus:ring-white',
  ghost: 'bg-transparent text-white hover:bg-white/10 active:scale-95 focus:ring-white'
}

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

// Test comment
// Final test for Claude review
// Test comment to trigger Claude Code Review workflow
export const testFix = 'Claude Action configuration fixed';
