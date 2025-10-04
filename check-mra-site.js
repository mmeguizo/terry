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

async function checkMRASite() {
  try {
    // This is the exact same query your frontend uses
    const queryUrl = `/sites?filters[slug][$eq]=mra&populate[footer]=*&populate[socials]=*&populate[sponsors]=*&populate[eventDocuments]=*&populate[menu]=*&populate[websites]=*&populate[hero]=*&populate[heroButton]=*`;
    
    console.log('🔍 Checking MRA site with frontend query...');
    console.log('Query URL:', queryUrl);
    
    const response = await strapiApi.get(queryUrl);
    
    console.log('\n📊 Response:');
    console.log('Status:', response.status);
    console.log('Data count:', response.data.data?.length || 0);
    
    if (response.data.data && response.data.data.length > 0) {
      const site = response.data.data[0];
      console.log('\n🎯 Found MRA site:');
      console.log('ID:', site.id);
      console.log('Document ID:', site.documentId);
      console.log('Raw data:', JSON.stringify(site, null, 2));
    } else {
      console.log('❌ No MRA site found');
    }
    
  } catch (error) {
    console.error('💥 Error:', error.response?.data || error.message);
  }
}

checkMRASite();
