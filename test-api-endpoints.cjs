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
  },
  {
    name: 'Notion API Test',
    url: 'https://api.notion.com/v1/databases/2707c58a-5877-81af-9e26-ff0d9a5e0ae3',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_NOTION_API_KEY',
      'Notion-Version': '2022-06-28'
    }
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
          if (test.name.includes('Notion')) {
            try {
              const parsed = JSON.parse(data);
              console.log(`📊 Database Title: ${parsed.title?.[0]?.plain_text || 'N/A'}`);
              console.log(`🔑 Database ID: ${parsed.id}`);
            } catch (e) {
              // Ignore parse errors
            }
          }
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
  console.log('• Notion: Tests database access permissions');
  console.log('\n💡 Note: These are live API tests with your actual credentials');
}

runAllTests();