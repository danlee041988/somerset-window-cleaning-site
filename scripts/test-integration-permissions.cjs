/**
 * Test what permissions the integration actually has
 */

require('dotenv').config({ path: '.env.local' })
const { Client } = require('@notionhq/client')

const testPermissions = async () => {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
    notionVersion: '2022-06-28'
  })

  try {
    console.log('🔍 Testing integration permissions...')
    
    // Test 1: Get user info
    console.log('\n1. Testing user info...')
    const user = await notion.users.me()
    console.log('✅ User info:', user.name, user.type)
    
    // Test 2: Try to search for anything
    console.log('\n2. Testing general search...')
    const searchAll = await notion.search({})
    console.log(`✅ Found ${searchAll.results.length} total items`)
    
    // Test 3: Search specifically for pages
    console.log('\n3. Testing page search...')
    const searchPages = await notion.search({
      filter: { property: 'object', value: 'page' }
    })
    console.log(`✅ Found ${searchPages.results.length} pages`)
    
    // Test 4: Search for databases
    console.log('\n4. Testing database search...')
    const searchDatabases = await notion.search({
      filter: { property: 'object', value: 'database' }
    })
    console.log(`✅ Found ${searchDatabases.results.length} databases`)
    
    if (searchDatabases.results.length > 0) {
      console.log('\n📋 Existing databases:')
      searchDatabases.results.forEach((db, index) => {
        const title = db.title?.[0]?.plain_text || 'Untitled'
        console.log(`${index + 1}. ${title} (${db.id})`)
      })
      
      // Test if we can use an existing database
      console.log('\n💡 You already have databases! We could add to an existing one.')
    }
    
    if (searchPages.results.length > 0) {
      console.log('\n📄 Available pages:')
      searchPages.results.forEach((page, index) => {
        const title = page.properties?.title?.title?.[0]?.text?.content || 'Untitled'
        console.log(`${index + 1}. ${title} (${page.id})`)
      })
      
      console.log('\n💡 Found pages! We can create a database using one as parent.')
      return searchPages.results[0].id
    }
    
    return null
    
  } catch (error) {
    console.error('❌ Permission test failed:', error.message)
    return null
  }
}

testPermissions().then(pageId => {
  if (pageId) {
    console.log(`\n🎯 Use this page ID: ${pageId}`)
    console.log('Run: NOTION_PARENT_PAGE_ID=' + pageId + ' node scripts/create-notion-database.cjs')
  }
})