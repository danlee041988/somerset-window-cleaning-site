/**
 * Test Notion API with direct key (no env loading)
 */

const testDirectAPI = async () => {
  // Direct API key for testing
  const apiKey = 'YOUR_NOTION_API_KEY_HERE'
  
  console.log('Testing with direct API key...')
  console.log('Key preview:', `${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 5)}`)
  
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
    
    if (response.ok) {
      console.log('✅ API key is working!')
      console.log('User:', data.name, data.type)
      console.log('Workspace:', data.bot?.workspace_name)
      
      // Now test search for pages
      console.log('\n🔍 Testing page search...')
      const searchResponse = await fetch('https://api.notion.com/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filter: { property: 'object', value: 'page' }
        })
      })
      
      const searchData = await searchResponse.json()
      console.log(`Found ${searchData.results?.length || 0} pages`)
      
      if (searchData.results?.length > 0) {
        console.log('✅ Found accessible pages! Can create database.')
        console.log('First page ID:', searchData.results[0].id)
      }
      
    } else {
      console.log('❌ API error:', data.message)
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

testDirectAPI()