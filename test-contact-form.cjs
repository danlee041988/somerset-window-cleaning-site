// Focused test for the contact form submission issue
const { chromium } = require('playwright');

async function testContactForm() {
  console.log('🧪 Testing Contact Form Submission...\n');
  
  const browser = await chromium.launch({ 
    headless: false,  // Show browser for debugging
    slowMo: 500       // Slow down actions
  });
  
  const page = await browser.newPage();
  
  try {
    // Load the contact page
    console.log('1️⃣ Loading contact form...');
    await page.goto('https://somerset-window-cleaning-nextjs.vercel.app/get-in-touch', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    console.log('✅ Contact page loaded');
    
    // Target the main contact form specifically (not the postcode checker form)
    console.log('\n2️⃣ Finding the main contact form...');
    const contactForm = page.locator('form').filter({ hasText: 'I am a...' });
    const formExists = await contactForm.isVisible();
    console.log(`   Main contact form found: ${formExists ? '✅' : '❌'}`);
    
    if (!formExists) {
      throw new Error('Contact form not found');
    }
    
    // Fill out the form completely
    console.log('\n3️⃣ Filling out the contact form...');
    
    // Select customer type
    await page.click('input[value="new"]');
    console.log('   ✅ Selected new customer');
    
    // Fill personal information
    await page.fill('input[name="first_name"]', 'Test');
    await page.fill('input[name="last_name"]', 'User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="mobile"]', '07123456789');
    await page.fill('input[name="property_address"]', '123 Test Street, Bath, BA1 1AA');
    console.log('   ✅ Filled personal information');
    
    // Select property type and size
    await page.click('input[value="Detached house|3 bedrooms"]');
    console.log('   ✅ Selected property type and size');
    
    // Select services
    await page.check('input[value="Window Cleaning"]');
    console.log('   ✅ Selected Window Cleaning service');
    
    // Select frequency
    await page.click('input[value="8-weeks"]');
    console.log('   ✅ Selected cleaning frequency');
    
    // Add a message
    await page.fill('textarea[name="message"]', 'This is a test submission to check form functionality.');
    console.log('   ✅ Added message');
    
    // Wait for and complete reCAPTCHA (this will require manual intervention)
    console.log('\n4️⃣ Waiting for reCAPTCHA...');
    
    // Wait for reCAPTCHA to be visible
    await page.waitForSelector('.g-recaptcha, [data-callback]', { timeout: 10000 });
    console.log('   ⏳ reCAPTCHA widget found - please complete it manually...');
    
    // Wait for reCAPTCHA to be completed
    await page.waitForFunction(() => {
      const recaptchaResponse = document.querySelector('#g-recaptcha-response, [name="g-recaptcha-response"]');
      return recaptchaResponse && recaptchaResponse.value && recaptchaResponse.value.length > 0;
    }, { timeout: 60000 });
    
    console.log('   ✅ reCAPTCHA completed!');
    
    // Check if submit button is enabled
    console.log('\n5️⃣ Checking submit button...');
    const submitButton = page.locator('button[type="submit"]');
    const isEnabled = await submitButton.isEnabled();
    console.log(`   Submit button enabled: ${isEnabled ? '✅' : '❌'}`);
    
    // Listen for console logs to capture form submission debugging
    page.on('console', msg => {
      if (msg.text().includes('🚀') || msg.text().includes('✅') || msg.text().includes('❌')) {
        console.log(`   Console: ${msg.text()}`);
      }
    });
    
    // Submit the form
    console.log('\n6️⃣ Submitting the form...');
    await submitButton.click();
    console.log('   🔄 Form submitted, waiting for response...');
    
    // Wait for either success or error state
    try {
      // Wait for success message
      await page.waitForSelector('text=Message sent successfully!', { timeout: 15000 });
      console.log('   ✅ SUCCESS: Form submitted successfully!');
      
      // Check if success message is visible
      const successMessage = await page.locator('text=Message sent successfully!').isVisible();
      console.log(`   Success message displayed: ${successMessage ? '✅' : '❌'}`);
      
    } catch (timeoutError) {
      // Check for error message
      const errorMessage = await page.locator('text=Sorry, something went wrong').isVisible();
      if (errorMessage) {
        console.log('   ❌ ERROR: Form submission failed with error message');
      } else {
        console.log('   ⚠️  STUCK: Form submitted but no response received (this is the bug!)');
        
        // Check current button state
        const buttonText = await submitButton.textContent();
        console.log(`   Button text: "${buttonText}"`);
        
        // Check if form is still in submitting state
        const isSubmitting = await submitButton.isDisabled();
        console.log(`   Button disabled (submitting): ${isSubmitting ? '✅' : '❌'}`);
      }
    }
    
    console.log('\n📊 TEST COMPLETE');
    
    // Keep browser open for inspection
    console.log('\n👀 Browser will stay open for 30 seconds for inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testContactForm();