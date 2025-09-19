import type { Metadata } from 'next'
import ServiceConceptOneClient from './ServiceConceptOneClient'

export const metadata: Metadata = {
  title: 'Service Concept 1 | Flagship Window Cleaning Frequency',
  description:
    'Immersive single-service layout showcasing the Somerset Window Cleaning flagship window frequencies with interactive plans and premium visuals.',
}

export default function ServiceConceptOnePage() {
  return <ServiceConceptOneClient />
}
