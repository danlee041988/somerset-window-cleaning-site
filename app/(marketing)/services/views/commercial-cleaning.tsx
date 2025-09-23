import { SERVICE_IMAGES } from '@/content/image-manifest'
import { servicesData } from '@/content/services-data'
import { ServicePageLayout } from './components/service-page-layout'

export const metadata = {
  title: 'Commercial Exterior Cleaning Somerset | RAMS & Flexible Scheduling',
  description:
    'Keep your business frontage pristine with professional exterior cleaning, RAMS documentation, and out-of-hours scheduling across Somerset.',
}

const FAQS = [
  {
    question: 'Can you work outside our trading hours?',
    answer:
      'Yes. We regularly schedule early morning, evening, or weekend cleans so your frontage is ready for opening without disruption.',
  },
  {
    question: 'Do you supply RAMS and insurance documents?',
    answer:
      'All commercial work includes full RAMS documentation, method statements, risk assessments, and proof of insurance on request.',
  },
  {
    question: 'What types of commercial properties do you service?',
    answer:
      'We support retail units, hospitality venues, schools, offices, and multi-site portfolios across Somerset with tailored maintenance plans.',
  },
  {
    question: 'Can you coordinate with facilities or property managers?',
    answer:
      'Absolutely. We provide photo reports, completion notes, and scheduled updates so internal teams stay informed without chasing.',
  },
]

export default function CommercialCleaningPage() {
  const service = servicesData.find((entry) => entry.slug === 'commercial-cleaning')
  if (!service) {
    throw new Error('Commercial cleaning service data missing')
  }

  return (
    <ServicePageLayout
      service={service}
      hero={{
        kicker: 'Business ready',
        heading: 'Commercial exterior cleaning without disruption',
        intro:
          'Professional crews, compliant documentation, and flexible scheduling so your premises always present at their best.',
        highlights: [
          'RAMS and compliance covered',
          'Out-of-hours availability',
          'Tailored maintenance programs',
        ],
        imageSrc: SERVICE_IMAGES.commercial || '/images/photos/Commercial.jpg',
        imageAlt: 'Commercial property exterior cleaning crew',
      }}
      faqs={FAQS}
      bookingHref="/book-appointment?service=commercial-cleaning&intent=quote"
      bookingLabel="Request commercial quote"
    />
  )
}
