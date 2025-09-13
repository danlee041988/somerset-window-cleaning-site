import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'

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
        url: '/logo.png',
        width: 512,
        height: 512,
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
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-black text-brand-white antialiased">
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-white text-black px-3 py-2 rounded">Skip to content</a>
        <Header />
        <main id="content" className="pt-28 md:pt-32">
          {children}
        </main>
        <Footer />
        <StructuredData />
      </body>
    </html>
  )
}
