import { test, expect } from '@playwright/test'

test.describe('Mobile Header Size Check', () => {
  test('should have appropriately sized logo on mobile', async ({ page }) => {
    // Set mobile viewport (iPhone 12 Pro)
    await page.setViewportSize({ width: 390, height: 844 })

    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')

    // Get the logo element
    const logo = page.locator('header a[href="/"] svg, header a[href="/"] img').first()

    // Get logo dimensions
    const logoBox = await logo.boundingBox()

    if (logoBox) {
      console.log('\n📱 MOBILE LOGO MEASUREMENTS:')
      console.log(`  Width: ${logoBox.width}px`)
      console.log(`  Height: ${logoBox.height}px`)
      console.log(`  Viewport width: 390px`)
      console.log(`  Logo takes up: ${((logoBox.width / 390) * 100).toFixed(1)}% of screen width`)
    }

    // Get header dimensions
    const header = page.locator('header').first()
    const headerBox = await header.boundingBox()

    if (headerBox) {
      console.log(`\n📏 HEADER MEASUREMENTS:`)
      console.log(`  Height: ${headerBox.height}px`)
    }

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/mobile-header-check.png',
      fullPage: false
    })
    console.log('\n📸 Screenshot saved to tests/screenshots/mobile-header-check.png')

    // Check sticky CTA at bottom
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(500)

    const stickyButton = page.locator('div.fixed.bottom-0').first()
    const stickyBox = await stickyButton.boundingBox()

    if (stickyBox) {
      console.log(`\n📍 BOTTOM CTA BANNER:`)
      console.log(`  Height: ${stickyBox.height}px`)
      console.log(`  Takes up from bottom: ${stickyBox.height}px`)
    }

    await page.screenshot({
      path: 'tests/screenshots/mobile-with-sticky-cta.png',
      fullPage: false
    })
    console.log('📸 Screenshot with sticky CTA saved to tests/screenshots/mobile-with-sticky-cta.png\n')

    // Recommendations
    console.log('✅ RECOMMENDATIONS:')
    if (logoBox && logoBox.height > 40) {
      console.log(`  ⚠️  Logo height (${logoBox.height}px) might be too tall for mobile`)
      console.log('     Recommended: 28-36px for optimal mobile UX')
    }
    if (stickyBox && stickyBox.height > 60) {
      console.log(`  ⚠️  Sticky CTA (${stickyBox.height}px) might be too tall`)
      console.log('     Recommended: 48-56px for optimal mobile UX')
    }
  })

  test('should check mobile header on different screen sizes', async ({ page }) => {
    const devices = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 12 Pro', width: 390, height: 844 },
      { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
      { name: 'Samsung Galaxy S21', width: 360, height: 800 },
    ]

    for (const device of devices) {
      await page.setViewportSize({ width: device.width, height: device.height })
      await page.goto('http://localhost:3000')
      await page.waitForLoadState('networkidle')

      const logo = page.locator('header a[href="/"] svg, header a[href="/"] img').first()
      const logoBox = await logo.boundingBox()

      if (logoBox) {
        const widthPercent = ((logoBox.width / device.width) * 100).toFixed(1)
        console.log(`${device.name} (${device.width}x${device.height}):`)
        console.log(`  Logo: ${logoBox.width}x${logoBox.height}px (${widthPercent}% width)`)
      }

      await page.screenshot({
        path: `tests/screenshots/mobile-${device.name.toLowerCase().replace(/\s/g, '-')}.png`,
      })
    }
  })
})
