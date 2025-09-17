/**
 * Create simple customer database
 */

const { Client } = require('@notionhq/client')

const createSimpleDB = async () => {
  const notion = new Client({
    auth: 'YOUR_NOTION_API_KEY_HERE',
    notionVersion: '2022-06-28'
  })

  try {
    console.log('🚀 Creating simple customer database...')

    const database = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: '2707c58a-5877-8085-b60c-e89fbf44f08e'
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'Website Customers'
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
        'Services': {
          multi_select: {
            options: [
              { name: 'Window Cleaning', color: 'blue' },
              { name: 'Gutter Clearing', color: 'green' }
            ]
          }
        },
        'Status': {
          select: {
            options: [
              { name: 'New Lead', color: 'yellow' },
              { name: 'Contacted', color: 'blue' }
            ]
          }
        },
        'Date Added': {
          date: {}
        }
      }
    })

    console.log('✅ Database created!')
    console.log('📝 Database ID:', database.id)
    console.log('🔗 URL:', database.url)
    
    // Update .env.local
    const fs = require('fs')
    const envPath = '.env.local'
    let envContent = fs.readFileSync(envPath, 'utf8')
    envContent = envContent.replace(
      'NOTION_DATABASE_ID=YOUR_NOTION_DATABASE_ID_HERE',
      `NOTION_DATABASE_ID=${database.id}`
    )
    fs.writeFileSync(envPath, envContent)
    console.log('✅ Updated .env.local with database ID')

    return database.id

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('Full error:', error)
  }
}

createSimpleDB()