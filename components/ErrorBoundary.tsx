'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>
}

const DefaultErrorFallback = ({ error, retry }: { error?: Error; retry?: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-brand-black text-white p-8">
    <div className="text-center max-w-md">
      <h2 className="text-2xl font-bold text-brand-red mb-4">
        Something went wrong
      </h2>
      <p className="text-white/80 mb-6">
        We apologize for the inconvenience. Please try refreshing the page.
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="text-left bg-white/10 p-4 rounded-lg mb-4">
          <summary className="cursor-pointer font-medium">Error details</summary>
          <pre className="mt-2 text-xs overflow-auto">
            {error.message}
            {'\n'}
            {error.stack}
          </pre>
        </details>
      )}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Refresh Page
        </button>
        {retry && (
          <button
            onClick={retry}
            className="px-6 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  </div>
)

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service in production
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { errorInfo } })
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} retry={this.retry} />
    }

    return this.props.children
  }
}