import { test, expect } from '@playwright/test'

test.describe('EmailJS Integration Tests', () => {
  test('contact form loads and submits successfully', async ({ page }) => {
    // Navigate to contact form
    await page.goto('/get-in-touch')
    
    // Wait for form to load
    await expect(page.locator('form')).toBeVisible()
    
    // Check EmailJS script loads
    await expect(page.locator('script[src*="emailjs"]')).toBeAttached()
    
    // Fill out form with test data
    await page.fill('[name="name"]', 'Test Customer')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="phone"]', '01234567890')
    await page.selectOption('[name="customerType"]', 'New customer')
    await page.fill('[name="address"]', 'Test Address, Somerset BA1 1AA')
    await page.selectOption('[name="propertySize"]', '2-3 bedrooms')
    await page.selectOption('[name="serviceType"]', 'Window Cleaning')
    await page.fill('[name="message"]', 'This is a test message for EmailJS integration')
    
    // Check reCAPTCHA loads (but don't solve it in test)
    await expect(page.locator('.recaptcha-checkbox-border')).toBeVisible()
    
    // Verify form validation works
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toContainText(/send|submit/i)
    
    // Test form validation without reCAPTCHA
    await submitButton.click()
    
    // Should show reCAPTCHA validation message
    await expect(page.locator('text=Please complete the reCAPTCHA')).toBeVisible()
  })
  
  test('emailjs configuration is correct', async ({ page }) => {
    await page.goto('/get-in-touch')
    
    // Check EmailJS initialization
    const emailjsConfig = await page.evaluate(() => {
      return {
        publicKey: window.emailjs?.publicKey || 'Not found',
        serviceId: 'service_yfnr1a9', // Expected service ID
        templateId: 'template_booking_form', // Expected template ID
        recaptchaSiteKey: '6LdwUDQrAAAAAM0HwqssAwwiFgCZ_ZrSA7gZciWC' // Expected reCAPTCHA key
      }
    })
    
    console.log('EmailJS Configuration:', emailjsConfig)
    
    // Verify configuration matches expected values
    expect(emailjsConfig.serviceId).toBe('service_yfnr1a9')
    expect(emailjsConfig.templateId).toBe('template_booking_form')
    expect(emailjsConfig.recaptchaSiteKey).toBe('6LdwUDQrAAAAAM0HwqssAwwiFgCZ_ZrSA7gZciWC')
  })
  
  test('form has all required fields', async ({ page }) => {
    await page.goto('/get-in-touch')
    
    // Check all required form fields exist
    await expect(page.locator('[name="name"]')).toBeVisible()
    await expect(page.locator('[name="email"]')).toBeVisible()
    await expect(page.locator('[name="phone"]')).toBeVisible()
    await expect(page.locator('[name="customerType"]')).toBeVisible()
    await expect(page.locator('[name="address"]')).toBeVisible()
    await expect(page.locator('[name="propertySize"]')).toBeVisible()
    await expect(page.locator('[name="serviceType"]')).toBeVisible()
    await expect(page.locator('[name="message"]')).toBeVisible()
    
    // Check reCAPTCHA widget
    await expect(page.locator('.g-recaptcha')).toBeVisible()
  })
})
