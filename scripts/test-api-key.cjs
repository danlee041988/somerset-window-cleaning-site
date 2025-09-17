#!/usr/bin/env node

/**
 * Test Google API Key
 */

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(text) {
  return new Promise((resolve) => {
    rl.question(text, resolve)
  })
}

async function testAPIKey() {
  console.log('🧪 Google API Key Tester')
  console.log('========================')
  console.log('')
  
  const apiKey = await question('Paste your Google API key here: ')
  
  if (!apiKey || apiKey.length < 30) {
    console.log('❌ API key looks invalid (too short)')
    rl.close()
    return
  }
  
  console.log('\n🔍 Testing API key...')
  
  try {
    // Test Places API
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Somerset+Window+Cleaning+Wells&inputtype=textquery&key=${apiKey}`)
    const data = await response.json()
    
    if (data.status === 'OK') {
      console.log('✅ API key works perfectly!')
      console.log('📍 Found business locations:', data.candidates?.length || 0)
      
      if (data.candidates && data.candidates.length > 0) {
        console.log('🏢 Business found:', data.candidates[0].name)
      }
    } else if (data.status === 'ZERO_RESULTS') {
      console.log('✅ API key works (no results found for search)')
    } else {
      console.log('⚠️ API issue:', data.status)
      console.log('💡 Check if Places API is enabled')
    }
    
    // Show how to add to .env.local
    console.log('\n📝 Add this to your .env.local file:')
    console.log('=====================================')
    console.log(`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${apiKey}`)
    console.log('')
    console.log('💡 You can use the same key for:')
    console.log('• NEXT_PUBLIC_PAGESPEED_API_KEY')
    console.log('• NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY')
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
  
  rl.close()
}

testAPIKey().catch(console.error)