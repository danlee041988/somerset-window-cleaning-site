"use client"

import React from 'react'
import PostcodeChecker from '@/components/features/contact/PostcodeChecker'

export default function HeroPostcodeToggle() {
  const [isOpen, setIsOpen] = React.useState(false)

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 shadow-md transition hover:bg-white/15"
      >
        <span className="h-2 w-2 rounded-full bg-brand-red" />
        Check coverage
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <span className="flex-1 text-sm font-semibold text-white/75">
          Check your postcode
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-xs font-semibold uppercase tracking-[0.15em] text-white/55 hover:text-white/80"
        >
          Close
        </button>
      </div>
      <div className="mt-3">
        <PostcodeChecker variant="hero" placeholder="Enter your postcode (e.g. BA5 1TX)" />
      </div>
    </div>
  )
}
