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

console.log('🔧 Quick Fix: Updating Sponsor Logos to CDN URLs...\n');

// Sponsors with working CDN URLs
const workingSponsors = [
  {
    name: 'Clubman Championship',
    logo: 'https://cdn.syzmic.com.au/sites/clubman/logo.png',
    url: 'https://clubmanchampionship.com'
  },
  {
    name: 'Motor Racing Australia',
    logo: 'https://cdn.syzmic.com.au/common/sponsors/mra-logo.svg',
    url: 'https://motorrace.com.au'
  },
  {
    name: 'RaceReady',
    logo: 'https://cdn.syzmic.com.au/common/sponsors/raceready-logo.svg',
    url: 'https://raceready.com.au'
  },
  {
    name: 'Motorsport Australia',
    logo: 'https://cdn.syzmic.com.au/common/sponsors/motorsport-australia.png',
    url: 'https://motorsport.org.au'
  },
  {
    name: 'Michelin Tyres',
    logo: 'https://cdn.syzmic.com.au/common/sponsors/michelin-logo.svg',
    url: 'https://www.michelin.com.au'
  },
  {
    name: 'Pirelli Motorsport',
    logo: 'https://cdn.syzmic.com.au/common/sponsors/pirelli-logo.svg',
    url: 'https://www.pirelli.com'
  },
  {
    name: 'Shell V-Power Racing',
    logo: 'https://cdn.syzmic.com.au/common/sponsors/shell-vpower.svg',
    url: 'https://www.shell.com.au'
  },
  {
    name: 'Castrol Edge',
    logo: 'https://cdn.syzmic.com.au/common/sponsors/castrol-edge.svg',
    url: 'https://www.castrol.com'
  },
  {
    name: 'Supercheap Auto',
    logo: 'https://cdn.syzmic.com.au/common/sponsors/supercheap-auto.svg',
    url: 'https://www.supercheapauto.com.au'
  },
  {
    name: 'Repco',
    logo: 'https://cdn.syzmic.com.au/common/sponsors/repco-logo.svg',
    url: 'https://www.repco.com.au'
  },
  {
    name: 'Penrite Oils',
    logo: 'https://cdn.syzmic.com.au/common/sponsors/penrite-oils.svg',
    url: 'https://penriteoil.com.au'
  }
];

async function updateSponsors() {
  try {
    // Get Clubman site
    const siteResponse = await strapiApi.get('/sites?filters[slug][$eq]=clubman');
    const site = siteResponse.data.data[0];
    
    if (!site) {
      console.log('❌ Clubman site not found!');
      return;
    }
    
    console.log('✅ Found Clubman site');
    console.log('   Current sponsors:', site.sponsors?.length || 0);
    
    // Update with CDN URLs
    console.log('\n🔄 Updating sponsors with CDN URLs...');
    await strapiApi.put(`/sites/${site.documentId}`, {
      data: {
        sponsors: workingSponsors
      }
    });
    
    console.log('✅ Sponsors updated successfully!');
    console.log('\n📊 Updated sponsors:');
    workingSponsors.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.name}`);
    });
    
    console.log('\n🎉 DONE! Refresh your browser to see the sponsor logos.\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

updateSponsors();


