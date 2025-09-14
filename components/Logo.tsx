import React from 'react'
import ImageWithFallback from './ImageWithFallback'
import { SWC_LOGO } from '@/content/image-manifest'

type Props = {
  className?: string
  height?: number
  width?: number
}

// Renders the actual brand file placed at /public/logo.png (or jpeg)
// For best results, export a transparent PNG around 600–900px wide.
export default function Logo({ className = '', height, width }: Props) {
  const style: React.CSSProperties = {}
  if (height) style.height = height
  if (width) style.width = width
  if (height && !width) style.width = 'auto'
  if (width && !height) style.height = 'auto'
  return (
    <ImageWithFallback
      src={SWC_LOGO}
      fallbackSrc="/images/logos/logo.svg"
      alt="Somerset Window Cleaning"
      className={`logo-blend ${className}`}
      style={{
        ...style,
        // Fallback for browsers that don't support mix-blend-mode
        mixBlendMode: 'lighten',
        filter: 'brightness(1.2) contrast(1.1)',
      }}
      width={width || 300}
      height={height || 100}
      priority={true}
    />
  )
}
