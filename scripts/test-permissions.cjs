#!/usr/bin/env node

/**
 * Test reCAPTCHA Enterprise API permissions
 */

const { GoogleAuth } = require('google-auth-library');
const https = require('https');
const path = require('path');

const PROJECT_ID = 'somerset-window--1746789685902';
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../service-account-key.json');

function makeRequest(accessToken, method, path) {
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

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          console.log(`Status: ${res.statusCode}`);
          console.log('Response:', JSON.stringify(parsedData, null, 2));
          
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
    
    req.end();
  });
}

async function main() {
  try {
    console.log('🧪 Testing reCAPTCHA Enterprise API permissions...');
    
    const auth = new GoogleAuth({
      keyFile: SERVICE_ACCOUNT_PATH,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const authClient = await auth.getClient();
    const accessToken = await authClient.getAccessToken();
    console.log('✅ Access token obtained');
    
    // Test 1: List keys
    console.log('\n📋 Test 1: Listing reCAPTCHA keys...');
    try {
      const listPath = `/v1/projects/${PROJECT_ID}/keys`;
      const keys = await makeRequest(accessToken.token, 'GET', listPath);
      console.log('✅ List keys: SUCCESS');
      
      if (keys.keys && keys.keys.length > 0) {
        console.log(`Found ${keys.keys.length} keys`);
        keys.keys.forEach(key => {
          console.log(`  - ${key.name} (${key.displayName})`);
        });
      }
    } catch (error) {
      console.log('❌ List keys: FAILED');
      console.log('Error:', error.message);
    }
    
    // Test 2: Get specific key
    console.log('\n🔍 Test 2: Getting specific key...');
    try {
      const keyId = '6LeZUcsrAAAAAHbxJ-EVdADU75FLU1SfeVEMEJMQ';
      const getPath = `/v1/projects/${PROJECT_ID}/keys/${keyId}`;
      const key = await makeRequest(accessToken.token, 'GET', getPath);
      console.log('✅ Get key: SUCCESS');
      
    } catch (error) {
      console.log('❌ Get key: FAILED');
      console.log('Error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

main();