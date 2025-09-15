"use client"

import React from 'react'

// UK Bank Holidays - add more as needed
const UK_BANK_HOLIDAYS = [
  // 2024
  '2024-01-01', '2024-03-29', '2024-04-01', '2024-05-06', '2024-05-27', '2024-08-26', '2024-12-25', '2024-12-26',
  // 2025
  '2025-01-01', '2025-04-18', '2025-04-21', '2025-05-05', '2025-05-26', '2025-08-25', '2025-12-25', '2025-12-26',
  // 2026
  '2026-01-01', '2026-04-03', '2026-04-06', '2026-05-04', '2026-05-25', '2026-08-31', '2026-12-25', '2026-12-28',
]

// Helper function to check if current date is a UK bank holiday
const isBankHoliday = (date: Date): boolean => {
  const dateString = date.toISOString().split('T')[0]
  return UK_BANK_HOLIDAYS.includes(dateString)
}

export default function OpenBanner() {
  const [isOpen, setIsOpen] = React.useState(false)
  
  React.useEffect(() => {
    const checkStatus = () => {
      const now = new Date()
      const currentDay = now.getDay()
      const currentTime = now.getHours() * 100 + now.getMinutes()
      
      // Closed on weekends
      if (currentDay === 0 || currentDay === 6) {
        setIsOpen(false)
        return
      }
      
      // Closed on bank holidays
      if (isBankHoliday(now)) {
        setIsOpen(false)
        return
      }
      
      // Monday-Friday: 9:00 AM to 4:00 PM
      setIsOpen(currentTime >= 900 && currentTime < 1600)
    }
    
    checkStatus()
    const interval = setInterval(checkStatus, 60000)
    return () => clearInterval(interval)
  }, [])
  
  if (!isOpen) return null
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
      <div className="relative overflow-hidden">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-white/10 to-green-400/20 animate-pulse"></div>
        
        <div className="relative flex items-center justify-center py-3 px-4">
          <div className="flex items-center gap-3 text-center">
            {/* Pulsing phone icon */}
            <div className="relative">
              <svg className="w-5 h-5 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
            </div>
            
            {/* Main message */}
            <div className="text-white">
              <span className="font-bold text-lg">CALL NOW - We are OPEN!</span>
              <span className="hidden sm:inline ml-2 text-sm opacity-90">Get your free quote today</span>
            </div>
            
            {/* Call to action button */}
            <a 
              href="tel:01458860339"
              className="ml-4 bg-white text-green-600 font-bold px-4 py-2 rounded-full hover:bg-green-50 transition-all duration-300 hover:scale-105 shadow-lg text-sm"
            >
              📞 01458 860339
            </a>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}