/**
 * Test script for Notion integration
 * 
 * To test:
 * 1. Set your Notion API key and database ID in .env.local
 * 2. Run: node scripts/test-notion.cjs
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const testNotionIntegration = async () => {
  const testData = {
    firstName: 'Emma',
    lastName: 'Thompson',
    email: 'emma.thompson.test@example.com',
    phone: '07123987654',
    postcode: 'BA5 1AB',
    propertyType: 'Detached house',
    propertySize: '4 bedrooms',
    services: ['Window Cleaning', 'Conservatory Roof Cleaning'],
    frequency: '8-weeks',
    customerType: 'new',
    message: 'Need regular window cleaning and one-off conservatory cleaning. Property has difficult access at the back.',
    preferredContact: 'Email'
  }

  try {
    const response = await fetch('http://localhost:3000/api/notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    const result = await response.json()
    
    console.log('🔬 Notion Integration Test Results:')
    console.log('Status:', response.status)
    console.log('Response:', result)

    if (result.success) {
      console.log('✅ Test passed! Customer created in Notion')
      if (result.customerId) console.log('📝 Customer ID:', result.customerId)
      if (result.url) console.log('🔗 Notion URL:', result.url)
    } else {
      console.log('❌ Test failed:', result.error)
      if (result.skipError) {
        console.log('ℹ️  This is expected if Notion API key is not configured')
      }
    }

  } catch (error) {
    console.error('🚨 Test script error:', error.message)
    console.log('💡 Make sure your development server is running (npm run dev)')
  }
}

// Run test if API key is configured
if (process.env.NOTION_API_KEY && process.env.NOTION_API_KEY !== 'YOUR_NOTION_API_KEY_HERE') {
  console.log('🚀 Starting Notion integration test...')
  testNotionIntegration()
} else {
  console.log('⚠️  Notion API key not configured in .env.local')
  console.log('Set NOTION_API_KEY and NOTION_DATABASE_ID in your .env.local file to test integration')
}