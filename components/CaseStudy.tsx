import React from 'react'
import Image from 'next/image'

export default function CaseStudy({
  title = 'Somerset Council case study',
  link = process.env.NEXT_PUBLIC_CASE_STUDY_URL || 'https://www.somerset.gov.uk/business-economy-and-licences/case-studies/somerset-window-cleaning-company/',
  bullets = [
    'Featured by Somerset Council',
    'Local growth and quality of service',
    'Community focus and reliable operations',
  ],
  quote = 'The Enterprise Centres support has helped us stay organised, grow steadily and keep standards high for customers across Somerset.',
  cta = 'Read the case study',
  logoSrc = process.env.NEXT_PUBLIC_COUNCIL_LOGO_URL || '/Codex SWC Photos/Somerset Council Logo .png',
}: {
  title?: string
  link?: string
  bullets?: string[]
  quote?: string
  cta?: string
  logoSrc?: string
}) {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/10">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
          <div className="md:w-2/3">
            <div className="mb-3 flex items-center gap-3">
              <div className="relative h-8 w-28 overflow-hidden rounded-sm bg-white">
                <Image src={logoSrc} alt="Somerset Council logo" fill className="object-contain p-1" sizes="112px" />
              </div>
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--brand-red)' }} aria-hidden />
              <p className="text-xs uppercase tracking-wide text-white/70">Case Study</p>
            </div>
            <h3 className="text-xl font-semibold md:text-2xl">{title}</h3>
            <ul className="mt-3 grid list-disc gap-1 pl-5 text-sm text-white/80 md:grid-cols-2">
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                {cta}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10"/></svg>
              </a>
            </div>
          </div>
          <div className="md:w-1/3">
            <figure className="rounded-lg border border-white/10 bg-white/5 p-4">
              <svg aria-hidden xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mb-2 h-5 w-5 text-white/60"><path fill="currentColor" d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6v-6H5.17A3.17 3.17 0 0 1 8.34 9h2.49V6zm9 0A5.17 5.17 0 0 0 11 11.17V18h6v-6h-2.83A3.17 3.17 0 0 1 17.34 9h2.49V6z"/></svg>
              <blockquote className="text-sm text-white/80">“{quote}”</blockquote>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
