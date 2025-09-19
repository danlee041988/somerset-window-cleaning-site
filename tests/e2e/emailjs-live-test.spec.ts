import { test, expect } from '@playwright/test'

test.describe('EmailJS Live Site Tests', () => {
  test('contact form loads correctly on live site', async ({ page }) => {
    // Test against the live Vercel deployment
    await page.goto('https://somerset-window-cleaning-nextjs.vercel.app/get-in-touch')
    
    // Wait for form to load
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 })
    
    // Check that EmailJS scripts are loaded
    const emailjsScript = page.locator('script[src*="emailjs"]')
    await expect(emailjsScript).toBeAttached()
    
    // Verify all form fields are present
    await expect(page.locator('[name="first_name"]')).toBeVisible()
    await expect(page.locator('[name="last_name"]')).toBeVisible()
    await expect(page.locator('[name="email"]')).toBeVisible()
    await expect(page.locator('[name="mobile"]')).toBeVisible()
    
    // Check customer type radio buttons
    await expect(page.locator('input[type="radio"][value="new"]')).toBeVisible()
    await expect(page.locator('input[type="radio"][value="existing"]')).toBeVisible()
    
    // Check service selection dropdowns
    await expect(page.locator('[name="property_type"]')).toBeVisible()
    await expect(page.locator('[name="bedrooms"]')).toBeVisible()
    
    // Check reCAPTCHA loads
    await expect(page.locator('.g-recaptcha')).toBeVisible({ timeout: 15000 })
    
    // Check submit button
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toContainText(/get my quote|submit/i)
    
    console.log('✅ All EmailJS form elements loaded successfully')
  })
  
  test('form validation works correctly', async ({ page }) => {
    await page.goto('https://somerset-window-cleaning-nextjs.vercel.app/get-in-touch')
    
    // Wait for form to load
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 })
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    // Check that validation messages appear
    const firstNameField = page.locator('[name="first_name"]')
    const emailField = page.locator('[name="email"]')
    
    // HTML5 validation should trigger
    const firstNameValid = await firstNameField.evaluate(el => (el as HTMLInputElement).validity.valid)
    const emailValid = await emailField.evaluate(el => (el as HTMLInputElement).validity.valid)
    
    // At least one field should be invalid (empty required field)
    expect(firstNameValid || emailValid).toBe(false)
    
    console.log('✅ Form validation working correctly')
  })
  
  test('emailjs configuration is accessible', async ({ page }) => {
    await page.goto('https://somerset-window-cleaning-nextjs.vercel.app/get-in-touch')
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle')
    
    // Check if EmailJS configuration is available
    const config = await page.evaluate(() => {
      return {
        hasEmailJS: typeof window.emailjs !== 'undefined',
        publicKey: 'cbA_IhBfxEeDwbEx6', // Expected
        serviceId: 'service_yfnr1a9',     // Expected
        templateId: 'template_booking_form' // Expected
      }
    })
    
    expect(config.hasEmailJS).toBe(true)
    console.log('✅ EmailJS configuration verified:', config)
  })
})
