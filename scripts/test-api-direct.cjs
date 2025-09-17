/**
 * Test the exact API key we have
 */

const testAPIKey = async () => {
  const apiKey = 'YOUR_NOTION_API_KEY_HERE'
  
  console.log('Testing API key:', `${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 5)}`)
  
  try {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28'
      }
    })
    
    const data = await response.json()
    
    console.log('Status:', response.status)
    console.log('Response:', data)
    
    if (response.ok) {
      console.log('✅ API key is valid!')
      
      // Test creating a page in our database
      const databaseId = '2707c58a-5877-81af-9e26-ff0d9a5e0ae3'
      console.log('\\n🧪 Testing page creation...')
      
      const createResponse = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parent: {
            database_id: databaseId
          },
          properties: {
            'Name': {
              title: [
                {
                  text: {
                    content: 'Test Customer'
                  }
                }
              ]
            },
            'Email': {
              email: 'test@example.com'
            },
            'Phone': {
              phone_number: '07123456789'
            },
            'Postcode': {
              rich_text: [
                {
                  text: {
                    content: 'BA5 1AB'
                  }
                }
              ]
            },
            'Customer Type': {
              select: {
                name: 'New Customer'
              }
            },
            'Services': {
              multi_select: [
                { name: 'Window Cleaning' }
              ]
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
            }
          }
        })
      })
      
      const createData = await createResponse.json()
      
      if (createResponse.ok) {
        console.log('✅ Page created successfully!')
        console.log('Page ID:', createData.id)
        console.log('URL:', createData.url)
      } else {
        console.log('❌ Page creation failed:', createData.message)
        console.log('Full error:', createData)
      }
      
    } else {
      console.log('❌ API key invalid:', data.message)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }
}

testAPIKey()