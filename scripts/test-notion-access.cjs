/**
 * Test Notion API access and permissions
 */

require('dotenv').config({ path: '.env.local' })
const { Client } = require('@notionhq/client')

const testAccess = async () => {
  if (!process.env.NOTION_API_KEY) {
    console.log('❌ No Notion API key found')
    return
  }

  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
    notionVersion: '2022-06-28'
  })

  try {
    console.log('🔍 Testing Notion API access...')
    
    // Test basic API access
    const searchResults = await notion.search({
      filter: {
        value: 'page',
        property: 'object'
      }
    })
    
    console.log('✅ API key is valid')
    console.log(`📄 Found ${searchResults.results.length} accessible pages`)
    
    if (searchResults.results.length > 0) {
      console.log('\n📋 Available pages:')
      searchResults.results.forEach((page, index) => {
        const title = page.properties?.title?.title?.[0]?.text?.content || 'Untitled'
        console.log(`${index + 1}. ${title} (ID: ${page.id})`)
      })
    } else {
      console.log('\n💡 No pages accessible to the integration yet')
      console.log('Make sure you\'ve shared a page with the "Claude" integration')
    }
    
  } catch (error) {
    console.error('❌ API Error:', error.message)
    
    if (error.code === 'unauthorized') {
      console.log('💡 API key might be invalid or the integration is not properly set up')
    }
  }
}

testAccess()