import React from 'react'

interface Review {
  name: string
  text: string
  verified: boolean
}

const reviews: Review[] = [
  {
    name: "Jodie Cater",
    text: "Second window clean with Somerset Window Cleaning — excellent on both occasions.",
    verified: true
  },
  {
    name: "Sandra",
    text: "Dylan did a fantastic window clean this morning. Hard-to-reach, high windows left spotless.",
    verified: true
  },
  {
    name: "Dean Rowland",
    text: "Would highly recommend — brilliant service, windows have never been cleaner. Very polite operative.",
    verified: true
  },
  {
    name: "Jayne Trott",
    text: "Great experience — windows done brilliantly. Reliable company, would use again.",
    verified: true
  },
  {
    name: "Cher Davis",
    text: "Very friendly and thorough service. Would definitely recommend.",
    verified: true
  },
  {
    name: "TheShortfry",
    text: "Needed a clean urgently before a viewing — rapid response and excellent result.",
    verified: true
  }
]

export default function Reviews() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-5 md:p-6">
      <div className="mb-6 flex items-center gap-2">
        {[...Array(5)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path fill="#FBBC05" d="M12 17.27 18.18 21 16.54 13.97 22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        ))}
        <span className="ml-2 text-sm font-medium text-white/90">Excellent reviews from our customers</span>
        <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, index) => (
          <div key={index} className="group flex h-full flex-col rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:from-white/15 hover:to-white/8 hover:shadow-lg hover:shadow-brand-red/10">
            {/* Stars */}
            <div className="mb-4 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 drop-shadow-sm" aria-hidden>
                  <path fill="#FBBC05" d="M12 17.27 18.18 21 16.54 13.97 22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
            
            {/* Review text */}
            <blockquote className="mb-6 flex-1 text-sm text-white/85 leading-relaxed">
              &ldquo;{review.text}&rdquo;
            </blockquote>
            
            {/* Customer info - fixed height and positioning */}
            <div className="mt-auto h-12 flex flex-col justify-end">
              <div className="font-medium text-white/95 mb-2 leading-tight">{review.name}</div>
              {review.verified && (
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c-.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="font-medium">Verified Customer</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}