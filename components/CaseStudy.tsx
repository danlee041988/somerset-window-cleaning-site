import React from 'react'

export default function CaseStudy({
  title = 'Featured Business Success Story',
  link = 'https://www.somerset.gov.uk/business-economy-and-licences/somerset-enterprise-centres/case-studies/somerset-window-cleaning-company/',
  bullets = [
    'Grown from zero to 6 employees in under 3 years',
    'State-of-the-art cleaning technology and equipment',
    'Founded by former Royal Marine Commando Dan Lee',
    'Serving homes and businesses across Somerset',
  ],
  quote = 'Dan\'s commitment to fantastic customer service and his willingness to innovate in a traditional industry are two huge factors in his meteoric growth.',
  cta = 'Read our story',
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
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
        
        {/* Accent gradient line at top */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-brand-red to-transparent" />
        
        {/* Header section with badge and logo */}
        <div className="relative p-8 md:p-10">
          {/* Top row with properly aligned boxes */}
          <div className="mb-6 flex items-center justify-between">
            {/* Featured Case Study Badge */}
            <div className="relative inline-flex items-center gap-4 rounded-xl border border-white/20 bg-black/40 px-4 py-3 backdrop-blur-sm">
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
            
            {/* Somerset Council Logo - Aligned with badge */}
            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-black/40 px-4 py-3 backdrop-blur-sm">
              <img
                src="https://somerset.concessionarytravelpass.co.uk/buspass/Content/Images/somerset/logo.png"
                alt="Somerset Council"
                className="h-12 w-auto md:h-14 opacity-90 hover:opacity-100 transition-opacity"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-medium text-white/90">Somerset Council</span>
                <span className="text-xs text-white/60">Official Partner</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content section */}
        <div className="relative px-8 pb-8 md:px-10 md:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left column - Main content */}
            <div className="lg:col-span-2">
              {/* Enhanced title with better typography */}
              <h3 className="mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
                {title}
              </h3>

              {/* Enhanced bullet points with icons */}
              <div className="mb-8 grid gap-4 md:grid-cols-2">
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

            {/* Right column - Quote section */}
            <div className="lg:col-span-1">
              <div className="relative">
                {/* Decorative background element */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-brand-red/10 to-transparent blur-xl" />
                
                <figure className="relative rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
                  {/* Large decorative quote mark */}
                  <div className="mb-4 flex justify-center">
                    <svg 
                      className="h-8 w-8 text-brand-red/30" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                  </div>
                  
                  <blockquote className="text-center text-white/90 leading-relaxed">
                    <span className="text-sm">&ldquo;{quote}&rdquo;</span>
                  </blockquote>

                  {/* Attribution */}
                  <div className="mt-4 text-center">
                    <div className="h-px w-12 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent mb-2" />
                    <p className="text-xs font-medium text-white/60 uppercase tracking-wide">Alan Smith, Business Advisor</p>
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
