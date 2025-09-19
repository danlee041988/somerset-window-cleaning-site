import React from 'react'
import clsx from 'clsx'
import ImageWithFallback from './ImageWithFallback'

type Props = {
  className?: string
  height?: number
  width?: number
}

const PRIMARY_LOGO_SRC = '/images/logos/logo.png'
const FALLBACK_LOGO_SRC = '/images/logos/logo.svg'
const DEFAULT_WIDTH = 300
const DEFAULT_HEIGHT = 100
const ASPECT_RATIO = DEFAULT_WIDTH / DEFAULT_HEIGHT

export default function Logo({ className = '', height, width }: Props) {
  const resolvedWidth = width ?? (height ? Math.round(height * ASPECT_RATIO) : DEFAULT_WIDTH)
  const resolvedHeight = height ?? (width ? Math.round(width / ASPECT_RATIO) : DEFAULT_HEIGHT)

  return (
    <span className="inline-flex items-center justify-center">
      <ImageWithFallback
        src={PRIMARY_LOGO_SRC}
        fallbackSrc={FALLBACK_LOGO_SRC}
        alt="Somerset Window Cleaning"
        width={resolvedWidth}
        height={resolvedHeight}
        priority
        className={clsx('logo-blend block h-full w-full object-contain transition-all duration-300', className)}
      />
    </span>
  )
}
