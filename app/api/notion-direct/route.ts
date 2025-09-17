import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get environment variables at runtime
    const apiKey = process.env.NOTION_API_KEY
    const databaseId = process.env.NOTION_DATABASE_ID
    
    // Use environment variable or fallback for development
    const workingApiKey = process.env.NOTION_API_KEY || apiKey
    const workingDatabaseId = process.env.NOTION_DATABASE_ID || '2707c58a-5877-81af-9e26-ff0d9a5e0ae3'
    
    console.log('🔧 Notion Configuration:', {
      hasApiKey: !!workingApiKey,
      databaseId: workingDatabaseId,
      apiKeyLength: workingApiKey?.length || 0
    })
    
    if (!workingApiKey || !workingDatabaseId) {
      console.error('❌ Notion configuration missing:', {
        apiKey: !!workingApiKey,
        databaseId: !!workingDatabaseId
      })
      return NextResponse.json({
        success: false,
        error: 'Notion not configured - missing API key or database ID'
      })
    }
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'postcode', 'services', 'customerType', 'preferredContact']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Log received data for debugging
    console.log('📋 Received data:', {
      name: `${body.firstName} ${body.lastName}`,
      photos: body.customerPhotos ? `${body.customerPhotos.length} photos` : 'No photos',
      calculatedPrice: body.calculatedPrice,
      services: body.services,
      customerType: body.customerType
    })

    // Create page properties
    const properties = {
      'Name': {
        title: [
          {
            text: {
              content: `${body.firstName} ${body.lastName}`
            }
          }
        ]
      },
      'Email': {
        email: body.email
      },
      'Phone': {
        phone_number: body.phone
      },
      'Postcode': {
        rich_text: [
          {
            text: {
              content: body.postcode
            }
          }
        ]
      },
      'Property Type': {
        select: {
          name: body.propertyType || 'Detached house'
        }
      },
      'Services': {
        multi_select: Array.isArray(body.services) 
          ? body.services.map((service: string) => ({ name: service }))
          : [{ name: body.services }]
      },
      'Customer Type': {
        select: {
          name: body.customerType === 'new' ? 'New Customer' : 'Existing Customer'
        }
      },
      'Status': {
        select: {
          name: 'New Lead'
        }
      },
      'Date Added': {
        date: {
          start: new Date().toISOString().split('T')[0]
        }
      },
      'Date & Time Submitted (UK Format)': {
        rich_text: [
          {
            text: {
              content: (() => {
                const now = new Date()
                const day = now.getDate().toString().padStart(2, '0')
                const month = (now.getMonth() + 1).toString().padStart(2, '0')
                const year = now.getFullYear()
                const hours = now.getHours().toString().padStart(2, '0')
                const minutes = now.getMinutes().toString().padStart(2, '0')
                return `${day}-${month}-${year} ${hours}:${minutes}`
              })()
            }
          }
        ]
      },
      'Customer Reference Number': {
        rich_text: [
          {
            text: {
              content: '' // Empty by default - to be filled manually
            }
          }
        ]
      },
      'Squeegee Status': {
        select: {
          name: 'Not Processed'
        }
      },
      'Services & Agreed Prices': {
        rich_text: [
          {
            text: {
              content: '' // Empty by default - to be filled manually after quoting
            }
          }
        ]
      },
      'Cleaning Frequency': {
        select: {
          name: (() => {
            if (!body.frequency) return 'Not specified'
            
            // Map form values to database options
            const frequencyMap = {
              '4-weeks': 'Every 4 weeks',
              '8-weeks': 'Every 8 weeks', 
              '12-weeks': 'Every 12 weeks',
              'ad-hoc': 'Ad hoc basis',
              'Every 4 weeks': 'Every 4 weeks',
              'Every 8 weeks': 'Every 8 weeks',
              'Every 12 weeks': 'Every 12 weeks'
            }
            
            return frequencyMap[body.frequency as keyof typeof frequencyMap] || 'Not specified'
          })()
        }
      },
      'Customer Photos': {
        files: body.customerPhotos && body.customerPhotos.length > 0 
          ? body.customerPhotos.map((fileUploadId: string) => ({
              type: 'file_upload',
              file_upload: {
                id: fileUploadId
              }
            }))
          : []
      }
    }

    // Add optional fields to Notes section

    // Combine message and other details in Notes
    let notesContent = ''
    if (body.message) {
      notesContent += body.message
    }
    
    // Property details section
    const propertyDetails = []
    if (body.propertySize) {
      propertyDetails.push(`Property size: ${body.propertySize}`)
    }
    if (body.hasExtension) {
      propertyDetails.push(`Has extension: Yes`)
    }
    if (body.hasConservatory) {
      propertyDetails.push(`Has conservatory: Yes`)
    }
    if (body.propertyNotes) {
      propertyDetails.push(`Property notes: ${body.propertyNotes}`)
    }
    
    if (propertyDetails.length > 0) {
      notesContent += (notesContent ? '\n\n' : '') + 'PROPERTY DETAILS:\n' + propertyDetails.join('\n')
    }
    
    // Service preferences section
    const serviceDetails = []
    if (body.preferredContact) {
      serviceDetails.push(`Preferred contact method: ${body.preferredContact}`)
    }
    if (body.calculatedPrice) {
      serviceDetails.push(`Estimated window cleaning price: £${body.calculatedPrice}`)
    }
    
    if (serviceDetails.length > 0) {
      notesContent += (notesContent ? '\n\n' : '') + 'SERVICE PREFERENCES:\n' + serviceDetails.join('\n')
    }
    
    // Address validation section
    if (body.addressValidation) {
      const addressDetails = []
      if (body.addressValidation.inServiceArea !== undefined) {
        addressDetails.push(`In service area: ${body.addressValidation.inServiceArea ? 'Yes' : 'No'}`)
      }
      if (body.addressValidation.formattedAddress) {
        addressDetails.push(`Formatted address: ${body.addressValidation.formattedAddress}`)
      }
      if (body.addressValidation.coordinates) {
        addressDetails.push(`Location: ${body.addressValidation.coordinates.lat}, ${body.addressValidation.coordinates.lng}`)
      }
      
      if (addressDetails.length > 0) {
        notesContent += (notesContent ? '\n\n' : '') + 'ADDRESS VALIDATION:\n' + addressDetails.join('\n')
      }
    }
    
    if (notesContent) {
      (properties as any)['Notes'] = {
        rich_text: [
          {
            text: {
              content: notesContent
            }
          }
        ]
      }
    }

    // Create page using direct API call
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${workingApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parent: {
          database_id: workingDatabaseId
        },
        properties
      })
    })

    const responseText = await response.text()
    let result: any
    
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      console.error('❌ Failed to parse Notion response:', responseText)
      return NextResponse.json({
        success: false,
        error: 'Invalid response from Notion API'
      })
    }

    if (response.ok) {
      console.log('✅ Customer created in Notion:', result.id)
      
      return NextResponse.json({
        success: true,
        customerId: result.id,
        url: result.url
      })
    } else {
      console.error('❌ Notion API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: result,
        databaseId: workingDatabaseId
      })
      
      // Check for specific Notion error types
      let errorMessage = 'Failed to create customer in Notion'
      
      if (result.code === 'unauthorized') {
        errorMessage = 'Notion API key is invalid or lacks permissions'
      } else if (result.code === 'object_not_found') {
        errorMessage = 'Notion database not found - check database ID'
      } else if (result.code === 'validation_error') {
        errorMessage = `Notion validation error: ${result.message}`
      } else if (result.message) {
        errorMessage = result.message
      }
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        details: result
      })
    }

  } catch (error) {
    console.error('Notion API route error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}