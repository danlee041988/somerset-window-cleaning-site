'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface ImageWithFallbackProps {
  src: string
  fallbackSrc: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  fill?: boolean
  sizes?: string
  style?: React.CSSProperties
}

export default function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  className = '',
  priority = false,
  loading = 'lazy',
  fill = false,
  sizes,
  style
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // Build props object conditionally
  const imageProps: React.ComponentProps<typeof Image> = {
    src: error ? fallbackSrc : src,
    alt,
    width,
    height,
    className,
    sizes,
    style,
    onError: handleError,
    onLoad: handleLoad,
  }

  if (fill) {
    imageProps.fill = true
  }

  // Only add priority OR loading, not both
  if (priority) {
    imageProps.priority = true
  } else if (loading) {
    imageProps.loading = loading
  }
  const showPlaceholder = isLoading && !priority && loading === 'lazy'

  return (
    <>
      {showPlaceholder && (
        <div
          className="bg-white/10 animate-pulse flex items-center justify-center"
          style={{ width: width || 'auto', height: height || 'auto' }}
          data-testid="image-placeholder"
        />
      )}
      <Image {...imageProps} alt={alt} className={className} />
    </>
  )
}
