import { redirect } from 'next/navigation'

export default function BookNowRedirect() {
  redirect('/book-appointment?intent=book')
}
