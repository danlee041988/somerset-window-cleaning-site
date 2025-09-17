import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID
  
  // Test the API key
  let apiValid = false
  let apiError = null
  
  if (apiKey) {
    try {
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28'
        }
      })
      
      if (response.ok) {
        apiValid = true
      } else {
        const error = await response.json()
        apiError = error
      }
    } catch (e) {
      apiError = e instanceof Error ? e.message : 'Unknown error'
    }
  }
  
  return NextResponse.json({
    environment: {
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET',
      apiKeyType: apiKey ? (apiKey.startsWith('secret_') ? 'secret' : apiKey.startsWith('ntn_') ? 'ntn' : 'unknown') : 'none',
      databaseId: databaseId || 'NOT SET'
    },
    validation: {
      apiValid,
      apiError
    }
  })
}