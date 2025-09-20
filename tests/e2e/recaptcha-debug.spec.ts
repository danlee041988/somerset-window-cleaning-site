import { test, expect } from '@playwright/test';

test.describe('reCAPTCHA Production Debugging', () => {
  test('should diagnose reCAPTCHA issues on production domain', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    // Enable network request monitoring
    page.on('request', request => {
      if (request.url().includes('recaptcha') || request.url().includes('google')) {
        console.log(`REQUEST: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('recaptcha') || response.url().includes('google')) {
        console.log(`RESPONSE: ${response.status()} ${response.url()}`);
      }
    });

    console.log('🔍 Testing reCAPTCHA on production domain...');
    
    // Navigate to production contact page
    await page.goto('https://somersetwindowcleaning.co.uk/get-in-touch', {
      waitUntil: 'networkidle'
    });

    console.log('✅ Page loaded successfully');

    // Wait for page to fully render
    await page.waitForTimeout(3000);

    // Check if reCAPTCHA container exists
    const recaptchaContainer = page.locator('#recaptcha-container');
    await expect(recaptchaContainer).toBeVisible({ timeout: 10000 });
    console.log('✅ reCAPTCHA container found');

    // Check for reCAPTCHA iframe
    const recaptchaIframe = page.frameLocator('iframe[title="reCAPTCHA"]');
    
    try {
      await expect(recaptchaIframe.locator('[role="checkbox"]')).toBeVisible({ timeout: 10000 });
      console.log('✅ reCAPTCHA checkbox is visible');
    } catch (error) {
      console.log('❌ reCAPTCHA checkbox not visible');
      
      // Check for error messages in the iframe
      const errorElement = page.locator('.recaptcha-error, [data-error], .rc-error');
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        console.log(`❌ reCAPTCHA Error: ${errorText}`);
      }
      
      // Check console for reCAPTCHA errors
      const allIframes = page.locator('iframe');
      const iframeCount = await allIframes.count();
      console.log(`📊 Found ${iframeCount} iframes on page`);
      
      for (let i = 0; i < iframeCount; i++) {
        const iframe = allIframes.nth(i);
        const src = await iframe.getAttribute('src');
        if (src && src.includes('recaptcha')) {
          console.log(`🔍 reCAPTCHA iframe src: ${src}`);
        }
      }
    }

    // Check environment variables in client-side
    const siteKey = await page.evaluate(() => {
      return (window as any).NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 
             process?.env?.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
             'NOT_FOUND';
    });
    
    console.log(`🔑 Client-side site key: ${siteKey}`);

    // Try to fill form and submit to test reCAPTCHA
    await page.fill('input[name="name"]', 'Test Customer');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '01234567890');
    await page.fill('input[name="address"]', 'Test Address');
    await page.selectOption('select[name="propertySize"]', 'Medium (3-4 bedrooms)');
    await page.selectOption('select[name="serviceType"]', 'Window Cleaning');
    await page.fill('textarea[name="message"]', 'Test message for reCAPTCHA debugging');

    console.log('✅ Form filled successfully');

    // Check submit button state
    const submitButton = page.locator('button[type="submit"]');
    const isDisabled = await submitButton.isDisabled();
    console.log(`🔘 Submit button disabled: ${isDisabled}`);

    if (isDisabled) {
      const buttonText = await submitButton.textContent();
      console.log(`🔘 Button text: ${buttonText}`);
    }

    // Take a screenshot for debugging
    await page.screenshot({ 
      path: 'recaptcha-debug-production.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved as recaptcha-debug-production.png');

    // Try to interact with reCAPTCHA if visible
    try {
      const checkbox = recaptchaIframe.locator('[role="checkbox"]');
      if (await checkbox.isVisible()) {
        await checkbox.click();
        console.log('✅ Clicked reCAPTCHA checkbox');
        await page.waitForTimeout(2000);
        
        // Check if reCAPTCHA completed
        const completed = await page.evaluate(() => {
          return typeof (window as any).grecaptcha !== 'undefined' && 
                 (window as any).grecaptcha.getResponse().length > 0;
        });
        console.log(`✅ reCAPTCHA completed: ${completed}`);
      }
    } catch (error) {
      console.log(`❌ Could not interact with reCAPTCHA: ${error}`);
    }

    // Final state check
    const finalButtonState = await submitButton.isDisabled();
    console.log(`🔘 Final submit button disabled: ${finalButtonState}`);
  });

  test('should test reCAPTCHA key validation', async ({ page }) => {
    console.log('🔑 Testing reCAPTCHA site key validation...');
    
    // Check if the current site key is valid for this domain
    await page.goto('https://www.google.com/recaptcha/api/siteverify', {
      waitUntil: 'networkidle'
    });
    
    // This will help us understand if the key is properly configured
    const response = await page.evaluate(async () => {
      try {
        const testKey = '6LdwUDQrAAAAAJh5Z2V5paJn003OrFouc8KVdA0H';
        const testResponse = await fetch('https://www.google.com/recaptcha/api.js?render=' + testKey);
        return {
          status: testResponse.status,
          url: testResponse.url,
          ok: testResponse.ok
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('🔑 Site key validation result:', response);
  });
});
