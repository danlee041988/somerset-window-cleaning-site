#!/usr/bin/env node

/**
 * Google Ads API Authentication Script
 * 
 * Generates the refresh token needed for Google Ads API access
 * Run this once during initial setup
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { google } = require('googleapis')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const SCOPES = ['https://www.googleapis.com/auth/adwords']

async function getRefreshToken() {
  console.log('🔐 Google Ads API Authentication Setup')
  console.log('=====================================')
  
  // Check if credentials file exists
  const credentialsPath = path.join(__dirname, '..', 'google-ads-credentials.json')
  if (!fs.existsSync(credentialsPath)) {
    console.error('❌ Error: google-ads-credentials.json not found')
    console.log('Please download your OAuth 2.0 credentials from Google Cloud Console:')
    console.log('1. Go to https://console.cloud.google.com')
    console.log('2. Navigate to APIs & Services → Credentials')
    console.log('3. Download your OAuth 2.0 client credentials as JSON')
    console.log('4. Save it as google-ads-credentials.json in your project root')
    process.exit(1)
  }

  // Load credentials
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
  const { client_id, client_secret, redirect_uris } = credentials.web

  if (!client_id || !client_secret) {
    console.error('❌ Error: Invalid credentials file')
    console.log('Please ensure your google-ads-credentials.json contains valid OAuth 2.0 credentials')
    process.exit(1)
  }

  // Create OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0] || 'http://localhost:3000/auth/callback'
  )

  // Generate authorization URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent' // Forces refresh token generation
  })

  console.log('🌐 Please visit this URL to authorize the application:')
  console.log(authUrl)
  console.log('')

  // Get authorization code from user
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question('📋 Enter the authorization code from the URL: ', async (code) => {
    try {
      // Exchange authorization code for tokens
      const { tokens } = await oauth2Client.getToken(code)
      
      if (!tokens.refresh_token) {
        console.error('❌ Error: No refresh token received')
        console.log('This usually happens if you\'ve already authorized this app.')
        console.log('Try revoking access at https://myaccount.google.com/permissions and try again.')
        process.exit(1)
      }

      console.log('✅ Authentication successful!')
      console.log('')
      console.log('📝 Add these to your .env.local file:')
      console.log('GOOGLE_ADS_CLIENT_ID=' + client_id)
      console.log('GOOGLE_ADS_CLIENT_SECRET=' + client_secret)
      console.log('GOOGLE_ADS_REFRESH_TOKEN=' + tokens.refresh_token)
      console.log('')

      // Test the connection
      console.log('🧪 Testing API connection...')
      
      oauth2Client.setCredentials(tokens)
      
      // You'll also need to add your customer ID and developer token
      console.log('⚠️  Don\'t forget to add:')
      console.log('GOOGLE_ADS_CUSTOMER_ID=your_customer_id_here')
      console.log('GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token_here')
      console.log('')
      console.log('🎉 Setup complete! You can now run the Google Ads integration.')

    } catch (error) {
      console.error('❌ Error getting tokens:', error.message)
    } finally {
      rl.close()
    }
  })
}

// Check if required packages are installed
try {
  require('googleapis')
} catch (error) {
  console.error('❌ Error: googleapis package not found')
  console.log('Please install required dependencies:')
  console.log('npm install googleapis google-auth-library')
  process.exit(1)
}

// Run the authentication flow
getRefreshToken().catch(console.error)