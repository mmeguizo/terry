/**
 * Add raceReadyGUID field to all sites in Strapi
 * 
 * Usage:
 * 1. Add your site GUIDs below (from Google Sheet)
 * 2. Run: node add-guid-to-strapi.js
 * 
 * This script reads STRAPI_URL and STRAPI_API_TOKEN from .env.local automatically!
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// GUID mappings from Google Sheet
const SITE_GUIDS = {
  // Motor Racing Australia - CONFIRMED WORKING
  'mra': '84368220-881D-42A8-8B08-A38A4FE11A96',
  'motorrace': '84368220-881D-42A8-8B08-A38A4FE11A96', // Alias
  
  // Add your other site GUIDs from Google Sheet:
  'supertt': 'YOUR-SUPERTT-GUID',
  'clubman': 'YOUR-CLUBMAN-GUID',
  'mx5cup': 'YOUR-MX5CUP-GUID',
  'extremett': 'YOUR-EXTREMETT-GUID',
  'sydney300': 'YOUR-SYDNEY300-GUID',
  'wakefield300': 'YOUR-WAKEFIELD300-GUID',
  'classicsportscars': 'YOUR-CLASSICSPORTSCARS-GUID',
  'amrc': 'YOUR-AMRC-GUID',
  'raceready': 'YOUR-RACEREADY-GUID',
  // Add more sites as needed
};

async function addGUIDsToSites() {
  try {
    console.log('🏁 Fetching all sites from Strapi...\n');
    
    // Fetch all sites
    const response = await fetch(`${STRAPI_URL}/api/sites?pagination[pageSize]=100`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sites: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const sites = data.data;

    console.log(`Found ${sites.length} sites\n`);

    // Update each site with its GUID
    for (const site of sites) {
      const siteId = site.id;
      const slug = site.slug || site.attributes?.slug;
      const siteName = site.siteTitle || site.attributes?.siteTitle || slug;
      
      const guid = SITE_GUIDS[slug];

      if (!guid || guid.startsWith('YOUR-')) {
        console.log(`⚠️  Skipping ${siteName} (${slug}) - No GUID configured`);
        continue;
      }

      console.log(`✅ Updating ${siteName} (${slug})...`);
      console.log(`   GUID: ${guid}`);

      // Update the site with the GUID
      const updateResponse = await fetch(`${STRAPI_URL}/api/sites/${siteId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            raceReadyGUID: guid
          }
        })
      });

      if (!updateResponse.ok) {
        const error = await updateResponse.text();
        console.error(`   ❌ Failed: ${updateResponse.status} - ${error}\n`);
        continue;
      }

      console.log(`   ✓ Success!\n`);
    }

    console.log('\n🎉 All sites updated successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Restart your Next.js app: npm run dev');
    console.log('2. Check homepage - countdown should show real data');
    console.log('3. Test API: http://localhost:3000/api/raceready-events?view=next\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Make sure:');
    console.error('- STRAPI_URL is correct');
    console.error('- STRAPI_API_TOKEN is valid');
    console.error('- You have permission to update sites');
    console.error('- The raceReadyGUID field exists in Site content type\n');
  }
}

// Check if credentials are loaded from .env.local
if (!STRAPI_URL || !STRAPI_API_TOKEN) {
  console.error('\n❌ Error: Could not load Strapi credentials from .env.local\n');
  console.log('Make sure your .env.local file contains:');
  console.log('  STRAPI_URL=https://your-strapi-url.com');
  console.log('  STRAPI_API_TOKEN=your-api-token\n');
  console.log('Then run: node add-guid-to-strapi.js\n');
  process.exit(1);
}

console.log('✅ Loaded credentials from .env.local');
console.log(`   Strapi URL: ${STRAPI_URL}\n`);

// Run the script
addGUIDsToSites();

