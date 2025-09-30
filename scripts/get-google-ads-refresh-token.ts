#!/usr/bin/env tsx
/**
 * Google Ads OAuth Flow - Automated Refresh Token Generator
 *
 * This script uses Playwright to automate the OAuth consent flow
 * and capture the refresh token for Google Ads API access.
 */

import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { join } from 'path';

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
  console.log('🚀 Starting Google Ads OAuth flow automation...\n');

  // Load OAuth credentials
  const config: OAuthConfig = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
  const { client_id, client_secret, redirect_uris, auth_uri } = config.web;

  // Use localhost redirect for automation
  const redirectUri = redirect_uris.find(uri => uri.includes('localhost')) || redirect_uris[0];

  // Build OAuth URL with Google Ads API scope
  const scope = 'https://www.googleapis.com/auth/adwords';
  const authUrl = `${auth_uri}?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

  console.log('📋 OAuth Configuration:');
  console.log(`   Client ID: ${client_id.substring(0, 20)}...`);
  console.log(`   Redirect URI: ${redirectUri}`);
  console.log(`   Scope: ${scope}\n`);

  // Launch browser
  console.log('🌐 Opening browser for authentication...\n');
  const browser = await chromium.launch({
    headless: false, // Show browser so user can authenticate
    slowMo: 500 // Slow down for better visibility
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to OAuth consent page
    await page.goto(authUrl);
    console.log('✅ Navigated to Google OAuth consent page');
    console.log('👤 Please sign in with your Google Ads account...\n');

    // Wait for redirect with authorization code
    console.log('⏳ Waiting for authorization (you may need to select account and grant permissions)...\n');

    const response = await page.waitForURL(/localhost.*code=/, {
      timeout: 120000 // 2 minutes for user to complete OAuth
    });

    const currentUrl = page.url();
    console.log('✅ Authorization received!\n');

    // Extract authorization code from URL
    const urlParams = new URLSearchParams(new URL(currentUrl).search);
    const authCode = urlParams.get('code');

    if (!authCode) {
      throw new Error('No authorization code found in redirect URL');
    }

    console.log('🔑 Authorization code captured');
    console.log(`   Code: ${authCode.substring(0, 20)}...\n`);

    // Exchange authorization code for refresh token
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

    // Store in keychain
    console.log('💾 Storing refresh token in macOS keychain...\n');

    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    // Store refresh token
    await execAsync(
      `security add-generic-password -a "google-ads" -s "GOOGLE_ADS_REFRESH_TOKEN" -w "${tokenData.refresh_token}" -U`
    );

    console.log('✅ Refresh token stored in keychain!\n');

    console.log('🎉 SUCCESS! Your Google Ads API is now authenticated.\n');
    console.log('Next steps:');
    console.log('1. Obtain Developer Token from Google Ads account');
    console.log('2. Run daily sync script to test connection');
    console.log('3. Link GA4 to Google Ads for conversion tracking\n');

    return tokenData.refresh_token;

  } catch (error) {
    console.error('❌ Error during OAuth flow:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the OAuth flow
getRefreshToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export { getRefreshToken };