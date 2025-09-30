/**
 * Alert Component
 * Displays important messages to users
 */

import { useEffect } from 'react'
import { announceToScreenReader } from '@/lib/accessibility'

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  onClose?: () => void
  className?: string
}

export default function Alert({
  type = 'info',
  title,
  message,
  action,
  onClose,
  className = '',
}: AlertProps) {
  // Announce to screen readers
  useEffect(() => {
    const priority = type === 'error' ? 'assertive' : 'polite'
    const announcement = title ? `${title}: ${message}` : message
    announceToScreenReader(announcement, priority)
  }, [type, title, message])

  const styles = {
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  }

  const style = styles[type]

  return (
    <div
      className={`rounded-lg border ${style.bg} ${style.border} p-4 ${className}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${style.text}`} aria-hidden="true">
          {style.icon}
        </div>

        <div className="flex-1">
          {title && (
            <h3 className={`mb-1 text-sm font-semibold ${style.text}`}>
              {title}
            </h3>
          )}
          <p className="text-sm text-white/80">{message}</p>

          {action && (
            <button
              onClick={action.onClick}
              className={`mt-3 text-sm font-medium ${style.text} underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black`}
            >
              {action.label}
            </button>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white/40 hover:text-white/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Close alert"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
