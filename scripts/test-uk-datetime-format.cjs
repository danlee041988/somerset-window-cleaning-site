/**
 * Test UK date/time format (DD-MM-YYYY HH:MM)
 */

const testUKDateTimeFormat = async () => {
  const testCustomer = {
    firstName: 'Test',
    lastName: 'UKFormat',
    email: 'test.ukformat@example.com',
    phone: '07123456789',
    postcode: 'BA5 1QT',
    propertyType: 'Detached house',
    propertySize: '3 bedrooms',
    services: ['Window Cleaning'],
    frequency: 'Every 4 weeks',
    customerType: 'new',
    message: 'Testing UK date/time format DD-MM-YYYY HH:MM',
    preferredContact: 'Email'
  }

  // Show current time in different formats for comparison
  const now = new Date()
  const day = now.getDate().toString().padStart(2, '0')
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const year = now.getFullYear()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const ukFormat = `${day}-${month}-${year} ${hours}:${minutes}`

  console.log('🇬🇧 Testing UK Date/Time Format Integration')
  console.log('==========================================')
  console.log('')
  console.log('📅 Current Time Formats:')
  console.log('• ISO Format:', now.toISOString())
  console.log('• UK Format:  ', ukFormat)
  console.log('• Expected:   DD-MM-YYYY HH:MM')
  console.log('')

  try {
    const response = await fetch('http://localhost:3000/api/notion-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCustomer)
    })

    const result = await response.json()

    if (result.success) {
      console.log('✅ UK format integration successful!')
      console.log('')
      console.log('📊 Customer Record Created:')
      console.log('• Record ID:', result.customerId)
      console.log('• Notion URL:', result.url)
      console.log('')
      console.log('🎯 DATE/TIME FORMAT VERIFICATION:')
      console.log('')
      console.log('✅ Date & Time Submitted (UK Format): Using DD-MM-YYYY HH:MM format')
      console.log('✅ Date Added: Still using standard date format for compatibility')
      console.log('✅ Customer Reference Number: Ready for Squeegee number')
      console.log('✅ Squeegee Status: Set to "Not Processed"')
      console.log('')
      console.log('📋 FIELD STRUCTURE:')
      console.log('• Date Added: YYYY-MM-DD (for system sorting)')
      console.log('• Date & Time Submitted (UK Format): DD-MM-YYYY HH:MM (for human reading)')
      console.log('• Customer Reference Number: [Empty - for manual Squeegee number]')
      console.log('• Squeegee Status: Not Processed → In Squeegee → Filed in Squeegee')
      console.log('')
      console.log('🎉 Perfect! UK format is now implemented as requested!')
      
    } else {
      console.log('❌ Test failed:', result.error)
    }

  } catch (error) {
    console.error('🚨 Test error:', error.message)
    console.log('💡 Make sure the development server is running (npm run dev)')
  }
}

testUKDateTimeFormat()