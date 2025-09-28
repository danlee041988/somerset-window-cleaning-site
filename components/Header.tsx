"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import BusinessHours from './BusinessHours'
import { analytics } from '@/lib/analytics'
import { pushToDataLayer } from '@/lib/dataLayer'

type ServiceLink = {
  title: string
  href: string
}

const SERVICE_LINKS: ServiceLink[] = [
  { title: 'Window Cleaning', href: '/services/window-cleaning' },
  { title: 'Gutter Clearing', href: '/services/gutter-clearing' },
  { title: 'Fascias & Soffits Cleaning', href: '/services/fascias-soffits-cleaning' },
  { title: 'Conservatory Roof Cleaning', href: '/services/conservatory-roof-cleaning' },
  { title: 'Solar Panel Cleaning', href: '/services/solar-panel-cleaning' },
  { title: 'External Commercial Cleaning', href: '/services/commercial-cleaning' },
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
  { type: 'link', label: 'Quote', href: '/book-appointment' },
  { type: 'link', label: 'Gallery', href: '/gallery' },
  { type: 'link', label: 'Contact', href: '/contact' },
]

// UK Bank Holidays
const UK_BANK_HOLIDAYS = [
  // 2024
  '2024-01-01', '2024-03-29', '2024-04-01', '2024-05-06', '2024-05-27', '2024-08-26', '2024-12-25', '2024-12-26',
  // 2025
  '2025-01-01', '2025-04-18', '2025-04-21', '2025-05-05', '2025-05-26', '2025-08-25', '2025-12-25', '2025-12-26',
  // 2026
  '2026-01-01', '2026-04-03', '2026-04-06', '2026-05-04', '2026-05-25', '2026-08-31', '2026-12-25', '2026-12-28',
]

const isBankHoliday = (date: Date): boolean => {
  const dateString = date.toISOString().split('T')[0]
  return UK_BANK_HOLIDAYS.includes(dateString)
}

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
  const [isOpen, setIsOpen] = React.useState(false)

  const handleCallClick = React.useCallback(() => {
    analytics.quoteRequest('phone')
    pushToDataLayer('phone_click', { source: 'header_call_button' })
  }, [])

  React.useEffect(() => {
    const checkStatus = () => {
      const now = new Date()
      const currentDay = now.getDay()
      const currentTime = now.getHours() * 100 + now.getMinutes()

      // Closed on weekends
      if (currentDay === 0 || currentDay === 6) {
        setIsOpen(false)
        return
      }

      // Closed on bank holidays
      if (isBankHoliday(now)) {
        setIsOpen(false)
        return
      }

      // Monday-Friday: 9:00 AM to 4:00 PM
      setIsOpen(currentTime >= 900 && currentTime < 1600)
    }

    checkStatus()
    const interval = window.setInterval(checkStatus, 60000)
    return () => window.clearInterval(interval)
  }, [])

  if (!isOpen) return null

  const baseClasses = `group relative inline-flex shrink-0 items-center gap-2.5 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-left text-white/80 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.9)] transition-all duration-300 hover:border-white/25 hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40 ${className}`

  return (
    <a
      href="tel:01458860339"
      className={baseClasses}
      aria-label="Call our team (we are open)"
      onClick={handleCallClick}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white/70">
        <PhoneIcon className="h-4 w-4" />
      </span>
      <span className="flex flex-col gap-0.5 text-left">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/75 whitespace-nowrap">
          Call our team
        </span>
        <span className="text-sm font-semibold tracking-[0.18em] text-white/65 whitespace-nowrap">
          01458 860 339
        </span>
      </span>
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-emerald-300 whitespace-nowrap">Now Open</span>
      <span
        className="pointer-events-none absolute inset-x-4 -bottom-1 h-[2px] rounded-full bg-gradient-to-r from-brand-red via-brand-red/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
    </a>
  )
}

export default function Header() {
  const [open, setOpen] = React.useState(false)
  const [isBusinessOpen, setIsBusinessOpen] = React.useState(false)
  const [servicesOpen, setServicesOpen] = React.useState(false)
  const [supportsHover, setSupportsHover] = React.useState(false)
  const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({})
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
    const checkStatus = () => {
      const now = new Date()
      const currentDay = now.getDay()
      const currentTime = now.getHours() * 100 + now.getMinutes()

      // Closed on weekends
      if (currentDay === 0 || currentDay === 6) {
        setIsBusinessOpen(false)
        return
      }

      // Closed on bank holidays
      if (isBankHoliday(now)) {
        setIsBusinessOpen(false)
        return
      }

      // Monday-Friday: 9:00 AM to 4:00 PM
      setIsBusinessOpen(currentTime >= 900 && currentTime < 1600)
    }

    checkStatus()
    const interval = window.setInterval(checkStatus, 60000)
    return () => window.clearInterval(interval)
  }, [])

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
    if (!supportsHover) {
      return
    }
    servicesCloseTimeout.current = window.setTimeout(() => {
      setServicesOpen(false)
    }, 120)
  }, [clearServicesCloseTimer, supportsHover])

  const handleServicesKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setServicesOpen(false)
      servicesButtonRef.current?.focus()
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openServicesMenu()
      const firstLink = servicesMenuRef.current?.querySelector<HTMLAnchorElement>('a')
      firstLink?.focus()
    }
  }, [openServicesMenu])

  const updateMenuPosition = React.useCallback(() => {
    if (!servicesButtonRef.current || !servicesMenuRef.current) return
    const triggerRect = servicesButtonRef.current.getBoundingClientRect()
    const menuRect = servicesMenuRef.current.getBoundingClientRect()
    const parentRect = servicesButtonRef.current.parentElement?.getBoundingClientRect()
    if (!parentRect) return

    const viewportWidth = window.innerWidth
    const gutter = 16
    const desiredLeft = triggerRect.left + triggerRect.width / 2 - menuRect.width / 2
    const clampedViewportLeft = Math.max(gutter, Math.min(desiredLeft, viewportWidth - menuRect.width - gutter))
    const relativeLeft = clampedViewportLeft - parentRect.left

    setMenuStyle({ left: `${relativeLeft}px`, right: 'auto' })
  }, [])

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

  React.useEffect(() => {
    if (!servicesOpen) return

    const raf = window.requestAnimationFrame(updateMenuPosition)
    window.addEventListener('resize', updateMenuPosition)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', updateMenuPosition)
    }
  }, [servicesOpen, updateMenuPosition])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="relative bg-black/95">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 px-4 py-1 sm:gap-5 sm:py-2 md:px-6 lg:py-2.5">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center rounded-md px-3 py-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
            aria-label="Somerset Window Cleaning home"
          >
            <Logo className="h-10 w-[140px] sm:h-12 sm:w-[180px] md:h-[3.5rem] md:w-[220px] lg:h-[4rem] lg:w-[240px]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden flex-1 items-center justify-end gap-6 lg:flex">
            <nav className="flex items-center gap-6">
              {NAV_ITEMS.map((item) => {
                if (item.type === 'services') {
                  return (
                    <div
                      key={item.type}
                      className="relative"
                      onMouseEnter={supportsHover ? openServicesMenu : undefined}
                      onMouseLeave={supportsHover ? scheduleServicesClose : undefined}
                      onFocusCapture={openServicesMenu}
                      onBlurCapture={scheduleServicesClose}
                    >
                      <button
                        ref={servicesButtonRef}
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={servicesOpen}
                        aria-controls="services-mega-menu"
                        onClick={() => (servicesOpen ? setServicesOpen(false) : openServicesMenu())}
                        onKeyDown={handleServicesKeyDown}
                        className={`group relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] transition-colors ${
                          servicesOpen ? 'text-white' : 'text-white/70 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        <svg
                          className={`h-2.5 w-2.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180 text-brand-red' : 'text-white/60'}`}
                          viewBox="0 0 12 8"
                          fill="none"
                          aria-hidden
                        >
                          <path d="M10.667.667 6 5.333 1.333.667 0 2l6 6 6-6L10.667.667Z" fill="currentColor" />
                        </svg>
                        <span
                          className={`pointer-events-none mt-1 h-px w-full origin-left bg-gradient-to-r from-brand-red via-brand-red/60 to-transparent transition-opacity duration-300 ${
                            servicesOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      <div
                        ref={servicesMenuRef}
                        id="services-mega-menu"
                        style={menuStyle}
                        className={`absolute top-full z-50 hidden w-[min(640px,calc(100vw-2rem))] pt-5 transition-all duration-300 lg:block ${
                          servicesOpen ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-4'
                        }`}
                        role="region"
                        aria-label="Somerset Window Cleaning services"
                      >
                        <div className="overflow-hidden rounded-3xl border border-white/12 bg-black/95 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)]">
                          <div className="relative">
                            <div className="pointer-events-none absolute -left-32 top-[-120px] h-64 w-64 rounded-full bg-brand-red/20 blur-[120px]" aria-hidden />
                            <div className="pointer-events-none absolute -right-24 bottom-[-120px] h-72 w-72 rounded-full bg-white/10 blur-[140px]" aria-hidden />
                            <div className="relative px-5 py-6">
                              <ul className="space-y-2">
                                {SERVICE_LINKS.map((service) => (
                                  <li key={service.href}>
                                    <Link
                                      href={service.href}
                                      className="flex items-center justify-between rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-white/80 transition hover:border-brand-red/60 hover:bg-brand-red/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                                    >
                                      <span>{service.title}</span>
                                      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" aria-hidden>
                                        <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/70 transition-colors hover:text-white"
                  >
                    <span>{item.label}</span>
                    <span
                      className="pointer-events-none h-px w-full max-w-[2.5rem] bg-gradient-to-r from-brand-red via-brand-red/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                )
              })}
            </nav>
            <div className="flex flex-wrap items-center justify-end gap-4 lg:flex-nowrap">
              <HeaderCallButton className="hidden lg:inline-flex lg:min-w-[12.5rem] xl:min-w-[16.5rem]" />
              <div className="hidden shrink-0 lg:flex lg:flex-col lg:items-end lg:gap-1.5 lg:text-right">
                <Link
                  href="/book-appointment?intent=quote"
                  className="inline-flex min-h-[2.8rem] min-w-[11rem] shrink-0 items-center justify-center rounded-[1.5rem] bg-brand-red px-5 text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-white whitespace-nowrap shadow-[0_24px_55px_-32px_rgba(225,29,42,0.8)] transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40 xl:min-h-[3.1rem] xl:min-w-[14rem] xl:rounded-[1.75rem] xl:px-6 xl:text-[0.65rem] xl:shadow-[0_28px_65px_-35px_rgba(225,29,42,0.9)]"
                >
                  Request Quote
                </Link>
                <span className="text-[0.52rem] uppercase tracking-[0.32em] text-white/50 xl:text-[0.6rem]">
                  Free quotes • fast response
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="tel:01458860339"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-brand-red/50 hover:bg-brand-red/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red sm:hidden"
              aria-label="Call Somerset Window Cleaning"
            >
              <PhoneIcon className="h-5 w-5" />
            </a>
            <HeaderCallButton className="hidden sm:inline-flex" />
            <button
              aria-label="Toggle menu"
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/10 p-2.5 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Desktop trust ticker */}
        <div className="hidden justify-center px-4 pb-1 md:flex md:px-6">
          <div className="pointer-events-auto mx-auto mt-2 flex w-full max-w-[1280px] items-center justify-center gap-4 rounded-[1.9rem] border border-white/8 bg-black/70 px-5 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/55 shadow-[0_12px_28px_-24px_rgba(0,0,0,0.75)]">
            <div className="flex items-center gap-2 text-white/65">
              <span className={`relative inline-flex h-2 w-2 shrink-0 rounded-full ${isBusinessOpen ? 'bg-green-400' : 'bg-red-400'}`}>
                <span className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ backgroundColor: isBusinessOpen ? '#4ade80' : '#f87171' }} />
              </span>
              {isBusinessOpen ? 'Open now • Call us' : 'Closed now • Message us'}
            </div>
            <div className="flex items-center gap-2 text-white/65">
              <svg className="h-3 w-3 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              4,000+ customers
            </div>
            <div className="flex items-center gap-2 px-2.5 text-white/65">
              <span className="font-bold text-brand-gold">4.9★</span>
              195+ Google reviews
            </div>
            <div className="flex items-center gap-2 text-white/65">
              <svg className="h-3 w-3 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Fully insured professionals
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 overflow-y-auto bg-black/95 backdrop-blur-sm pt-28"
        >
          <div className="mx-auto w-full max-w-md px-4 pb-16">
            <div className="rounded-3xl border border-white/10 bg-black/80 p-6 shadow-[0_40px_60px_-40px_rgba(0,0,0,0.95)]">
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">Our services</h3>
                  <ul className="mt-5 space-y-2">
                    {SERVICE_LINKS.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-xl border border-white/12 bg-black/40 px-4 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white/85 transition hover:border-brand-red/60 hover:bg-brand-red/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                        >
                          <span>{item.title}</span>
                          <svg className="h-3.5 w-3.5 transition-transform hover:translate-x-1" viewBox="0 0 20 20" fill="none" aria-hidden>
                            <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 grid gap-3">
                    <Link
                      href="/services"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-brand-red/50 hover:bg-brand-red/10"
                    >
                      View all services
                    </Link>
                  </div>
                </div>

                <div className="space-y-3">
                  {NAV_ITEMS.filter((navItem): navItem is NavLinkItem => navItem.type === 'link').map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white/70 transition-all hover:border-brand-red/50 hover:bg-brand-red/10 hover:text-white"
                    >
                      <span>{item.label}</span>
                      <span
                        className="pointer-events-none h-[2px] w-10 rounded-full bg-gradient-to-r from-brand-red via-brand-red/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <HeaderCallButton className="w-full justify-center" />
                <Button
                  href="/book-appointment?intent=quote"
                  className="w-full justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em]"
                >
                  Request Quote
                </Button>
                <Button
                  href="/contact"
                  variant="ghost"
                  className="w-full justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em]"
                >
                  Message us
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
