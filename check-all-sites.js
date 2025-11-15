const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🔍 Checking All Sites in Strapi...\n');

const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function checkSites() {
  try {
    console.log('🔗 Connecting to Strapi...');
    const response = await strapiApi.get('/sites');
    console.log('✅ Connected!\n');
    
    const sites = response.data.data;
    console.log(`📊 Total Sites Found: ${sites.length}\n`);
    
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    sites.forEach((site, index) => {
      console.log(`\n${index + 1}. ${site.siteTitle || 'Untitled'}`);
      console.log(`   Domain: ${site.domain || 'Not set'}`);
      console.log(`   Slug: ${site.slug || '❌ EMPTY'}`);
      console.log(`   Document ID: ${site.documentId}`);
      console.log(`   Status: ${site.publishedAt ? '✅ Published' : '⚠️  Draft'}`);
      console.log(`   Primary Color: ${site.primaryColor || 'Not set'}`);
    });
    
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`\n🎯 PRIORITY SITES NEEDED:`);
    console.log(`   1. motorrace.com.au → slug: mra`);
    console.log(`   2. supertt.com.au → slug: supertt`);
    console.log(`   3. clubmanchampionship.com.au → slug: clubman`);
    console.log(`   4. mx5cup.com.au → slug: mx5cup`);
    
    console.log(`\n📋 SITES TO FIX:`);
    const needsFix = sites.filter(s => !s.slug || s.slug === '');
    console.log(`   ${needsFix.length} sites need slugs added\n`);
    
    needsFix.forEach(site => {
      console.log(`   - ${site.siteTitle} (${site.domain}) → Document ID: ${site.documentId}`);
    });
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.status === 401) {
      console.error('\n⚠️  API Token expired! Get new token from:');
      console.error('   https://studio.raceready.com.au/admin');
      console.error('   Settings → API Tokens → Create new token (Full access)');
    }
  }
}

checkSites();







