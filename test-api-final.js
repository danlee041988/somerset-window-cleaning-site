#!/usr/bin/env node

const payload = {
  customer: {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '07700123456',
    address: '10 Market Place',
    postcode: 'BA1 1AB'
  },
  request: {
    propertyCategory: 'residential',
    propertyType: 'detached',
    bedrooms: '3',
    hasExtension: false,
    hasConservatory: false,
    services: ['windows'],
    frequency: 'every-4-weeks',
    notes: 'Test from FIXED environment - should work now!'
  },
  recaptchaToken: 'test-token'
}

async function test() {
  console.log('🧪 Testing API with FIXED environment...\n')

  const response = await fetch('http://localhost:3000/api/notion/simple-leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const data = await response.json()

  if (response.ok) {
    console.log('✅ SUCCESS!')
    console.log('Response:', JSON.stringify(data, null, 2))
    console.log('\n🎉 Website form will now work!')
    console.log('Check Notion for: John Smith')
  } else {
    console.log('❌ FAILED:', response.status)
    console.log('Error:', JSON.stringify(data, null, 2))
  }
}

test()
