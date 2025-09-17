import React from 'react'
import ImageWithFallback from './ImageWithFallback'

type Props = {
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
  bullets?: string[]
}

export default function ServiceCard({ title, description, imageSrc, imageAlt, bullets }: Props) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/10 transition hover:bg-white/15">
      {imageSrc && (
        <div className="relative aspect-[16/9]">
          <ImageWithFallback
            src={imageSrc}
            fallbackSrc="/images/photos/photo02.jpg"
            alt={imageAlt || title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 flex-1 text-sm text-white/80">{description}</p>
        {bullets && bullets.length > 0 && (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/75">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )}
