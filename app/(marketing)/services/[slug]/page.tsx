import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'

import WindowCleaningPage, { metadata as windowCleaningMetadata } from '../views/window-cleaning'
import GutterClearingPage, { metadata as gutterClearingMetadata } from '../views/gutter-clearing'
import ConservatoryRoofCleaningPage, { metadata as conservatoryRoofCleaningMetadata } from '../views/conservatory-roof-cleaning'
import SolarPanelCleaningPage, { metadata as solarPanelMetadata } from '../views/solar-panel-cleaning'
import FasciasSoffitsCleaningPage, { metadata as fasciasMetadata } from '../views/fascias-soffits-cleaning'
import CommercialCleaningPage, { metadata as commercialMetadata } from '../views/commercial-cleaning'

const servicePages = {
  'window-cleaning': {
    Component: WindowCleaningPage,
    metadata: windowCleaningMetadata,
  },
  'gutter-clearing': {
    Component: GutterClearingPage,
    metadata: gutterClearingMetadata,
  },
  'conservatory-roof-cleaning': {
    Component: ConservatoryRoofCleaningPage,
    metadata: conservatoryRoofCleaningMetadata,
  },
  'solar-panel-cleaning': {
    Component: SolarPanelCleaningPage,
    metadata: solarPanelMetadata,
  },
  'fascias-soffits-cleaning': {
    Component: FasciasSoffitsCleaningPage,
    metadata: fasciasMetadata,
  },
  'commercial-cleaning': {
    Component: CommercialCleaningPage,
    metadata: commercialMetadata,
  },
} satisfies Record<string, { Component: ComponentType; metadata: Metadata }>

type Params = {
  params: {
    slug: keyof typeof servicePages
  }
}

export function generateMetadata({ params }: Params): Metadata {
  const entry = servicePages[params.slug]
  if (!entry) {
    return {}
  }
  return entry.metadata
}

export default function ServiceDetailPage({ params }: Params) {
  const entry = servicePages[params.slug]
  if (!entry) {
    notFound()
  }

  const ServiceComponent = entry.Component
  return <ServiceComponent />
}
