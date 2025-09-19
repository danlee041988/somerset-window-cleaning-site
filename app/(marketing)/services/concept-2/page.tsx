import type { Metadata } from 'next'
import ServiceConceptTwoClient from './ServiceConceptTwoClient'

export const metadata: Metadata = {
  title: 'Service Concept 2 | Signature Gutter & Roof Detailing',
  description:
    'Interactive gutter and fascia cleaning design concept featuring live process walkthrough, membership tiers, and instant property estimate cards.',
}

export default function ServiceConceptTwoPage() {
  return <ServiceConceptTwoClient />
}
