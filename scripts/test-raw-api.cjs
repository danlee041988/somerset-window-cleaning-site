/**
 * Test raw Notion API call to debug token issues
 */

require('dotenv').config({ path: '.env.local' })

const testRawAPI = async () => {
  const apiKey = process.env.NOTION_API_KEY
  console.log('Testing API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET')
  
  try {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Status:', response.status)
    const data = await response.json()
    console.log('Response:', data)
    
    if (response.ok) {
      console.log('✅ API key is working!')
      console.log('User:', data.name, data.type)
    } else {
      console.log('❌ API key issue:', data.message)
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

testRawAPI()