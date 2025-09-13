import React from 'react'
import Link from 'next/link'

type Step = {
  title: string
  desc: string
  icon: React.ReactNode
}

const Arrow = ({ direction = 'right' }: { direction?: 'right' | 'down' }) => (
  <span
    aria-hidden
    className={`hidden md:inline-flex items-center justify-center text-brand-white/70 transition-transform group-hover:translate-x-0.5 ${direction === 'down' ? 'md:hidden inline-flex rotate-90' : ''}`}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="#E11D2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
)

const CircleIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white">
    {children}
  </div>
)

export default function ProcessFlow() {
  const steps: Step[] = [
    {
      title: 'Get in touch',
      desc: 'Contact us by form, email, phone or WhatsApp.',
      icon: <CircleIcon>1</CircleIcon>,
    },
    {
      title: 'Quick quote',
      desc: 'We confirm details and provide a clear price.',
      icon: <CircleIcon>2</CircleIcon>,
    },
    {
      title: 'Book a date',
      desc: 'Agree a convenient time. No need to be home.',
      icon: <CircleIcon>3</CircleIcon>,
    },
    {
      title: 'Reminder',
      desc: 'We send a reminder just before your clean.',
      icon: <CircleIcon>4</CircleIcon>,
    },
    {
      title: 'Clean (guaranteed)',
      desc: 'Uniformed, fully insured team. Spot‑free results.',
      icon: <CircleIcon>5</CircleIcon>,
    },
    {
      title: 'Pay online',
      desc: 'Invoice by email with easy, secure payment.',
      icon: <CircleIcon>6</CircleIcon>,
    },
  ]

  return (
    <div className="group">
      <ol className="flex flex-col gap-4 md:flex-row md:items-stretch">
        {steps.map((s, i) => (
          <React.Fragment key={s.title}>
            <li className="flex-1 rounded-xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-start gap-3">
                {s.icon}
                <div>
                  <h3 className="text-base font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-white/75">{s.desc}</p>
                </div>
              </div>
            </li>
            {i < steps.length - 1 && (
              <div className="hidden items-center md:flex">
                <Arrow />
              </div>
            )}
            {i < steps.length - 1 && (
              <div className="md:hidden flex items-center justify-center">
                <Arrow direction="down" />
              </div>
            )}
          </React.Fragment>
        ))}
      </ol>
      <p className="mt-3 text-xs text-white/60">
        Prefer WhatsApp? Message us directly at{' '}
        <a href="https://wa.me/447415526331" className="underline decoration-brand-red underline-offset-2 hover:text-white">07415 526 331</a> — we reply during opening hours.
      </p>
    </div>
  )
}

