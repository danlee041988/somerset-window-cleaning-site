import React from 'react'
import Image from 'next/image'

type Props = {
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
  bullets?: string[]
}

export default function ServiceCard({ title, description, imageSrc, imageAlt, bullets }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/10 transition hover:bg-white/15">
      {imageSrc && (
        <div className="relative aspect-[16/9]">
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-white/80">{description}</p>
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
