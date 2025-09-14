import React from 'react'

export default function CaseStudy({
  title = 'Somerset Council Case Study',
  link = process.env.NEXT_PUBLIC_CASE_STUDY_URL || 'https://www.somerset.gov.uk/business-economy-and-licences/case-studies/somerset-window-cleaning-company/',
  bullets = [
    'Featured by Somerset Council',
    'Local growth and quality of service',
    'Community focus and reliable operations',
  ],
  quote = 'The Enterprise Centres support has helped us stay organised, grow steadily and keep standards high for customers across Somerset.',
  cta = 'Read the case study',
}: {
  title?: string
  link?: string
  bullets?: string[]
  quote?: string
  cta?: string
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      {/* Background gradient overlay for visual interest */}
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg className="h-full w-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="case-study-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#case-study-pattern)" />
          </svg>
        </div>
        
        {/* Accent gradient line at top */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-brand-red to-transparent" />
        
        <div className="relative flex flex-col gap-8 p-8 md:flex-row md:p-10">
          <div className="md:w-2/3">
            {/* Enhanced header with better styling */}
            <div className="mb-6 inline-flex items-center gap-4 rounded-xl border border-white/20 bg-black/40 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span 
                  className="inline-block h-3 w-3 animate-pulse rounded-full shadow-lg" 
                  style={{ backgroundColor: 'var(--brand-red)', boxShadow: '0 0 10px var(--brand-red)' }} 
                  aria-hidden 
                />
                <div className="flex flex-col">
                  <p className="text-xs font-medium uppercase tracking-wider text-brand-red">Featured</p>
                  <p className="text-xs uppercase tracking-wide text-white/70">Case Study</p>
                </div>
              </div>
            </div>

            {/* Enhanced title with better typography */}
            <h3 className="mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
              {title}
            </h3>

            {/* Enhanced bullet points with icons */}
            <div className="mb-6 grid gap-3 md:grid-cols-2">
              {bullets.map((bullet, index) => (
                <div key={bullet} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red/20">
                    <svg className="h-3 w-3 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-white/90 leading-relaxed">{bullet}</span>
                </div>
              ))}
            </div>

            {/* Enhanced CTA button */}
            <div className="flex flex-wrap gap-3">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-white to-white/95 px-6 py-3 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-white/95 hover:to-white"
              >
                <span>{cta}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="md:w-1/3">
            {/* Enhanced quote section */}
            <div className="relative">
              {/* Decorative background element */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-brand-red/10 to-transparent blur-xl" />
              
              <figure className="relative rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
                {/* Large decorative quote mark */}
                <div className="mb-4 flex justify-center">
                  <svg 
                    className="h-12 w-12 text-brand-red/30" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
                
                <blockquote className="text-center text-white/90 leading-relaxed">
                  <span className="text-lg font-medium">&ldquo;</span>
                  <span className="text-sm">{quote}</span>
                  <span className="text-lg font-medium">&rdquo;</span>
                </blockquote>

                {/* Attribution */}
                <div className="mt-4 text-center">
                  <div className="h-px w-12 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent mb-2" />
                  <p className="text-xs font-medium text-white/60 uppercase tracking-wide">Somerset Council</p>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
