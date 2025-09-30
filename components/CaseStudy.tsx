import React from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'

type CaseStudyProps = {
  title?: string
  link?: string
  quote?: string
  cta?: string
}

const CASE_STUDY_IMAGE = '/images/photos/0842B2D1-78F3-406F-86C5-A69D64AC0280_1_102_o.jpeg'

export default function CaseStudy({
  title = 'Somerset Council Business Success Feature',
  link = 'https://www.somerset.gov.uk/business-economy-and-licences/somerset-enterprise-centres/case-studies/somerset-window-cleaning-company/',
  quote = "Dan's commitment to fantastic customer service and his willingness to innovate in a traditional industry are two huge factors in his meteoric growth.",
  cta = 'Read the case study',
}: CaseStudyProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <div className="grid gap-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent lg:grid-cols-[1.1fr_0.9fr]">

        {/* Left: Image with Council Logo Overlay */}
        <div className="relative aspect-[4/3] lg:aspect-auto">
          <Image
            src={CASE_STUDY_IMAGE}
            alt="Somerset Window Cleaning van at work site"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Somerset Council Logo Badge */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="inline-flex items-center gap-4 rounded-2xl border border-white/20 bg-black/60 px-6 py-4 backdrop-blur-xl">
              <Image
                src="https://somerset.concessionarytravelpass.co.uk/buspass/Content/Images/somerset/logo.png"
                alt="Somerset Council"
                width={120}
                height={60}
                className="h-12 w-auto"
              />
              <div className="border-l border-white/20 pl-4">
                <div className="text-sm font-semibold text-white">Somerset Council</div>
                <div className="text-xs text-white/60">Official Business Feature</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col justify-center space-y-6 p-8 md:p-12">

          {/* Badge */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            <span className="h-2 w-2 rounded-full bg-brand-red" />
            Case Study
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
            {title}
          </h2>

          {/* Description */}
          <p className="text-base leading-relaxed text-white/70">
            Somerset Window Cleaning was selected by Somerset Council to showcase how military discipline, customer-first values, and smart technology can transform a traditional trade into a thriving local business.
          </p>

          {/* Quote */}
          <div className="rounded-xl border border-white/10 bg-black/20 p-6">
            <div className="mb-3 text-brand-red/60">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
              </svg>
            </div>
            <blockquote className="text-sm leading-relaxed text-white/90">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/50">
              Alan Smith, Business Advisor
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4 pt-2">
            <Button
              href={link}
              variant="primary"
              className="group"
            >
              {cta}
              <svg
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">5 min read</span>
          </div>

        </div>
      </div>
    </section>
  )
}
