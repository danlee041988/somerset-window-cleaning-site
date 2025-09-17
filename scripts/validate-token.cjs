/**
 * Validate the exact token in our .env file
 */

require('dotenv').config({ path: '.env.local' })

const validateToken = async () => {
  const envToken = process.env.NOTION_API_KEY
  const directToken = 'YOUR_NOTION_API_KEY_HERE'
  
  console.log('🔍 Token comparison:')
  console.log('Environment token:', envToken)
  console.log('Direct token:     ', directToken)
  console.log('Tokens match:     ', envToken === directToken)
  console.log('Token length comparison:', envToken?.length, 'vs', directToken.length)
  
  // Test both tokens
  for (const [name, token] of [['Environment', envToken], ['Direct', directToken]]) {
    if (!token) {
      console.log(`❌ ${name} token is null/undefined`)
      continue
    }
    
    try {
      console.log(`\\n🧪 Testing ${name} token...`)
      
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': '2022-06-28'
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ ${name} token works!`)
        console.log('User:', data.name)
      } else {
        console.log(`❌ ${name} token failed:`, data.message)
      }
    } catch (error) {
      console.log(`❌ ${name} token error:`, error.message)
    }
  }
}

validateToken()