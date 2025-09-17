/**
 * Debug environment variables loading
 */

require('dotenv').config({ path: '.env.local' })

console.log('Environment variables loaded:')
console.log('NOTION_API_KEY:', process.env.NOTION_API_KEY ? `${process.env.NOTION_API_KEY.substring(0, 15)}...` : 'NOT SET')
console.log('NOTION_DATABASE_ID:', process.env.NOTION_DATABASE_ID || 'NOT SET')

// Test direct API call
const testDirectConnection = async () => {
  const apiKey = process.env.NOTION_API_KEY
  
  if (!apiKey) {
    console.log('❌ No API key found')
    return
  }
  
  try {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28'
      }
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Direct API connection working!')
      console.log('User:', data.name)
    } else {
      console.log('❌ API error:', data.message)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }
}

testDirectConnection()