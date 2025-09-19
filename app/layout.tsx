import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import ErrorBoundary from '@/components/ErrorBoundary'
import DynamicLayout from '@/components/DynamicLayout'
import StickyCTABar from '@/components/StickyCTABar'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const siteUrlRaw = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
let siteUrl: URL | undefined
try {
  siteUrl = new URL(siteUrlRaw)
} catch {}

export const metadata: Metadata = {
  title: {
    default: 'Somerset Window Cleaning | Professional, Reliable, Local Service',
    template: '%s | Somerset Window Cleaning',
  },
  description: 'Somerset Window Cleaning: Expert residential & commercial window, gutter, and fascia cleaning. Trusted service across Somerset and surrounding areas',
  ...(siteUrl ? { metadataBase: siteUrl, alternates: { canonical: siteUrl.href } } : {}),
  openGraph: {
    title: 'Somerset Window Cleaning',
    description: 'Somerset Window Cleaning: Expert residential & commercial window, gutter, and fascia cleaning. Trusted service across Somerset and surrounding areas',
    type: 'website',
    url: siteUrl?.href || 'http://localhost:3000',
    images: [
      {
        url: '/Codex SWC Photos/SWC Logo.png',
        alt: 'Somerset Window Cleaning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Somerset Window Cleaning',
    description: 'Somerset Window Cleaning: Expert residential & commercial window, gutter, and fascia cleaning. Trusted service across Somerset and surrounding areas',
  },
  icons: {
    icon: '/Codex SWC Photos/SWC Logo.png',
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
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen bg-brand-black text-brand-white antialiased">
        <ErrorBoundary>
          <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-white text-black px-3 py-2 rounded">Skip to content</a>
          <Header />
          <DynamicLayout>
            {children}
          </DynamicLayout>
          <Footer />
          <StickyCTABar />
          <StructuredData />
        </ErrorBoundary>
      </body>
    </html>
  )
}
