/**
 * Test complete contact form to Notion integration
 */

const testCompleteIntegration = async () => {
  const customerData = {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '07891234567',
    postcode: 'BA5 3QT',
    propertyType: 'Detached house',
    propertySize: '4 bedrooms',
    services: ['Window Cleaning', 'Gutter Clearing'],
    frequency: 'Every 8 weeks',
    customerType: 'new',
    message: 'Looking for regular window cleaning service. Property has some difficult to reach windows at the back.',
    preferredContact: 'Email'
  }

  try {
    console.log('🧪 Testing complete Somerset Window Cleaning integration...')
    console.log('Customer:', `${customerData.firstName} ${customerData.lastName}`)
    console.log('Services:', customerData.services.join(', '))
    console.log('')
    
    const response = await fetch('http://localhost:3000/api/notion-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData)
    })

    console.log('Response status:', response.status)
    
    const result = await response.json()

    if (result.success) {
      console.log('✅ Integration successful!')
      console.log('📝 Customer ID:', result.customerId)
      console.log('🔗 Notion URL:', result.url)
      console.log('')
      console.log('🎉 Somerset Window Cleaning website can now:')
      console.log('   - Capture customer inquiries via contact form')
      console.log('   - Send email notifications via EmailJS')
      console.log('   - Automatically create customer records in Notion')
      console.log('   - Store all customer details and service requests')
      console.log('')
      console.log('📋 Customer record includes:')
      console.log('   • Contact information (name, email, phone, postcode)')
      console.log('   • Property details and services requested')
      console.log('   • Customer status tracking (New Lead → Contacted → Booked)')
      console.log('   • Notes with additional requirements and preferences')
    } else {
      console.log('❌ Integration failed:', result.error)
    }

  } catch (error) {
    console.error('🚨 Test failed:', error.message)
    console.log('💡 Make sure the development server is running on localhost:3000')
  }
}

testCompleteIntegration()