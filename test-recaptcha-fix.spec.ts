import { test, expect } from '@playwright/test'

test('Test reCAPTCHA fix on production site', async ({ page }) => {
  console.log('Testing reCAPTCHA fix...')
  
  // Navigate to the contact page
  await page.goto('https://somersetwindowcleaning.co.uk/get-in-touch')
  
  // Wait for page to load
  await page.waitForLoadState('networkidle')
  
  // Take screenshot
  await page.screenshot({ path: 'recaptcha-test.png', fullPage: true })
  
  // Check if the contact form has loaded (not stuck in loading state)
  const loadingSpinner = page.locator('text="Loading contact form..."')
  const isStillLoading = await loadingSpinner.isVisible()
  console.log('Contact form still loading?', isStillLoading)
  
  if (!isStillLoading) {
    console.log('✅ Contact form loaded successfully!')
    
    // Look for the reCAPTCHA
    await page.waitForTimeout(2000) // Give reCAPTCHA time to load
    
    const recaptchaFrame = page.frameLocator('iframe[src*="recaptcha"]')
    const recaptchaPresent = await page.locator('iframe[src*="recaptcha"]').count()
    console.log('reCAPTCHA iframes found:', recaptchaPresent)
    
    // Check for error messages
    const errorMessages = page.locator('text=/ERROR for site owner/i')
    const errorCount = await errorMessages.count()
    console.log('reCAPTCHA error messages:', errorCount)
    
    if (errorCount === 0 && recaptchaPresent > 0) {
      console.log('✅ reCAPTCHA appears to be working correctly!')
    } else if (errorCount > 0) {
      console.log('❌ reCAPTCHA still has errors')
      for (let i = 0; i < errorCount; i++) {
        const errorText = await errorMessages.nth(i).textContent()
        console.log(`Error ${i + 1}:`, errorText)
      }
    }
  } else {
    console.log('❌ Contact form still not loading')
  }
})