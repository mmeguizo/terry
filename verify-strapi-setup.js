const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🔍 Verifying Strapi Content Types...\n');

async function checkContentTypes() {
  const endpoints = [
    { name: 'Sites', url: '/api/sites' },
    { name: 'News Items (plural)', url: '/api/news-items' },
    { name: 'News Item (singular)', url: '/api/news-item' },
    { name: 'Pages', url: '/api/pages' },
  ];

  console.log('Testing endpoints:\n');

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${STRAPI_URL}${endpoint.url}`, {
        headers: { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` }
      });
      console.log(`✅ ${endpoint.name}: EXISTS (${response.data.data?.length || 0} items)`);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`❌ ${endpoint.name}: NOT FOUND`);
      } else if (error.response?.status === 403) {
        console.log(`⚠️  ${endpoint.name}: EXISTS but no permission`);
      } else {
        console.log(`❌ ${endpoint.name}: ERROR - ${error.message}`);
      }
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('💡 TROUBLESHOOTING STEPS:\n');
  console.log('1. Check if you copied to the CORRECT Strapi directory');
  console.log('   - Your Strapi should have: src/api/news-item/');
  console.log('   - Not: src/api/news-items/ (note the plural)\n');
  
  console.log('2. After copying, did you RESTART Strapi?');
  console.log('   - Stop Strapi (Ctrl+C)');
  console.log('   - Run: npm run develop\n');
  
  console.log('3. Check Strapi logs for errors');
  console.log('   - Look for schema loading errors');
  console.log('   - Check for syntax errors in schema.json\n');
  
  console.log('4. Verify the schema file exists:');
  console.log('   - Check: your-strapi/src/api/news-item/content-types/news-item/schema.json\n');
  
  console.log('5. Check Strapi Admin:');
  console.log('   - Go to: http://localhost:1337/admin');
  console.log('   - Content-Type Builder → Should see "News Item"');
  console.log('   - If not there, the schema wasn\'t loaded\n');
}

checkContentTypes();


