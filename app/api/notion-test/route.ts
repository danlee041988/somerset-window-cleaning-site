import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NOTION_API_KEY
    const databaseId = process.env.NOTION_DATABASE_ID
    
    console.log('🧪 Testing Notion Connection:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      databaseId: databaseId || 'Not set'
    })
    
    if (!apiKey || !databaseId) {
      return NextResponse.json({
        success: false,
        error: 'Notion environment variables not configured',
        details: {
          NOTION_API_KEY: !!apiKey,
          NOTION_DATABASE_ID: !!databaseId
        }
      })
    }
    
    // Test 1: Verify API Key validity
    const userResponse = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28'
      }
    })
    
    if (!userResponse.ok) {
      const error = await userResponse.json()
      return NextResponse.json({
        success: false,
        error: 'Invalid Notion API key',
        details: error
      })
    }
    
    const userData = await userResponse.json()
    console.log('✅ API Key valid, user:', userData.name)
    
    // Test 2: Verify Database Access
    const dbResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28'
      }
    })
    
    if (!dbResponse.ok) {
      const error = await dbResponse.json()
      return NextResponse.json({
        success: false,
        error: 'Cannot access Notion database',
        details: {
          databaseId,
          error
        }
      })
    }
    
    const dbData = await dbResponse.json()
    console.log('✅ Database accessible:', dbData.title?.[0]?.plain_text || 'Untitled')
    
    // Test 3: Try to create a test entry
    const testData = {
      parent: {
        database_id: databaseId
      },
      properties: {
        'Name': {
          title: [{
            text: {
              content: 'Test Entry - ' + new Date().toISOString()
            }
          }]
        },
        'Email': {
          email: 'test@example.com'
        },
        'Phone': {
          phone_number: '07123456789'
        },
        'Status': {
          select: {
            name: 'New Lead'
          }
        }
      }
    }
    
    const createResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })
    
    const createResult = await createResponse.json()
    
    if (!createResponse.ok) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create test entry',
        details: createResult
      })
    }
    
    // Delete the test entry
    await fetch(`https://api.notion.com/v1/pages/${createResult.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ archived: true })
    })
    
    return NextResponse.json({
      success: true,
      message: 'All Notion tests passed!',
      details: {
        apiKeyValid: true,
        databaseAccessible: true,
        canCreateEntries: true,
        databaseTitle: dbData.title?.[0]?.plain_text || 'Untitled',
        testEntryCreated: createResult.id
      }
    })
    
  } catch (error) {
    console.error('Notion test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}