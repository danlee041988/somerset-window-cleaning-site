/**
 * Progress Bar Component
 * Shows progress through multi-step forms
 */

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
  className?: string
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  labels,
  className = '',
}: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100

  return (
    <div className={`w-full ${className}`} role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      {/* Progress bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-brand-red transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step labels */}
      {labels && labels.length === totalSteps && (
        <div className="mt-4 flex justify-between">
          {labels.map((label, index) => {
            const stepNumber = index + 1
            const isComplete = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const isPending = stepNumber > currentStep

            return (
              <div
                key={label}
                className={`flex flex-col items-center gap-2 ${
                  isCurrent ? 'text-brand-red' : isComplete ? 'text-white/70' : 'text-white/40'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                    isCurrent
                      ? 'border-brand-red bg-brand-red/20 text-brand-red'
                      : isComplete
                      ? 'border-white/40 bg-white/10 text-white/70'
                      : 'border-white/20 bg-transparent text-white/40'
                  }`}
                >
                  {isComplete ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className="text-xs font-medium">{label}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite">
        Step {currentStep} of {totalSteps}
        {labels && labels[currentStep - 1] && `: ${labels[currentStep - 1]}`}
      </div>
    </div>
  )
}
