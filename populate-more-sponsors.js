const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

// Configuration from environment variables
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🚀 Adding MORE Sponsors to All Sites...');
console.log('   STRAPI_URL:', STRAPI_URL);

// API client
const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Comprehensive sponsor list with REAL logo paths from public/Logo
const allSponsors = [
  // Primary sponsors
  {
    name: 'RaceReady',
    logo: '/Logo/RaceReady/RaceReady 3.svg',
    url: 'https://raceready.com.au'
  },
  {
    name: 'Motor Racing Australia',
    logo: '/Logo/MRA/MRA-Logo.svg',
    url: 'https://motorrace.com.au'
  },
  {
    name: 'SuperTT Championship',
    logo: '/Logo/SuperTT/SuperTT.png',
    url: 'https://supertt.com.au'
  },
  {
    name: 'Clubman Championship',
    logo: '/Logo/Clubmans/Clubman Championship.svg',
    url: 'https://clubmanchampionship.com'
  },
  {
    name: 'Sydney 300',
    logo: '/Logo/Sydney300/Sydney300_Logo.png',
    url: 'https://sydney300.com.au'
  },
  // Industry sponsors
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
  },
  {
    name: 'Haltech Engine Management',
    logo: 'https://cdn.syzmic.com.au/common/sponsors/haltech-logo.svg',
    url: 'https://www.haltech.com'
  }
];

// Site-specific sponsor configurations (10-12 sponsors per site)
const siteSponsors = {
  raceready: [
    allSponsors[0], // RaceReady
    allSponsors[1], // MRA
    allSponsors[5], // Motorsport Australia
    allSponsors[6], // Michelin
    allSponsors[8], // Shell
    allSponsors[9], // Castrol
    allSponsors[10], // Supercheap Auto
    allSponsors[11], // Repco
    allSponsors[12], // Penrite
    allSponsors[13], // Haltech
  ],
  mra: [
    allSponsors[1], // MRA (self)
    allSponsors[0], // RaceReady
    allSponsors[2], // SuperTT
    allSponsors[3], // Clubman
    allSponsors[5], // Motorsport Australia
    allSponsors[6], // Michelin
    allSponsors[7], // Pirelli
    allSponsors[8], // Shell
    allSponsors[9], // Castrol
    allSponsors[10], // Supercheap Auto
    allSponsors[11], // Repco
    allSponsors[13], // Haltech
  ],
  supertt: [
    allSponsors[2], // SuperTT (self)
    allSponsors[1], // MRA
    allSponsors[0], // RaceReady
    allSponsors[5], // Motorsport Australia
    allSponsors[6], // Michelin
    allSponsors[7], // Pirelli
    allSponsors[8], // Shell
    allSponsors[9], // Castrol
    allSponsors[10], // Supercheap Auto
    allSponsors[12], // Penrite
    allSponsors[13], // Haltech
  ],
  clubman: [
    allSponsors[3], // Clubman (self)
    allSponsors[1], // MRA
    allSponsors[0], // RaceReady
    allSponsors[5], // Motorsport Australia
    allSponsors[6], // Michelin
    allSponsors[7], // Pirelli
    allSponsors[8], // Shell
    allSponsors[9], // Castrol
    allSponsors[10], // Supercheap Auto
    allSponsors[11], // Repco
    allSponsors[12], // Penrite
  ],
  mx5cup: [
    allSponsors[0], // RaceReady
    allSponsors[1], // MRA
    allSponsors[5], // Motorsport Australia
    allSponsors[6], // Michelin
    allSponsors[7], // Pirelli
    allSponsors[8], // Shell
    allSponsors[9], // Castrol
    allSponsors[10], // Supercheap Auto
    allSponsors[11], // Repco
    allSponsors[12], // Penrite
    allSponsors[13], // Haltech
  ],
  extremett: [
    allSponsors[0], // RaceReady
    allSponsors[1], // MRA
    allSponsors[5], // Motorsport Australia
    allSponsors[6], // Michelin
    allSponsors[7], // Pirelli
    allSponsors[8], // Shell
    allSponsors[9], // Castrol
    allSponsors[10], // Supercheap Auto
    allSponsors[12], // Penrite
    allSponsors[13], // Haltech
  ],
  raceofficial: [
    allSponsors[0], // RaceReady
    allSponsors[1], // MRA
    allSponsors[5], // Motorsport Australia
    allSponsors[6], // Michelin
    allSponsors[7], // Pirelli
    allSponsors[8], // Shell
    allSponsors[9], // Castrol
    allSponsors[10], // Supercheap Auto
    allSponsors[11], // Repco
    allSponsors[12], // Penrite
  ],
  amrc: [
    allSponsors[0], // RaceReady
    allSponsors[1], // MRA
    allSponsors[4], // Sydney 300
    allSponsors[5], // Motorsport Australia
    allSponsors[6], // Michelin
    allSponsors[7], // Pirelli
    allSponsors[8], // Shell
    allSponsors[9], // Castrol
    allSponsors[10], // Supercheap Auto
    allSponsors[11], // Repco
    allSponsors[12], // Penrite
    allSponsors[13], // Haltech
  ]
};

async function updateSiteSponsors(siteSlug, sponsors) {
  console.log(`\n🤝 Updating ${siteSlug} with ${sponsors.length} sponsors...`);
  
  try {
    // Get the site
    const sitesResponse = await strapiApi.get(`/sites?filters[slug][$eq]=${siteSlug}`);
    const siteData = sitesResponse.data.data[0];
    
    if (!siteData) {
      console.log(`   ⚠️  Site ${siteSlug} not found`);
      return;
    }
    
    // Update site with sponsors using documentId
    await strapiApi.put(`/sites/${siteData.documentId}`, {
      data: {
        sponsors: sponsors
      }
    });
    
    console.log(`   ✅ Updated with ${sponsors.length} sponsors`);
    sponsors.forEach((s, i) => {
      console.log(`      ${i + 1}. ${s.name}`);
    });
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    if (error.response?.data) {
      console.log(`      Details: ${JSON.stringify(error.response.data.error, null, 2)}`);
    }
  }
}

async function main() {
  try {
    console.log('\n🔗 Connecting to Strapi...');
    await strapiApi.get('/sites');
    console.log('✅ Connected successfully!\n');
    
    // Update all sites with more sponsors
    for (const [siteSlug, sponsors] of Object.entries(siteSponsors)) {
      await updateSiteSponsors(siteSlug, sponsors);
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n\n🎉 Sponsor update completed!\n');
    console.log('📊 Summary:');
    console.log(`   - Sites updated: ${Object.keys(siteSponsors).length}`);
    console.log(`   - Sponsors per site: 10-12`);
    console.log(`   - Using real logos from public/Logo folder`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

main();

