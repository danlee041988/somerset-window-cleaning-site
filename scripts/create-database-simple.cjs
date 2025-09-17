/**
 * Simple database creation - try to create in any accessible location
 */

require('dotenv').config({ path: '.env.local' })
const { Client } = require('@notionhq/client')

const createSimpleDatabase = async () => {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
    notionVersion: '2022-06-28' // Using stable version
  })

  try {
    console.log('🚀 Trying to create database in root workspace...')
    
    // Try different approaches to find where to create the database
    
    // Method 1: Search for any page
    let searchResults = await notion.search({})
    console.log(`Found ${searchResults.results.length} total results`)
    
    // Filter for pages only
    const pages = searchResults.results.filter(result => result.object === 'page')
    console.log(`Found ${pages.length} pages`)
    
    if (pages.length > 0) {
      const targetPage = pages[0]
      console.log(`Using page: ${targetPage.id}`)
      
      const database = await notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: targetPage.id
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
                { name: 'Gutter Clearing', color: 'green' },
                { name: 'Conservatory Roof Cleaning', color: 'purple' }
              ]
            }
          },
          'Status': {
            select: {
              options: [
                { name: 'New Lead', color: 'yellow' },
                { name: 'Contacted', color: 'blue' },
                { name: 'Booked', color: 'green' }
              ]
            }
          },
          'Date Added': {
            date: {}
          }
        }
      })

      console.log('✅ Database created!')
      console.log('Database ID:', database.id)
      console.log('Database URL:', database.url)
      
      return database.id
    } else {
      console.log('❌ No accessible pages found')
      
      // Try to get more details about access
      const user = await notion.users.me()
      console.log('Current user:', user)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('Full error:', error)
  }
}

createSimpleDatabase()