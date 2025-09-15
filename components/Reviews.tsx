"use client"

import React from 'react'

interface Review {
  name: string
  text: string
  verified: boolean
  service?: string
  rating: number
  date?: string
  initials?: string
}

const reviews: Review[] = [
  {
    name: "Tricia Woods",
    text: "Yes I was very happy with my window clean they sparkle, shame it has rained ever since!!! And appreciated you came so soon after I asked. Looking forward to the next time!",
    verified: true,
    service: "Window Cleaning",
    rating: 5,
    initials: "TW"
  },
  {
    name: "Sandra",
    text: "Dylan did a fantastic window clean for me this morning. All the windows, although hard to reach (as they're high off the ground), were left absolutely spotless.",
    verified: true,
    service: "Window Cleaning", 
    rating: 5,
    initials: "S"
  },
  {
    name: "Dean Rowland",
    text: "Would highly recommend, brilliant service, windows have never been cleaner. The man who cleaned was ever so polite too.",
    verified: true,
    service: "Window Cleaning",
    rating: 5,
    initials: "DR"
  },
  {
    name: "TheShortfry",
    text: "We desperately needed a window clean as we are selling our property and had a viewing in the next couple of days. They fit us in and saved the day!",
    verified: true,
    service: "Emergency Clean",
    rating: 5,
    initials: "TS"
  },
  {
    name: "Graham Whitcombe",
    text: "We asked SWC if they were able to clean our solar panels. They arrived, looked at the solar panels, a price was agreed and they did a fantastic job. Highly professional service.",
    verified: true,
    service: "Solar Panel Cleaning",
    rating: 5,
    initials: "GW"
  },
  {
    name: "Helen F",
    text: "These guys are extremely professional - they turn up when they say, do a thorough job of the windows (even awkward and very high ones), and have an easy payment system.",
    verified: true,
    service: "Window Cleaning",
    rating: 5,
    initials: "HF"
  },
  {
    name: "Katie Boxer",
    text: "Excellent window cleaning service. Reliable and professional. I have been using Somerset Window Cleaning for years.",
    verified: true,
    service: "Window Cleaning",
    rating: 5,
    initials: "KB"
  },
  {
    name: "Claire Tucker",
    text: "I've used this business for quite a while. Always happy with the service. Text reminders on upcoming visit & automation payment afterwards. Very efficient business with a streamlined process.",
    verified: true,
    service: "Window Cleaning",
    rating: 5,
    initials: "CT"
  },
  {
    name: "John Rider",
    text: "Been using Somerset window cleaning for the last 7 years and cannot recommend them enough, professional thorough and reliable.",
    verified: true,
    service: "Window Cleaning",
    rating: 5,
    initials: "JR"
  },
  {
    name: "Tom Bath",
    text: "Excellent, thorough service. Polite courteous staff and very accommodating. Competitively priced but frankly I'm happy to pay a bit extra for a reliable service.",
    verified: true,
    service: "Window Cleaning",
    rating: 5,
    initials: "TB"
  },
  {
    name: "Matt Coley",
    text: "Great Technique, walked straight into the french doors they were so clean, didn't even know they were there.",
    verified: true,
    service: "Window Cleaning",
    rating: 5,
    initials: "MC"
  },
  {
    name: "Lilli",
    text: "These people are the best!! They are helpful and friendly, send out reminders, turn up reliably when they say they will, do a brilliant job and charge the same as everyone else. I highly recommend them.",
    verified: true,
    service: "Window Cleaning",
    rating: 5,
    initials: "L"
  }
]

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true)

  // Calculate number of pages for pagination dots
  const reviewsPerPage = 3
  const totalPages = Math.min(3, Math.ceil(reviews.length / reviewsPerPage)) // Limit to 3 pages maximum

  // Auto-advance reviews every 5 seconds
  React.useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxPage = totalPages - 1
        return prev >= maxPage ? 0 : prev + 1
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, totalPages])

  const nextReview = () => {
    setCurrentIndex((prev) => {
      const maxPage = totalPages - 1
      return Math.min(prev + 1, maxPage)
    })
    setIsAutoPlaying(false)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
    setIsAutoPlaying(false)
  }

  const goToReview = (pageIndex: number) => {
    const maxPage = totalPages - 1
    setCurrentIndex(Math.min(pageIndex, maxPage))
    setIsAutoPlaying(false)
  }

  // Calculate translation for smooth carousel movement
  const getDesktopTransform = () => {
    // Show 3 cards, move by 1 card width each time
    const cardWidth = 33.333 // 100% / 3 cards
    return -(currentIndex * cardWidth)
  }

  const getMobileTransform = () => {
    // Show 1 card, move by full width each time
    return -(currentIndex * 100)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm">
      {/* Header with Rating Summary */}
      <div className="relative p-8 pb-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent" />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left: Rating & Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent mb-2">
                5.0
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                    <path fill="#FBBC05" d="M12 17.27 18.18 21 16.54 13.97 22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>
              <div className="text-xs text-white/60">Over 195 star reviews</div>
            </div>
            
            <div className="h-12 w-px bg-white/20" />
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c-.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-semibold text-white/90">Google Reviews</span>
              </div>
              <p className="text-sm text-white/70">Real feedback from verified customers</p>
            </div>
          </div>
          
          {/* Right: Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevReview}
              className="p-3 rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
              aria-label="Previous review"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextReview}
              className="p-3 rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
              aria-label="Next review"
            >
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Carousel */}
      <div className="px-8 pb-8">
        {/* Desktop: Show 3 reviews with smooth sliding */}
        <div className="hidden md:block overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ 
              transform: `translateX(${getDesktopTransform()}%)`,
              width: `${reviews.length * 33.333}%`
            }}
          >
            {reviews.map((review, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / reviews.length}%` }}
              >
                <ReviewCard 
                  review={review} 
                  isActive={false} // Remove active styling to make all cards consistent
                  delay={0}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile: Show 1 review with smooth sliding */}
        <div className="md:hidden overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ 
              transform: `translateX(${getMobileTransform()}%)`,
              width: `${reviews.length * 100}%`
            }}
          >
            {reviews.map((review, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-full"
              >
                <ReviewCard 
                  review={review} 
                  isActive={false} // Remove active styling for mobile too
                  delay={0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="px-8 pb-8">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => goToReview(pageIndex)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                pageIndex === currentIndex 
                  ? 'bg-brand-red w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to page ${pageIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Individual Review Card Component
function ReviewCard({ 
  review, 
  isActive, 
  delay = 0 
}: { 
  review: Review
  isActive: boolean
  delay?: number
}) {
  return (
    <div 
      className="group relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm hover:border-white/30 transition-all duration-300 h-full flex flex-col"
      style={{ 
        animationDelay: `${delay}ms`
      }}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Customer Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-white/95 truncate">{review.name}</h4>
              {review.verified && (
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                    <path fill="#FBBC05" d="M12 17.27 18.18 21 16.54 13.97 22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Review Text */}
        <blockquote className="text-sm text-white/85 leading-relaxed flex-1">
          &ldquo;{review.text}&rdquo;
        </blockquote>
        
        {/* Google Verification */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c-.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-xs font-medium text-white/60">Verified Google Review</span>
        </div>
      </div>
    </div>
  )
}