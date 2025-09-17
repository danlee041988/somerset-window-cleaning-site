#!/usr/bin/env node

/**
 * Check Google APIs Status
 * Helps locate and test existing API keys
 */

async function checkGoogleAPIs() {
  console.log('🔍 Checking Google APIs Configuration')
  console.log('=====================================')
  console.log('')
  
  console.log('📋 Current Environment Variables:')
  console.log(`✅ reCAPTCHA: ${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? 'Configured' : 'Missing'}`)
  console.log(`✅ GA4: ${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? 'Configured' : 'Missing'}`)
  console.log(`⚠️  PageSpeed: ${process.env.NEXT_PUBLIC_PAGESPEED_API_KEY === 'YOUR_PAGESPEED_API_KEY_HERE' ? 'Placeholder' : 'Configured'}`)
  console.log(`⚠️  Google Maps: ${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE' ? 'Placeholder' : 'Configured'}`)
  console.log(`⚠️  Google Calendar: ${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY === 'YOUR_GOOGLE_CALENDAR_API_KEY_HERE' ? 'Placeholder' : 'Configured'}`)
  console.log(`✅ Google Ads: ${process.env.GOOGLE_ADS_CUSTOMER_ID ? 'Configured' : 'Missing'}`)
  console.log(`✅ Notion: ${process.env.NOTION_API_KEY ? 'Configured' : 'Missing'}`)
  console.log('')
  
  console.log('🔑 To Get Your API Keys:')
  console.log('========================')
  console.log('')
  console.log('1. Go to Google Cloud Console:')
  console.log('   🔗 https://console.cloud.google.com')
  console.log('')
  console.log('2. Select your project (same as Google Ads)')
  console.log('')
  console.log('3. Go to "APIs & Services" → "Credentials"')
  console.log('')
  console.log('4. Look for existing API keys, or create new one:')
  console.log('   • Click "Create Credentials" → "API Key"')
  console.log('   • Copy the generated key')
  console.log('')
  console.log('5. Check which APIs are enabled:')
  console.log('   • Go to "APIs & Services" → "Enabled APIs"')
  console.log('   • You should see:')
  console.log('     ✅ Places API')
  console.log('     ✅ Maps JavaScript API')
  console.log('     ✅ PageSpeed Insights API')
  console.log('     ✅ Calendar API')
  console.log('')
  console.log('6. If any are missing, go to "Library" and enable them')
  console.log('')
  
  console.log('🧪 Test Your API Key:')
  console.log('=====================')
  console.log('')
  console.log('Once you have an API key, test it with:')
  console.log('')
  console.log('Places API Test:')
  console.log('curl "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Somerset+Window+Cleaning+Wells&inputtype=textquery&key=YOUR_API_KEY"')
  console.log('')
  
  console.log('🎯 Next Steps:')
  console.log('==============')
  console.log('1. Get your API key from Google Cloud Console')
  console.log('2. Replace the placeholder in .env.local:')
  console.log('   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key')
  console.log('3. Run: npm run dev')
  console.log('4. Test Google Business features')
  console.log('')
  
  console.log('💡 Pro Tip:')
  console.log('If you have multiple API keys, you can use the same one for:')
  console.log('• Google Maps/Places API')
  console.log('• PageSpeed Insights API') 
  console.log('• Google Calendar API')
  console.log('Just make sure it\'s properly restricted for security!')
}

// Load environment variables
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') })

checkGoogleAPIs().catch(console.error)