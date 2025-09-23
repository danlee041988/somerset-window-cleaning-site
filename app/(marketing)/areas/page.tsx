import Link from 'next/link'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import PostcodeChecker from '@/components/features/contact/PostcodeChecker'
import { findFrequencyForPostcode } from '@/content/route-schedule'
import { POSTCODE_AREAS, buildAreaDomId, AREA_DETAIL_ROUTES } from '@/content/service-areas'

export const revalidate = 0

interface NextVisitDetails {
  dateLabel: string
  day: string
  strapline: string
}

const formatTodayIso = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const deriveLookupPostcodes = (rawCode: string): string[] => {
  const normalized = rawCode.toUpperCase().replace(/\s+/g, '')
  if (!normalized) return []

  const segments = normalized.split('/')
  const prefix = segments[0]?.match(/^[A-Z]+/i)?.[0]?.toUpperCase() ?? ''
  const candidates = new Set<string>()

  segments.forEach((segment) => {
    const part = segment.trim().toUpperCase()
    if (!part) return

    if (/^[A-Z]{1,2}\d/.test(part)) {
      candidates.add(part)
      return
    }

    if (/^\d/.test(part) && prefix) {
      candidates.add(`${prefix}${part}`)
    }
  })

  return Array.from(candidates)
}

const resolvePrimaryPostcode = (rawCode: string): string => {
  if (!rawCode) return ''
  const lookupCodes = deriveLookupPostcodes(rawCode)
  if (lookupCodes.length > 0) {
    return lookupCodes[0]
  }

  return rawCode.toUpperCase().replace(/\s+/g, '')
}

const getNextVisitForArea = (code: string, todayIso: string): NextVisitDetails | null => {
  const lookupCodes = deriveLookupPostcodes(code)

  for (const lookupCode of lookupCodes) {
    const frequency = findFrequencyForPostcode(lookupCode)
    if (!frequency) continue

    const timeline = frequency.matches
      .flatMap((match) =>
        match.dates.map((date) => ({
          date,
          day: match.day,
        })),
      )
      .sort((a, b) => a.date.iso.localeCompare(b.date.iso))

    if (!timeline.length) continue

    const upcoming =
      timeline.find((entry) => entry.date.iso >= todayIso) ?? timeline[0]

    if (!upcoming) continue

    return {
      dateLabel: upcoming.date.label,
      day: upcoming.day,
      strapline: frequency.strapline,
    }
  }

  return null
}

export const metadata = {
  title: 'Areas We Cover | Somerset Window Cleaning Service Areas',
  description:
    'Professional window cleaning across Somerset. BA postcodes (Wells, Glastonbury), BS postcodes (Weston, Cheddar), TA postcodes (Taunton, Bridgwater). Check if we cover your area.',
  keywords:
    'BA5 window cleaner, BS27 window cleaning, TA6 cleaning services, Somerset window cleaning areas, Wells, Glastonbury, Cheddar, Street, Bridgwater, Taunton, Yeovil'
}

const prefixDescriptions: Record<string, string> = {
  BA: 'BA postcodes cover Wells, Glastonbury, Street, Castle Cary, and the surrounding Mendip villages. Our local Somerset team keeps heritage homes, stone cottages, and new-build developments streak-free with pure-water window cleaning and reliable maintenance schedules.',
  BS: 'Our BS coverage reaches Weston-super-Mare, Clevedon, Cheddar, and the coastal communities across North Somerset. Regular window cleaning keeps sea-spray, farm dust, and holiday let traffic under control.',
  TA: 'From Taunton and Bridgwater to Ilminster and Chard, TA postcodes enjoy dedicated crews for residential, commercial, and agricultural properties. We handle everything from townhouses to rural farmsteads.',
  DT: 'We look after Sherborne and the Dorset border villages, delivering the same professional finish for homes that straddle the Somerset boundary.'
}

const areaHighlights: Array<{
  title: string
  description: string
  primaryPostcode: string
  area: string
  href?: string
  ctaHref?: string
  ctaLabel?: string
  ctaVariant?: 'primary' | 'secondary'
}> = [
  {
    title: 'Window Cleaning in Wells (BA5)',
    description:
      'Our Wells window cleaners are trusted by homeowners, schools, and hospitality venues across the cathedral city. We navigate tight streets and period properties with specialist equipment for a spotless finish.',
    primaryPostcode: 'BA5',
    area: 'Wells',
    href: '/areas/wells-ba5',
    ctaHref: '/book-appointment?intent=quote&postcode=BA5&coverageArea=Wells',
    ctaLabel: 'Request a quote in Wells',
    ctaVariant: 'primary'
  },
  {
    title: 'Cheddar Gorge & Mendip Villages (BS26–BS28)',
    description:
      'From Cheddar and Axbridge to Wedmore and the Somerset Levels, our pure-water systems remove limestone residue and farm dust without leaving streaks.',
    primaryPostcode: 'BS27',
    area: 'Cheddar'
  },
  {
    title: 'Weston-super-Mare & North Somerset Coast (BS22–BS24)',
    description:
      'Holiday lets, seafront apartments, and family homes benefit from routine cleans that combat salt spray and gull droppings. We also manage Clevedon, Banwell, and surrounding villages.',
    primaryPostcode: 'BS23',
    area: 'Weston-super-Mare'
  },
  {
    title: 'Taunton, Bridgwater & Langport (TA Postcodes)',
    description:
      'Our TA crews support market towns, logistics centres, and new housing developments. Flexible scheduling keeps shopfronts, offices, and homes looking their best year-round.',
    primaryPostcode: 'TA6',
    area: 'Bridgwater'
  },
  {
    title: 'Glastonbury & Street Window Cleaning (BA6 & BA16)',
    description:
      'Festival traffic, tourist footfall, and local businesses rely on us to keep glazing shining. We cover the Tor, Meare, Ashcott, Street, and the Clarks Village retail outlets.',
    primaryPostcode: 'BA6',
    area: 'Glastonbury & Street',
    ctaHref: '/book-appointment?intent=quote&postcode=BA6&coverageArea=Glastonbury%20%26%20Street',
    ctaLabel: 'Request a quote in Glastonbury'
  }
]

const faqs = [
  {
    question: 'Do you cover new housing developments or rural properties?',
    answer:
      'Yes. Our vehicles are equipped with long-reach poles and onboard water purification, so we can clean homes on new estates as well as farms and cottages down country lanes.'
  },
  {
    question: 'Can you provide window cleaning for businesses in these areas?',
    answer:
      'We already service shops, schools, offices, and hospitality venues throughout Somerset. Let us know the property type when you book and we will schedule the right team.'
  },
  {
    question: 'What if my postcode is just outside the list?',
    answer:
      'Enter your postcode in the checker or contact us. If you are close to our Somerset window frequencies we can often fit you in, and we will refer you if the postcode falls outside our coverage.'
  }
]

const buildQuoteHref = (postcode: string, area?: string) => {
  const params = new URLSearchParams({ intent: 'quote' })
  const normalizedPostcode = resolvePrimaryPostcode(postcode)

  if (normalizedPostcode) {
    params.set('postcode', normalizedPostcode)
  }
  if (area) {
    params.set('coverageArea', area)
  }
  return `/book-appointment?${params.toString()}`
}

export default function AreasPage() {
  const todayIso = formatTodayIso()

  return (
    <div className="space-y-20 md:space-y-24 pb-20">
      <Section spacing="relaxed" className="pt-32 md:pt-40">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6">
              Areas We Cover Across Somerset
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-5 max-w-2xl">
              Somerset Window Cleaning delivers professional pure-water window cleaning across Mendip, North Somerset, Taunton Deane, and the Dorset border. Use the postcode checker to confirm coverage and request your quote in less than a minute.
            </p>
            <ul className="space-y-3 text-white/70 text-sm md:text-base">
              <li>• BA, BS, TA, and DT9 postcodes with regular domestic and commercial window frequencies.</li>
              <li>• Flexible scheduling for homes, schools, shops, care homes, and hospitality venues.</li>
              <li>• Trusted local team with 4.9★ Google rating and specialist access equipment.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-2 text-center">Check Your Postcode</h2>
            <p className="text-white/70 text-sm mb-6 text-center">
              Type a postcode or town (e.g. BA5, Wells) to see if we cover your property. We will confirm and send you straight to the quote form.
            </p>
            <PostcodeChecker variant="hero" placeholder="Enter postcode or town" />
            <p className="text-xs text-white/50 mt-4 text-center">
              ✅ Selecting an area now shows a confirmation and auto-redirects to our quote request form.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="coverage-map"
        title="Somerset Postcode Coverage"
        subtitle="Explore the postcode districts we visit most often. Select a town to read more or jump straight to your quote request."
        spacing="relaxed"
      >
        <div className="space-y-12">
          {Object.entries(POSTCODE_AREAS).map(([prefix, data]) => {
            const firstCode = data.areas[0]?.code ?? ''
            const normalizedFirstCode = resolvePrimaryPostcode(firstCode)
            const quoteHref = normalizedFirstCode
              ? buildQuoteHref(normalizedFirstCode, data.areas[0]?.town)
              : '/get-in-touch'

            return (
              <section
                key={prefix}
                className={`rounded-2xl border ${data.borderColor} bg-gradient-to-br ${data.color} backdrop-blur-sm shadow-lg`}
              >
                <header className="flex flex-col gap-4 border-b border-white/10 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                      <span className={`text-3xl ${data.iconColor}`}>{prefix}</span>
                      <span>{data.name}</span>
                    </h3>
                    <p className="text-sm text-white/70 mt-2 max-w-2xl">
                      {prefixDescriptions[prefix] ?? `Professional window cleaning across ${data.name}.`}
                    </p>
                  </div>
                  <Button href={quoteHref} className="text-sm whitespace-nowrap">
                    Request quote for {prefix} Area
                  </Button>
                </header>

                <div className="p-6">
                  <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
                    {data.areas.map((area) => {
                      const nextVisit = getNextVisitForArea(area.code, todayIso)
                      const strapline = nextVisit?.strapline.replace(/\s*window frequency\s*/i, ' route')
                      const quoteHrefForArea = buildQuoteHref(area.code, area.town)

                      return (
                        <Link
                          key={area.code}
                          href={quoteHrefForArea}
                          className="block h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/40"
                        >
                          <div
                            className="group flex h-full items-start gap-3 rounded-lg border border-white/5 bg-white/5 p-3 transition hover:border-brand-red/40 hover:bg-white/10"
                            id={buildAreaDomId(prefix, area.code)}
                          >
                            <div className={`font-mono font-semibold ${data.iconColor} bg-white/10 px-2 py-1 rounded text-xs min-w-[82px] text-center`}>
                              {area.code}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-white text-sm md:text-base">{area.town}</div>
                              {area.keywords && (
                                <div className="text-xs text-white/60 mt-1">{area.keywords}</div>
                              )}
                              {strapline && (
                                <div className="mt-2 text-[0.65rem] uppercase tracking-[0.35em] text-white/45">
                                  {strapline}
                                </div>
                              )}
                              {nextVisit ? (
                                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/70">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-red/15 px-2 py-0.5 text-brand-red/90">
                                    <svg
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm8 6H6a1 1 0 000 2h8a1 1 0 100-2z" />
                                    </svg>
                                    Next visit {nextVisit.dateLabel}
                                  </span>
                                </div>
                              ) : (
                                <div className="mt-2 text-xs text-white/50">Next rounds scheduled on request</div>
                              )}
                            </div>
                            <div className="text-xs text-white/50">{prefix}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      </Section>

      <Section
        title="Local Window Cleaning Highlights"
        subtitle="A quick snapshot of the Somerset towns we visit most often."
        spacing="relaxed"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {areaHighlights.map((highlight) => {
            const defaultHref = buildQuoteHref(highlight.primaryPostcode, highlight.area)
            const ctaHref = highlight.ctaHref ?? highlight.href ?? defaultHref
            const isDetailPage = Boolean(highlight.href) && !highlight.ctaHref
            const ctaVariant = highlight.ctaVariant ?? (isDetailPage ? 'secondary' : 'primary')
            const ctaLabel = highlight.ctaLabel ?? (isDetailPage ? 'Explore local guide' : `Request a quote in ${highlight.area}`)

            return (
              <article key={highlight.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-3">{highlight.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed mb-4">{highlight.description}</p>
                <Button href={ctaHref} variant={ctaVariant} className="text-sm">
                  {ctaLabel}
                </Button>
              </article>
            )
          })}
        </div>
      </Section>

      <Section
        title="Area Coverage FAQs"
        subtitle="Answers to the most common questions about where and how we work."
        spacing="relaxed"
      >
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
