#!/usr/bin/env node

/**
 * Simple script to update reCAPTCHA Enterprise key configuration
 */

const { GoogleAuth } = require('google-auth-library');
const https = require('https');
const path = require('path');

// Configuration
const PROJECT_ID = 'somerset-window--1746789685902';
const KEY_ID = '6LeZUcsrAAAAAHbxJ-EVdADU75FLU1SfeVEMEJMQ';
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../service-account-key.json');

/**
 * Make HTTP request with access token
 */
function makeRequest(accessToken, method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'recaptchaenterprise.googleapis.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    };

    if (data && method !== 'GET') {
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
          const parsedData = responseData ? JSON.parse(responseData) : {};
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

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Configuring reCAPTCHA Enterprise key for checkbox challenges...');
  console.log('');
  
  try {
    // Initialize authentication
    console.log('🔐 Getting access token...');
    const auth = new GoogleAuth({
      keyFile: SERVICE_ACCOUNT_PATH,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const authClient = await auth.getClient();
    const accessToken = await authClient.getAccessToken();
    
    if (!accessToken.token) {
      throw new Error('Failed to get access token');
    }
    
    console.log('✅ Access token obtained');
    
    // Get current key configuration
    console.log('🔍 Fetching current key configuration...');
    const getPath = `/v1/projects/${PROJECT_ID}/keys/${KEY_ID}`;
    const currentKey = await makeRequest(accessToken.token, 'GET', getPath);
    
    console.log('✅ Current configuration:');
    console.log(`  - Display Name: ${currentKey.displayName}`);
    console.log(`  - Domains: ${currentKey.webSettings?.allowedDomains?.join(', ') || 'None'}`);
    console.log(`  - Challenge Type: ${currentKey.webSettings?.challengeSecurityPreference || 'SCORE'}`);
    console.log(`  - Integration Type: ${currentKey.webSettings?.integrationType || 'SCORE'}`);
    
    // Update the key configuration
    console.log('');
    console.log('🔧 Updating key to enable checkbox challenges...');
    
    const updateData = {
      displayName: currentKey.displayName,
      webSettings: {
        allowedDomains: ['somersetwindowcleaning.co.uk'],
        challengeSecurityPreference: 'CHALLENGE',
        integrationType: 'CHECKBOX'
      }
    };
    
    const updatePath = `/v1/projects/${PROJECT_ID}/keys/${KEY_ID}?updateMask=displayName,webSettings`;
    const updatedKey = await makeRequest(accessToken.token, 'PATCH', updatePath, updateData);
    
    console.log('✅ Successfully updated reCAPTCHA Enterprise key!');
    console.log('');
    console.log('📋 New configuration:');
    console.log(`  - Display Name: ${updatedKey.displayName}`);
    console.log(`  - Domains: ${updatedKey.webSettings?.allowedDomains?.join(', ') || 'None'}`);
    console.log(`  - Challenge Type: ${updatedKey.webSettings?.challengeSecurityPreference || 'Not set'}`);
    console.log(`  - Integration Type: ${updatedKey.webSettings?.integrationType || 'Not set'}`);
    
    console.log('');
    console.log('🎉 Configuration complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Wait 2-3 minutes for changes to propagate');
    console.log('2. Test your contact form: https://somersetwindowcleaning.co.uk/get-in-touch');
    console.log('3. The reCAPTCHA checkbox should now work without "Invalid site key" error');
    
  } catch (error) {
    console.error('❌ Configuration failed:', error.message);
    
    if (error.message.includes('403')) {
      console.log('');
      console.log('💡 Permission issue detected:');
      console.log('The service account needs reCAPTCHA Enterprise Admin permissions');
      console.log('');
      console.log('To fix this manually:');
      console.log('1. Go to Google Cloud Console → IAM & Admin → IAM');
      console.log('2. Find: recaptcha-manager@somerset-window--1746789685902.iam.gserviceaccount.com');
      console.log('3. Add role: reCAPTCHA Enterprise Admin');
    }
    
    if (error.message.includes('404')) {
      console.log('💡 The reCAPTCHA key might not exist or project ID is incorrect');
    }
    
    process.exit(1);
  }
}

// Run the script
main();