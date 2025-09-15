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
  
  // Use natural aspect ratio if only one dimension is specified - optimized for narrow/horizontal layout (20% larger)
  const imgWidth = width || (height ? undefined : 480)
  const imgHeight = height || (width ? undefined : 96)
  
  return (
    <ImageWithFallback
      src={SWC_LOGO}
      fallbackSrc="/images/logos/brand.svg"
      alt="Somerset Window Cleaning"
      className={`logo-blend transition-all duration-300 ${className}`}
      style={{
        ...style,
        objectFit: 'contain',
        // Seamless black header integration
        mixBlendMode: 'screen',
        filter: 'brightness(1.8) contrast(1.3) saturate(1.1)',
        background: 'transparent',
        border: 'none',
        outline: 'none',
      }}
      width={imgWidth}
      height={imgHeight}
      priority={true}
    />
  )
}
