/**
 * Test direct API route
 */

const testDirectRoute = async () => {
  const testData = {
    firstName: 'Direct',
    lastName: 'Test',
    email: 'direct.test@example.com',
    phone: '07123456789',
    postcode: 'BA5 1AB',
    propertyType: 'Detached house',
    propertySize: '3 bedrooms',
    services: ['Window Cleaning'],
    customerType: 'new',
    preferredContact: 'Email',
    message: 'Testing direct API route integration'
  }

  try {
    console.log('🧪 Testing direct API route...')
    
    const response = await fetch('http://localhost:3000/api/notion-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    console.log('Response status:', response.status)
    
    const result = await response.json()
    console.log('Response:', result)

    if (result.success) {
      console.log('✅ Customer created successfully!')
      console.log('Customer ID:', result.customerId)
      console.log('URL:', result.url)
    } else {
      console.log('❌ Failed:', result.error)
    }

  } catch (error) {
    console.error('🚨 Request failed:', error.message)
  }
}

testDirectRoute()