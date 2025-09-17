"use client"

import React from 'react'
import { useState, useEffect } from 'react'

export default function StrategicCTA() {
  const [currentStat, setCurrentStat] = useState(0)
  
  const stats = [
    { value: "500+", label: "Properties Cleaned" },
    { value: "4.9★", label: "Google Rating" },
    { value: "195+", label: "Google Reviews" }
  ]

  // Rotate stats every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [stats.length])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm">
      {/* Animated gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-brand-red to-transparent animate-pulse" />
      
      <div className="p-8 md:p-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Section - Main CTA Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Urgency indicator */}
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20">
              <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              <span className="text-xs font-medium text-brand-red uppercase tracking-wide">
                Booking Fast
              </span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-3">
              Book Your Window Clean Today
            </h3>
            
            <p className="text-white/80 text-lg mb-6 max-w-lg">
              Join hundreds of satisfied customers across Somerset. Professional service, 
              <span className="text-brand-red font-semibold"> guaranteed results</span>, 
              and no upfront payment required.
            </p>

            {/* Social proof with rotating stats */}
            <div className="flex items-center justify-center lg:justify-start gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-red transition-all duration-500">
                  {stats[currentStat].value}
                </div>
                <div className="text-xs text-white/60 uppercase tracking-wide">
                  {stats[currentStat].label}
                </div>
              </div>
              
              <div className="h-8 w-px bg-white/20" />
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white/70">Fully Insured</span>
              </div>
            </div>
          </div>

          {/* Right Section - Action Area */}
          <div className="flex-shrink-0">
            <div className="text-center lg:text-right mb-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-green-400">Quick Response</span>
              </div>
              <p className="text-white/60 text-sm">
                Response within 2 hours
              </p>
            </div>

            {/* Primary CTA Button */}
            <a
              href="/get-in-touch"
              className="group inline-flex items-center justify-center gap-3 w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-brand-red to-brand-red/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-brand-red/25 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>Book Now</span>
              <svg 
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>

            {/* Secondary action */}
            <div className="mt-3 text-center">
              <p className="text-xs text-white/50">
                Or call{" "}
                <a 
                  href="tel:01749123456" 
                  className="text-brand-red hover:text-white transition-colors font-medium"
                >
                  01749 123456
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Benefits Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No upfront payment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Fast response times</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Professional guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}