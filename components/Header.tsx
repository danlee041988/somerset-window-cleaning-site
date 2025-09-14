"use client"

import React from 'react'
import Link from 'next/link'
import Button from './Button'
import Logo from './Logo'

export default function Header() {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center gap-3 text-white" aria-label="Somerset Window Cleaning home">
          <Logo className="h-20 md:h-24 lg:h-28" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/services" className="text-white/80 hover:text-white">Services</Link>
          <Link href="/gallery" className="text-white/80 hover:text-white">Gallery</Link>
          
          <Link href="/team" className="text-white/80 hover:text-white">Meet the Team</Link>
          <Link href="/contact" className="text-white/80 hover:text-white">Contact</Link>
          <Button href="/quote" className="ml-2">Quote me</Button>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <Button href="/quote" className="text-sm px-3 py-2">Quote me</Button>
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
      {open && (
        <div id="mobile-menu" className="md:hidden fixed inset-0 z-40 bg-black/90 pt-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-4 text-lg">
              <Link href="/services" onClick={() => setOpen(false)} className="text-white/90">Services</Link>
              <Link href="/gallery" onClick={() => setOpen(false)} className="text-white/90">Gallery</Link>
              <Link href="/team" onClick={() => setOpen(false)} className="text-white/90">Meet the Team</Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="text-white/90">Contact</Link>
              <div className="pt-2">
                <Button href="/quote" className="w-full justify-center">Quote me</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
