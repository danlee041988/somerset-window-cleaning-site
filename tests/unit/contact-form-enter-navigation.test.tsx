import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GeneralEnquiryForm from '@/components/features/contact/GeneralEnquiryForm'

describe('GeneralEnquiryForm keyboard navigation', () => {
  it('moves focus to the next field instead of submitting when Enter is pressed', async () => {
    const user = userEvent.setup()
    render(<GeneralEnquiryForm />)

    const firstNameInput = screen.getByPlaceholderText('Your first name') as HTMLInputElement
    const lastNameInput = screen.getByPlaceholderText('Your last name') as HTMLInputElement

    await user.click(firstNameInput)
    await user.type(firstNameInput, 'Dan')

    expect(document.activeElement).toBe(firstNameInput)

    await user.keyboard('{Enter}')

    expect(document.activeElement).toBe(lastNameInput)
    expect(lastNameInput.value).toBe('')
  })
})
