"use client"

import React from 'react'

// Business hours configuration
const BUSINESS_HOURS = {
  monday: { open: '9:00', close: '16:00' },
  tuesday: { open: '9:00', close: '16:00' },
  wednesday: { open: '9:00', close: '16:00' },
  thursday: { open: '9:00', close: '16:00' },
  friday: { open: '9:00', close: '16:00' },
  saturday: null, // Closed
  sunday: null,   // Closed
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

// UK Bank Holidays - add more as needed
const UK_BANK_HOLIDAYS = [
  // 2024
  '2024-01-01', // New Year's Day
  '2024-03-29', // Good Friday
  '2024-04-01', // Easter Monday
  '2024-05-06', // Early May Bank Holiday
  '2024-05-27', // Spring Bank Holiday
  '2024-08-26', // Summer Bank Holiday
  '2024-12-25', // Christmas Day
  '2024-12-26', // Boxing Day
  
  // 2025
  '2025-01-01', // New Year's Day
  '2025-04-18', // Good Friday
  '2025-04-21', // Easter Monday
  '2025-05-05', // Early May Bank Holiday
  '2025-05-26', // Spring Bank Holiday
  '2025-08-25', // Summer Bank Holiday
  '2025-12-25', // Christmas Day
  '2025-12-26', // Boxing Day
  
  // 2026
  '2026-01-01', // New Year's Day
  '2026-04-03', // Good Friday
  '2026-04-06', // Easter Monday
  '2026-05-04', // Early May Bank Holiday
  '2026-05-25', // Spring Bank Holiday
  '2026-08-31', // Summer Bank Holiday
  '2026-12-25', // Christmas Day
  '2026-12-28', // Boxing Day (substitute as 26th is Saturday)
]

// Helper function to check if current date is a UK bank holiday
const isBankHoliday = (date: Date): boolean => {
  const dateString = date.toISOString().split('T')[0]
  return UK_BANK_HOLIDAYS.includes(dateString)
}

type BusinessHoursProps = {
  variant?: 'compact' | 'full'
  className?: string
}

// Helper function to check if business is currently open
const isBusinessOpen = (): { isOpen: boolean; status: string; nextOpen?: string } => {
  const now = new Date()
  const currentDay = DAYS[now.getDay()]
  const currentTime = now.getHours() * 100 + now.getMinutes()
  
  // Check if today is a bank holiday
  if (isBankHoliday(now)) {
    // Find next working day (not weekend or bank holiday)
    let nextDay = (now.getDay() + 1) % 7
    let nextDate = new Date(now)
    nextDate.setDate(nextDate.getDate() + 1)
    
    while (nextDay !== now.getDay()) {
      const nextDayName = DAYS[nextDay]
      if (BUSINESS_HOURS[nextDayName] && !isBankHoliday(nextDate)) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return {
          isOpen: false,
          status: 'Closed - Bank Holiday',
          nextOpen: `Opens ${dayNames[nextDay]} at 9:00 AM`
        }
      }
      nextDay = (nextDay + 1) % 7
      nextDate.setDate(nextDate.getDate() + 1)
    }
    return { isOpen: false, status: 'Closed - Bank Holiday' }
  }
  
  const todayHours = BUSINESS_HOURS[currentDay]
  
  // If closed today (weekend)
  if (!todayHours) {
    // Find next working day
    let nextDay = (now.getDay() + 1) % 7
    while (nextDay !== now.getDay()) {
      const nextDayName = DAYS[nextDay]
      if (BUSINESS_HOURS[nextDayName]) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return {
          isOpen: false,
          status: 'Closed - Weekends',
          nextOpen: `Opens ${dayNames[nextDay]} at 9:00 AM`
        }
      }
      nextDay = (nextDay + 1) % 7
    }
    return { isOpen: false, status: 'Closed - Weekends' }
  }
  
  // Convert business hours to numbers for comparison
  const openTime = parseInt(todayHours.open.replace(':', ''))
  const closeTime = parseInt(todayHours.close.replace(':', ''))
  
  if (currentTime >= openTime && currentTime < closeTime) {
    return { isOpen: true, status: `Open until ${formatTime(todayHours.close)}` }
  } else if (currentTime < openTime) {
    return { isOpen: false, status: `Opens at ${formatTime(todayHours.open)}` }
  } else {
    // After closing time - find next open day
    let nextDay = (now.getDay() + 1) % 7
    while (nextDay !== now.getDay()) {
      const nextDayName = DAYS[nextDay]
      if (BUSINESS_HOURS[nextDayName]) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return {
          isOpen: false,
          status: 'Closed',
          nextOpen: `Opens ${dayNames[nextDay]} at 9:00 AM`
        }
      }
      nextDay = (nextDay + 1) % 7
    }
    return { isOpen: false, status: 'Closed' }
  }
}

// Helper function to format time
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export default function BusinessHours({ variant = 'compact', className = '' }: BusinessHoursProps) {
  const [businessStatus, setBusinessStatus] = React.useState(() => isBusinessOpen())
  
  // Update status every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      setBusinessStatus(isBusinessOpen())
    }, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])
  
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${businessStatus.isOpen ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
        <span className="text-xs text-white/70">
          {businessStatus.isOpen ? 'Open' : 'Closed'}
        </span>
      </div>
    )
  }
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
        <div className={`w-3 h-3 rounded-full ${businessStatus.isOpen ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
        <div>
          <div className={`font-medium ${businessStatus.isOpen ? 'text-green-400' : 'text-red-400'}`}>
            {businessStatus.isOpen ? 'Currently Open' : 'Currently Closed'}
          </div>
          <div className="text-sm text-white/70">
            {businessStatus.status}
          </div>
          {businessStatus.nextOpen && (
            <div className="text-xs text-white/60 mt-1">
              {businessStatus.nextOpen}
            </div>
          )}
        </div>
      </div>
      
      {/* Full business hours display */}
      <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
        <h4 className="text-sm font-medium text-white mb-3">Business Hours</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-white/70">Monday - Friday:</span>
            <span className="text-white/90">9:00 AM - 4:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Saturday:</span>
            <span className="text-red-400">Closed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Sunday:</span>
            <span className="text-red-400">Closed</span>
          </div>
        </div>
      </div>
    </div>
  )
}