/**
 * Script to populate Racing Network websites in Strapi
 * Based on SRO Motorsports network structure
 *
 * Usage: node scripts/populate-racing-networks.js
 */

require('dotenv').config({ path: '.env.local' });

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const SITE_SLUG = process.env.SITE_SLUG || 'mra';

// Racing network websites (SRO-style)
const racingNetworks = [
  {
    label: 'GT World Challenge Australia',
    url: 'https://www.gt-world-challenge-australia.com/',
    logo: 'https://www.sro-motorsports.com/assets/img/gtwc-australia-neg-250x140-2025.svg'
  },
  {
    label: 'GT4 Australia',
    url: 'https://gt4australia.com.au/',
    logo: 'https://www.sro-motorsports.com/assets/img/gt4-australia-logo-250x140-neg.svg'
  },
  {
    label: 'GT World Challenge',
    url: 'https://www.gt-world-challenge.com',
    logo: 'https://www.sro-motorsports.com/assets/img/gtwc-neg-250x140-2025.svg'
  },
  {
    label: 'GT World Challenge Europe',
    url: 'https://www.gt-world-challenge-europe.com',
    logo: 'https://www.sro-motorsports.com/assets/img/gtwc-europe-neg-250x140-2025.svg'
  },
  {
    label: 'GT World Challenge America',
    url: 'https://www.gt-world-challenge-america.com/',
    logo: 'https://www.sro-motorsports.com/assets/img/gtwc-america-neg-250x140-2025.svg'
  },
  {
    label: 'GT World Challenge Asia',
    url: 'https://www.gt-world-challenge-asia.com/',
    logo: 'https://www.sro-motorsports.com/assets/img/gtwc-asia-neg-250x140-2025.svg'
  },
  {
    label: 'GT4 European Series',
    url: 'https://www.gt4europeanseries.com/',
    logo: 'https://www.sro-motorsports.com/assets/img/gt4-european-series-rafa-250x140-logo.svg'
  },
  {
    label: 'GT4 America',
    url: 'https://www.gt4-america.com/',
    logo: 'https://www.sro-motorsports.com/assets/img/gt4-america-logo-250x140-2023-v2.svg'
  },
  {
    label: 'British GT Championship',
    url: 'https://www.britishgt.com/',
    logo: 'https://www.sro-motorsports.com/assets/img/british-gt-championship-logo-2024-250x140.svg'
  },
  {
    label: 'Intercontinental GT Challenge',
    url: 'https://www.intercontinentalgtchallenge.com/',
    logo: 'https://www.sro-motorsports.com/assets/img/intercontinental-gt-challange-logo-neg-250x140.svg'
  },
  {
    label: 'GT2 European Series',
    url: 'https://www.gt2europeanseries.com/',
    logo: 'https://www.sro-motorsports.com/assets/img/gt2-european-series-pirelli-250x140-logo-neg-2025.svg'
  },
  {
    label: 'SRO Motorsports Group',
    url: 'https://www.sro-motorsports.com/',
    logo: 'https://www.sro-motorsports.com/assets/img/sro-motorsports-group-logo-neg-250x140.svg'
  }
];

if (!STRAPI_URL || !STRAPI_API_TOKEN) {
  console.error('❌ Error: STRAPI_URL and STRAPI_API_TOKEN must be set in .env.local');
  process.exit(1);
}

async function populateRacingNetworks() {
  try {
    console.log('🔍 Fetching MRA site from Strapi...');
    console.log(`   URL: ${STRAPI_URL}`);
    console.log(`   Site Slug: ${SITE_SLUG}`);

    // Step 1: Fetch current site data
    const fetchResponse = await fetch(
      `${STRAPI_URL}/api/sites?filters[slug][$eq]=${SITE_SLUG}&populate=*`,
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
    console.log(`📝 Found site entry (ID: ${siteEntry.id})`);
    console.log(`   Site Title: ${siteEntry.siteTitle || 'N/A'}`);
    console.log(`   Current websites count: ${siteEntry.websites?.length || 0}`);

    console.log('\n⚠️  Unable to update via API - Strapi sites collection is read-only.');
    console.log('\n📋 Manual Update Instructions:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Open Strapi Admin Panel:');
    console.log(`   ${STRAPI_URL}/admin`);
    console.log('\n2. Navigate to:');
    console.log('   Content Manager → Collection Types → Site');
    console.log('\n3. Find and open:');
    console.log(`   "${siteEntry.siteTitle}" (slug: ${SITE_SLUG})`);
    console.log('\n4. Scroll down to the "Websites" section');
    console.log('\n5. Add the following racing networks (click "+ Add entry" for each):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    racingNetworks.forEach((network, index) => {
      console.log(`\n   ${index + 1}. ${network.label}`);
      console.log(`      URL: ${network.url}`);
      console.log(`      Logo: ${network.logo}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n6. Click "Save" at the top right');
    console.log('\n7. Refresh your website to see the racing networks!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('\n❌ Error populating racing networks:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the script
populateRacingNetworks();
