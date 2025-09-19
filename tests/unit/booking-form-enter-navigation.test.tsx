import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookingForm from '@/components/BookingForm'

describe('BookingForm keyboard navigation', () => {
  it('keeps the user within the form when Enter is pressed in the first name field', async () => {
    const user = userEvent.setup()
    render(<BookingForm />)

    const firstNameInput = screen.getByPlaceholderText('Alex') as HTMLInputElement
    const lastNameInput = screen.getByPlaceholderText('Morgan') as HTMLInputElement

    await user.click(firstNameInput)
    await user.type(firstNameInput, 'John')

    expect(document.activeElement).toBe(firstNameInput)

    await user.keyboard('{Enter}')

    expect(document.activeElement).toBe(lastNameInput)
    expect(lastNameInput.value).toBe('')
  })
})
