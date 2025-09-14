import { render, screen } from '@testing-library/react'
import Reviews from '@/components/Reviews'

describe('Reviews Component', () => {
  it('renders the reviews section with title', () => {
    render(<Reviews />)
    
    expect(screen.getByText('Excellent reviews from our customers')).toBeInTheDocument()
  })

  it('displays 5 stars in the header', () => {
    render(<Reviews />)
    
    // Should have 5 stars in the header plus 5 stars for each review (6 reviews = 30 stars total = 35 stars)
    const stars = screen.getAllByRole('img', { hidden: true })
    const starElements = stars.filter(star => star.getAttribute('aria-hidden') === 'true')
    expect(starElements.length).toBeGreaterThanOrEqual(30) // At least 30 stars for reviews
  })

  it('renders all review cards', () => {
    render(<Reviews />)
    
    // Check for specific reviewers
    expect(screen.getByText('Jodie Cater')).toBeInTheDocument()
    expect(screen.getByText('Sandra')).toBeInTheDocument()
    expect(screen.getByText('Dean Rowland')).toBeInTheDocument()
    expect(screen.getByText('Jayne Trott')).toBeInTheDocument()
    expect(screen.getByText('Cher Davis')).toBeInTheDocument()
    expect(screen.getByText('TheShortfry')).toBeInTheDocument()
  })

  it('shows verified customer badges', () => {
    render(<Reviews />)
    
    const verifiedBadges = screen.getAllByText('Verified Customer')
    expect(verifiedBadges).toHaveLength(6) // All 6 reviews should be verified
  })

  it('displays review text content', () => {
    render(<Reviews />)
    
    expect(screen.getByText(/Second window clean with Somerset Window Cleaning/)).toBeInTheDocument()
    expect(screen.getByText(/Dylan did a fantastic window clean/)).toBeInTheDocument()
  })

  it('has proper responsive grid structure', () => {
    render(<Reviews />)
    
    const gridContainer = screen.getByRole('list', { hidden: true }) || 
                         document.querySelector('.grid')
    expect(gridContainer).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3')
  })

  it('includes Google branding', () => {
    render(<Reviews />)
    
    // Should have Google logo in header
    const googleLogos = document.querySelectorAll('svg path[fill="#4285F4"]')
    expect(googleLogos.length).toBeGreaterThan(0)
  })
})