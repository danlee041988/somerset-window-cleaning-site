import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import ErrorBoundary from '@/components/ErrorBoundary'
import DynamicLayout from '@/components/DynamicLayout'
import { GoogleTagManager } from '@next/third-parties/google'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { buildAbsoluteUrl, getSiteUrl } from '@/lib/site-url'

const siteUrl = getSiteUrl()
const logoUrl = buildAbsoluteUrl('/images/logos/swc-logo.png', siteUrl)
const siteUrlHref = buildAbsoluteUrl('/', siteUrl)
const gtmContainerId = (process.env.NEXT_PUBLIC_GTM_CONTAINER_ID || '').trim()

export const metadata: Metadata = {
  title: {
    default: 'Somerset Window Cleaning | Professional, Reliable, Local Service',
    template: '%s | Somerset Window Cleaning',
  },
  description: 'Somerset Window Cleaning: Expert residential & commercial window, gutter, and fascia cleaning. Trusted service across Somerset and surrounding areas',
  metadataBase: siteUrl,
  openGraph: {
    title: 'Somerset Window Cleaning',
    description: 'Somerset Window Cleaning: Expert residential & commercial window, gutter, and fascia cleaning. Trusted service across Somerset and surrounding areas',
    type: 'website',
    url: siteUrlHref,
    images: [
      {
        url: logoUrl,
        alt: 'Somerset Window Cleaning logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Somerset Window Cleaning',
    description: 'Somerset Window Cleaning: Expert residential & commercial window, gutter, and fascia cleaning. Trusted service across Somerset and surrounding areas',
    images: [logoUrl],
  },
  icons: {
    icon: logoUrl,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {gtmContainerId ? <GoogleTagManager gtmId={gtmContainerId} /> : null}
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen bg-brand-black text-brand-white antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-white text-black px-3 py-2 rounded">Skip to content</a>
          <Header />
          <DynamicLayout>
            {children}
          </DynamicLayout>
          <Footer />
          <StructuredData />
        </ErrorBoundary>
      </body>
    </html>
  )
}
