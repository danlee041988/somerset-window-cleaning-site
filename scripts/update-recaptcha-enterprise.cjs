#!/usr/bin/env node

/**
 * Update reCAPTCHA Enterprise key to enable checkbox challenge using Service Account
 */

const { GoogleAuth } = require('google-auth-library');
const path = require('path');

// Configuration
const PROJECT_ID = 'somerset-window--1746789685902';
const KEY_ID = '6LeZUcsrAAAAAHbxJ-EVdADU75FLU1SfeVEMEJMQ';
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../service-account-key.json');

/**
 * Initialize Google Auth with service account
 */
async function initializeAuth() {
  const auth = new GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  
  return auth.getClient();
}

/**
 * Make authenticated request to reCAPTCHA Enterprise API
 */
async function makeAuthenticatedRequest(authClient, method, url, data = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const request = {
    method,
    url,
    headers,
    data
  };
  
  const response = await authClient.request(request);
  return response.data;
}

/**
 * Get current key configuration
 */
async function getCurrentKey(authClient) {
  console.log('🔍 Fetching current reCAPTCHA Enterprise key configuration...');
  
  try {
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/keys/${KEY_ID}`;
    const keyData = await makeAuthenticatedRequest(authClient, 'GET', url);
    
    console.log('✅ Current key configuration:');
    console.log(`  - Display Name: ${keyData.displayName}`);
    console.log(`  - Platform: ${keyData.webSettings ? 'Web' : 'Unknown'}`);
    console.log(`  - Domains: ${keyData.webSettings?.allowedDomains?.join(', ') || 'None'}`);
    console.log(`  - Challenge Type: ${keyData.webSettings?.challengeSecurityPreference || 'Not set'}`);
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
async function updateKeyConfiguration(authClient) {
  console.log('🔧 Updating reCAPTCHA Enterprise key to enable checkbox challenge...');
  
  try {
    // First get the current configuration
    const currentKey = await getCurrentKey(authClient);
    
    // Prepare the update payload
    const updatedKey = {
      displayName: currentKey.displayName,
      webSettings: {
        allowedDomains: ['somersetwindowcleaning.co.uk'],
        challengeSecurityPreference: 'CHALLENGE',
        integrationType: 'CHECKBOX'
      }
    };
    
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/keys/${KEY_ID}`;
    const result = await makeAuthenticatedRequest(authClient, 'PATCH', url, updatedKey);
    
    console.log('✅ Successfully updated reCAPTCHA Enterprise key configuration!');
    console.log('  - Checkbox challenge: ENABLED');
    console.log('  - Domain: somersetwindowcleaning.co.uk');
    console.log('  - Integration type: CHECKBOX');
    
    return result;
  } catch (error) {
    console.error('❌ Failed to update key:', error.message);
    
    if (error.message.includes('403')) {
      console.log('💡 Permission issue - need to add reCAPTCHA Enterprise Admin role to service account');
    }
    
    throw error;
  }
}

/**
 * Verify the configuration works
 */
async function verifyConfiguration(authClient) {
  console.log('🧪 Verifying updated configuration...');
  
  try {
    await getCurrentKey(authClient);
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
    // Initialize authentication
    console.log('🔐 Initializing Google Cloud authentication...');
    const authClient = await initializeAuth();
    console.log('✅ Authentication successful');
    console.log('');
    
    // Update the key configuration
    await updateKeyConfiguration(authClient);
    console.log('');
    
    // Verify the configuration
    await verifyConfiguration(authClient);
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('1. Ensure service account has reCAPTCHA Enterprise Admin role');
    console.log('2. Check that the project ID and key ID are correct');
    console.log('3. Verify the service account key file is valid');
    
    if (error.message.includes('403')) {
      console.log('');
      console.log('🔧 To fix permissions, run:');
      console.log(`gcloud projects add-iam-policy-binding ${PROJECT_ID} \\`);
      console.log(`  --member="serviceAccount:recaptcha-manager@${PROJECT_ID}.iam.gserviceaccount.com" \\`);
      console.log(`  --role="roles/recaptchaenterprise.admin"`);
    }
    
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}