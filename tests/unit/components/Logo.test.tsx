import { render, screen } from '@testing-library/react'
import Logo from '@/components/ui/Logo'

// Mock the ImageWithFallback component
jest.mock('@/components/ui/ImageWithFallback', () => {
  const MockImageWithFallback = ({ src, fallbackSrc, alt, className, priority, fill, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      className={className}
      data-testid="logo-image"
      data-fallback={fallbackSrc}
      {...(priority ? { 'data-priority': 'true' } : {})}
      {...(fill ? { 'data-fill': 'true' } : {})}
      {...props}
    />
  )
  MockImageWithFallback.displayName = 'ImageWithFallback'
  return MockImageWithFallback
})

describe('Logo Component', () => {
  it('renders with default props', () => {
    render(<Logo />)
    
    const logo = screen.getByTestId('logo-image')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('alt', 'Somerset Window Cleaning')
  })

  it('applies custom className', () => {
    render(<Logo className="custom-logo-class" />)
    
    const logo = screen.getByTestId('logo-image')
    expect(logo).toHaveClass('logo-blend', 'custom-logo-class')
  })

  it('uses correct image sources', () => {
    render(<Logo />)
    
    const logo = screen.getByTestId('logo-image')
    expect(logo).toHaveAttribute('src', '/images/logos/logo.png')
    expect(logo).toHaveAttribute('data-fallback', '/images/logos/logo.svg')
  })

  it('sets priority to true for logo images', () => {
    render(<Logo />)
    
    const logo = screen.getByTestId('logo-image')
    expect(logo).toHaveAttribute('data-priority', 'true')
  })

  it('applies correct dimensions when provided', () => {
    render(<Logo width={400} height={150} />)
    
    const logo = screen.getByTestId('logo-image')
    expect(logo).toHaveAttribute('width', '400')
    expect(logo).toHaveAttribute('height', '150')
  })

  it('uses default dimensions when not provided', () => {
    render(<Logo />)
    
    const logo = screen.getByTestId('logo-image')
    expect(logo).toHaveAttribute('width', '300')
    expect(logo).toHaveAttribute('height', '100')
  })

  it('handles width-only dimension correctly', () => {
    render(<Logo width={500} />)
    
    const logo = screen.getByTestId('logo-image')
    expect(logo).toHaveAttribute('width', '500')
    // Height should be auto when only width is provided
  })

  it('includes blend mode styling', () => {
    render(<Logo />)
    
    const logo = screen.getByTestId('logo-image')
    expect(logo).toHaveClass('logo-blend')
  })
})
