import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ImageWithFallback from '@/components/ImageWithFallback'

// Mock Next.js Image component
jest.mock('next/image', () => {
  const MockImage = ({ onError, onLoad, src, alt, ...props }: any) => {
    return (
      <img
        src={src}
        alt={alt}
        onError={onError}
        onLoad={onLoad}
        data-testid="mock-image"
        {...props}
      />
    )
  }
  MockImage.displayName = 'Image'
  return MockImage
})

describe('ImageWithFallback Component', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    fallbackSrc: '/fallback-image.jpg',
    alt: 'Test image',
    width: 300,
    height: 200
  }

  it('renders image with correct src initially', () => {
    render(<ImageWithFallback {...defaultProps} />)
    
    const image = screen.getByTestId('mock-image')
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveAttribute('alt', 'Test image')
  })

  it('shows loading placeholder when loading=lazy and not priority', () => {
    render(<ImageWithFallback {...defaultProps} loading="lazy" priority={false} />)
    
    // Should show loading placeholder initially
    const loadingPlaceholder = document.querySelector('.animate-pulse')
    expect(loadingPlaceholder).toBeInTheDocument()
  })

  it('does not show loading placeholder when priority=true', () => {
    render(<ImageWithFallback {...defaultProps} priority={true} />)
    
    const image = screen.getByTestId('mock-image')
    expect(image).toBeInTheDocument()
  })

  it('switches to fallback image on error', async () => {
    render(<ImageWithFallback {...defaultProps} />)
    
    const image = screen.getByTestId('mock-image')
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    
    // Simulate image error
    fireEvent.error(image)
    
    await waitFor(() => {
      expect(image).toHaveAttribute('src', '/fallback-image.jpg')
    })
  })

  it('handles load event correctly', async () => {
    render(<ImageWithFallback {...defaultProps} loading="lazy" priority={false} />)
    
    // Initially shows loading placeholder
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    
    const image = screen.getByTestId('mock-image')
    fireEvent.load(image)
    
    // Loading placeholder should disappear after load
    await waitFor(() => {
      expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument()
    })
  })

  it('applies custom className correctly', () => {
    render(<ImageWithFallback {...defaultProps} className="custom-class" />)
    
    const image = screen.getByTestId('mock-image')
    expect(image).toHaveClass('custom-class')
  })

  it('supports fill prop', () => {
    render(<ImageWithFallback {...defaultProps} fill={true} />)
    
    const image = screen.getByTestId('mock-image')
    expect(image).toHaveAttribute('fill')
  })
})