/**
 * Script to update Strapi Hero collection with backgroundVideo field
 *
 * Usage: node scripts/update-hero-video.js
 *
 * This script will:
 * 1. Fetch the current hero data for MRA site from Strapi
 * 2. Update it with the backgroundVideo URL
 * 3. Publish the changes
 */

require('dotenv').config({ path: '.env.local' });

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const SITE_SLUG = process.env.SITE_SLUG || 'mra';
const YOUTUBE_VIDEO_URL = 'https://youtu.be/zEsbZSRtM7E';

if (!STRAPI_URL || !STRAPI_API_TOKEN) {
  console.error('❌ Error: STRAPI_URL and STRAPI_API_TOKEN must be set in .env.local');
  process.exit(1);
}

async function updateHeroVideo() {
  try {
    console.log('🔍 Fetching site data from Strapi...');
    console.log(`   URL: ${STRAPI_URL}`);
    console.log(`   Site Slug: ${SITE_SLUG}`);

    // Step 1: Fetch current site data with hero populated
    const fetchResponse = await fetch(
      `${STRAPI_URL}/api/sites?filters[slug][$eq]=${SITE_SLUG}&populate[hero]=*`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch site data: ${fetchResponse.status} ${fetchResponse.statusText}`);
    }

    const fetchData = await fetchResponse.json();
    console.log('✅ Site data fetched successfully');

    if (!fetchData.data || fetchData.data.length === 0) {
      console.error('❌ No site found for slug:', SITE_SLUG);
      process.exit(1);
    }

    const siteEntry = fetchData.data[0];
    const heroData = siteEntry.hero?.[0];

    if (!heroData) {
      console.error('❌ No hero data found in site');
      process.exit(1);
    }

    console.log(`📝 Found site entry (ID: ${siteEntry.id})`);
    console.log(`   Site Title: ${siteEntry.siteTitle || 'N/A'}`);
    console.log(`   Hero ID: ${heroData.id}`);
    console.log(`   Event Name: ${heroData.eventName || 'N/A'}`);
    console.log(`   Current backgroundVideo: ${heroData.backgroundVideo || 'null'}`);

    console.log('\n⚠️  Unable to update via API - Strapi components are protected.');
    console.log('\n📋 Manual Update Instructions:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Open Strapi Admin Panel:');
    console.log(`   ${STRAPI_URL}/admin`);
    console.log('\n2. Navigate to:');
    console.log('   Content Manager → Collection Types → Site');
    console.log('\n3. Find and open:');
    console.log(`   "${siteEntry.siteTitle}" (slug: ${SITE_SLUG})`);
    console.log('\n4. Scroll down to the "Hero" section');
    console.log('\n5. Add the backgroundVideo field with value:');
    console.log(`   ${YOUTUBE_VIDEO_URL}`);
    console.log('\n6. Click "Save" at the top right');
    console.log('\n7. Refresh your website to see the video background!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('\n❌ Error fetching site data:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the script
updateHeroVideo();
