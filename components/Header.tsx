"use client"

import React from 'react'
import Link from 'next/link'
import Button from './Button'
import Logo from './Logo'
import AreaCombobox from './AreaCombobox'
import BusinessHours from './BusinessHours'
import { FLATTENED_AREAS } from '@/content/service-areas'

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

// Header Call Button Component
const HeaderCallButton = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  
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
    const interval = setInterval(checkStatus, 60000)
    return () => clearInterval(interval)
  }, [])
  
  if (isOpen) {
    return (
      <a 
        href="tel:01458860339" 
        className="relative inline-flex flex-col items-center gap-1 px-4 py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-all duration-300 hover:scale-105 shadow-lg animate-pulse"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="hidden xl:inline">CALL NOW</span>
        </div>
        <div className="text-xs">We are Open</div>
        {/* Glowing ring */}
        <div className="absolute inset-0 bg-green-500/30 rounded-lg animate-ping"></div>
      </a>
    )
  }
  
  return (
    <a href="tel:01458860339" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      <span className="hidden xl:inline">01458 860339</span>
    </a>
  )
}

export default function Header() {
  const [open, setOpen] = React.useState(false)
  const [isBusinessOpen, setIsBusinessOpen] = React.useState(false)
  
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
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
    const interval = setInterval(checkStatus, 60000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black">
      {/* Main Header */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1">
          <Link href="/" className="flex items-center gap-3 text-white" aria-label="Somerset Window Cleaning home">
            <Logo className="h-14 md:h-16 lg:h-20 w-auto max-w-[240px] md:max-w-[300px] lg:max-w-[360px]" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            <div className="relative w-72">
              <AreaCombobox 
                areas={FLATTENED_AREAS}
                containerClassName="mx-0"
                placeholder="Check your postcode"
                showLabel={false}
                inputId="header-area-search"
              />
            </div>
            
            <nav className="flex items-center gap-4 xl:gap-6 text-sm">
              <Link href="/services" className="text-white/80 hover:text-white transition-colors">Services</Link>
              <Link href="/areas" className="text-white/80 hover:text-white transition-colors">Areas</Link>
              <Link href="/gallery" className="text-white/80 hover:text-white transition-colors">Gallery</Link>
              
              {/* Dynamic Call/Phone Button */}
              <HeaderCallButton />
              
              <a href="/get-in-touch" className="relative inline-flex flex-col items-center gap-1 px-4 py-2 bg-[var(--brand-red)] text-white font-bold rounded-lg hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg ml-2">
                <span>BOOK NOW</span>
                <div className="text-xs opacity-80">Free Quotes</div>
              </a>
            </nav>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 lg:hidden">
            <a href="tel:01458860339" className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/10 p-2 text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
            <button
              aria-label="Toggle menu"
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
              className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/10 p-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Trust Signals Sub-header */}
      <div className="hidden md:block bg-black/50 border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-1">
          <div className="flex items-center justify-center gap-3 md:gap-6 text-xs text-white/70">
            <BusinessHours variant="compact" />
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              4,000+ Customers
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold" style={{ color: '#FBBC05' }}>4.9★</span> 195+ Google Reviews
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Fully Insured
            </span>
          </div>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-sm pt-28">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <div className="mb-6">
              <AreaCombobox 
                areas={FLATTENED_AREAS}
                containerClassName="mx-0"
                placeholder="Enter your postcode or town"
                inputId="mobile-area-search"
              />
            </div>
            
            <div className="grid gap-4 text-lg">
              <Link href="/services" onClick={() => setOpen(false)} className="text-white/90 hover:text-white transition-colors py-2 border-b border-white/10">Services</Link>
              <Link href="/areas" onClick={() => setOpen(false)} className="text-white/90 hover:text-white transition-colors py-2 border-b border-white/10">Areas We Cover</Link>
              <Link href="/gallery" onClick={() => setOpen(false)} className="text-white/90 hover:text-white transition-colors py-2 border-b border-white/10">Gallery</Link>
              <Link href="/team" onClick={() => setOpen(false)} className="text-white/90 hover:text-white transition-colors py-2 border-b border-white/10">Meet the Team</Link>
              
              <div className="pt-4 space-y-4">
                <a href="tel:01458860339" className="flex items-center justify-center gap-3 w-full py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call 01458 860339
                </a>
                <Button href="/book-appointment" className="w-full justify-center">BOOK NOW</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
