/**
 * Add Customer Reference Number and enhanced date/time tracking to existing Notion database
 */

const addSqueegeeFields = async () => {
  const apiKey = 'YOUR_NOTION_API_KEY_HERE'
  const databaseId = '2707c58a-5877-81af-9e26-ff0d9a5e0ae3'

  console.log('🔧 Adding Squeegee tracking fields to Somerset Window Cleaning database...')
  console.log('Database ID:', databaseId)
  console.log('')

  // New properties to add
  const newProperties = {
    'Customer Reference Number': {
      rich_text: {}
    },
    'Date & Time Submitted': {
      date: {}
    },
    'Squeegee Status': {
      select: {
        options: [
          { name: 'Not Processed', color: 'red' },
          { name: 'In Squeegee', color: 'blue' },
          { name: 'Filed in Squeegee', color: 'green' }
        ]
      }
    }
  }

  try {
    // Add each property individually
    for (const [propertyName, propertyConfig] of Object.entries(newProperties)) {
      console.log(`📝 Adding property: "${propertyName}"...`)
      
      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            [propertyName]: propertyConfig
          }
        })
      })

      const result = await response.json()

      if (response.ok) {
        console.log(`✅ Successfully added "${propertyName}"`)
      } else {
        console.log(`❌ Failed to add "${propertyName}":`, result.message)
        console.log('Error details:', result)
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log('')
    console.log('🎉 Database enhancement complete!')
    console.log('')
    console.log('📋 New fields added:')
    console.log('• Customer Reference Number - For manual Squeegee number entry')
    console.log('• Date & Time Submitted - Automatic timestamp of form submission')
    console.log('• Squeegee Status - Workflow tracking (Not Processed → In Squeegee → Filed)')
    console.log('')
    console.log('🔧 Next steps:')
    console.log('1. Update the Notion API route to populate new fields')
    console.log('2. Test form submission with enhanced tracking')
    console.log('3. Update documentation with new fields')

  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

addSqueegeeFields()