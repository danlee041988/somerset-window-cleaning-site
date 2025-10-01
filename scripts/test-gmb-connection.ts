#!/usr/bin/env tsx
/**
 * Test Google Business Profile API connection
 */

import { google } from 'googleapis'
import * as fs from 'fs'
import * as path from 'path'

async function testGMBConnection() {
  console.log('🔍 Testing Google Business Profile API Connection\n')

  // Load credentials
  const credentialsPath = process.env.GOOGLE_CLOUD_CREDENTIALS || path.join(
    process.env.HOME!,
    '.config/google-cloud/swc-service-account.json'
  )

  if (!fs.existsSync(credentialsPath)) {
    console.error('❌ Credentials file not found:', credentialsPath)
    process.exit(1)
  }

  console.log('✅ Credentials file found')

  try {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
    console.log('✅ Credentials loaded')
    console.log('📧 Service Account:', credentials.client_email)

    // Initialize auth
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/business.manage',
      ],
    })

    const authClient = await auth.getClient()
    console.log('✅ Authentication successful')

    // Try to list accounts
    const mybusiness = google.mybusinessaccountmanagement({ version: 'v1', auth: authClient as any })

    console.log('\n📊 Attempting to list Business Profile accounts...')

    const response = await mybusiness.accounts.list()

    if (response.data.accounts && response.data.accounts.length > 0) {
      console.log('✅ Successfully connected to Google Business Profile!')
      console.log('\n📍 Your Business Accounts:')

      for (const account of response.data.accounts) {
        console.log(`   • ${account.accountName} (${account.name})`)
      }

      console.log('\n✅ GMB API is working correctly!')
    } else {
      console.log('⚠️  No business accounts found.')
      console.log('   Make sure you added the service account to your Google Business Profile:')
      console.log('   → https://business.google.com/settings')
      console.log('   → Add user: ' + credentials.client_email)
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message)

    if (error.code === 403) {
      console.log('\n⚠️  Permission denied. Did you:')
      console.log('   1. Add the service account to Google Business Profile?')
      console.log('   2. Grant "Manager" permissions?')
      console.log('   → https://business.google.com/settings')
    }
  }
}

testGMBConnection()
