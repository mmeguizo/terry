const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🚀 POPULATING MRA, SuperTT, and MX5 Cup Sites...');
console.log('   STRAPI_URL:', STRAPI_URL, '\n');

const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// All sponsors with CDN URLs
const allSponsors = [
  { name: 'RaceReady', logo: 'https://cdn.syzmic.com.au/common/sponsors/raceready-logo.svg', url: 'https://raceready.com.au' },
  { name: 'Motor Racing Australia', logo: 'https://cdn.syzmic.com.au/common/sponsors/mra-logo.svg', url: 'https://motorrace.com.au' },
  { name: 'SuperTT Championship', logo: 'https://cdn.syzmic.com.au/sites/supertt/logo.png', url: 'https://supertt.com.au' },
  { name: 'Clubman Championship', logo: 'https://cdn.syzmic.com.au/sites/clubman/logo.png', url: 'https://clubmanchampionship.com' },
  { name: 'Motorsport Australia', logo: 'https://cdn.syzmic.com.au/common/sponsors/motorsport-australia.png', url: 'https://motorsport.org.au' },
  { name: 'Michelin Tyres', logo: 'https://cdn.syzmic.com.au/common/sponsors/michelin-logo.svg', url: 'https://www.michelin.com.au' },
  { name: 'Pirelli Motorsport', logo: 'https://cdn.syzmic.com.au/common/sponsors/pirelli-logo.svg', url: 'https://www.pirelli.com' },
  { name: 'Shell V-Power Racing', logo: 'https://cdn.syzmic.com.au/common/sponsors/shell-vpower.svg', url: 'https://www.shell.com.au' },
  { name: 'Castrol Edge', logo: 'https://cdn.syzmic.com.au/common/sponsors/castrol-edge.svg', url: 'https://www.castrol.com' },
  { name: 'Supercheap Auto', logo: 'https://cdn.syzmic.com.au/common/sponsors/supercheap-auto.svg', url: 'https://www.supercheapauto.com.au' },
  { name: 'Repco', logo: 'https://cdn.syzmic.com.au/common/sponsors/repco-logo.svg', url: 'https://www.repco.com.au' },
  { name: 'Penrite Oils', logo: 'https://cdn.syzmic.com.au/common/sponsors/penrite-oils.svg', url: 'https://penriteoil.com.au' }
];

// Site configurations
const sitesConfig = {
  mra: {
    siteTitle: 'Motor Racing Australia',
    domain: 'motorrace.com.au',
    primaryColor: '#E31E24',
    menuBackground: '#FFFFFF',
    textColor: '#000000',
    logoImage: '/Logo/MRA/MRA-Logo.svg',
    hero: [{
      background: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg',
      eventName: 'MRA Championship 2025',
      eventLocation: 'Mount Panorama Circuit',
      eventDate: '2025-10-04',
      eventInfo: '/event-info'
    }],
    heroButton: [
      { label: 'Championship Info', url: '/event-info' },
      { label: 'Enter Now', url: '/entry-form' },
      { label: 'View Calendar', url: '/events' }
    ],
    menu: [
      { label: 'Home', url: '/' },
      { label: 'Events', url: '/events' },
      { label: 'Event Info', url: '/event-info' },
      { label: 'News', url: '/#news' },
      { label: 'Documents', url: '/#documents' }
    ],
    footer: [{ backgroundColor: '#1a1a1a', textColor: '#FFFFFF' }],
    socials: [
      { platform: 'Facebook', url: 'https://facebook.com/motorracingaustralia' },
      { platform: 'Instagram', url: 'https://instagram.com/motorracingaustralia' },
      { platform: 'Twitter', url: 'https://twitter.com/mra_racing' }
    ],
    sponsors: [allSponsors[1], allSponsors[0], allSponsors[2], allSponsors[4], allSponsors[5], allSponsors[6], allSponsors[7], allSponsors[8], allSponsors[9], allSponsors[10], allSponsors[11]],
    news: [
      { title: "MRA Championship 2024 Season Review - Record Breaking Year", slug: "mra-2024-season-review", date: "2024-10-08", excerpt: "Record entries across all categories with thrilling competition." },
      { title: "2025 Technical Regulations Announced", slug: "mra-2025-tech-regulations", date: "2024-09-25", excerpt: "Updated regulations focus on sustainability and cost control." },
      { title: "MRA Expands to Three New Venues in 2025", slug: "mra-new-venues-2025", date: "2024-09-15", excerpt: "Queensland Raceway, Sandown Park, and Winton added to calendar." },
      { title: "Junior Development Program Launches", slug: "mra-junior-development-program", date: "2024-08-30", excerpt: "New pathways for young drivers to progress through motorsport." },
      { title: "MRA Finals at Bathurst - Preview", slug: "mra-bathurst-finals-preview", date: "2024-08-15", excerpt: "Championship showdown at Mount Panorama promises spectacular racing." }
    ],
    eventDocuments: [
      { label: 'Championship Regulations', url: 'https://cdn.syzmic.com.au/sites/mra/documents/championship-regulations.pdf' },
      { label: 'Event Schedule', url: 'https://cdn.syzmic.com.au/sites/mra/documents/schedule.pdf' },
      { label: 'Supplementary Regulations', url: 'https://cdn.syzmic.com.au/sites/mra/documents/regulations.pdf' },
      { label: 'Technical Specifications', url: 'https://cdn.syzmic.com.au/sites/mra/documents/tech-specs.pdf' },
      { label: 'Entry List', url: 'https://cdn.syzmic.com.au/sites/mra/documents/entry-list.pdf' }
    ]
  },
  supertt: {
    siteTitle: 'SuperTT Championship',
    domain: 'supertt.com.au',
    primaryColor: '#FF0000',
    menuBackground: '#FFFFFF',
    textColor: '#000000',
    logoImage: '/Logo/SuperTT/SuperTT.png',
    hero: [{
      background: 'https://images.pexels.com/photos/358220/pexels-photo-358220.jpeg',
      eventName: 'SuperTT Championship Finale',
      eventLocation: 'Mount Panorama',
      eventDate: '2025-10-10',
      eventInfo: '/event-info'
    }],
    heroButton: [
      { label: 'Event Information', url: '/event-info' },
      { label: 'Enter Now', url: '/entry-form' },
      { label: 'View Schedule', url: '/events' }
    ],
    menu: [
      { label: 'Home', url: '/' },
      { label: 'Events', url: '/events' },
      { label: 'Event Info', url: '/event-info' },
      { label: 'News', url: '/#news' },
      { label: 'Documents', url: '/#documents' }
    ],
    footer: [{ backgroundColor: '#1a1a1a', textColor: '#FFFFFF' }],
    socials: [
      { platform: 'Facebook', url: 'https://facebook.com/supertt' },
      { platform: 'Instagram', url: 'https://instagram.com/supertt' },
      { platform: 'Twitter', url: 'https://twitter.com/supertt' }
    ],
    sponsors: [allSponsors[2], allSponsors[1], allSponsors[0], allSponsors[4], allSponsors[5], allSponsors[6], allSponsors[7], allSponsors[8], allSponsors[9], allSponsors[10], allSponsors[11]],
    news: [
      { title: "SuperTT Championship Finale at Mount Panorama", slug: "supertt-finale-bathurst-preview", date: "2024-10-10", excerpt: "Just 10 points separate the top three drivers in season finale." },
      { title: "Gen3 Touring Car Regulations for 2025", slug: "supertt-gen3-2025-announcement", date: "2024-09-28", excerpt: "New generation regulations promise closer racing and reduced costs." },
      { title: "Record Grid of 38 Cars for Season Finale", slug: "supertt-record-grid-finale", date: "2024-09-18", excerpt: "Biggest field in SuperTT history confirmed for Mount Panorama." },
      { title: "SuperTT TV Coverage Expanded for 2025", slug: "supertt-tv-coverage-2025", date: "2024-09-05", excerpt: "All rounds to be broadcast live on Channel 7 with enhanced coverage." },
      { title: "International Driver Wildcards Announced", slug: "supertt-international-wildcards", date: "2024-08-20", excerpt: "Three international touring car stars to compete as wildcards." }
    ],
    eventDocuments: [
      { label: 'SuperTT Regulations', url: 'https://cdn.syzmic.com.au/sites/supertt/documents/regulations.pdf' },
      { label: 'Event Schedule', url: 'https://cdn.syzmic.com.au/sites/supertt/documents/schedule.pdf' },
      { label: 'Technical Regulations', url: 'https://cdn.syzmic.com.au/sites/supertt/documents/tech-regs.pdf' },
      { label: 'Entry Form', url: 'https://cdn.syzmic.com.au/sites/supertt/documents/entry-form.pdf' },
      { label: 'Track Map', url: 'https://cdn.syzmic.com.au/sites/supertt/documents/track-map.pdf' }
    ]
  },
  mx5cup: {
    siteTitle: 'MX5 Cup Australia',
    domain: 'mx5cup.com.au',
    primaryColor: '#C8102E',
    menuBackground: '#FFFFFF',
    textColor: '#000000',
    logoImage: '/Logo/MX5/MX5-Cup-Logo.svg',
    hero: [{
      background: 'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg',
      eventName: 'MX5 Cup 2025',
      eventLocation: 'Phillip Island Grand Prix Circuit',
      eventDate: '2025-10-09',
      eventInfo: '/event-info'
    }],
    heroButton: [
      { label: 'Event Information', url: '/event-info' },
      { label: 'Enter Now', url: '/entry-form' },
      { label: 'View Schedule', url: '/events' }
    ],
    menu: [
      { label: 'Home', url: '/' },
      { label: 'Events', url: '/events' },
      { label: 'Event Info', url: '/event-info' },
      { label: 'News', url: '/#news' },
      { label: 'Documents', url: '/#documents' }
    ],
    footer: [{ backgroundColor: '#1a1a1a', textColor: '#FFFFFF' }],
    socials: [
      { platform: 'Facebook', url: 'https://facebook.com/mx5cup' },
      { platform: 'Instagram', url: 'https://instagram.com/mx5cup' },
      { platform: 'Twitter', url: 'https://twitter.com/mx5cup' }
    ],
    sponsors: [allSponsors[0], allSponsors[1], allSponsors[4], allSponsors[5], allSponsors[6], allSponsors[7], allSponsors[8], allSponsors[9], allSponsors[10], allSponsors[11]],
    news: [
      { title: "MX5 Cup Champion Crowned at Phillip Island", slug: "mx5cup-2024-champion-crowned", date: "2024-10-09", excerpt: "Thrilling season concludes with nail-biting finale at Phillip Island." },
      { title: "Record 45 Entries Already Confirmed for 2025", slug: "mx5cup-record-2025-entries", date: "2024-09-27", excerpt: "Championship expands to two classes for ND and NC MX-5s." },
      { title: "MX5 Cup Australia Joins International Network", slug: "mx5cup-international-network", date: "2024-09-16", excerpt: "Partnership enables inter-series events and driver exchanges." },
      { title: "New Scholarship Program for Young Drivers", slug: "mx5cup-scholarship-program", date: "2024-09-05", excerpt: "Mazda Australia provides fully-funded drives for talented juniors." },
      { title: "2025 Calendar Visits Six States", slug: "mx5cup-2025-calendar", date: "2024-08-22", excerpt: "National expansion to circuits in QLD, NSW, VIC, SA, WA, and TAS." }
    ],
    eventDocuments: [
      { label: 'MX5 Cup Regulations', url: 'https://cdn.syzmic.com.au/sites/mx5cup/documents/regulations.pdf' },
      { label: 'Event Schedule', url: 'https://cdn.syzmic.com.au/sites/mx5cup/documents/schedule.pdf' },
      { label: 'Technical Specifications', url: 'https://cdn.syzmic.com.au/sites/mx5cup/documents/tech-specs.pdf' },
      { label: 'Entry Form', url: 'https://cdn.syzmic.com.au/sites/mx5cup/documents/entry-form.pdf' },
      { label: 'Track Notes', url: 'https://cdn.syzmic.com.au/sites/mx5cup/documents/track-notes.pdf' }
    ]
  }
};

async function createSite(slug, config) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🏗️  CREATING ${config.siteTitle.toUpperCase()}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  
  try {
    // Check if site exists
    const existingResponse = await strapiApi.get(`/sites`);
    const existingSite = existingResponse.data.data.find(site => site.slug === slug);
    
    if (existingSite) {
      console.log(`⚠️  Site already exists, skipping creation...`);
      return existingSite.documentId;
    }
    
    // Remove news, sponsors, and eventDocuments from site creation (will add separately)
    const { news, sponsors, eventDocuments, ...siteData } = config;
    
    // Create site
    const response = await strapiApi.post('/sites', { data: siteData });
    console.log(`✅ Site created successfully!`);
    console.log(`   Document ID: ${response.data.data.documentId}`);
    return response.data.data.documentId;
    
  } catch (error) {
    console.log(`❌ Error creating site: ${error.message}`);
    if (error.response?.data) {
      console.log(`   Details: ${JSON.stringify(error.response.data.error, null, 2)}`);
    }
    return null;
  }
}

async function populateContent(slug, siteDocumentId, config) {
  console.log(`\n📦 POPULATING CONTENT FOR ${slug.toUpperCase()}...`);
  
  try {
    // Update sponsors
    console.log(`\n🤝 Updating ${config.sponsors.length} sponsors...`);
    await strapiApi.put(`/sites/${siteDocumentId}`, {
      data: { sponsors: config.sponsors }
    });
    config.sponsors.forEach((s, i) => console.log(`   ${i + 1}. ${s.name}`));
    console.log(`   ✅ Sponsors updated`);
    
    // Update event documents
    console.log(`\n📄 Updating ${config.eventDocuments.length} event documents...`);
    await strapiApi.put(`/sites/${siteDocumentId}`, {
      data: { eventDocuments: config.eventDocuments }
    });
    config.eventDocuments.forEach((d, i) => console.log(`   ${i + 1}. ${d.label}`));
    console.log(`   ✅ Event documents updated`);
    
    // Add news articles
    console.log(`\n📰 Adding ${config.news.length} news articles...`);
    for (const article of config.news) {
      try {
        const newsData = {
          title: article.title,
          slug: article.slug,
          publishedAt: new Date(article.date).toISOString(),
          description: article.excerpt.substring(0, 80)
        };
        
        await strapiApi.post('/articles', { data: newsData });
        console.log(`   ✅ ${article.title}`);
      } catch (error) {
        const errorMsg = error.response?.data?.error?.message || '';
        if (errorMsg.includes('unique') || errorMsg.includes('already exists')) {
          console.log(`   ⏭️  ${article.title} (already exists)`);
        } else {
          console.log(`   ❌ ${article.title}: ${errorMsg}`);
        }
      }
    }
    
    console.log(`\n✨ ${slug.toUpperCase()} - CONTENT POPULATED!`);
    
  } catch (error) {
    console.log(`\n❌ Error populating content: ${error.message}`);
  }
}

async function main() {
  try {
    console.log('\n🔗 Connecting to Strapi...');
    await strapiApi.get('/sites');
    console.log('✅ Connected successfully!\n');
    
    // Process each site
    for (const [slug, config] of Object.entries(sitesConfig)) {
      const siteDocumentId = await createSite(slug, config);
      if (siteDocumentId) {
        await populateContent(slug, siteDocumentId, config);
      }
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between sites
    }
    
    console.log(`\n\n╔══════════════════════════════════════════════════════════════╗`);
    console.log(`║  🎉 ALL THREE SITES POPULATED SUCCESSFULLY!                 ║`);
    console.log(`╚══════════════════════════════════════════════════════════════╝\n`);
    
    console.log(`📊 SUMMARY:`);
    console.log(`   ✅ MRA - Motor Racing Australia (Red #E31E24)`);
    console.log(`   ✅ SuperTT - SuperTT Championship (Red #FF0000)`);
    console.log(`   ✅ MX5 Cup - MX5 Cup Australia (Mazda Red #C8102E)`);
    console.log(`\n🎯 Each site has:`);
    console.log(`   - 10-11 sponsors with CDN logos`);
    console.log(`   - 5 news articles`);
    console.log(`   - 4-5 event documents`);
    console.log(`   - Full branding and navigation\n`);
    
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
  }
}

main();

