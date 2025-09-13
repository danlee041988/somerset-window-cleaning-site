import Section from '@/components/Section'
import Button from '@/components/Button'
import { TEAM_IMAGES } from '@/content/image-manifest'
import Image from 'next/image'
import CaseStudy from '@/components/CaseStudy'

type TeamMember = {
  name: string
  role: string
  desc: string
  photo?: string
}

export const metadata = {
  title: 'Meet the Team',
  description: 'Get to know the friendly local team behind Somerset Window Cleaning.'
}

const TEAM: TeamMember[] = [
  {
    name: 'Dan Lee',
    role: 'Owner & Founder',
    desc: 'Former Royal Marine who brings discipline and attention to detail to window cleaning.',
    photo: TEAM_IMAGES[0],
  },
  {
    name: 'Sean',
    role: 'Ops Manager',
    desc: 'Keeps routes running smoothly and standards consistently high.',
    photo: TEAM_IMAGES[1],
  },
  {
    name: 'Pat',
    role: 'Office Admin',
    desc: 'Scheduling, customer queries and quotes — your first point of contact.',
    photo: TEAM_IMAGES[2],
  },
  {
    name: 'Dylan',
    role: 'Team Supervisor',
    desc: 'Quality checks and support across teams and complex jobs.',
    photo: TEAM_IMAGES[3],
  },
  {
    name: 'Woody',
    role: 'Window Cleaner',
    desc: 'Friendly service and a meticulous eye for detail.',
  },
  {
    name: 'Josh',
    role: 'Window Cleaner',
    desc: 'Consistent results and great communication with customers.',
  },
]

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('') || '—'

export default function TeamPage() {
  const caseStudyUrl = process.env.NEXT_PUBLIC_CASE_STUDY_URL || 'https://www.somerset.gov.uk/business-economy-and-licences/somerset-enterprise-centres/case-studies/somerset-window-cleaning-company/'
  return (
    <div className="py-16 md:py-20">
      <Section title="Meet the team" subtitle="Professional, reliable and local. Fully insured and DBS checked.">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <div key={m.name} className="overflow-hidden rounded-xl border border-white/10 bg-white/10">
              <div className="relative aspect-[4/3] w-full">
                {m.photo ? (
                  <Image src={m.photo} alt={`${m.name} — ${m.role}`} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 50vw" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/10 text-3xl font-semibold text-white/80">
                    {initials(m.name)}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{m.name}</h3>
                <p className="mt-1 text-sm text-white/70">{m.role}</p>
                <p className="mt-2 text-sm text-white/80">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <CaseStudy />
        </div>
      </Section>
    </div>
  )
}
