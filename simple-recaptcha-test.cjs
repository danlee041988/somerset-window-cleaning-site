// Simple test to check if reCAPTCHA is working on live site
const puppeteer = require('puppeteer');

async function testLiveRecaptcha() {
  console.log('Testing reCAPTCHA on live Somerset Window Cleaning site...\n');
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Monitor console messages
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('recaptcha') || text.includes('error') || text.includes('Recaptcha') || text.includes('ReCAPTCHA')) {
      console.log(`Console: ${msg.type()}: ${text}`);
    }
  });
  
  try {
    console.log('Navigating to contact page...');
    await page.goto('https://somersetwindowcleaning.co.uk/get-in-touch', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('Page loaded, waiting for reCAPTCHA...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check for reCAPTCHA elements
    const recaptchaExists = await page.evaluate(() => {
      const container = document.getElementById('recaptcha-container');
      const iframe = document.querySelector('iframe[src*="recaptcha"]');
      const grecaptcha = typeof window.grecaptcha !== 'undefined';
      
      return {
        container: !!container,
        iframe: !!iframe,
        grecaptcha: grecaptcha,
        containerHtml: container ? container.innerHTML : 'not found',
        totalIframes: document.querySelectorAll('iframe').length
      };
    });
    
    console.log('reCAPTCHA check results:');
    console.log(`  Container exists: ${recaptchaExists.container}`);
    console.log(`  reCAPTCHA iframe: ${recaptchaExists.iframe}`);
    console.log(`  grecaptcha loaded: ${recaptchaExists.grecaptcha}`);
    console.log(`  Total iframes: ${recaptchaExists.totalIframes}`);
    console.log(`  Container content: ${recaptchaExists.containerHtml}`);
    
    if (recaptchaExists.iframe && recaptchaExists.grecaptcha) {
      console.log('\n✅ SUCCESS: reCAPTCHA is working!');
    } else {
      console.log('\n❌ ISSUE: reCAPTCHA not fully loaded');
    }
    
    // Take screenshot
    await page.screenshot({ path: '/Users/danlee/CODEX_SWC_WEBSITE/live-recaptcha-test.png', fullPage: true });
    console.log('Screenshot saved as live-recaptcha-test.png');
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await browser.close();
  }
}

testLiveRecaptcha();