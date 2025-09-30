/**
 * Loading Spinner Component
 * Accessible loading indicator
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}

export default function LoadingSpinner({
  size = 'md',
  message = 'Loading...',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} role="status">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-brand-red border-t-transparent`}
        aria-hidden="true"
      />
      <span className="sr-only">{message}</span>
      {message && (
        <p className="text-sm text-white/70" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  )
}
