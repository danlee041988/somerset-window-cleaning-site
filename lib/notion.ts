import { Client } from '@notionhq/client'

// Initialize Notion client with stable API version
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28' // Using stable version to avoid 2025-09-03 breaking changes
})

const DATABASE_ID = process.env.NOTION_DATABASE_ID || ''

export interface NotionCustomerData {
  firstName: string
  lastName: string
  email: string
  phone: string
  postcode: string
  propertyType?: string
  propertySize?: string
  services: string[]
  frequency?: string
  customerType: string
  message?: string
  preferredContact: string
}

export async function createNotionCustomer(data: NotionCustomerData) {
  try {
    // Check if Notion is configured
    if (!process.env.NOTION_API_KEY || !DATABASE_ID || 
        process.env.NOTION_API_KEY === 'YOUR_NOTION_API_KEY_HERE' ||
        DATABASE_ID === 'YOUR_NOTION_DATABASE_ID_HERE') {
      console.warn('Notion API not configured - skipping Notion integration')
      return { 
        success: false, 
        error: 'Notion not configured',
        skipError: true 
      }
    }

    const properties = {
      // Name (title property)
      'Name': {
        title: [
          {
            text: {
              content: `${data.firstName} ${data.lastName}`
            }
          }
        ]
      },
      // Contact Information
      'Email': {
        email: data.email
      },
      'Phone': {
        phone_number: data.phone
      },
      'Postcode': {
        rich_text: [
          {
            text: {
              content: data.postcode
            }
          }
        ]
      },
      // Property Details
      'Property Type': {
        select: {
          name: data.propertyType || 'Residential'
        }
      },
      'Property Size': {
        select: {
          name: data.propertySize || 'Unknown'
        }
      },
      // Services
      'Services': {
        multi_select: data.services.map(service => ({ name: service }))
      },
      // Customer Info
      'Customer Type': {
        select: {
          name: data.customerType === 'new' ? 'New Customer' : 'Existing Customer'
        }
      },
      'Preferred Contact': {
        select: {
          name: data.preferredContact
        }
      },
      // Additional Info
      'Status': {
        select: {
          name: 'New Lead'
        }
      },
      'Date Added': {
        date: {
          start: new Date().toISOString().split('T')[0]
        }
      }
    }

    // Add cleaning frequency if provided
    if (data.frequency) {
      (properties as any)['Cleaning Frequency'] = {
        select: {
          name: data.frequency.replace('-', ' ')
        }
      }
    }

    // Add message if provided
    if (data.message) {
      (properties as any)['Notes'] = {
        rich_text: [
          {
            text: {
              content: data.message
            }
          }
        ]
      }
    }

    const response = await notion.pages.create({
      parent: {
        database_id: DATABASE_ID
      },
      properties
    })

    console.log('✅ Customer created in Notion:', response.id)

    return {
      success: true,
      customerId: response.id,
      url: (response as any).url
    }

  } catch (error) {
    console.error('Notion API Error:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Notion error'
    }
  }
}

export async function updateCustomerStatus(customerId: string, status: string) {
  try {
    await notion.pages.update({
      page_id: customerId,
      properties: {
        'Status': {
          select: {
            name: status
          }
        }
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Failed to update customer status:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function addCustomerNote(customerId: string, note: string) {
  try {
    // Get current notes
    const page = await notion.pages.retrieve({ page_id: customerId })
    
    if ('properties' in page) {
      const currentNotes = page.properties.Notes
      let newContent = note
      
      // Append to existing notes if they exist
      if (currentNotes && 'rich_text' in currentNotes && currentNotes.rich_text.length > 0) {
        const existingText = currentNotes.rich_text.map(rt => rt.plain_text).join('')
        newContent = `${existingText}\n\n---\n${note}`
      }
      
      await notion.pages.update({
        page_id: customerId,
        properties: {
          'Notes': {
            rich_text: [
              {
                text: {
                  content: newContent
                }
              }
            ]
          }
        }
      })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Failed to add customer note:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}