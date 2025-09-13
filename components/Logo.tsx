import React from 'react'

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
    <img
      src="/logo.svg"
      alt="Somerset Window Cleaning"
      className={`bg-black ${className}`}
      style={style}
    />
  )
}
