import { NextRequest, NextResponse } from 'next/server'
import { createNotionCustomer, type NotionCustomerData } from '@/lib/notion'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'postcode', 'services', 'customerType', 'preferredContact']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    const customerData: NotionCustomerData = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      postcode: body.postcode,
      propertyType: body.propertyType,
      propertySize: body.propertySize,
      services: Array.isArray(body.services) ? body.services : [body.services],
      frequency: body.frequency,
      customerType: body.customerType,
      message: body.message,
      preferredContact: body.preferredContact
    }

    // Create customer in Notion
    const result = await createNotionCustomer(customerData)

    return NextResponse.json(result)

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