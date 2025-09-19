import { SERVICE_IMAGES } from '@/content/image-manifest'
import { servicesData } from '@/content/services-data'
import { ServicePageLayout } from './components/service-page-layout'

export const metadata = {
  title: 'Window Cleaning Somerset | Pure Water Specialists',
  description:
    'Professional window cleaning across Somerset with pure water systems, frame detailing, and flexible 4–8 week rounds. Book a spotless finish today.',
}

const FAQS = [
  {
    question: 'How often should I book window cleaning?',
    answer:
      'Most Somerset homeowners choose a four or eight-week schedule so the glass, frames, and sills stay bright year-round. We can also arrange one-off visits for property sales or inspections.',
  },
  {
    question: 'Do you clean the frames and sills as well?',
    answer:
      'Yes. Every service includes frames, sills, and door glass as standard. Pure water technology lifts the dirt without leaving spotting or residue.',
  },
  {
    question: 'Do I need to be home when you visit?',
    answer:
      'No. We arrive in uniform, send a text reminder, and take contactless payment after the clean. Gate access instructions can be added in the booking form.',
  },
  {
    question: 'Can you reach top-floor or awkward windows?',
    answer:
      'Our carbon fibre pole systems reach up to four storeys safely from the ground. For anything beyond that we schedule ladder or platform access in advance.',
  },
]

export default function WindowCleaningPage() {
  const service = servicesData.find((entry) => entry.slug === 'window-cleaning')
  if (!service) {
    throw new Error('Window cleaning service data missing')
  }

  return (
    <ServicePageLayout
      service={service}
      hero={{
        kicker: 'Pure water perfection',
        heading: 'Somerset window cleaning specialists',
        intro:
          'Crystal-clear glass, detailed frames, and reliable four-week rounds delivered by a fully insured, uniformed crew.',
        highlights: [
          '4–8 week maintenance frequencies',
          'Frames, doors, and sills included',
          'Text reminders and contactless payment',
        ],
        imageSrc: SERVICE_IMAGES.window || '/images/photos/Window Clean.jpeg',
        imageAlt: 'Technician cleaning domestic windows with pure water pole system',
      }}
      faqs={FAQS}
      bookingHref="/book-appointment?service=window-cleaning"
      bookingLabel="Book window cleaning"
    />
  )
}
