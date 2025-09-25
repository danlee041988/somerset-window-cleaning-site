import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookingForm from '@/components/BookingForm'

describe('BookingForm enquiry flow', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn()
  })

  it('summarises residential enquiry details with extras and pricing follow-up messaging', async () => {
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

    await user.click(screen.getByLabelText(/^Gutter clearing/i))
    await user.click(screen.getByLabelText(/^Fascia & soffit cleaning/i))
    await user.click(screen.getByRole('button', { name: /Continue to details/i }))

    const summary = await screen.findByTestId('enquiry-summary')
    const services = within(summary).getByTestId('enquiry-services')

    expect(services).toHaveTextContent(/Exterior window cleaning/i)
    expect(services).toHaveTextContent(/Gutter clearing requested/i)
    expect(services).toHaveTextContent(/Fascia & soffit cleaning requested/i)
    expect(services).not.toHaveTextContent(/Manual quote required/i)

    expect(within(summary).getByTestId('enquiry-pricing-note')).toHaveTextContent(/Pricing confirmed after review/i)
    expect(services).not.toHaveTextContent('£')
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
    expect(await screen.findByTestId('manual-quote-banner')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Continue to details/i }))

    const summary = await screen.findByTestId('enquiry-summary')
    const services = within(summary).getByTestId('enquiry-services')

    expect(services).toHaveTextContent(/Manual quote required/i)
    expect(within(summary).getByTestId('manual-quote-note')).toHaveTextContent(/manual quoting/i)
    expect(within(summary).getByTestId('enquiry-pricing-note')).toHaveTextContent(/Pricing confirmed after review/i)
  })
})
