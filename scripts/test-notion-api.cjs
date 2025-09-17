const https = require('https');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_DATABASE_ID;

console.log('Testing Notion API...');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
console.log('API Key prefix:', apiKey ? apiKey.substring(0, 4) : 'NOT SET');
console.log('Database ID:', databaseId || 'NOT SET');

// Test 1: Check if API key is valid
const options = {
  hostname: 'api.notion.com',
  port: 443,
  path: '/v1/users/me',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Notion-Version': '2022-06-28'
  }
};

const req = https.request(options, (res) => {
  console.log('\nAPI Key Test:');
  console.log('Status Code:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const result = JSON.parse(data);
    if (res.statusCode === 200) {
      console.log('✅ API Key is valid!');
      console.log('Bot name:', result.bot?.owner?.user?.name || 'Unknown');
      testDatabase();
    } else {
      console.log('❌ API Key is invalid!');
      console.log('Error:', result);
      console.log('\nPossible solutions:');
      console.log('1. Generate a new integration at https://www.notion.so/my-integrations');
      console.log('2. Make sure to copy the entire "Internal Integration Token"');
      console.log('3. The token should start with "secret_" not "ntn_"');
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.end();

function testDatabase() {
  console.log('\nTesting database access...');
  
  const dbOptions = {
    hostname: 'api.notion.com',
    port: 443,
    path: `/v1/databases/${databaseId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28'
    }
  };
  
  const dbReq = https.request(dbOptions, (res) => {
    console.log('Database Status Code:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const result = JSON.parse(data);
      if (res.statusCode === 200) {
        console.log('✅ Database accessible!');
        console.log('Database title:', result.title?.[0]?.plain_text || 'Untitled');
      } else {
        console.log('❌ Cannot access database!');
        console.log('Error:', result);
        console.log('\nMake sure to:');
        console.log('1. Share the database with your integration');
        console.log('2. Click "Share" on the database page');
        console.log('3. Invite your integration by name');
      }
    });
  });
  
  dbReq.on('error', (e) => {
    console.error('Database request error:', e);
  });
  
  dbReq.end();
}