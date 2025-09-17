/**
 * Create Somerset Window Cleaning customer database in Notion
 * 
 * To run:
 * 1. Set your Notion API key in .env.local
 * 2. Run: node scripts/create-notion-database.cjs
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const { Client } = require('@notionhq/client')

const createCustomerDatabase = async () => {
  if (!process.env.NOTION_API_KEY || process.env.NOTION_API_KEY === 'YOUR_NOTION_API_KEY_HERE') {
    console.log('❌ Please set your Notion API key in .env.local first')
    console.log('Get your API key from: https://www.notion.so/my-integrations')
    return
  }

  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  })

  try {
    console.log('🚀 Creating Somerset Window Cleaning customer database...')

    // First try to find a suitable parent page
    let parentPageId = process.env.NOTION_PARENT_PAGE_ID
    
    if (!parentPageId || parentPageId === 'YOUR_PARENT_PAGE_ID_HERE') {
      console.log('📋 Searching for available pages...')
      
      try {
        const searchResults = await notion.search({
          filter: {
            value: 'page',
            property: 'object'
          }
        })
        
        if (searchResults.results.length > 0) {
          parentPageId = searchResults.results[0].id
          console.log(`✅ Found page to use: ${searchResults.results[0].id}`)
        } else {
          throw new Error('No accessible pages found')
        }
      } catch (searchError) {
        console.log('❌ Could not find accessible pages')
        console.log('💡 You need to share a page with the "Claude" integration first')
        return
      }
    }

    const database = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: parentPageId
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'Somerset Window Cleaning - Customers'
          }
        }
      ],
      properties: {
        // Customer Name (Title)
        'Name': {
          title: {}
        },
        
        // Contact Information
        'Email': {
          email: {}
        },
        'Phone': {
          phone_number: {}
        },
        'Postcode': {
          rich_text: {}
        },
        
        // Property Details
        'Property Type': {
          select: {
            options: [
              { name: 'Detached house', color: 'blue' },
              { name: 'Terraced / Semi-detached house', color: 'green' },
              { name: 'Commercial property', color: 'purple' },
              { name: 'Apartment/Flat', color: 'yellow' }
            ]
          }
        },
        'Property Size': {
          select: {
            options: [
              { name: '1-2 bedrooms', color: 'gray' },
              { name: '3 bedrooms', color: 'brown' },
              { name: '4 bedrooms', color: 'orange' },
              { name: '5 bedrooms', color: 'yellow' },
              { name: '6+ bedrooms', color: 'green' },
              { name: 'Commercial', color: 'purple' }
            ]
          }
        },
        
        // Services
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
        
        // Customer Information
        'Customer Type': {
          select: {
            options: [
              { name: 'New Customer', color: 'green' },
              { name: 'Existing Customer', color: 'blue' }
            ]
          }
        },
        'Preferred Contact': {
          select: {
            options: [
              { name: 'Email', color: 'blue' },
              { name: 'Phone', color: 'green' }
            ]
          }
        },
        
        // Service Details
        'Cleaning Frequency': {
          select: {
            options: [
              { name: 'Every 4 weeks', color: 'green' },
              { name: 'Every 8 weeks', color: 'blue' },
              { name: 'Every 12 weeks', color: 'yellow' },
              { name: 'Ad hoc basis', color: 'gray' }
            ]
          }
        },
        
        // Business Management
        'Status': {
          select: {
            options: [
              { name: 'New Lead', color: 'yellow' },
              { name: 'Contacted', color: 'blue' },
              { name: 'Quote Sent', color: 'purple' },
              { name: 'Booked', color: 'green' },
              { name: 'Completed', color: 'gray' },
              { name: 'Recurring Customer', color: 'pink' }
            ]
          }
        },
        'Date Added': {
          date: {}
        },
        'Last Service': {
          date: {}
        },
        'Next Service': {
          date: {}
        },
        
        // Notes and Additional Info
        'Notes': {
          rich_text: {}
        },
        'Estimated Value': {
          number: {
            format: 'pound'
          }
        }
      }
    })

    console.log('✅ Database created successfully!')
    console.log('📝 Database ID:', database.id)
    console.log('🔗 Database URL:', database.url)
    console.log('')
    console.log('🔧 Next steps:')
    console.log('1. Add this to your .env.local file:')
    console.log(`NOTION_DATABASE_ID=${database.id}`)
    console.log('')
    console.log('2. Test the integration:')
    console.log('node scripts/test-notion.cjs')

    return database.id

  } catch (error) {
    console.error('❌ Failed to create database:', error)
    
    if (error.code === 'object_not_found') {
      console.log('')
      console.log('💡 This usually means:')
      console.log('1. Your Notion integration doesn\'t have access to the parent page')
      console.log('2. The parent page ID is incorrect')
      console.log('')
      console.log('🔧 To fix:')
      console.log('1. Go to the Notion page where you want the database')
      console.log('2. Share the page with your integration')
      console.log('3. Copy the page ID from the URL')
      console.log('4. Set NOTION_PARENT_PAGE_ID in .env.local')
    }
    
    if (error.code === 'unauthorized') {
      console.log('')
      console.log('💡 Your API key might be invalid or expired')
      console.log('🔧 Get a new one from: https://www.notion.so/my-integrations')
    }
  }
}

// Run the script
createCustomerDatabase()