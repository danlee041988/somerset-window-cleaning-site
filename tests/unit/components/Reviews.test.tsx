import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Reviews, { ReviewsShowcase } from '@/components/Reviews'

describe('Reviews component variants', () => {
  it('renders the spotlight variant with feature review', () => {
    render(<Reviews variant="spotlight" />)

    expect(screen.getByText('Google rating')).toBeInTheDocument()
    expect(screen.getByText(/4\.9 out of 5 on Google/)).toBeInTheDocument()
    expect(screen.getByText(/Second window clean with Somerset Window Cleaning/)).toBeInTheDocument()
    expect(screen.getByText('Jodie Cater')).toBeInTheDocument()
  })

  it('renders the carousel variant with navigation controls', async () => {
    render(<Reviews variant="carousel" />)

    const nextButton = screen.getByRole('button', { name: /Next review/i })
    const prevButton = screen.getByRole('button', { name: /Previous review/i })
    const highlightedCard = screen.getByTestId('review-card-emphasis')

    expect(nextButton).toBeInTheDocument()
    expect(prevButton).toBeInTheDocument()
    expect(highlightedCard).toHaveTextContent('Jodie Cater')

    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByTestId('review-card-emphasis')).toHaveTextContent('Sandra')
    })
  })

  it('renders the mosaic variant with multiple review cards', () => {
    render(<Reviews variant="mosaic" />)

    expect(screen.getByText(/195\+ Google reviews/)).toBeInTheDocument()

    const cards = screen.getAllByText(/Window Cleaning|Routine Clean|Commercial Frontage/)
    expect(cards.length).toBeGreaterThanOrEqual(3)
  })
})

describe('Reviews showcase', () => {
  it('displays all three design headings', () => {
    render(<ReviewsShowcase />)

    expect(screen.getByText(/Concept A: Customer Spotlight/)).toBeInTheDocument()
    expect(screen.getByText(/Concept B: Guided Carousel/)).toBeInTheDocument()
    expect(screen.getByText(/Concept C: Review Mosaic/)).toBeInTheDocument()
  })
})
