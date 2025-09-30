import Link from 'next/link'
import BusinessHours from './BusinessHours'
import ImageWithFallback from '@/components/ui/ImageWithFallback'

const GO_CARDLESS_URL = process.env.NEXT_PUBLIC_GOCARDLESS_PAYMENT_URL

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="glass-card glass-noir-card--tight grid gap-8 rounded-3xl border border-white/12 p-8 md:p-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          {/* Column 1: Brand & Contact */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-5">
              <span className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-brand-red/55 bg-black p-3 shadow-[0_22px_52px_-32px_rgba(225,29,42,0.85)]">
                <ImageWithFallback
                  src="/images/logos/swc-logo.png"
                  fallbackSrc="/images/logos/logo.png"
                  alt="Somerset Window Cleaning"
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              </span>
              <div>
                <p className="text-base font-semibold uppercase tracking-[0.28em] text-white">
                  Somerset Window Cleaning
                </p>
                <p className="text-sm text-white/60 mt-1">
                  Professional window cleaning since 2019
                </p>
              </div>
            </div>

            <p className="text-sm text-white/70 max-w-prose">
              Professional window cleaning for homes and businesses across Somerset. Friendly, reliable, fully insured.
            </p>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                Contact
              </h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="leading-relaxed">
                  13 Rockhaven Business Centre
                  <br />Gravenchon Way
                  <br />BA16 0HW, UK
                </li>
                <li>
                  <a href="tel:01458860339" className="transition hover:text-white">01458 860 339</a>
                </li>
                <li>
                  <a href="mailto:info@somersetwindowcleaning.co.uk" className="transition hover:text-white">
                    info@somersetwindowcleaning.co.uk
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                Business hours
              </h3>
              <BusinessHours variant="compact" className="mb-2" />
              <p className="text-xs text-white/60">Mon–Fri 09:00–16:00 • Weekends Closed</p>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
              Services
            </h3>
            <div className="space-y-2 text-sm text-white/70">
              <Link href="/services/window-cleaning" className="block transition hover:text-white hover:translate-x-1 duration-200">Window Cleaning</Link>
              <Link href="/services/gutter-clearing" className="block transition hover:text-white hover:translate-x-1 duration-200">Gutter Clearing</Link>
              <Link href="/services/conservatory-roof-cleaning" className="block transition hover:text-white hover:translate-x-1 duration-200">Conservatory Roof Cleaning</Link>
              <Link href="/services/solar-panel-cleaning" className="block transition hover:text-white hover:translate-x-1 duration-200">Solar Panel Cleaning</Link>
              <Link href="/services/fascias-soffits-cleaning" className="block transition hover:text-white hover:translate-x-1 duration-200">Fascias &amp; Soffits</Link>
              <Link href="/services/commercial-cleaning" className="block transition hover:text-white hover:translate-x-1 duration-200">Commercial Cleaning</Link>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
              Quick links
            </h3>
            <div className="space-y-2 text-sm text-white/70">
              <Link href="/areas" className="block transition hover:text-white hover:translate-x-1 duration-200">Areas We Cover</Link>
              <Link href="/team" className="block transition hover:text-white hover:translate-x-1 duration-200">Meet the Team</Link>
              <Link href="/book-appointment" className="block transition hover:text-white hover:translate-x-1 duration-200">Request a Quote</Link>
              <Link href="/get-in-touch" className="block transition hover:text-white hover:translate-x-1 duration-200">Get in Touch</Link>
              {GO_CARDLESS_URL && (
                <a
                  href={GO_CARDLESS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition hover:text-white hover:translate-x-1 duration-200"
                >
                  Pay by Direct Debit
                </a>
              )}
              <Link href="/privacy" className="block transition hover:text-white hover:translate-x-1 duration-200">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs noir-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Somerset Window Cleaning. All rights reserved.</p>
          <p>Proud to serve Somerset since 2019.</p>
        </div>
      </div>
    </footer>
  )
}
