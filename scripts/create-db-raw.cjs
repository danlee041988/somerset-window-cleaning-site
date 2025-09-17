/**
 * Create database using raw API calls
 */

const createDatabaseRaw = async () => {
  const apiKey = 'YOUR_NOTION_API_KEY_HERE'
  const parentPageId = '2707c58a-5877-8085-b60c-e89fbf44f08e'

  const databaseData = {
    parent: {
      type: 'page_id',
      page_id: parentPageId
    },
    title: [
      {
        type: 'text',
        text: {
          content: 'Somerset Window Cleaning - Website Customers'
        }
      }
    ],
    properties: {
      'Name': {
        title: {}
      },
      'Email': {
        email: {}
      },
      'Phone': {
        phone_number: {}
      },
      'Postcode': {
        rich_text: {}
      },
      'Services': {
        multi_select: {
          options: [
            { name: 'Window Cleaning', color: 'blue' },
            { name: 'Gutter Clearing', color: 'green' },
            { name: 'Conservatory Roof Cleaning', color: 'purple' },
            { name: 'Solar Panel Cleaning', color: 'yellow' },
            { name: 'Fascias & Soffits Cleaning', color: 'orange' },
            { name: 'External Commercial Cleaning', color: 'red' }
          ]
        }
      },
      'Property Type': {
        select: {
          options: [
            { name: 'Detached house', color: 'blue' },
            { name: 'Terraced / Semi-detached house', color: 'green' },
            { name: 'Commercial property', color: 'purple' }
          ]
        }
      },
      'Customer Type': {
        select: {
          options: [
            { name: 'New Customer', color: 'green' },
            { name: 'Existing Customer', color: 'blue' }
          ]
        }
      },
      'Status': {
        select: {
          options: [
            { name: 'New Lead', color: 'yellow' },
            { name: 'Contacted', color: 'blue' },
            { name: 'Quote Sent', color: 'purple' },
            { name: 'Booked', color: 'green' },
            { name: 'Completed', color: 'gray' }
          ]
        }
      },
      'Date Added': {
        date: {}
      },
      'Notes': {
        rich_text: {}
      }
    }
  }

  try {
    console.log('🚀 Creating database with raw API...')
    
    const response = await fetch('https://api.notion.com/v1/databases', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(databaseData)
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Database created successfully!')
      console.log('📝 Database ID:', result.id)
      console.log('🔗 Database URL:', result.url)
      
      // Update .env.local
      const fs = require('fs')
      const envPath = '.env.local'
      let envContent = fs.readFileSync(envPath, 'utf8')
      envContent = envContent.replace(
        'NOTION_DATABASE_ID=YOUR_NOTION_DATABASE_ID_HERE',
        `NOTION_DATABASE_ID=${result.id}`
      )
      fs.writeFileSync(envPath, envContent)
      console.log('✅ Updated .env.local')
      
      console.log('')
      console.log('🧪 Now test the integration:')
      console.log('node scripts/test-notion.cjs')
      
      return result.id
    } else {
      console.error('❌ API Error:', result.message)
      console.log('Full response:', result)
    }

  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

createDatabaseRaw()