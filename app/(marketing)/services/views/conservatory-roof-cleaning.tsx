import { SERVICE_IMAGES } from '@/content/image-manifest'
import { servicesData } from '@/content/services-data'
import { ServicePageLayout } from './components/service-page-layout'

export const metadata = {
  title: 'Conservatory Roof Cleaning Somerset | Seal-Safe Treatments',
  description:
    'Restore light to your conservatory with gentle, seal-safe roof cleaning. Removal of algae, moss, and staining across Somerset.',
}

const FAQS = [
  {
    question: 'Will the cleaning damage seals or coatings?',
    answer:
      'No. We use biodegradable detergents, soft applicators, and pure water rinses that protect seals and existing roof coatings.',
  },
  {
    question: 'How long does the conservatory stay clean?',
    answer:
      'Most customers schedule an annual visit. This keeps algae and staining under control and maintains the clarity of the roof panels.',
  },
  {
    question: 'Can you clean the inside as well?',
    answer:
      'Yes. Just mention it on the booking form and we can include internal glass or frame detailing during the same visit.',
  },
  {
    question: 'Do you need access to power or water?',
    answer:
      'We bring purified water on-board. An outdoor tap is helpful but not essential. We always protect planting and surrounding decking.',
  },
]

export default function ConservatoryRoofCleaningPage() {
  const service = servicesData.find((entry) => entry.slug === 'conservatory-roof-cleaning')
  if (!service) {
    throw new Error('Conservatory roof cleaning service data missing')
  }

  return (
    <ServicePageLayout
      service={service}
      hero={{
        kicker: 'Bring back the light',
        heading: 'Conservatory roof cleaning across Somerset',
        intro:
          'Specialist roof cleaning that lifts moss, algae, and weathering without disturbing seals or finishes. Watch natural light flood back in.',
        highlights: [
          'Biodegradable, seal-safe products',
          'Non-abrasive brushing techniques',
          'Optional internal glass cleaning',
        ],
        imageSrc: SERVICE_IMAGES.conservatory || '/images/photos/DJI_0052.JPG',
        imageAlt: 'Conservatory roof cleaning in progress',
      }}
      faqs={FAQS}
      bookingHref="/book-appointment?service=conservatory-roof-cleaning&intent=quote"
      bookingLabel="Request conservatory quote"
    />
  )
}
