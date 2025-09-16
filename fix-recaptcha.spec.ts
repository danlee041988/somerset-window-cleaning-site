import { test, expect } from '@playwright/test'

test('Fix reCAPTCHA and contact form', async ({ page }) => {
  console.log('Starting reCAPTCHA debugging...')
  
  // Capture console logs and errors
  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}]`, msg.text())
  })
  
  page.on('pageerror', err => {
    console.error('[PAGE ERROR]', err.message)
  })
  
  // Navigate to the contact page
  console.log('Navigating to contact page...')
  await page.goto('https://somersetwindowcleaning.co.uk/get-in-touch')
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle')
  
  // Take initial screenshot
  await page.screenshot({ path: 'debug-initial.png' })
  
  // Check if contact form is loading or loaded
  const loadingSpinner = page.locator('text="Loading contact form..."')
  const isLoading = await loadingSpinner.isVisible()
  console.log('Is contact form loading?', isLoading)
  
  if (isLoading) {
    console.log('Contact form is stuck in loading state...')
    // Wait a bit more to see if it resolves
    await page.waitForTimeout(5000)
    
    // Check again
    const stillLoading = await loadingSpinner.isVisible()
    console.log('Still loading after 5 seconds?', stillLoading)
    
    if (stillLoading) {
      console.log('Contact form failed to load - client-side issue')
    }
  }
  
  // Look for any reCAPTCHA elements
  const recaptchaContainer = page.locator('.recaptcha-container')
  const recaptchaCount = await recaptchaContainer.count()
  console.log('reCAPTCHA containers found:', recaptchaCount)
  
  // Look for reCAPTCHA iframes
  const recaptchaIframes = page.locator('iframe[src*="recaptcha"]')
  const iframeCount = await recaptchaIframes.count()
  console.log('reCAPTCHA iframes found:', iframeCount)
  
  // Check for error messages
  const errorMessages = page.locator('text=/ERROR/i')
  const errorCount = await errorMessages.count()
  console.log('Error messages found:', errorCount)
  
  if (errorCount > 0) {
    for (let i = 0; i < errorCount; i++) {
      const errorText = await errorMessages.nth(i).textContent()
      console.log(`Error ${i + 1}:`, errorText)
    }
  }
  
  // Take final screenshot
  await page.screenshot({ path: 'debug-final.png' })
  
  console.log('Debug complete')
})