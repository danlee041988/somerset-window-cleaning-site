import { test, expect } from '@playwright/test'

test.describe('Floating call CTA (mobile viewport)', () => {
  test('exposes tel link during open hours', async ({ page }, testInfo) => {
    test.skip(!/mobile/i.test(testInfo.project.name), 'Only relevant for mobile viewport projects')

    await page.addInitScript(() => {
      const fixed = new Date('2024-09-25T10:00:00')
      const OriginalDate = Date
      class FixedDate extends OriginalDate {
        constructor(...args: ConstructorParameters<typeof Date>) {
          if (args.length === 0) {
            return new OriginalDate(fixed.getTime())
          }
          return new OriginalDate(...args)
        }
        static now() {
          return fixed.getTime()
        }
      }
      // @ts-ignore
      window.Date = FixedDate
    })

    await page.goto('/')

    const floatingCta = page.getByTestId('floating-call-cta')
    await expect(floatingCta).toBeVisible()

    const callLink = floatingCta.locator('a[href="tel:01458860339"]')
    await expect(callLink).toBeVisible()
    await expect(callLink).toHaveAttribute('href', 'tel:01458860339')
  })
})
