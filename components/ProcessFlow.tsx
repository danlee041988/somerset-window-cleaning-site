import React from 'react'
import Link from 'next/link'

type Step = {
  title: string
  desc: string
  icon: React.ReactNode
  number: number
}

const Arrow = ({ direction = 'right' }: { direction?: 'right' | 'down' }) => (
  <span
    aria-hidden
    className={`hidden md:inline-flex items-center justify-center text-[var(--brand-red)] transition-transform group-hover:translate-x-1 ${direction === 'down' ? 'md:hidden inline-flex rotate-90' : ''}`}
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
)

const StepIcon = ({ children, number }: { children: React.ReactNode, number: number }) => (
  <div className="relative">
    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--brand-red)] bg-[var(--brand-red)] text-white font-bold text-lg shadow-lg">
      {number}
    </div>
    <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
      {children}
    </div>
  </div>
)

export default function ProcessFlow() {
  const steps: Step[] = [
    {
      title: 'Get in touch',
      desc: 'Contact us by form, email, phone or WhatsApp.',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      number: 1,
    },
    {
      title: 'Quick quote',
      desc: 'We confirm details and provide a clear price.',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
        </svg>
      ),
      number: 2,
    },
    {
      title: 'Book a date',
      desc: 'Agree a convenient time. No need to be home.',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      number: 3,
    },
    {
      title: 'Reminder',
      desc: 'We send a reminder just before your clean.',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      number: 4,
    },
    {
      title: 'Clean (guaranteed)',
      desc: 'Uniformed, fully insured team. Spot‑free results.',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      number: 5,
    },
    {
      title: 'Pay online',
      desc: 'Invoice by email with easy, secure payment.',
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      ),
      number: 6,
    },
  ]

  return (
    <div className="group">
      <ol className="flex flex-col gap-6 md:flex-row md:items-stretch md:gap-4">
        {steps.map((s, i) => (
          <React.Fragment key={s.title}>
            <li className="flex-1 rounded-xl border border-white/10 bg-white/10 p-5 transition-all duration-200 hover:bg-white/15 hover:border-white/20 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <StepIcon number={s.number}>{s.icon}</StepIcon>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-white/80 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </li>
            {i < steps.length - 1 && (
              <div className="hidden items-center md:flex px-2">
                <Arrow />
              </div>
            )}
            {i < steps.length - 1 && (
              <div className="md:hidden flex items-center justify-center py-2">
                <Arrow direction="down" />
              </div>
            )}
          </React.Fragment>
        ))}
      </ol>
    </div>
  )
}

