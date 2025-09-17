#!/usr/bin/env node

/**
 * Test Google Ads API Connection
 * Verify that authentication and API access is working
 */

const fs = require('fs')
const path = require('path')
const { google } = require('googleapis')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

async function testGoogleAdsAPI() {
  console.log('🧪 Testing Google Ads API Connection')
  console.log('===================================')
  
  // Check environment variables
  const requiredVars = [
    'GOOGLE_ADS_CUSTOMER_ID',
    'GOOGLE_ADS_DEVELOPER_TOKEN',
    'GOOGLE_ADS_CLIENT_ID',
    'GOOGLE_ADS_CLIENT_SECRET',
    'GOOGLE_ADS_REFRESH_TOKEN'
  ]

  console.log('🔍 Checking environment variables...')
  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (!value) {
      console.error(`❌ Missing ${varName}`)
      process.exit(1)
    } else {
      console.log(`✅ ${varName}: ${value.substring(0, 10)}...`)
    }
  }
  
  try {
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_ADS_CLIENT_ID,
      process.env.GOOGLE_ADS_CLIENT_SECRET,
      'http://localhost:3000/auth/callback'
    )

    // Set credentials
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN
    })

    console.log('')
    console.log('🔑 OAuth2 client configured successfully')
    
    // Get access token
    console.log('🔄 Getting access token...')
    const { token } = await oauth2Client.getAccessToken()
    
    if (token) {
      console.log('✅ Access token obtained successfully')
      console.log(`🎫 Token: ${token.substring(0, 20)}...`)
    } else {
      console.error('❌ Failed to obtain access token')
      process.exit(1)
    }

    console.log('')
    console.log('🎉 Google Ads API authentication test passed!')
    console.log('🚀 Your integration is ready to use.')
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Apply for Basic Access level in Google Ads API (currently in Test mode)')
    console.log('2. Test the dashboard: npm run dev and visit /admin/google-ads')
    console.log('3. Run optimization scripts: node scripts/google-ads-automation.cjs')

  } catch (error) {
    console.error('❌ API Test Failed:', error.message)
    
    if (error.message.includes('invalid_grant')) {
      console.log('')
      console.log('💡 The refresh token may have expired or been revoked.')
      console.log('Please run the authentication script again:')
      console.log('node scripts/google-ads-auth.cjs')
    }
    
    process.exit(1)
  }
}

testGoogleAdsAPI().catch(console.error)