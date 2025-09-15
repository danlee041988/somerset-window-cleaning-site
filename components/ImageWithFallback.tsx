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

  // Don't show loading placeholder for lazy images since they should load seamlessly
  if (isLoading && !priority && loading !== 'lazy') {
    return (
      <div 
        className={`bg-white/10 animate-pulse flex items-center justify-center ${className}`}
        style={{ width: width || 'auto', height: height || 'auto', ...style }}
      >
        <svg className="w-8 h-8 text-white/30" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    )
  }

  // Build props object conditionally
  const imageProps: any = {
    src: error ? fallbackSrc : src,
    alt,
    width,
    height,
    className,
    fill,
    sizes,
    style,
    onError: handleError,
    onLoad: handleLoad,
  }

  // Only add priority OR loading, not both
  if (priority) {
    imageProps.priority = true
  } else {
    imageProps.loading = loading
  }

  return <Image {...imageProps} />
}