/**
 * Test API route with debugging
 */

const testAPIRoute = async () => {
  const testData = {
    firstName: 'Test',
    lastName: 'Customer',
    email: 'test@example.com',
    phone: '07123456789',
    postcode: 'BA5 1AB',
    propertyType: 'Detached house',
    propertySize: '3 bedrooms',
    services: ['Window Cleaning'],
    customerType: 'new',
    preferredContact: 'Email'
  }

  try {
    console.log('🧪 Testing API route with data:', testData)
    
    const response = await fetch('http://localhost:3000/api/notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    const result = await response.json()
    console.log('Response body:', result)

    if (result.success) {
      console.log('✅ Customer created successfully!')
      if (result.customerId) console.log('Customer ID:', result.customerId)
      if (result.url) console.log('Notion URL:', result.url)
    } else {
      console.log('❌ Failed:', result.error)
    }

  } catch (error) {
    console.error('🚨 Request failed:', error.message)
  }
}

testAPIRoute()