import type { Metadata } from 'next'
import ServiceConceptThreeClient from './ServiceConceptThreeClient'

export const metadata: Metadata = {
  title: 'Service Concept 3 | Exterior Care Programmes',
  description:
    'Immersive service page concept highlighting maintenance vs project modes, modular experience tracks, and customer success storytelling.',
}

export default function ServiceConceptThreePage() {
  return <ServiceConceptThreeClient />
}
