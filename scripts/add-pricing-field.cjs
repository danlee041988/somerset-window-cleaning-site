/**
 * Add Services & Agreed Prices field to Notion database
 */

const addPricingField = async () => {
  const apiKey = 'YOUR_NOTION_API_KEY_HERE'
  const databaseId = '2707c58a-5877-81af-9e26-ff0d9a5e0ae3'

  console.log('💰 Adding Services & Agreed Prices field to Somerset Window Cleaning database...')
  console.log('Database ID:', databaseId)
  console.log('')

  // New pricing field
  const pricingField = {
    'Services & Agreed Prices': {
      rich_text: {}
    }
  }

  try {
    console.log('📝 Adding "Services & Agreed Prices" field...')
    
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: pricingField
      })
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✅ Successfully added "Services & Agreed Prices" field!')
      console.log('')
      console.log('💰 PRICING FIELD DETAILS:')
      console.log('• Field Name: Services & Agreed Prices')
      console.log('• Field Type: Rich text (allows formatting)')
      console.log('• Usage: Manual entry after quoting customer')
      console.log('')
      console.log('📋 EXAMPLE FORMAT:')
      console.log('Window Cleaning: £25')
      console.log('Gutter Clearing: £80')
      console.log('Conservatory Cleaning: £45')
      console.log('Total Quote: £150')
      console.log('')
      console.log('💼 BUSINESS BENEFITS:')
      console.log('• Track agreed pricing for each customer')
      console.log('• Create accurate quotes and invoices')
      console.log('• Monitor pricing trends and profitability')
      console.log('• Ensure consistent service delivery')
      console.log('• Easy reference for recurring customers')
      console.log('')
      console.log('🔧 Next steps:')
      console.log('1. Update API route to include pricing field')
      console.log('2. Test the pricing functionality')
      console.log('3. Update staff workflow documentation')
      
    } else {
      console.log('❌ Failed to add pricing field:', result.message)
      console.log('Error details:', result)
    }

  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

addPricingField()