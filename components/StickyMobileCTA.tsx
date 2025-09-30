'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after user scrolls down 300px
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="border-t border-white/10 bg-black/95 px-4 py-3 backdrop-blur-lg">
        <div className="flex gap-2">
          <Button
            href="/book-appointment?intent=quote"
            className="flex-1 text-sm"
          >
            Get Quote
          </Button>
          <Button
            href="tel:01458860339"
            variant="secondary"
            className="flex-1 text-sm"
          >
            Call Now
          </Button>
        </div>
      </div>
    </div>
  )
}
