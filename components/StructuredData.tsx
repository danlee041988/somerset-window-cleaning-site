import React from 'react'
import { buildAbsoluteUrl, getSiteOrigin } from '@/lib/site-url'

export default function StructuredData() {
  const siteOrigin = getSiteOrigin()
  const logoUrl = buildAbsoluteUrl('/images/logos/swc-logo.png')
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Somerset Window Cleaning',
    url: siteOrigin,
    image: logoUrl,
    telephone: '+44 1458 860 339',
    email: 'info@somersetwindowcleaning.co.uk',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '13 Rockhaven Business Centre, Gravenchon Way',
      addressLocality: 'Street',
      addressRegion: 'Somerset',
      postalCode: 'BA16 0HW',
      addressCountry: 'GB',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Somerset',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ],
        opens: '09:00',
        closes: '16:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/SomersetWindowCleaning/',
      'https://www.instagram.com/somersetwindowcleaning/',
      'https://www.linkedin.com/company/somerset-window-cleaning/',
    ],
    priceRange: '££',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
