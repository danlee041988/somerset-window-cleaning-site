"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import { useBusinessStatus } from './BusinessHours'
import { analytics } from '@/lib/analytics'
import { pushToDataLayer } from '@/lib/dataLayer'

type NavItem = {
  type: 'link'
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { type: 'link', label: 'Areas', href: '/areas' },
  { type: 'link', label: 'Team', href: '/team' },
  { type: 'link', label: 'Gallery', href: '/gallery' },
  { type: 'link', label: 'Contact', href: '/contact' },
]

const PhoneIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const HeaderCallButton = ({ className = '' }: { className?: string }) => {
  const businessStatus = useBusinessStatus()

  const handleCallClick = React.useCallback(() => {
    analytics.quoteRequest('phone')
    pushToDataLayer('phone_click', { source: 'header_call_button' })
  }, [])

  return (
    <a
      href="tel:01458860339"
      className={`group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/60 px-4 py-2.5 transition-all hover:border-brand-red/40 hover:bg-black/80 ${className}`}
      aria-label="Call Somerset Window Cleaning"
      onClick={handleCallClick}
    >
      <PhoneIcon className="h-4 w-4 text-white/70" />
      <span className="text-sm font-semibold text-white">01458 860 339</span>
      {businessStatus.isOpen && (
        <span className="flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
          </span>
          Open
        </span>
      )}
    </a>
  )
}

export default function Header() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4 md:h-20 md:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 rounded-lg px-2 py-2 transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
            aria-label="Somerset Window Cleaning home"
          >
            <Logo className="h-7 w-[120px] md:h-12 md:w-[200px]" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold uppercase tracking-[0.15em] text-white/70 transition-all hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <HeaderCallButton />
            <Button
              href="/book-appointment?intent=quote"
              className="px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.15em]"
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <HeaderCallButton className="hidden sm:inline-flex" />
            <a
              href="tel:01458860339"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-brand-red/50 hover:bg-brand-red/20 sm:hidden"
              aria-label="Call us"
            >
              <PhoneIcon className="h-5 w-5" />
            </a>
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-brand-red/50 hover:bg-brand-red/20"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 top-20 z-40 bg-black/95 backdrop-blur-lg lg:hidden">
          <div className="mx-auto max-w-md px-4 py-8">
            <div className="space-y-6">
              {/* Nav Links */}
              <div className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white/80 transition-all hover:border-brand-red/40 hover:bg-brand-red/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile CTAs */}
              <div className="space-y-3">
                <Button
                  href="/book-appointment?intent=quote"
                  className="w-full justify-center py-3 text-sm font-semibold uppercase tracking-[0.15em]"
                >
                  Get Quote
                </Button>
                <Button
                  href="/contact"
                  variant="secondary"
                  className="w-full justify-center py-3 text-sm font-semibold uppercase tracking-[0.15em]"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
