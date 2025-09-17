import { test, expect } from '@playwright/test';

test.describe('Production reCAPTCHA Testing', () => {
  test('should test reCAPTCHA functionality on production site', async ({ page }) => {
    console.log('🔍 Testing reCAPTCHA on production domain...');
    
    // Enable console and network monitoring
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    page.on('response', response => {
      if (response.url().includes('recaptcha') || response.url().includes('google')) {
        console.log(`RESPONSE: ${response.status()} ${response.url()}`);
      }
    });

    // Navigate to production contact page
    await page.goto('https://somersetwindowcleaning.co.uk/get-in-touch', {
      waitUntil: 'networkidle'
    });

    console.log('✅ Production page loaded');

    // Wait for page to fully render
    await page.waitForTimeout(5000);

    // Check if reCAPTCHA container exists
    const recaptchaContainer = page.locator('#recaptcha-container');
    await expect(recaptchaContainer).toBeVisible({ timeout: 15000 });
    console.log('✅ reCAPTCHA container found');

    // Check for reCAPTCHA iframe and any error messages
    const allIframes = page.locator('iframe');
    const iframeCount = await allIframes.count();
    console.log(`📊 Found ${iframeCount} iframes on page`);

    // Look for reCAPTCHA specific iframes
    let recaptchaFound = false;
    for (let i = 0; i < iframeCount; i++) {
      const iframe = allIframes.nth(i);
      const src = await iframe.getAttribute('src');
      if (src && src.includes('recaptcha')) {
        console.log(`🔍 reCAPTCHA iframe found: ${src}`);
        recaptchaFound = true;
      }
    }

    if (!recaptchaFound) {
      console.log('❌ No reCAPTCHA iframe found - checking for error messages');
      
      // Check for error text on page
      const pageContent = await page.textContent('body');
      if (pageContent && pageContent.includes('ERROR')) {
        console.log('❌ Error found in page content');
      }
    }

    // Try to fill the form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '01234567890');
    await page.fill('input[name="address"]', 'Test Address, Somerset');
    await page.selectOption('select[name="propertySize"]', 'Medium (3-4 bedrooms)');
    await page.selectOption('select[name="serviceType"]', 'Window Cleaning');
    await page.fill('textarea[name="message"]', 'Testing reCAPTCHA functionality');

    console.log('✅ Form filled successfully');

    // Check submit button state
    const submitButton = page.locator('button[type="submit"]');
    const isDisabled = await submitButton.isDisabled();
    const buttonText = await submitButton.textContent();
    
    console.log(`🔘 Submit button disabled: ${isDisabled}`);
    console.log(`🔘 Button text: ${buttonText}`);

    // Check if reCAPTCHA is actually working
    const recaptchaIframe = page.frameLocator('iframe[title="reCAPTCHA"]');
    
    try {
      const checkbox = recaptchaIframe.locator('[role="checkbox"]');
      if (await checkbox.isVisible({ timeout: 5000 })) {
        console.log('✅ reCAPTCHA checkbox is visible and clickable');
        
        // Try to click the checkbox
        await checkbox.click();
        console.log('✅ Clicked reCAPTCHA checkbox');
        
        // Wait for potential challenge or completion
        await page.waitForTimeout(3000);
        
        // Check if submit button is now enabled
        const finalButtonState = await submitButton.isDisabled();
        console.log(`🔘 Submit button disabled after reCAPTCHA: ${finalButtonState}`);
        
        if (!finalButtonState) {
          console.log('🎉 SUCCESS: reCAPTCHA is working correctly!');
        } else {
          console.log('⚠️ Submit button still disabled after reCAPTCHA interaction');
        }
      } else {
        console.log('❌ reCAPTCHA checkbox not visible');
      }
    } catch (error) {
      console.log(`❌ Error interacting with reCAPTCHA: ${error}`);
    }

    // Take final screenshot
    await page.screenshot({ 
      path: 'production-recaptcha-test.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved as production-recaptcha-test.png');
  });
});