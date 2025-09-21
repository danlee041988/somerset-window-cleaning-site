import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookingForm from '@/components/BookingForm'

describe('BookingForm pricing flow', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn()
  })

  it('updates the visit total when property options change', async () => {
    const user = userEvent.setup()
    render(<BookingForm />)

    await user.click(screen.getByLabelText(/Residential home/i))
    await user.click(screen.getByLabelText(/4 bedrooms/i))
    await user.click(
      screen.getByLabelText((content) => content.toLowerCase().startsWith('detached')),
    )

    const extensionSection = screen
      .getByText(/Do you have an extension or porch\?/i)
      .closest('section')
    if (!extensionSection) throw new Error('Extension section not found')
    const extensionYes = within(extensionSection).getByRole('radio', { name: /yes/i })
    await user.click(extensionYes)
    expect(extensionYes).toBeChecked()

    await user.click(screen.getByRole('button', { name: /Continue to services/i }))

    const total = await screen.findByTestId('visit-total')
    expect(total).toHaveTextContent('£40')

    await user.click(screen.getByLabelText(/^Gutter clearing/i))
    await user.click(screen.getByLabelText(/^Fascia & soffit cleaning/i))

    expect(screen.getByTestId('window-line')).toHaveTextContent(/included with gutter & fascia bundle/i)
    expect(total).toHaveTextContent('£260')
  })

  it('switches to manual quote flow for commercial enquiries', async () => {
    const user = userEvent.setup()
    render(<BookingForm />)

    await user.click(screen.getByLabelText(/Commercial premises/i))
    await user.selectOptions(
      screen.getByLabelText(/What type of premises is it\?/i),
      'shopfront',
    )
    await user.type(
      screen.getByLabelText(/Anything we should know about access or glazing\?/i),
      'Main entrance via high street. Preferred before 9am.',
    )

    await user.click(await screen.findByRole('button', { name: /Continue to services/i }))

    await user.click(screen.getByLabelText(/Exterior window cleaning/i))
    expect(screen.queryByTestId('visit-total')).not.toBeInTheDocument()
    expect(screen.getByTestId('window-line')).toHaveTextContent(/Exterior window cleaning/i)

    await user.click(screen.getByRole('button', { name: /Continue to your details/i }))
    expect(screen.getByText(/manual quoting/i)).toBeInTheDocument()
  })
})
