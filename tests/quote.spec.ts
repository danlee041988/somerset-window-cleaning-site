import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Stub EmailJS network call to avoid real send
  await page.route('https://api.emailjs.com/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })
})

test('quote flow basic steps and frequency validation', async ({ page }) => {
  await page.goto('/quote')

  // Step 1 visible
  await expect(page.getByTestId('step-1')).toBeVisible()

  // Select property: 3 Bed, Detached
  await page.getByTestId('prop-3-Detached').click()

  // Next to prices
  await page.getByTestId('btn-step1-next').click()

  // Step 2 visible, summary present
  await expect(page.getByTestId('step-2')).toBeVisible()
  await expect(page.getByTestId('summary')).toBeVisible()

  // Select Window Cleaning, try to continue without frequency -> error expected
  await page.getByRole('checkbox', { name: /^Window Cleaning/ }).check()
  await page.getByTestId('btn-step2-next').click()
  await expect(page.getByText('Choose a window frequency')).toBeVisible()

  // Choose 4-weekly and proceed
  await page.getByRole('radio', { name: /4‑weekly frequency/i }).click()
  await page.getByTestId('btn-step2-next').click()

  // Step 3 visible
  await expect(page.getByTestId('step-3')).toBeVisible()

  // Fill required contact fields
  await page.getByLabel('First name').fill('Jane')
  await page.getByLabel('Last name').fill('Doe')
  await page.getByLabel('Email').fill('jane@example.com')
  await page.getByRole('textbox', { name: 'Postcode' }).fill('BA16 0HW')

  // Optional: verify weekend date validation via dialog alert
  const today = new Date();
  // find next Saturday
  const d = new Date(today);
  while (d.getDay() !== 6) d.setDate(d.getDate() + 1)
  const ymd = d.toISOString().slice(0,10)
  page.once('dialog', async (dialog) => { await dialog.accept() })
  await page.getByLabel('Preferred first clean date').fill(ymd)

  // Continue to Step 4
  await page.getByTestId('btn-step3-next').click()
  await expect(page.getByTestId('step-4')).toBeVisible()

  // Agree T&Cs and submit
  await page.getByText('I agree to the Terms & Conditions.').click()
  await page.getByTestId('btn-submit').click()

  // Success message visible
  await expect(page.getByText('Thanks — we’ll be in touch shortly.')).toBeVisible()
})

test('windows FREE when gutter + fascias + windows selected', async ({ page }) => {
  await page.goto('/quote')
  await page.getByTestId('prop-4-Detached').click()
  await page.getByTestId('btn-step1-next').click()
  await expect(page.getByTestId('step-2')).toBeVisible()

  // Select the three services
  await page.getByRole('checkbox', { name: /^Window Cleaning/ }).check()
  await page.getByRole('checkbox', { name: /^Gutter Clearing/ }).check()
  await page.getByRole('checkbox', { name: /^Fascias & Soffits Cleaning/ }).check()
  // Need a frequency for windows
  await page.getByRole('radio', { name: /4‑weekly frequency/i }).click()

  // Summary should mention the FREE windows offer
  await expect(page.getByText('Windows FREE with Gutter Clearing + Fascias & Soffits.')).toBeVisible()
})

test('6+ bedrooms shows POA in property cards', async ({ page }) => {
  await page.goto('/quote')
  // Click the 6+ option (either Semi/Terraced or Detached card displays POA)
  await page.getByTestId('prop-6+-Semi-Detached').click()
  // The selected card shows POA
  await expect(page.getByTestId('prop-6+-Semi-Detached')).toContainText('POA')
})
