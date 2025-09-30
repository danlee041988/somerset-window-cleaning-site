#!/usr/bin/env tsx
/**
 * Google Ads OAuth - Manual Refresh Token Generator
 *
 * This script provides a URL and waits for you to complete OAuth manually,
 * then exchanges the code for a refresh token.
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

  // Use localhost redirect
  const redirectUri = 'urn:ietf:wg:oauth:2.0:oob'; // Out-of-band for manual flow

  // Build OAuth URL
  const scope = 'https://www.googleapis.com/auth/adwords';
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

  console.log('📋 INSTRUCTIONS:\n');
  console.log('1. Copy the URL below and paste it into your browser');
  console.log('2. Sign in with your Google Ads account');
  console.log('3. Grant permissions when asked');
  console.log('4. Copy the authorization code from the browser');
  console.log('5. Paste it back here\n');

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
    const authCode = await question('📝 Enter the authorization code: ');
    console.log('\n');

    if (!authCode || authCode.trim() === '') {
      throw new Error('No authorization code provided');
    }

    console.log('🔄 Exchanging authorization code for refresh token...\n');

    const tokenResponse = await fetch(config.web.token_uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: authCode.trim(),
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

    await execAsync(
      `security add-generic-password -a "google-ads" -s "GOOGLE_ADS_REFRESH_TOKEN" -w "${tokenData.refresh_token}" -U`
    );

    console.log('✅ Refresh token stored in keychain!\n');

    console.log('🎉 SUCCESS!\n');
    console.log('Your refresh token has been saved. Next steps:');
    console.log('1. Get Developer Token from Google Ads (https://ads.google.com/aw/apicenter)');
    console.log('2. Store it with: security add-generic-password -a "google-ads" -s "GOOGLE_ADS_DEVELOPER_TOKEN" -w "YOUR_TOKEN" -U');
    console.log('3. Run: npm exec tsx scripts/google-ads-daily-sync.ts\n');

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