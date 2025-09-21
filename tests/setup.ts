import '@testing-library/jest-dom'
import React from 'react'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'

jest.mock('react-google-recaptcha', () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (token: string | null) => void }) => {
    React.useEffect(() => {
      onChange('test-token')
    }, [onChange])
    return React.createElement('div', { 'data-testid': 'mock-recaptcha' })
  },
}))
