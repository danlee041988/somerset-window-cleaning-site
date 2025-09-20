import Link from 'next/link'
import BusinessHours from './BusinessHours'
import ImageWithFallback from '@/components/ui/ImageWithFallback'

const GO_CARDLESS_URL = process.env.NEXT_PUBLIC_GOCARDLESS_PAYMENT_URL

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="glass-card glass-noir-card--tight grid gap-12 rounded-3xl border border-white/12 p-8 md:p-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-8">
            <div className="glass-noir-card glass-noir-card--tight flex flex-col gap-5 rounded-3xl border border-white/12 bg-black/65 p-6 text-[#F5F7FA] shadow-[0_30px_70px_-45px_rgba(0,0,0,0.95)]">
              <div className="flex items-center gap-5">
                <span className="relative flex h-[5rem] w-[5rem] min-h-[5rem] min-w-[5rem] items-center justify-center rounded-[1.6rem] border border-brand-red/55 bg-black p-3 shadow-[0_20px_45px_-30px_rgba(225,29,42,0.85)]">
                  <ImageWithFallback
                    src="/images/logos/swc-logo.png"
                    fallbackSrc="/images/logos/logo.png"
                    alt="Somerset Window Cleaning app icon"
                    width={80}
                    height={80}
                    className="h-full w-full object-contain"
                  />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white">
                    Somerset Window Cleaning
                  </p>
                  <p className="text-xs text-white/60">
                    Glass Noir finish and spotless results for Somerset homes and businesses.
                  </p>
                </div>
              </div>
              <div className="grid gap-2 text-xs text-white/55">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-3 py-1 uppercase tracking-[0.28em] text-white/65">
                  Trusted by 4,000+ customers
                </span>
                <span>
                  Book, schedule, and keep every visit on track with reminders and clear communication from our crew.
                </span>
              </div>
            </div>
            <p className="text-sm noir-muted max-w-prose">
              Crystal-clear windows for homes and businesses across Somerset. Friendly, reliable, fully insured.
            </p>
            <div className="glass-noir-card glass-noir-card--tight p-5 text-sm text-[#F5F7FA]">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] noir-subtle">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="leading-relaxed noir-muted">
                  13 Rockhaven Business Centre
                  <br />Gravenchon Way
                  <br />BA16 0HW, UK
                </li>
                <li>
                  <a href="tel:01458860339" className="transition hover:opacity-90">01458 860 339</a>
                </li>
                <li>
                  <a href="mailto:info@somersetwindowcleaning.co.uk" className="transition hover:opacity-90">
                    info@somersetwindowcleaning.co.uk
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h3 className="relative mb-4 font-semibold text-[#F5F7FA]">
                Services
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[var(--accent)] to-transparent opacity-60" />
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm noir-muted md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Link href="/services/window-cleaning" className="transition hover:text-[var(--fg)]">Window Cleaning</Link>
                <Link href="/services/gutter-clearing" className="transition hover:text-[var(--fg)]">Gutter Clearing</Link>
                <Link href="/services/conservatory-roof-cleaning" className="transition hover:text-[var(--fg)]">Conservatory Roof Cleaning</Link>
                <Link href="/services/solar-panel-cleaning" className="transition hover:text-[var(--fg)]">Solar Panel Cleaning</Link>
                <Link href="/services/fascias-soffits-cleaning" className="transition hover:text-[var(--fg)]">Fascias &amp; Soffits</Link>
                <Link href="/services/commercial-cleaning" className="transition hover:text-[var(--fg)]">Commercial Cleaning</Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h3 className="relative mb-4 font-semibold text-[#F5F7FA]">
                Quick links
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[var(--accent)] to-transparent opacity-60" />
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm noir-muted">
                <Link href="/areas" className="transition hover:text-[var(--fg)]">Areas We Cover</Link>
                <Link href="/pricing" className="transition hover:text-[var(--fg)]">Pricing &amp; Bundles</Link>
                <Link href="/book-appointment" className="transition hover:text-[var(--fg)]">Book Now</Link>
                {GO_CARDLESS_URL && (
                  <a
                    href={GO_CARDLESS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-[var(--fg)]"
                  >
                    Pay by Direct Debit
                  </a>
                )}
                <Link href="/get-in-touch" className="transition hover:text-[var(--fg)]">Get in Touch</Link>
                <Link href="/privacy" className="transition hover:text-[var(--fg)]">Privacy</Link>
              </div>
            </div>
            <div className="glass-noir-card glass-noir-card--tight p-5 text-sm text-[#F5F7FA]">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] noir-subtle">
                Business hours
              </h3>
              <BusinessHours variant="compact" className="mb-3" />
              <div className="flex flex-wrap gap-2 text-xs text-white/55">
                <span className="rounded-full border border-white/15 px-3 py-1">Mon–Fri · 09:00–16:00</span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-red-400">Sat–Sun · Closed</span>
              </div>
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
