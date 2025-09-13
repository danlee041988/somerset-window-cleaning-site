"use client"

import React from 'react'

export default function LightboxGallery({
  images,
  captionPrefix = 'Somerset Window Cleaning photo',
}: {
  images: string[]
  captionPrefix?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)
  const closeBtnRef = React.useRef<HTMLButtonElement>(null)
  const openAt = (i: number) => {
    setIndex(i)
    setOpen(true)
  }
  const close = () => setOpen(false)
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setIndex((i) => (i + 1) % images.length)

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
  }, [open])

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((src, i) => (
          <button
            key={src}
            className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-red"
            onClick={() => openAt(i)}
          >
            <img
              src={src}
              alt={`${captionPrefix} ${i + 1}`}
              className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.03]"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
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
          <img
            src={images[index]}
            alt={`${captionPrefix} ${index + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg border border-white/10"
          />
          <button onClick={next} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-white/10 p-2 text-white hover:bg-white/20">›</button>
        </div>
      )}
    </div>
  )
}
