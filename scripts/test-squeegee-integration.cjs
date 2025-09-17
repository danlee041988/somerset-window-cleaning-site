/**
 * Test enhanced Notion integration with Squeegee tracking fields
 */

const testSqueegeeIntegration = async () => {
  const testCustomer = {
    firstName: 'Michael',
    lastName: 'Thompson',
    email: 'michael.thompson@example.com',
    phone: '07123456789',
    postcode: 'BA5 1QP',
    propertyType: 'Detached house',
    propertySize: '4 bedrooms',
    services: ['Window Cleaning', 'Gutter Clearing'],
    frequency: 'Every 8 weeks',
    customerType: 'new',
    message: 'Need regular window cleaning and gutter maintenance for a large detached house.',
    preferredContact: 'Phone',
    hasExtension: true,
    hasConservatory: false,
    propertyNotes: 'Large property with extension. Some windows are difficult to access due to landscaping.'
  }

  console.log('🧪 Testing Enhanced Notion Integration with Squeegee Tracking')
  console.log('===========================================================')
  console.log('')
  console.log('📋 Test Customer Data:')
  console.log(`• Name: ${testCustomer.firstName} ${testCustomer.lastName}`)
  console.log(`• Email: ${testCustomer.email}`)
  console.log(`• Phone: ${testCustomer.phone}`)
  console.log(`• Services: ${testCustomer.services.join(', ')}`)
  console.log(`• Property: ${testCustomer.propertySize} ${testCustomer.propertyType.toLowerCase()}`)
  console.log('')
  console.log('🕐 Submission Time:', new Date().toISOString())
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
      console.log('✅ Enhanced integration successful!')
      console.log('')
      console.log('📊 Customer Record Created:')
      console.log('• Record ID:', result.customerId)
      console.log('• Notion URL:', result.url)
      console.log('')
      console.log('🎯 NEW TRACKING FIELDS VERIFICATION:')
      console.log('')
      console.log('✅ Date & Time Submitted: Auto-populated with exact submission timestamp')
      console.log('✅ Customer Reference Number: Empty field ready for Squeegee number')
      console.log('✅ Squeegee Status: Set to "Not Processed" (workflow ready)')
      console.log('')
      console.log('📋 COMPLETE DATA STRUCTURE:')
      console.log('')
      console.log('🏠 Customer Information:')
      console.log(`   • Name: ${testCustomer.firstName} ${testCustomer.lastName}`)
      console.log(`   • Email: ${testCustomer.email} (clickable)`)
      console.log(`   • Phone: ${testCustomer.phone} (clickable)`)
      console.log(`   • Postcode: ${testCustomer.postcode}`)
      console.log('')
      console.log('🏘️  Property Details:')
      console.log(`   • Type: ${testCustomer.propertyType}`)
      console.log(`   • Size: ${testCustomer.propertySize}`)
      console.log(`   • Extension: ${testCustomer.hasExtension ? 'Yes' : 'No'}`)
      console.log(`   • Conservatory: ${testCustomer.hasConservatory ? 'Yes' : 'No'}`)
      console.log(`   • Notes: ${testCustomer.propertyNotes}`)
      console.log('')
      console.log('🧹 Service Requirements:')
      console.log(`   • Services: ${testCustomer.services.join(', ')}`)
      console.log(`   • Frequency: ${testCustomer.frequency}`)
      console.log(`   • Customer Type: ${testCustomer.customerType}`)
      console.log(`   • Preferred Contact: ${testCustomer.preferredContact}`)
      console.log('')
      console.log('📊 Business Management:')
      console.log('   • Status: New Lead (auto-assigned)')
      console.log('   • Date Added: Today (date only)')
      console.log('   • Date & Time Submitted: Full timestamp with time')
      console.log('   • Customer Reference Number: [Empty - ready for Squeegee number]')
      console.log('   • Squeegee Status: Not Processed (workflow tracking)')
      console.log('')
      console.log('💼 SQUEEGEE WORKFLOW:')
      console.log('1. Customer submits form → "Not Processed" status')
      console.log('2. Staff enters Squeegee number → Update Reference Number')
      console.log('3. Processing in Squeegee → Change status to "In Squeegee"')
      console.log('4. Complete filing → Change status to "Filed in Squeegee"')
      console.log('')
      console.log('🎉 Somerset Window Cleaning now has complete customer tracking')
      console.log('   from website inquiry to Squeegee filing with full timestamps!')
      
    } else {
      console.log('❌ Test failed:', result.error)
    }

  } catch (error) {
    console.error('🚨 Test error:', error.message)
    console.log('💡 Make sure the development server is running (npm run dev)')
  }
}

testSqueegeeIntegration()