import { test, expect } from '@playwright/test'

test('Debug reCAPTCHA on live site', async ({ page }) => {
  // Navigate to the contact page
  await page.goto('https://somersetwindowcleaning.co.uk/get-in-touch')
  
  // Wait for page to load
  await page.waitForLoadState('networkidle')
  
  // Check for console logs and errors
  page.on('console', msg => {
    if (msg.type() === 'log') {
      console.log('CONSOLE LOG:', msg.text())
    }
    if (msg.type() === 'error') {
      console.error('CONSOLE ERROR:', msg.text())
    }
  })
  
  // Take screenshot of current state
  await page.screenshot({ path: 'recaptcha-debug-1.png', fullPage: true })
  
  // Check if reCAPTCHA container exists
  const recaptchaContainer = page.locator('.recaptcha-container')
  console.log('reCAPTCHA container exists:', await recaptchaContainer.count())
  
  // Check for the iframe
  const recaptchaFrame = page.frameLocator('iframe[src*="recaptcha"]')
  console.log('reCAPTCHA iframe exists:', await page.locator('iframe[src*="recaptcha"]').count())
  
  // Check for error messages
  const errorElements = page.locator('text=/ERROR for site owner/i')
  if (await errorElements.count() > 0) {
    console.log('Found reCAPTCHA error message')
    const errorText = await errorElements.first().textContent()
    console.log('Error text:', errorText)
  }
  
  // Check for the specific reCAPTCHA site key issue
  const siteKeyError = page.locator('text=/Invalid site key/i')
  if (await siteKeyError.count() > 0) {
    console.log('Found "Invalid site key" error')
  }
  
  // Wait a bit to let everything load
  await page.waitForTimeout(3000)
  
  // Take final screenshot
  await page.screenshot({ path: 'recaptcha-debug-2.png', fullPage: true })
  
  // Check network requests for reCAPTCHA
  const responses = []
  page.on('response', response => {
    if (response.url().includes('recaptcha') || response.url().includes('google')) {
      responses.push({
        url: response.url(),
        status: response.status()
      })
    }
  })
  
  // Log all reCAPTCHA related network requests
  console.log('reCAPTCHA network requests:', responses)
})