#!/usr/bin/env node

/**
 * Google My Business API Setup Helper
 * Guides through API key setup and testing
 */

const readline = require('readline')
const fs = require('fs')
const path = require('path')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(text) {
  return new Promise((resolve) => {
    rl.question(text, resolve)
  })
}

async function setupGoogleBusiness() {
  console.log('🏢 Google My Business API Setup for Somerset Window Cleaning')
  console.log('============================================================')
  console.log('')
  
  console.log('📋 Setup Steps (Using Google Places API):')
  console.log('1. Go to Google Cloud Console: https://console.cloud.google.com')
  console.log('2. Enable Places API (My Business API is deprecated)')
  console.log('3. Create API credentials')
  console.log('4. Restrict API key for security')
  console.log('')
  console.log('ℹ️  Note: Google My Business API was deprecated in 2022')
  console.log('   We\'ll use Places API for business information instead')
  console.log('')
  
  const hasApiKey = await question('Do you have your Google My Business API key? (y/n): ')
  
  if (hasApiKey.toLowerCase() === 'y') {
    const apiKey = await question('Enter your API key: ')
    
    // Update .env.local file
    const envPath = path.join(__dirname, '..', '.env.local')
    let envContent = ''
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    }
    
    // Add or update Google Business API key
    const apiKeyLine = `NEXT_PUBLIC_GOOGLE_BUSINESS_API_KEY=${apiKey}`
    if (envContent.includes('NEXT_PUBLIC_GOOGLE_BUSINESS_API_KEY=')) {
      envContent = envContent.replace(/NEXT_PUBLIC_GOOGLE_BUSINESS_API_KEY=.*/, apiKeyLine)
    } else {
      envContent += '\n# Google My Business API Configuration\n'
      envContent += apiKeyLine + '\n'
    }
    
    fs.writeFileSync(envPath, envContent)
    console.log('✅ API key added to .env.local')
    
    // Test the API key
    console.log('\n🧪 Testing API key...')
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Somerset+Window+Cleaning+Wells&inputtype=textquery&key=${apiKey}`)
      const data = await response.json()
      
      if (data.status === 'OK' || data.status === 'ZERO_RESULTS') {
        console.log('✅ API key is working!')
        console.log('📍 Business location search successful')
      } else {
        console.log('⚠️ API key test failed:', data.status)
        console.log('Please check your API key and restrictions')
      }
    } catch (error) {
      console.log('❌ API test error:', error.message)
    }
    
  } else {
    console.log('\n📖 Manual Setup Instructions:')
    console.log('')
    console.log('1. Open Google Cloud Console: https://console.cloud.google.com')
    console.log('2. Select your project (or create new one)')
    console.log('3. Go to APIs & Services → Library')
    console.log('4. Search and enable:')
    console.log('   - Places API (New) ✅')
    console.log('   - Maps JavaScript API ✅')
    console.log('   - (Skip Google My Business API - it\'s deprecated)')
    console.log('')
    console.log('5. Go to APIs & Services → Credentials')
    console.log('6. Click "Create Credentials" → "API Key"')
    console.log('7. Copy the API key')
    console.log('8. Click "Restrict Key" and add:')
    console.log('   - https://somersetwindowcleaning.co.uk/*')
    console.log('   - https://*.vercel.app/*')
    console.log('   - http://localhost:3000/*')
    console.log('')
    console.log('9. Run this script again with your API key')
  }
  
  console.log('\n🎯 Next Steps After API Key Setup:')
  console.log('1. Verify your business on Google My Business')
  console.log('2. Ensure you have owner/manager access')
  console.log('3. Test the integration with: npm run dev')
  console.log('4. Check the Google Business features in your dashboard')
  
  rl.close()
}

setupGoogleBusiness().catch(console.error)