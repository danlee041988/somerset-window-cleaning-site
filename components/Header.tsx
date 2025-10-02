"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import { useBusinessStatus } from './BusinessHours'
import { analytics } from '@/lib/analytics'
import { pushToDataLayer } from '@/lib/dataLayer'

type ServiceLink = {
  title: string
  href: string
}

const SERVICE_LINKS: ServiceLink[] = [
  { title: 'Window Cleaning', href: '/services/window-cleaning' },
  { title: 'Gutter Clearing', href: '/services/gutter-clearing' },
  { title: 'Conservatory Roof Cleaning', href: '/services/conservatory-roof-cleaning' },
  { title: 'Fascias & Soffits', href: '/services/fascias-soffits-cleaning' },
  { title: 'Solar Panel Cleaning', href: '/services/solar-panel-cleaning' },
  { title: 'Commercial Cleaning', href: '/services/commercial-cleaning' },
]

type NavLinkItem = {
  type: 'link'
  label: string
  href: string
}

type NavServicesItem = {
  type: 'services'
  label: string
}

type NavItem = NavLinkItem | NavServicesItem

const NAV_ITEMS: NavItem[] = [
  { type: 'services', label: 'Services' },
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
  const [servicesOpen, setServicesOpen] = React.useState(false)
  const [supportsHover, setSupportsHover] = React.useState(false)
  const servicesButtonRef = React.useRef<HTMLButtonElement | null>(null)
  const servicesMenuRef = React.useRef<HTMLDivElement | null>(null)
  const servicesCloseTimeout = React.useRef<number | null>(null)
  const pathname = usePathname()

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  React.useEffect(() => {
    setOpen(false)
    setServicesOpen(false)
  }, [pathname])

  React.useEffect(() => {
    return () => {
      if (servicesCloseTimeout.current) {
        window.clearTimeout(servicesCloseTimeout.current)
      }
    }
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const updateHoverSupport = (event: MediaQueryListEvent | MediaQueryList) => {
      setSupportsHover(event.matches)
    }

    updateHoverSupport(mediaQuery)

    const handler = (event: MediaQueryListEvent) => updateHoverSupport(event)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const clearServicesCloseTimer = React.useCallback(() => {
    if (servicesCloseTimeout.current) {
      window.clearTimeout(servicesCloseTimeout.current)
      servicesCloseTimeout.current = null
    }
  }, [])

  const openServicesMenu = React.useCallback(() => {
    clearServicesCloseTimer()
    setServicesOpen(true)
  }, [clearServicesCloseTimer])

  const scheduleServicesClose = React.useCallback(() => {
    clearServicesCloseTimer()
    if (!supportsHover) return
    servicesCloseTimeout.current = window.setTimeout(() => {
      setServicesOpen(false)
    }, 150)
  }, [clearServicesCloseTimer, supportsHover])

  React.useEffect(() => {
    if (!servicesOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (
        servicesMenuRef.current?.contains(target) ||
        servicesButtonRef.current?.contains(target)
      ) {
        return
      }
      setServicesOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [servicesOpen])

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
            {NAV_ITEMS.map((item) => {
              if (item.type === 'services') {
                return (
                  <div
                    key={item.type}
                    className="relative"
                    onMouseEnter={supportsHover ? openServicesMenu : undefined}
                    onMouseLeave={supportsHover ? scheduleServicesClose : undefined}
                  >
                    <button
                      ref={servicesButtonRef}
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={servicesOpen}
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className={`group flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] transition-colors ${
                        servicesOpen ? 'text-white' : 'text-white/70 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                      }`}
                    >
                      {item.label}
                      <svg
                        className={`h-3 w-3 transition-transform ${servicesOpen ? 'rotate-180 text-brand-red' : 'text-white/50'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Services Dropdown */}
                    {servicesOpen && (
                      <div
                        ref={servicesMenuRef}
                        className="absolute left-1/2 top-full z-50 mt-4 w-64 -translate-x-1/2"
                      >
                        <div className="rounded-2xl border border-white/15 bg-black/95 p-4 shadow-2xl backdrop-blur-xl">
                          <div className="space-y-1">
                            {SERVICE_LINKS.map((service) => (
                              <Link
                                key={service.href}
                                href={service.href}
                                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-brand-red/20 hover:text-white"
                              >
                                {service.title}
                              </Link>
                            ))}
                          </div>
                          <div className="mt-3 border-t border-white/10 pt-3">
                            <Link
                              href="/services"
                              className="block rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red/10"
                            >
                              View All Services →
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-semibold uppercase tracking-[0.15em] text-white/70 transition-all hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                >
                  {item.label}
                </Link>
              )
            })}
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
                {NAV_ITEMS.map((item) => {
                  if (item.type === 'services') {
                    return (
                      <div key={item.type} className="space-y-1">
                        <button
                          onClick={() => setServicesOpen(!servicesOpen)}
                          className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white/80 transition-all hover:border-brand-red/40 hover:bg-brand-red/10 hover:text-white"
                        >
                          {item.label}
                          <svg
                            className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {servicesOpen && (
                          <div className="space-y-1 pl-4">
                            {SERVICE_LINKS.map((service) => (
                              <Link
                                key={service.href}
                                href={service.href}
                                onClick={() => setOpen(false)}
                                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-brand-red/10 hover:text-white"
                              >
                                {service.title}
                              </Link>
                            ))}
                            <Link
                              href="/services"
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red/10"
                            >
                              View All Services →
                            </Link>
                          </div>
                        )}
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white/80 transition-all hover:border-brand-red/40 hover:bg-brand-red/10 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  )
                })}
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
