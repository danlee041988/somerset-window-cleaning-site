#!/usr/bin/env node
const https = require('https');

// Test configuration
const TESTS = [
  {
    name: 'EmailJS API Test',
    url: 'https://api.emailjs.com/api/v1.0/email/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      service_id: 'YOUR_SERVICE_ID',
      template_id: 'YOUR_TEMPLATE_ID',
      user_id: 'YOUR_PUBLIC_KEY',
      accessToken: 'YOUR_PRIVATE_KEY', // Private key from env
      template_params: {
        name: 'API Test',
        email: 'test@example.com',
        phone: '07123456789',
        message: 'Test message from API endpoint test',
        services_list: 'Window Cleaning',
        property_address: 'Test Address',
        property_type_field: 'Detached house',
        property_bedrooms: '3 bedrooms',
        property_extension: 'No',
        property_conservatory: 'No',
        cleaning_frequency: '8 weeks',
        customer_type_field: 'New Customer',
        submitted_at: new Date().toLocaleString('en-GB'),
        recaptcha_token: 'test-token'
      }
    })
  }
];

// Run tests
async function runTest(test) {
  console.log(`\n🧪 Running: ${test.name}`);
  console.log(`📍 URL: ${test.url}`);
  console.log(`📊 Method: ${test.method}`);
  
  return new Promise((resolve) => {
    const url = new URL(test.url);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: test.method,
      headers: test.headers
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Status Code: ${res.statusCode}`);
        console.log(`📝 Status Message: ${res.statusMessage}`);
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Test PASSED');
        } else {
          console.log('❌ Test FAILED');
          console.log('📋 Response:', data.substring(0, 200) + '...');
        }
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request Error:', error.message);
      resolve();
    });
    
    if (test.body) {
      req.write(test.body);
    }
    
    req.end();
  });
}

async function runAllTests() {
  console.log('🚀 Starting API Endpoint Tests...');
  console.log('================================');
  
  for (const test of TESTS) {
    await runTest(test);
  }
  
  console.log('\n================================');
  console.log('✅ All tests completed!');
  
  console.log('\n📊 Summary:');
  console.log('• EmailJS: The test attempts to send a real email (check your inbox)');
  console.log('\n💡 Note: This live test uses your EmailJS credentials and will send a real message');
}

runAllTests();
