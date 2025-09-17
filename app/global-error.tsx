"use client"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen bg-brand-black p-6 text-brand-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-white/80">An unexpected error occurred while rendering this page.</p>
          <pre className="mt-4 overflow-auto rounded-md border border-white/10 bg-white/5 p-3 text-xs text-red-300">
            {error?.message}
          </pre>
          <button
            onClick={() => reset()}
            className="mt-4 rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}

