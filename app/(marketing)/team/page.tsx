import type { Metadata } from 'next'
import Image from 'next/image'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { teamMembers } from '@/content/team-data'

export const metadata: Metadata = {
  title: 'Meet the Team | Somerset Window Cleaning',
  description:
    'Get to know the Somerset Window Cleaning crew—Dan, Sean, Dylan, Woody, and Josh. Meet the people who look after your property on every visit.',
  alternates: {
    canonical: '/team',
  },
}

type TeamMemberCardProps = {
  name: string
  role: string
  bio: string
  image?: string
  specialties?: string[]
}

const gradientPalette = [
  'from-brand-red/20 via-brand-red/10 to-brand-red/5',
  'from-sky-400/20 via-sky-300/10 to-sky-200/5',
  'from-emerald-400/20 via-emerald-300/10 to-emerald-200/5',
]

const TEAM_HERO_IMAGE = '/images/photos/Vans.jpeg'

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

function TeamMemberCard({ name, role, bio, image, specialties }: TeamMemberCardProps) {
  const initials = getInitials(name)
  const gradientClass = gradientPalette[name.length % gradientPalette.length]

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur transition-all duration-300 hover:border-white/25 hover:shadow-[0_28px_80px_-48px_rgba(225,29,42,0.4)] hover:-translate-y-1">
      <div className="relative aspect-[3/4] w-full overflow-hidden border-b border-white/10 bg-black/40">
        {image ? (
          <Image
            src={image}
            alt={`${name} - ${role}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 45vw, 90vw"
            priority={role.includes('Owner')}
          />
        ) : (
          <div
            className={`flex h-full items-center justify-center bg-gradient-to-br ${gradientClass} text-4xl font-semibold tracking-[0.35em] text-white/70`}
            aria-hidden
          >
            {initials}
          </div>
        )}
        {!image && (
          <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-white/65">
            Photo on the way
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6 text-white/80">
        <header className="space-y-1">
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-white/50">{role}</p>
        </header>
        <p className="text-sm leading-relaxed text-white/75">{bio}</p>
        {specialties && specialties.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-2 pt-2">
            {specialties.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/12 bg-black/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/55"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

export default function TeamPage() {
  const operationsLead = teamMembers.find((member) => member.role.includes('Owner'))

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden border-b border-white/10">
        <Image
          src={TEAM_HERO_IMAGE}
          alt="Somerset Window Cleaning vans lined up outside the unit"
          fill
          className="absolute inset-0 object-cover opacity-70"
          sizes="100vw"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" aria-hidden />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-24 pt-32 md:gap-10 md:px-6 md:pb-28 md:pt-36">
          <div className="flex flex-wrap items-center gap-3 text-[0.58rem] font-semibold uppercase tracking-[0.32em] text-white/60">
            <span className="noir-chip">Fleet-backed service</span>
            <span className="noir-chip">Trusted Somerset crew</span>
          </div>

          <header className="space-y-4 md:max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[var(--fg)] md:text-6xl md:leading-[1.15] mb-6">
              Meet the Somerset Window Cleaning team
            </h1>
            <p className="max-w-2xl text-lg noir-muted">
              The people behind the ladders, poles, and immaculate finishes. Every member is trained in pure-water systems, safety, and customer care.
            </p>
          </header>

          <div className="space-y-4 text-white/75 md:max-w-2xl">
            <p>
              We&apos;re a tight-knit crew covering Somerset with the same standards on every visit. From Dan setting the direction to Sean keeping the rounds organised, you&apos;ll always have a familiar face looking after your property.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/book-appointment?intent=quote">Request a visit</Button>
            {operationsLead?.image && (
              <Button href="#our-team" variant="ghost">
                Meet {operationsLead.name.split(' ')[0]}&rsquo;s crew
              </Button>
            )}
          </div>
        </div>
      </section>

      <Section spacing="relaxed" className="pt-0">
        <div className="mx-auto max-w-4xl text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-brand-red/90">
            Why choose Somerset Window Cleaning
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Local, trained, and accountable
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Every member of our crew is background-checked, fully insured, and trained to the same standards Dan set when he founded the business.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-20">
          <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-6 text-center backdrop-blur transition-all hover:border-white/20 hover:bg-white/[0.05]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-red/20">
              <svg className="h-7 w-7 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Fully Insured</h3>
            <p className="text-sm text-white/65">£5M public liability and comprehensive equipment cover on every visit.</p>
          </div>

          <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-6 text-center backdrop-blur transition-all hover:border-white/20 hover:bg-white/[0.05]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
              <svg className="h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Trained Crew</h3>
            <p className="text-sm text-white/65">Every team member completes pure-water, safety, and customer care training.</p>
          </div>

          <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-6 text-center backdrop-blur transition-all hover:border-white/20 hover:bg-white/[0.05]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/20">
              <svg className="h-7 w-7 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Somerset Local</h3>
            <p className="text-sm text-white/65">Based in Glastonbury, serving communities across the county we call home.</p>
          </div>

          <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-6 text-center backdrop-blur transition-all hover:border-white/20 hover:bg-white/[0.05]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20">
              <svg className="h-7 w-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Reliable Service</h3>
            <p className="text-sm text-white/65">Reminder texts before every visit with easy rescheduling if plans change.</p>
          </div>
        </div>
      </Section>

      <Section id="our-team" spacing="relaxed" className="pt-0">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Meet the crew</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map(({ slug, ...member }) => (
            <TeamMemberCard key={slug} {...member} />
          ))}
        </div>
      </Section>
    </div>
  )
}
