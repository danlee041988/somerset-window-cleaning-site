import Section from '@/components/Section'
import Button from '@/components/Button'
import { TEAM_IMAGES } from '@/content/image-manifest'

export const metadata = {
  title: 'Meet the Team',
  description: 'Get to know the friendly local team behind Somerset Window Cleaning.'
}

const TEAM = [
  { name: 'Alex', role: 'Owner & Lead Technician', photo: TEAM_IMAGES[0] || '/photos/photo12.jpg' },
  { name: 'Sam', role: 'Senior Window Cleaner', photo: TEAM_IMAGES[1] || '/photos/photo02.jpg' },
  { name: 'Jordan', role: 'Gutter & Exteriors', photo: TEAM_IMAGES[2] || '/photos/photo06.jpg' },
  { name: 'Taylor', role: 'Customer Care', photo: TEAM_IMAGES[3] || '/photos/photo05.jpg' },
]

export default function TeamPage() {
  const caseStudyUrl = process.env.NEXT_PUBLIC_CASE_STUDY_URL || 'https://www.somerset.gov.uk/business-economy-and-licences/somerset-enterprise-centres/case-studies/somerset-window-cleaning-company/'
  return (
    <div className="py-16 md:py-20">
      <Section title="Meet the team" subtitle="Professional, reliable and local. Fully insured and DBS checked.">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <div key={m.name} className="overflow-hidden rounded-xl border border-white/10 bg-white/10">
              <img src={m.photo} alt={`${m.name} — ${m.role}`} className="aspect-[4/3] w-full object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{m.name}</h3>
                <p className="mt-1 text-sm text-white/70">{m.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-white/10 bg-white/10 p-6">
          <h3 className="text-xl font-semibold">Case study</h3>
          {caseStudyUrl ? (
            <>
              <p className="mt-2 max-w-prose text-white/80">Somerset Council produced a case study on our service and community focus.</p>
              <div className="mt-4 flex gap-3">
                <Button href={caseStudyUrl}>Read the case study</Button>
                <Button href="/contact" variant="ghost">Request a quote</Button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 max-w-prose text-white/80">We’ve been featured in a local council case study highlighting quality of service and community focus. We’ll add the official link here once confirmed.</p>
              <div className="mt-4 flex gap-3">
                <Button href="/contact">Request a quote</Button>
                <Button href="/gallery" variant="ghost">See our work</Button>
              </div>
            </>
          )}
        </div>
      </Section>
    </div>
  )
}
