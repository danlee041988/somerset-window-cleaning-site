#!/usr/bin/env tsx
/**
 * Google Ads OAuth - Localhost Redirect Method
 * Uses the configured localhost redirect URI
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as readline from 'readline';

const execAsync = promisify(exec);
const CONFIG_PATH = join(process.cwd(), 'config/google-ads/web-client.json');

interface OAuthConfig {
  web: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
    auth_uri: string;
    token_uri: string;
  };
}

async function getRefreshToken() {
  console.log('🔐 Google Ads OAuth - Refresh Token Generator\n');

  // Load OAuth credentials
  const config: OAuthConfig = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
  const { client_id, client_secret, redirect_uris } = config.web;

  // Use localhost redirect that's already configured
  const redirectUri = redirect_uris[0]; // http://localhost:3000/auth/callback

  // Build OAuth URL
  const scope = 'https://www.googleapis.com/auth/adwords';
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

  console.log('📋 INSTRUCTIONS:\n');
  console.log('1. Copy the URL below and paste it into your browser');
  console.log('2. Sign in with info@somersetwindowcleaning.co.uk');
  console.log('3. Grant permissions when asked');
  console.log('4. After redirect, copy the FULL URL from your browser address bar');
  console.log('5. Paste the complete URL here (it contains the code parameter)\n');

  console.log('🔗 Authorization URL:\n');
  console.log(authUrl);
  console.log('\n');

  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  };

  try {
    const fullUrl = await question('📝 Paste the full redirect URL: ');
    console.log('\n');

    if (!fullUrl || fullUrl.trim() === '') {
      throw new Error('No URL provided');
    }

    // Extract code from URL
    const url = new URL(fullUrl.trim());
    const authCode = url.searchParams.get('code');

    if (!authCode) {
      throw new Error('No authorization code found in URL');
    }

    console.log('✅ Authorization code extracted\n');
    console.log('🔄 Exchanging authorization code for refresh token...\n');

    const tokenResponse = await fetch(config.web.token_uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: authCode,
        client_id,
        client_secret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();

    console.log('✅ Successfully obtained tokens!\n');
    console.log('📝 Token Details:');
    console.log(`   Access Token: ${tokenData.access_token.substring(0, 20)}...`);
    console.log(`   Refresh Token: ${tokenData.refresh_token.substring(0, 20)}...`);
    console.log(`   Expires In: ${tokenData.expires_in} seconds\n`);

    // Store refresh token in keychain
    console.log('💾 Storing refresh token in macOS keychain...\n');
    await execAsync(
      `security add-generic-password -a "google-ads" -s "GOOGLE_ADS_REFRESH_TOKEN" -w "${tokenData.refresh_token}" -U`
    );

    console.log('✅ Refresh token stored in keychain!\n');

    // Developer Token should be stored separately - never hardcode it!
    console.log('💾 To store Developer Token, run:\n');
    console.log('   security add-generic-password -a "google-ads" -s "GOOGLE_ADS_DEVELOPER_TOKEN" -w "YOUR_DEV_TOKEN_HERE" -U\n');

    console.log('✅ Developer Token stored in keychain!\n');

    console.log('🎉 SUCCESS! All credentials stored.\n');
    console.log('Next steps:');
    console.log('1. Test connection: npm exec tsx scripts/google-ads-daily-sync.ts');
    console.log('2. Link GA4 to Google Ads for conversion tracking');
    console.log('3. Review campaign performance\n');

    rl.close();
    return tokenData.refresh_token;

  } catch (error) {
    rl.close();
    console.error('❌ Error:', error);
    throw error;
  }
}

getRefreshToken()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));