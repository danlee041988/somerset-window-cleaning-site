/**
 * Add dedicated Cleaning Frequency field to Notion database
 */

const addFrequencyField = async () => {
  const apiKey = 'YOUR_NOTION_API_KEY_HERE'
  const databaseId = '2707c58a-5877-81af-9e26-ff0d9a5e0ae3'

  console.log('📅 Adding Cleaning Frequency field to Somerset Window Cleaning database...')
  console.log('Database ID:', databaseId)
  console.log('')

  // New frequency field with all possible options
  const frequencyField = {
    'Cleaning Frequency': {
      select: {
        options: [
          { name: 'Every 4 weeks', color: 'green' },
          { name: 'Every 8 weeks', color: 'blue' },
          { name: 'Every 12 weeks', color: 'yellow' },
          { name: 'Ad hoc basis', color: 'gray' },
          { name: 'One-off cleaning', color: 'orange' },
          { name: 'Not specified', color: 'red' }
        ]
      }
    }
  }

  try {
    console.log('📝 Adding "Cleaning Frequency" field...')
    
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: frequencyField
      })
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✅ Successfully added "Cleaning Frequency" field!')
      console.log('')
      console.log('📅 FREQUENCY FIELD DETAILS:')
      console.log('• Field Name: Cleaning Frequency')
      console.log('• Field Type: Select dropdown')
      console.log('• Options:')
      console.log('  - Every 4 weeks (Most frequent)')
      console.log('  - Every 8 weeks (Standard)')
      console.log('  - Every 12 weeks (Less frequent)')
      console.log('  - Ad hoc basis (Irregular)')
      console.log('  - One-off cleaning (Single service)')
      console.log('  - Not specified (No preference given)')
      console.log('')
      console.log('💼 BUSINESS BENEFITS:')
      console.log('• Filter customers by cleaning frequency')
      console.log('• Schedule regular customers efficiently')
      console.log('• Identify high-value frequent customers')
      console.log('• Plan workload and capacity')
      console.log('• Target marketing for different frequency needs')
      console.log('')
      console.log('🔧 Next steps:')
      console.log('1. Update API route to populate frequency field')
      console.log('2. Test frequency field functionality')
      console.log('3. Remove frequency from Notes (reduce duplication)')
      
    } else {
      console.log('❌ Failed to add frequency field:', result.message)
      console.log('Error details:', result)
    }

  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

addFrequencyField()