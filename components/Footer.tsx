import Link from 'next/link'
import Logo from './Logo'
import WhatsAppButton from './WhatsAppButton'
import BusinessHours from './BusinessHours'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <Logo className="h-16 md:h-18 w-auto max-w-[200px] md:max-w-[250px]" />
            </div>
            <p className="text-sm text-white/70 max-w-prose">Crystal-clear windows for homes and businesses across Somerset. Friendly, reliable, fully insured.</p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Quick links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/areas" className="hover:text-white">Areas We Cover</Link></li>
              <li><Link href="/get-in-touch" className="hover:text-white">Get in Touch</Link></li>
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
            <div className="mt-4">
              <WhatsAppButton text="WhatsApp us" />
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Business Hours</h4>
            <div className="text-sm">
              <BusinessHours variant="compact" className="mb-2" />
              <div className="space-y-1 text-white/80">
                <div>Mon-Fri: 9:00 AM - 4:00 PM</div>
                <div className="text-red-400">Sat-Sun: Closed</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Somerset Window Cleaning. All rights reserved.</p>
          <p>Proud to serve Somerset since 2019.</p>
        </div>
      </div>
    </footer>
  )
}
