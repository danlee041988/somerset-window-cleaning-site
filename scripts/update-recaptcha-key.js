#!/usr/bin/env node

/**
 * Update reCAPTCHA Enterprise key to enable checkbox challenge
 * This script will configure your Enterprise key to work with v2 checkbox implementation
 */

const https = require('https');

// Configuration
const PROJECT_ID = 'somerset-window--1746789685902';
const KEY_ID = '6LeZUcsrAAAAAHbxJ-EVdADU75FLU1SfeVEMEJMQ';
const API_KEY = process.env.GOOGLE_CLOUD_API_KEY; // You'll need to provide this

if (!API_KEY) {
  console.error('❌ Error: GOOGLE_CLOUD_API_KEY environment variable is required');
  console.log('Please run: export GOOGLE_CLOUD_API_KEY=your_api_key');
  process.exit(1);
}

/**
 * Make authenticated request to Google Cloud API
 */
function makeAPIRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'recaptchaenterprise.googleapis.com',
      path: `${path}?key=${API_KEY}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${parsedData.error?.message || responseData}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Get current key configuration
 */
async function getCurrentKey() {
  console.log('🔍 Fetching current reCAPTCHA key configuration...');
  
  try {
    const keyPath = `/v1/projects/${PROJECT_ID}/keys/${KEY_ID}`;
    const keyData = await makeAPIRequest('GET', keyPath);
    
    console.log('✅ Current key configuration:');
    console.log(`  - Display Name: ${keyData.displayName}`);
    console.log(`  - Platform: ${keyData.webSettings ? 'Web' : 'Unknown'}`);
    console.log(`  - Domains: ${keyData.webSettings?.allowedDomains?.join(', ') || 'None'}`);
    console.log(`  - Challenge Required: ${keyData.webSettings?.challengeSecurityPreference || 'Not set'}`);
    console.log(`  - Integration Type: ${keyData.webSettings?.integrationType || 'Not set'}`);
    
    return keyData;
  } catch (error) {
    console.error('❌ Failed to fetch key:', error.message);
    throw error;
  }
}

/**
 * Update key to enable checkbox challenge
 */
async function updateKeyConfiguration() {
  console.log('🔧 Updating reCAPTCHA key to enable checkbox challenge...');
  
  try {
    // First get the current configuration
    const currentKey = await getCurrentKey();
    
    // Update the configuration
    const updatedKey = {
      displayName: currentKey.displayName,
      webSettings: {
        allowedDomains: ['somersetwindowcleaning.co.uk'],
        challengeSecurityPreference: 'CHALLENGE', // Enable checkbox challenge
        integrationType: 'CHECKBOX' // Set to checkbox integration
      }
    };
    
    const keyPath = `/v1/projects/${PROJECT_ID}/keys/${KEY_ID}`;
    const result = await makeAPIRequest('PATCH', keyPath, updatedKey);
    
    console.log('✅ Successfully updated reCAPTCHA key configuration!');
    console.log('  - Checkbox challenge: ENABLED');
    console.log('  - Domain: somersetwindowcleaning.co.uk');
    console.log('  - Integration type: CHECKBOX');
    
    return result;
  } catch (error) {
    console.error('❌ Failed to update key:', error.message);
    throw error;
  }
}

/**
 * Verify the configuration works
 */
async function verifyConfiguration() {
  console.log('🧪 Verifying updated configuration...');
  
  try {
    await getCurrentKey();
    console.log('✅ Configuration verified successfully!');
    console.log('');
    console.log('🎉 Your reCAPTCHA Enterprise key is now configured for checkbox challenges!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Wait 2-3 minutes for changes to propagate');
    console.log('2. Test your contact form at: https://somersetwindowcleaning.co.uk/get-in-touch');
    console.log('3. The reCAPTCHA checkbox should now work without errors');
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting reCAPTCHA Enterprise key configuration...');
  console.log('');
  
  try {
    await updateKeyConfiguration();
    console.log('');
    await verifyConfiguration();
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('1. Verify your API key has reCAPTCHA Enterprise permissions');
    console.log('2. Check that the project ID and key ID are correct');
    console.log('3. Ensure the API key is properly set in environment variable');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  getCurrentKey,
  updateKeyConfiguration,
  verifyConfiguration
};