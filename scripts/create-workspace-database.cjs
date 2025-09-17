/**
 * Create database at workspace level (no parent page needed)
 */

require('dotenv').config({ path: '.env.local' })
const { Client } = require('@notionhq/client')

const createWorkspaceDatabase = async () => {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
    notionVersion: '2022-06-28'
  })

  try {
    console.log('🚀 Creating workspace-level customer database...')
    
    const database = await notion.databases.create({
      parent: {
        type: 'workspace',
        workspace: true
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
              { name: 'Commercial property', color: 'purple' }
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
        
        // Notes
        'Notes': {
          rich_text: {}
        }
      }
    })

    console.log('✅ Database created successfully!')
    console.log('📝 Database ID:', database.id)
    console.log('🔗 Database URL:', database.url)
    console.log('')
    console.log('🔧 Add this to your .env.local file:')
    console.log(`NOTION_DATABASE_ID=${database.id}`)
    console.log('')
    console.log('🧪 Test the integration:')
    console.log('node scripts/test-notion.cjs')

    return database.id

  } catch (error) {
    console.error('❌ Failed to create database:', error.message)
    console.log('Full error:', error)
  }
}

createWorkspaceDatabase()