import { test, expect } from '@playwright/test';

test.describe('Live reCAPTCHA Test', () => {
  test('should test if reCAPTCHA is now working on production', async ({ page }) => {
    console.log('🧪 Testing live reCAPTCHA functionality...');
    
    // Enable console monitoring
    page.on('console', msg => {
      if (msg.text().includes('reCAPTCHA') || msg.text().includes('ERROR')) {
        console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
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
    const containerExists = await recaptchaContainer.isVisible();
    console.log(`📦 reCAPTCHA container visible: ${containerExists}`);

    // Look for error messages
    const errorMessages = page.locator('text=ERROR');
    const hasErrors = await errorMessages.count();
    console.log(`❌ Error messages found: ${hasErrors}`);

    if (hasErrors > 0) {
      for (let i = 0; i < hasErrors; i++) {
        const errorText = await errorMessages.nth(i).textContent();
        console.log(`   Error ${i + 1}: ${errorText}`);
      }
    }

    // Check for reCAPTCHA iframe
    const allIframes = page.locator('iframe');
    const iframeCount = await allIframes.count();
    console.log(`🖼️  Total iframes found: ${iframeCount}`);

    let recaptchaIframeFound = false;
    for (let i = 0; i < iframeCount; i++) {
      const iframe = allIframes.nth(i);
      const src = await iframe.getAttribute('src');
      const title = await iframe.getAttribute('title');
      
      if (src && src.includes('recaptcha')) {
        console.log(`✅ reCAPTCHA iframe found: ${src}`);
        recaptchaIframeFound = true;
      }
      
      if (title && title.includes('reCAPTCHA')) {
        console.log(`✅ reCAPTCHA iframe by title: ${title}`);
        recaptchaIframeFound = true;
      }
    }

    if (recaptchaIframeFound) {
      console.log('🎉 SUCCESS: reCAPTCHA iframe is loading properly!');
      
      // Try to interact with the reCAPTCHA
      try {
        const recaptchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]');
        const checkbox = recaptchaFrame.locator('[role="checkbox"]');
        
        if (await checkbox.isVisible({ timeout: 5000 })) {
          console.log('✅ reCAPTCHA checkbox is visible and ready!');
          
          // Fill out the form first
          await page.fill('input[name="name"]', 'Test User');
          await page.fill('input[name="email"]', 'test@example.com');
          await page.fill('input[name="phone"]', '01234567890');
          await page.fill('input[name="address"]', 'Test Address');
          await page.selectOption('select[name="propertySize"]', 'Medium (3-4 bedrooms)');
          await page.selectOption('select[name="serviceType"]', 'Window Cleaning');
          await page.fill('textarea[name="message"]', 'Testing reCAPTCHA');
          
          console.log('📝 Form filled out');
          
          // Check submit button before reCAPTCHA
          const submitButton = page.locator('button[type="submit"]');
          const isDisabledBefore = await submitButton.isDisabled();
          console.log(`🔘 Submit button disabled before reCAPTCHA: ${isDisabledBefore}`);
          
          // Click the reCAPTCHA checkbox
          await checkbox.click();
          console.log('🖱️  Clicked reCAPTCHA checkbox');
          
          // Wait for potential processing
          await page.waitForTimeout(3000);
          
          // Check submit button after reCAPTCHA
          const isDisabledAfter = await submitButton.isDisabled();
          console.log(`🔘 Submit button disabled after reCAPTCHA: ${isDisabledAfter}`);
          
          if (!isDisabledAfter) {
            console.log('🎉 COMPLETE SUCCESS: reCAPTCHA is fully functional!');
            console.log('✅ The form is ready to submit');
          } else {
            console.log('⚠️  Submit button still disabled - may need additional verification');
          }
          
        } else {
          console.log('❌ reCAPTCHA checkbox not visible');
        }
        
      } catch (error) {
        console.log(`⚠️  Could not interact with reCAPTCHA: ${error.message}`);
      }
      
    } else {
      console.log('❌ No reCAPTCHA iframe found - may still have configuration issues');
    }

    // Take screenshot for reference
    await page.screenshot({ 
      path: 'live-recaptcha-test-result.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved as live-recaptcha-test-result.png');
  });
});