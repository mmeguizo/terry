const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🔧 Fixing Site Slugs...\n');

const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Map domain to slug
const domainToSlug = {
  'motorrace.com.au': 'mra',
  'supertt.com.au': 'supertt',
  'clubmanchampionship.com.au': 'clubman',
  'mx5cup.com.au': 'mx5cup'
};

async function fixSlugs() {
  try {
    console.log('🔗 Connecting to Strapi...');
    const response = await strapiApi.get('/sites');
    console.log('✅ Connected!\n');
    
    const sites = response.data.data;
    console.log(`📊 Found ${sites.length} sites\n`);
    
    for (const site of sites) {
      const domain = site.domain;
      const expectedSlug = domainToSlug[domain];
      
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📍 ${site.siteTitle || 'Untitled'}`);
      console.log(`   Domain: ${domain}`);
      console.log(`   Current Slug: ${site.slug || '❌ EMPTY'}`);
      console.log(`   Expected Slug: ${expectedSlug || 'Not in priority list'}`);
      
      if (expectedSlug && site.slug !== expectedSlug) {
        console.log(`   🔄 Updating slug to: ${expectedSlug}`);
        
        try {
          await strapiApi.put(`/sites/${site.documentId}`, {
            data: {
              slug: expectedSlug
            }
          });
          console.log(`   ✅ Slug updated successfully!`);
          
          // Also publish the site
          try {
            await strapiApi.post(`/sites/${site.documentId}/actions/publish`);
            console.log(`   ✅ Site published!`);
          } catch (pubError) {
            console.log(`   ⚠️  Could not publish: ${pubError.response?.data?.error?.message || pubError.message}`);
          }
          
        } catch (error) {
          console.log(`   ❌ Error updating: ${error.response?.data?.error?.message || error.message}`);
        }
      } else if (expectedSlug && site.slug === expectedSlug) {
        console.log(`   ✅ Slug is correct!`);
        
        // Try to publish if not published
        if (!site.publishedAt) {
          try {
            await strapiApi.post(`/sites/${site.documentId}/actions/publish`);
            console.log(`   ✅ Site published!`);
          } catch (pubError) {
            console.log(`   ⚠️  Could not publish: ${pubError.response?.data?.error?.message || pubError.message}`);
          }
        } else {
          console.log(`   ✅ Already published!`);
        }
      } else {
        console.log(`   ⏭️  Skipping (not in priority list)`);
      }
      
      console.log('');
    }
    
    console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
    console.log(`║  🎉 SLUG FIX COMPLETE!                                      ║`);
    console.log(`╚══════════════════════════════════════════════════════════════╝\n`);
    
    console.log(`✅ Priority Sites Ready:`);
    console.log(`   1. MRA (motorrace.com.au) → slug: mra`);
    console.log(`   2. SuperTT (supertt.com.au) → slug: supertt`);
    console.log(`   3. Clubman (clubmanchampionship.com.au) → slug: clubman`);
    console.log(`   4. MX5 Cup (mx5cup.com.au) → slug: mx5cup`);
    console.log(`\n🎯 Update your .env.local with SITE_SLUG=mra (or supertt, clubman, mx5cup)`);
    console.log(`   Then restart your dev server!\n`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.status === 401) {
      console.error('\n⚠️  API Token is invalid or expired!');
      console.error('   Please get a new token from Strapi Admin:');
      console.error('   Settings → API Tokens → Create new token');
      console.error('   Then update STRAPI_API_TOKEN in .env.local');
    }
  }
}

fixSlugs();





