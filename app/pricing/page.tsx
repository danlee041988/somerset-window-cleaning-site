import Section from '@/components/Section'

export const metadata = { title: 'Pricing' }

export default function PricingPage() {
  return (
    <div className="py-16 md:py-20">
      <Section title="Pricing" subtitle="Transparent, fair pricing. Contact us for a tailored quote.">
        <div className="mb-6 overflow-hidden rounded-xl border border-white/10">
          <img src="/Codex SWC Photos/photo04.jpg" alt="Property exterior" className="aspect-[21/9] w-full object-cover" />
        </div>
        <div className="rounded-xl border border-white/10 bg-white/10 p-6 text-white/80">
          <ul className="list-disc space-y-2 pl-6">
            <li>Window Cleaning — from £X per visit</li>
            <li>Gutter Clearing — from £X</li>
            <li>Conservatory Roof Cleaning — from £X</li>
            <li>Solar Panel Cleaning — from £X</li>
          </ul>
          <p className="mt-4">Final price depends on property size and access. We’ll confirm everything before booking.</p>
        </div>
      </Section>
    </div>
  )
}
