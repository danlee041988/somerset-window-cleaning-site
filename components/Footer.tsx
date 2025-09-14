import Link from 'next/link'
import Logo from './Logo'
import WhatsAppButton from './WhatsAppButton'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <Logo className="h-24 md:h-28" />
            </div>
            <p className="text-sm text-white/70 max-w-prose">Crystal-clear windows for homes and businesses across Somerset. Friendly, reliable, fully insured.</p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Quick links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/quote" className="hover:text-white">Quote me</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>13 Rockhaven Business Centre<br />Gravenchon Way<br />BA16 0HW, UK</li>
              <li><a href="tel:01458860339" className="hover:text-white">01458 860 339</a></li>
              <li><a href="mailto:info@somersetwindowcleaning.co.uk" className="hover:text-white">info@somersetwindowcleaning.co.uk</a></li>
            </ul>
            <div className="mt-3">
              <WhatsAppButton text="WhatsApp us" />
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Hours</h4>
            <p className="text-sm text-white/80">Mon–Fri: 9am–4pm</p>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Somerset Window Cleaning. All rights reserved.</p>
          <p>Made with care in Somerset.</p>
        </div>
      </div>
    </footer>
  )
}
