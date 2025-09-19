import Section from '@/components/ui/Section'
import { SpotlightReviewsSection, CarouselReviewsSection, MosaicReviewsSection } from '@/components/Reviews'

export const metadata = {
  title: 'Google Review Concepts | Somerset Window Cleaning'
}

export default function GoogleReviewConceptsPage() {
  return (
    <div className="space-y-20 pb-20">
      <Section
        title="Google review design concepts"
        subtitle="Three high-trust layouts ready to drop into the site. Each uses the Somerset colour palette, typography, and highlights the 4.9★ Google rating."
        spacing="relaxed"
      >
        <p className="text-sm text-white/70">
          Pick the concept that best matches the page context—hero sections, pricing blocks, or SEO landing pages. Every module can be wired up to live Google data later if needed.
        </p>
      </Section>
      <SpotlightReviewsSection />
      <CarouselReviewsSection />
      <MosaicReviewsSection />
    </div>
  )
}
