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
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur transition-shadow hover:border-white/20 hover:shadow-[0_28px_80px_-48px_rgba(0,0,0,0.9)]">
      <div className="relative aspect-[3/4] w-full overflow-hidden border-b border-white/10 bg-black/40">
        {image ? (
          <Image
            src={image}
            alt={`${name} - ${role}`}
            fill
            className="object-cover"
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
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--fg)] md:text-6xl">
              Meet the Somerset Window Cleaning team
            </h1>
            <p className="max-w-2xl text-lg noir-muted">
              The people behind the ladders, poles, and immaculate finishes. Every member is trained in pure-water systems, safety, and customer care.
            </p>
          </header>

          <div className="space-y-4 text-white/75 md:max-w-2xl">
            <p>
              We’re a tight-knit crew covering Somerset with the same standards on every visit. From Dan setting the direction to Sean keeping the rounds organised, you’ll always have a familiar face looking after your property.
            </p>
            <p className="text-white/65">
              Woody’s portrait is being finished now—check back soon. Want to put the team to work? Request a quote and we’ll build the right rota for your property.
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

      <Section id="our-team" spacing="relaxed" className="pt-0">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map(({ slug, ...member }) => (
            <TeamMemberCard key={slug} {...member} />
          ))}
        </div>
      </Section>
    </div>
  )
}
