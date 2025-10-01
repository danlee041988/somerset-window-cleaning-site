'use client'

import * as Sentry from '@sentry/nextjs'
import { useState } from 'react'

export default function SentryTestPage() {
  const [error, setError] = useState<string | null>(null)

  const triggerError = () => {
    try {
      // @ts-ignore - intentionally calling undefined function
      myUndefinedFunction()
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Unknown error'
      setError(errorMsg)
      Sentry.captureException(e)
      console.log('✅ Error sent to Sentry:', errorMsg)
    }
  }

  const triggerComponentError = () => {
    // This will cause React to catch and report to Sentry
    throw new Error('Test error from React component')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Sentry Error Testing</h1>
        <p className="text-gray-600 mb-8">
          Click the buttons below to trigger test errors and verify Sentry is capturing them.
        </p>

        <div className="space-y-4">
          {/* Test Button 1 */}
          <div>
            <button
              onClick={triggerError}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Trigger Caught Error (try/catch)
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Calls an undefined function inside try/catch and manually reports to Sentry
            </p>
          </div>

          {/* Test Button 2 */}
          <div>
            <button
              onClick={triggerComponentError}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Trigger Uncaught React Error
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Throws an uncaught error that React Error Boundary will catch
            </p>
          </div>

          {/* Test Button 3 */}
          <div>
            <button
              onClick={() => {
                Sentry.captureMessage('Test message from Somerset Window Cleaning', 'info')
                setError('✅ Test message sent to Sentry')
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Send Test Message to Sentry
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Sends an informational message (not an error) to verify Sentry connection
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            <p className="font-semibold">Result:</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2">
              Check your{' '}
              <a
                href="https://somerset-window-cleaning.sentry.io"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                Sentry dashboard
              </a>{' '}
              to see the captured error
            </p>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold text-blue-900 mb-2">What to check:</h2>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Open Sentry dashboard in new tab</li>
            <li>Click a test button</li>
            <li>Refresh Sentry dashboard to see the error</li>
            <li>Verify error details, stack trace, and user context</li>
          </ul>
        </div>

        <div className="mt-4 text-center">
          <a
            href="https://somerset-window-cleaning.sentry.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 font-semibold underline"
          >
            Open Sentry Dashboard →
          </a>
        </div>
      </div>
    </div>
  )
}
