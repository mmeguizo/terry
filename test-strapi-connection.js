const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🧪 Testing Strapi Connection...\n');
console.log('STRAPI_URL:', STRAPI_URL);
console.log('Token exists:', !!STRAPI_API_TOKEN);
console.log('Token length:', STRAPI_API_TOKEN ? STRAPI_API_TOKEN.length : 0);
console.log('Token preview:', STRAPI_API_TOKEN ? STRAPI_API_TOKEN.substring(0, 20) + '...' : 'none');

async function testConnection() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Test 1: Basic connection without auth
  console.log('Test 1: Basic Strapi connection (no auth)');
  try {
    const response = await axios.get(`${STRAPI_URL}/_health`);
    console.log('✅ Strapi is running');
  } catch (error) {
    console.log('❌ Cannot connect to Strapi:', error.message);
    console.log('💡 Make sure Strapi is running on', STRAPI_URL);
    return;
  }
  
  // Test 2: API connection with token
  console.log('\nTest 2: API connection with token');
  try {
    const response = await axios.get(`${STRAPI_URL}/api/sites`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });
    console.log('✅ API token is valid!');
    console.log('   Sites found:', response.data.data.length);
    if (response.data.data.length > 0) {
      console.log('   First site:', response.data.data[0].siteTitle || response.data.data[0].slug);
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('❌ API token is INVALID or has wrong permissions');
      console.log('\n📋 How to fix:');
      console.log('   1. Go to http://localhost:1337/admin');
      console.log('   2. Settings → API Tokens');
      console.log('   3. Delete the old token');
      console.log('   4. Create new token:');
      console.log('      - Name: Content Population');
      console.log('      - Token type: Full access');
      console.log('      - Token duration: Unlimited');
      console.log('   5. Copy the NEW token');
      console.log('   6. Update .env.local with: STRAPI_API_TOKEN=your_new_token');
    } else if (error.response?.status === 403) {
      console.log('❌ API token lacks permissions');
      console.log('   Token needs "Full access" or at least:');
      console.log('   - Site: find, findOne, create, update');
      console.log('   - News-item: find, findOne, create, update');
    } else {
      console.log('❌ Error:', error.message);
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }
  
  // Test 3: Check content types exist
  console.log('\nTest 3: Checking if content types exist');
  try {
    const response = await axios.get(`${STRAPI_URL}/api/content-type-builder/content-types`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });
    console.log('✅ Can access content type builder');
  } catch (error) {
    // This endpoint might not be accessible, try a different approach
    console.log('⚠️  Cannot access content type builder (this is normal)');
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

testConnection();


