import React from 'react'
import Image from 'next/image'

type CaseStudyProps = {
  title?: string
  link?: string
  bullets?: string[]
  quote?: string
  cta?: string
}

const CASE_STUDY_IMAGE = '/images/photos/0842B2D1-78F3-406F-86C5-A69D64AC0280_1_102_o.jpeg'

const defaultBullets = [
  'Grown from zero to 6 employees in under 3 years',
  'State-of-the-art cleaning technology and equipment',
  'Founded by former Royal Marine Commando Dan Lee',
  'Serving homes and businesses across Somerset',
]

const quoteAttribution = 'Alan Smith, Business Advisor'

function CouncilLogo() {
  return (
    <div
      className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/90 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.7)] backdrop-blur"
      style={{ background: 'rgba(255,255,255,0.06)' }}
    >
      <Image
        src="https://somerset.concessionarytravelpass.co.uk/buspass/Content/Images/somerset/logo.png"
        alt="Somerset Council"
        width={98}
        height={48}
        className="h-10 w-auto opacity-80"
      />
      <div className="hidden text-xs font-medium tracking-wide text-white/70 sm:flex sm:flex-col">
        <span>Somerset Council</span>
        <span className="text-white/50">Official Partner</span>
      </div>
    </div>
  )
}

function BulletChecklist({
  bullets,
  className,
  iconVariant = 'filled',
}: {
  bullets: string[]
  className?: string
  iconVariant?: 'filled' | 'outline'
}) {
  return (
    <div className={className}>
      {bullets.map((bullet) => (
        <div key={bullet} className="flex items-start gap-3 rounded-xl bg-white/0 p-0">
          <span
            className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border"
            style={{
              background:
                iconVariant === 'filled'
                  ? 'linear-gradient(140deg, rgba(225,29,42,0.45), rgba(11,11,11,0.65))'
                  : 'rgba(8, 9, 12, 0.75)',
              borderColor:
                iconVariant === 'filled'
                  ? 'rgba(225,29,42,0.55)'
                  : 'rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.9)',
              boxShadow:
                iconVariant === 'filled'
                  ? '0 0 16px rgba(225,29,42,0.3)'
                  : '0 0 0 rgba(0,0,0,0)',
            }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span className="text-sm leading-relaxed text-white/90">{bullet}</span>
        </div>
      ))}
    </div>
  )
}

function QuoteCard({
  quote,
  attribution,
  className = '',
  light = false,
}: {
  quote: string
  attribution: string
  className?: string
  light?: boolean
}) {
  return (
    <figure
      className={`relative overflow-hidden rounded-2xl border ${
        light
          ? 'border-black/10 bg-white/90 text-slate-800'
          : 'border-white/12 bg-black/45 text-white'
      } p-6 shadow-[0_26px_45px_-36px_rgba(0,0,0,0.85)] backdrop-blur ${className}`}
    >
      <div className="mb-4 flex justify-start text-brand-red/60">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
        </svg>
      </div>
      <blockquote className={`text-sm leading-relaxed ${light ? 'text-slate-700' : 'text-white/90'}`}>
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div
        className={`mt-5 text-xs font-semibold tracking-wide uppercase ${
          light ? 'text-slate-500' : 'text-white/60'
        }`}
      >
        {attribution}
      </div>
    </figure>
  )
}

export default function CaseStudy({
  title = 'Featured Business Success Story',
  link = 'https://www.somerset.gov.uk/business-economy-and-licences/somerset-enterprise-centres/case-studies/somerset-window-cleaning-company/',
  bullets = defaultBullets,
  quote = "Dan's commitment to fantastic customer service and his willingness to innovate in a traditional industry are two huge factors in his meteoric growth.",
  cta = 'Read our story',
}: CaseStudyProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <div className="feature-card grid gap-10 text-white lg:grid-cols-[1.05fr_0.6fr]">
        <div className="feature-card__content space-y-10 p-10 md:p-14">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red/80">
              <span className="h-2 w-2 rounded-full bg-brand-red" /> Somerset Council Feature
            </div>
            <CouncilLogo />
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl font-semibold tracking-tight md:text-[42px]">
              {title}
            </h3>
            <p className="text-base leading-relaxed text-white/70">
              Somerset Window Cleaning was hand-picked by Somerset Council to demonstrate what happens when elite training meets relentless customer care. This is the playbook behind our rapid growth.
            </p>
          </div>

          <BulletChecklist bullets={bullets} className="grid gap-4 md:grid-cols-2" iconVariant="outline" />

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-white/90"
            >
              {cta}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
              </svg>
            </a>
            <span className="text-xs uppercase tracking-[0.25em] text-white/40">5 minute read</span>
          </div>
        </div>

        <div className="relative flex flex-col justify-between border-t border-white/10 bg-black/35 backdrop-blur md:border-t-0 md:border-l">
          <div className="p-10 md:p-14">
            <QuoteCard quote={quote} attribution={quoteAttribution} />
          </div>
          <div
            className="border-t border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent p-10 md:p-14"
          >
            <div className="rounded-3xl border border-white/12 bg-black/40 p-8 text-white/80 shadow-[0_30px_60px_-45px_rgba(0,0,0,0.85)]">
              <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/12 bg-black/50">
                <Image
                  src={CASE_STUDY_IMAGE}
                  alt="Somerset Window Cleaning van outside a Somerset home"
                  width={1024}
                  height={768}
                  className="h-48 w-full object-cover md:h-64"
                  priority={false}
                />
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/40"
                  aria-hidden
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red/80">
                Case study highlights
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {[{
                  value: '4k+',
                  label: 'Somerset properties cared for since launch'
                }, {
                  value: '195+',
                  label: 'Google reviews at a 4.9★ rating'
                }, {
                  value: '100%',
                  label: 'Fully insured window and exterior specialists'
                }].map((item) => (
                  <div key={item.label} className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <span className="text-3xl font-semibold text-white">{item.value}</span>
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-red/70">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-white/70">
                These results come from pairing military-grade discipline with neighbourly service—exactly what the council looked for when showcasing Somerset success stories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
