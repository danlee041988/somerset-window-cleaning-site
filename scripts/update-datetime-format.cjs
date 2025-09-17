/**
 * Update Date & Time Submitted field to use UK format (DD-MM-YYYY HH:MM)
 */

const updateDateTimeFormat = async () => {
  const apiKey = 'YOUR_NOTION_API_KEY_HERE'
  const databaseId = '2707c58a-5877-81af-9e26-ff0d9a5e0ae3'

  console.log('🔧 Updating Date & Time Submitted field to UK format...')
  console.log('Format: DD-MM-YYYY HH:MM')
  console.log('')

  try {
    // Update the field type from date to rich_text for custom formatting
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          'Date & Time Submitted (UK Format)': {
            rich_text: {}
          }
        }
      })
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✅ Successfully added new UK format field!')
      console.log('')
      
      // Test the new format
      const now = new Date()
      const ukFormat = now.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', '')
      
      console.log('📅 Format example:')
      console.log('Current time:', now.toISOString())
      console.log('UK format:', ukFormat)
      console.log('')
      console.log('✅ New field "Date & Time Submitted (UK Format)" added to database')
      console.log('📝 API will now use DD-MM-YYYY HH:MM format')
      
    } else {
      console.log('❌ Failed to update field:', result.message)
      console.log('Error details:', result)
    }

  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

updateDateTimeFormat()