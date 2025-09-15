"use client"

import React from 'react'
import Image from 'next/image'

export default function LightboxGallery({
  images,
  captionPrefix = 'Somerset Window Cleaning photo',
}: {
  images: string[]
  captionPrefix?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)
  const overlayRef = React.useRef<HTMLDivElement>(null)
  const closeBtnRef = React.useRef<HTMLButtonElement>(null)
  const openAt = (i: number) => {
    setIndex(i)
    setOpen(true)
  }
  const close = () => setOpen(false)
  const prev = React.useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = React.useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    if (open) {
      document.body.style.overflow = 'hidden'
      // focus close on open for keyboard users
      setTimeout(() => closeBtnRef.current?.focus(), 0)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, prev, next])

  // Basic focus trap within overlay when open
  React.useEffect(() => {
    if (!open) return
    const el = overlayRef.current
    if (!el) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusables = el.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          ;(last as HTMLElement).focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        ;(first as HTMLElement).focus()
      }
    }
    el.addEventListener('keydown', onKeyDown as any)
    return () => el.removeEventListener('keydown', onKeyDown as any)
  }, [open])

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src}
            className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-red"
            onClick={() => openAt(i)}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={src}
                alt={`${captionPrefix} ${i + 1}`}
                fill
                className="object-cover transition group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority={false}
              />
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          ref={overlayRef}
        >
          <button
            ref={closeBtnRef}
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 rounded bg-white/10 px-3 py-1 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brand-red"
          >
            Close
          </button>
          <button onClick={prev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 rounded bg-white/10 p-2 text-white hover:bg-white/20">‹</button>
          <Image
            src={images[index]}
            alt={`${captionPrefix} ${index + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg border border-white/10"
            width={1200}
            height={900}
            style={{
              maxHeight: '85vh',
              maxWidth: '90vw',
              width: 'auto',
              height: 'auto'
            }}
          />
          <button onClick={next} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-white/10 p-2 text-white hover:bg-white/20">›</button>
        </div>
      )}
    </div>
  )
}
