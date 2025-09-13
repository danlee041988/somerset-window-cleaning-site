import Section from '@/components/Section'

export const metadata = {
  title: 'About Somerset Window Cleaning | Trusted Local Experts',
  description: 'Learn about Somerset Window Cleaning—your trusted local experts in professional window, gutter, and fascia cleaning services.'
}

export default function AboutPage() {
  return (
    <div className="py-16 md:py-20">
      <Section title="Somerset Window Cleaning: Your Local Exterior Cleaning Experts" subtitle="Professional, reliable service for homes and businesses across Somerset.">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="prose prose-invert max-w-none text-white/80">
            <p>We’re a Somerset-based team delivering expert residential and commercial window, gutter, and fascia cleaning. Customers choose us for dependable service, clear communication, and results that make properties shine.</p>
            <p>We use safe, modern methods to protect your glass, frames, and exteriors while achieving a spotless finish. Fully insured and DBS checked, with flexible booking options to suit your schedule.</p>
            <p>Areas we cover include Taunton, Bridgwater, Yeovil, Weston‑super‑Mare, and surrounding towns.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src="/photos/photo12.jpg" alt="On-site work" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <img src="/photos/photo05.jpg" alt="Clean windows close-up" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <img src="/photos/photo06.jpg" alt="Conservatory cleaning" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <img src="/photos/photo02.jpg" alt="Commercial property" className="aspect-[4/3] w-full rounded-lg object-cover" />
          </div>
        </div>
      </Section>

      {/* Team Section */}
      <Section title="Meet Our Team" subtitle="The people behind Somerset Window Cleaning's professional service.">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Dan Lee - Owner */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-red text-2xl font-bold text-white">
                DL
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Dan Lee</h3>
            <p className="mb-3 text-sm font-medium text-brand-red">Owner & Founder</p>
            <p className="text-sm text-white/70">Former Royal Marine who brings discipline and attention to detail to window cleaning.</p>
          </div>

          {/* Sean - Ops Manager */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-red text-2xl font-bold text-white">
                ST
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Sean</h3>
            <p className="mb-3 text-sm font-medium text-brand-red">Ops Manager</p>
            <p className="text-sm text-white/70">Keeps routes running smoothly and standards consistently high.</p>
          </div>

          {/* Pat - Office Admin */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-red text-2xl font-bold text-white">
                P
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Pat</h3>
            <p className="mb-3 text-sm font-medium text-brand-red">Office Admin</p>
            <p className="text-sm text-white/70">Scheduling, customer queries and quotes — your first point of contact.</p>
          </div>

          {/* Dylan - Team Supervisor */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-red text-2xl font-bold text-white">
                D
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Dylan</h3>
            <p className="mb-3 text-sm font-medium text-brand-red">Team Supervisor</p>
            <p className="text-sm text-white/70">Quality checks and support across teams and complex jobs.</p>
          </div>

          {/* Woody - Window Cleaner */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-red text-2xl font-bold text-white">
                W
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Woody</h3>
            <p className="mb-3 text-sm font-medium text-brand-red">Window Cleaner</p>
            <p className="text-sm text-white/70">Friendly service and a meticulous eye for detail.</p>
          </div>

          {/* Josh - Window Cleaner */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-red text-2xl font-bold text-white">
                J
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Josh</h3>
            <p className="mb-3 text-sm font-medium text-brand-red">Window Cleaner</p>
            <p className="text-sm text-white/70">Consistent results and great communication with customers.</p>
          </div>
        </div>
      </Section>
    </div>
  )
}
