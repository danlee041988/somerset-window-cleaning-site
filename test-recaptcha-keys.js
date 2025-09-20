// Test script to validate reCAPTCHA site keys
const keys = [
  '6LcuV6ArAAAAAFBFdTX1k8uteQmXLwyNcnnMlgbJ',
  '6LdwUDQrAAAAAJh5Z2V5paJn003OrFouc8KVdA0H',
  '6LdwUDQrAAAAAM0HwqssAwwiFgCZ_ZrSA7gZciWC' // Legacy key retained for validation checks
];

async function testReCaptchaKey(siteKey) {
  console.log(`\nTesting key: ${siteKey}`);
  
  try {
    // Test by making a request to the reCAPTCHA API
    const response = await fetch(`https://www.google.com/recaptcha/api.js?render=${siteKey}`);
    
    console.log(`  Status: ${response.status}`);
    console.log(`  OK: ${response.ok}`);
    
    if (response.ok) {
      const text = await response.text();
      if (text.includes('Invalid site key') || text.includes('error')) {
        console.log(`  ❌ Invalid site key`);
        return false;
      } else {
        console.log(`  ✅ Key appears valid`);
        return true;
      }
    } else {
      console.log(`  ❌ HTTP error: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`  ❌ Network error: ${error.message}`);
    return false;
  }
}

async function testAllKeys() {
  console.log('Testing reCAPTCHA site keys for Somerset Window Cleaning...\n');
  
  for (const key of keys) {
    const isValid = await testReCaptchaKey(key);
    if (isValid) {
      console.log(`\n🎉 FOUND WORKING KEY: ${key}`);
      break;
    }
  }
  
  console.log('\nTest complete.');
}

testAllKeys().catch(console.error);
