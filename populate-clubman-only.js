const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🚀 POPULATING CLUBMAN CHAMPIONSHIP CONTENT...');
console.log('   STRAPI_URL:', STRAPI_URL);

// API client
const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// All sponsors with real logos
const allSponsors = [
  { name: 'RaceReady', logo: '/Logo/RaceReady/RaceReady 3.svg', url: 'https://raceready.com.au' },
  { name: 'Motor Racing Australia', logo: '/Logo/MRA/MRA-Logo.svg', url: 'https://motorrace.com.au' },
  { name: 'SuperTT Championship', logo: '/Logo/SuperTT/SuperTT.png', url: 'https://supertt.com.au' },
  { name: 'Clubman Championship', logo: '/Logo/Clubmans/Clubman Championship.svg', url: 'https://clubmanchampionship.com' },
  { name: 'Sydney 300', logo: '/Logo/Sydney300/Sydney300_Logo.png', url: 'https://sydney300.com.au' },
  { name: 'Motorsport Australia', logo: 'https://cdn.syzmic.com.au/common/sponsors/motorsport-australia.png', url: 'https://motorsport.org.au' },
  { name: 'Michelin Tyres', logo: 'https://cdn.syzmic.com.au/common/sponsors/michelin-logo.svg', url: 'https://www.michelin.com.au' },
  { name: 'Pirelli Motorsport', logo: 'https://cdn.syzmic.com.au/common/sponsors/pirelli-logo.svg', url: 'https://www.pirelli.com' },
  { name: 'Shell V-Power Racing', logo: 'https://cdn.syzmic.com.au/common/sponsors/shell-vpower.svg', url: 'https://www.shell.com.au' },
  { name: 'Castrol Edge', logo: 'https://cdn.syzmic.com.au/common/sponsors/castrol-edge.svg', url: 'https://www.castrol.com' },
  { name: 'Supercheap Auto', logo: 'https://cdn.syzmic.com.au/common/sponsors/supercheap-auto.svg', url: 'https://www.supercheapauto.com.au' },
  { name: 'Repco', logo: 'https://cdn.syzmic.com.au/common/sponsors/repco-logo.svg', url: 'https://www.repco.com.au' },
  { name: 'Penrite Oils', logo: 'https://cdn.syzmic.com.au/common/sponsors/penrite-oils.svg', url: 'https://penriteoil.com.au' }
];

// Clubman Championship specific data
const clubmanData = {
  sponsors: [
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
  news: [
    { 
      title: "Clubman Championship Celebrates 25th Anniversary", 
      slug: "clubman-25th-anniversary", 
      date: "2024-10-01", 
      excerpt: "Quarter century of grassroots motorsport excellence celebrated with special livery and commemorative events." 
    },
    { 
      title: "2025 Calendar - Eight Round Championship", 
      slug: "clubman-2025-calendar-announcement", 
      date: "2024-09-22", 
      excerpt: "Expanded calendar visits all major NSW and ACT circuits with increased prize money." 
    },
    { 
      title: "Junior Development Program Launched", 
      slug: "clubman-junior-development", 
      date: "2024-09-12", 
      excerpt: "New initiative provides pathway for young drivers to enter circuit racing affordably." 
    },
    { 
      title: "Record 45 Entries for Season Finale", 
      slug: "clubman-record-entries-finale", 
      date: "2024-08-28", 
      excerpt: "Unprecedented grid size demonstrates health and popularity of grassroots motorsport." 
    },
    { 
      title: "Clubman Champions Crowned at SMP", 
      slug: "clubman-champions-crowned", 
      date: "2024-08-15", 
      excerpt: "Thrilling season conclusion sees champions decided in final race at Sydney Motorsport Park." 
    }
  ],
  eventDocuments: [
    { label: 'Championship Rules', url: 'https://cdn.syzmic.com.au/sites/clubman/documents/rules.pdf' },
    { label: 'Event Schedule', url: 'https://cdn.syzmic.com.au/sites/clubman/documents/schedule.pdf' },
    { label: 'Supplementary Regulations', url: 'https://cdn.syzmic.com.au/sites/clubman/documents/regulations.pdf' },
    { label: 'Entry Form', url: 'https://cdn.syzmic.com.au/sites/clubman/documents/entry-form.pdf' }
  ]
};

async function populateClubmanContent() {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📦 POPULATING CLUBMAN CHAMPIONSHIP CONTENT`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  
  try {
    console.log('\n🔗 Connecting to Strapi...');
    await strapiApi.get('/sites');
    console.log('✅ Connected successfully!\n');
    
    // Get site
    console.log('🔍 Finding Clubman site...');
    const sitesResponse = await strapiApi.get(`/sites`);
    const siteData = sitesResponse.data.data.find(site => site.slug === 'clubman');
    
    if (!siteData) {
      console.log(`\n❌ Clubman site not found!`);
      console.log(`\n💡 Please run: node setup-clubman-site.js first\n`);
      return;
    }
    
    console.log('✅ Found Clubman site!');
    console.log('   Document ID:', siteData.documentId);
    console.log('   Title:', siteData.siteTitle);
    
    const siteDocumentId = siteData.documentId;
    
    // 1. Update Sponsors
    console.log(`\n🤝 Updating ${clubmanData.sponsors.length} sponsors...`);
    await strapiApi.put(`/sites/${siteDocumentId}`, {
      data: { sponsors: clubmanData.sponsors }
    });
    clubmanData.sponsors.forEach((s, i) => console.log(`   ${i + 1}. ${s.name}`));
    console.log(`   ✅ Sponsors updated`);
    
    // 2. Update Event Documents
    console.log(`\n📄 Updating ${clubmanData.eventDocuments.length} event documents...`);
    await strapiApi.put(`/sites/${siteDocumentId}`, {
      data: { eventDocuments: clubmanData.eventDocuments }
    });
    clubmanData.eventDocuments.forEach((d, i) => console.log(`   ${i + 1}. ${d.label}`));
    console.log(`   ✅ Event documents updated`);
    
    // 3. Add News Articles
    console.log(`\n📰 Adding ${clubmanData.news.length} news articles...`);
    for (const article of clubmanData.news) {
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
    
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✨ CLUBMAN CHAMPIONSHIP - CONTENT POPULATED!`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    console.log(`📊 SUMMARY:`);
    console.log(`   ✅ Sponsors: ${clubmanData.sponsors.length}`);
    console.log(`   ✅ News articles: ${clubmanData.news.length}`);
    console.log(`   ✅ Event documents: ${clubmanData.eventDocuments.length}`);
    
    console.log(`\n🎯 NEXT STEPS:`);
    console.log(`   1. Set SITE_SLUG=clubman in your .env.local`);
    console.log(`   2. Start your Next.js app: npm run dev`);
    console.log(`   3. Visit http://localhost:3000 to see your Clubman site!`);
    console.log(`\n🌟 Your Clubman Championship site is ready!\n`);
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`);
    if (error.response?.data) {
      console.log(`   Details: ${JSON.stringify(error.response.data.error, null, 2)}`);
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure Strapi is running on', STRAPI_URL);
    }
  }
}

populateClubmanContent();

