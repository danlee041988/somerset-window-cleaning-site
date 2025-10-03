import Link from 'next/link'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { POSTCODE_AREAS } from '@/content/service-areas'

export const metadata = {
  title: 'Areas We Cover | Somerset Window Cleaning Service Areas',
  description:
    'Professional window cleaning across Somerset. Covering Glastonbury, Taunton, Bridgwater, Weston-super-Mare and 30+ towns. Check if we cover your area.',
}

export default function AreasPage() {
  // Count total areas
  const totalAreas = Object.values(POSTCODE_AREAS).reduce((sum, group) => sum + group.areas.length, 0)

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <Section spacing="relaxed" className="pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white md:leading-[1.2] mb-6">
            Professional Window Cleaning Across Somerset
          </h1>
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8">
            We cover <strong className="text-white">{totalAreas} towns and villages</strong> across Bath & East Somerset, North Somerset, Taunton Deane, and the Dorset border.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/book-appointment?intent=quote" className="px-8 py-3">
              Request Your Quote
            </Button>
            <Button href="/contact" variant="secondary" className="px-8 py-3">
              Contact Us
            </Button>
          </div>
        </div>
      </Section>

      {/* Coverage Grid - Clean & Simple */}
      <Section
        title="All Areas We Cover"
        subtitle="Click on any area to request a quote for your postcode"
        spacing="relaxed"
      >
        <div className="space-y-10">
          {Object.entries(POSTCODE_AREAS).map(([prefix, data]) => (
            <div
              key={prefix}
              className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/8 to-white/5 p-6 md:p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-lg bg-brand-red/20 px-3 py-1 text-lg font-mono text-brand-red">
                    {prefix}
                  </span>
                  <span>{data.name}</span>
                </h2>
                <p className="text-white/70 text-sm md:text-base max-w-3xl">
                  {prefix === 'BA' && 'Glastonbury, Street, Castle Cary, Frome, and the Mendip villages.'}
                  {prefix === 'BS' && 'Weston-super-Mare, Clevedon, Cheddar, Axbridge, Wedmore, and coastal North Somerset.'}
                  {prefix === 'TA' && 'Taunton, Bridgwater, Burnham-on-Sea, Highbridge, Ilminster, Chard, and West Somerset.'}
                  {prefix === 'DT' && 'Sherborne and Dorset border villages.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {data.areas.map((area) => {
                  const quoteHref = `/book-appointment?intent=quote&postcode=${area.code}&coverageArea=${encodeURIComponent(area.town)}`

                  return (
                    <Link
                      key={area.code}
                      href={quoteHref}
                      className="group block rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-brand-red/40 hover:bg-white/10 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="font-semibold text-white text-sm group-hover:text-brand-red transition-colors">
                          {area.town}
                        </div>
                      </div>
                      <div className="text-xs font-mono text-white/50">
                        {area.code}
                      </div>
                      {area.keywords && (
                        <div className="text-xs text-white/40 mt-1 line-clamp-1">
                          {area.keywords}
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ Section - Simplified */}
      <Section
        title="Coverage Questions"
        subtitle="Common questions about our service areas"
        spacing="relaxed"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Do you cover new housing developments?
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Yes. Our long-reach poles and onboard water systems can access new estates and rural properties throughout Somerset.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Can you service commercial properties?
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              We clean shops, schools, offices, and hospitality venues across all our coverage areas. Request a quote with your property type.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              What if my postcode isn&apos;t listed?
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Contact us with your postcode. If you&apos;re close to our routes we can often fit you in, or we&apos;ll provide an honest referral.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              How do I book for my area?
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Click any area above to request a quote, or use our <Link href="/book-appointment" className="text-brand-red underline hover:text-brand-red/80">online booking form</Link> with your full postcode.
            </p>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section spacing="relaxed">
        <div className="rounded-3xl border border-brand-red/30 bg-gradient-to-br from-brand-red/10 to-transparent p-10 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Spotless Windows?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Request your quote in minutes. We&apos;ll confirm pricing and schedule within one working day.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/book-appointment?intent=quote" className="px-8 py-3 text-base">
              Get Your Quote
            </Button>
            <Button href="tel:01458860339" variant="secondary" className="px-8 py-3 text-base">
              Call 01458 860 339
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}
