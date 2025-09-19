"use client"

import React from 'react'

// UK Bank Holidays
const UK_BANK_HOLIDAYS = [
  // 2024
  '2024-01-01', '2024-03-29', '2024-04-01', '2024-05-06', '2024-05-27', '2024-08-26', '2024-12-25', '2024-12-26',
  // 2025
  '2025-01-01', '2025-04-18', '2025-04-21', '2025-05-05', '2025-05-26', '2025-08-25', '2025-12-25', '2025-12-26',
  // 2026
  '2026-01-01', '2026-04-03', '2026-04-06', '2026-05-04', '2026-05-25', '2026-08-31', '2026-12-25', '2026-12-28',
]

const isBankHoliday = (date: Date): boolean => {
  const dateString = date.toISOString().split('T')[0]
  return UK_BANK_HOLIDAYS.includes(dateString)
}

// Hook to check if business is open (shared logic)
const useIsBusinessOpen = () => {
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
  
  return isOpen
}

type DynamicLayoutProps = {
  children: React.ReactNode
}

export default function DynamicLayout({ children }: DynamicLayoutProps) {
  const isBusinessOpen = useIsBusinessOpen()
  
  return (
    <main 
      id="content" 
      className={`transition-all duration-300 ${
        isBusinessOpen 
          ? 'pt-36 md:pt-40 lg:pt-44' // Extra padding when banner is shown
          : 'pt-28 md:pt-32 lg:pt-36'  // Normal padding when banner is hidden
      }`}
    >
      {children}
    </main>
  )
}
