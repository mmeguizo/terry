const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function debugSites() {
  try {
    const response = await strapiApi.get('/sites?populate=*');
    const sites = response.data.data || [];
    
    console.log(`Found ${sites.length} sites:`);
    
    // Log the raw response structure
    console.log('\nRaw response structure:');
    console.log(JSON.stringify(response.data, null, 2));
    
    sites.forEach((site, index) => {
      console.log(`\n${index + 1}. Site ID: ${site.id}`);
      console.log(`   Raw site data:`, JSON.stringify(site, null, 2));
    });
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

debugSites();
