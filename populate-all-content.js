const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🚀 POPULATING ALL CONTENT FOR ALL SITES...');
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
  { name: 'Penrite Oils', logo: 'https://cdn.syzmic.com.au/common/sponsors/penrite-oils.svg', url: 'https://penriteoil.com.au' },
  { name: 'Haltech Engine Management', logo: 'https://cdn.syzmic.com.au/common/sponsors/haltech-logo.svg', url: 'https://www.haltech.com' },
  { name: 'Bridgestone', logo: 'https://cdn.syzmic.com.au/common/sponsors/bridgestone-logo.svg', url: 'https://www.bridgestone.com.au' },
  { name: 'Mobil 1', logo: 'https://cdn.syzmic.com.au/common/sponsors/mobil1-logo.svg', url: 'https://www.mobil.com.au' }
];

// Comprehensive site data
const sitesData = {
  raceready: {
    sponsors: [allSponsors[0], allSponsors[1], allSponsors[5], allSponsors[6], allSponsors[8], allSponsors[9], allSponsors[10], allSponsors[11], allSponsors[12], allSponsors[13]],
    news: [
      { title: "RaceReady Platform 3.0 Launch - Revolutionary Features", slug: "raceready-platform-30-launch", date: "2024-10-05", excerpt: "Major update brings AI-powered race scheduling, real-time competitor analytics, and automated timing integration." },
      { title: "Over 1000 Events Successfully Managed", slug: "raceready-1000-events-milestone", date: "2024-09-20", excerpt: "RaceReady reaches major milestone as motorsport organizers across Australia embrace digital transformation." },
      { title: "Strategic Partnership with FIA Announced", slug: "raceready-fia-partnership", date: "2024-09-10", excerpt: "Partnership ensures compliance with international motorsport regulations and standards." },
      { title: "New Mobile App for Competitors Released", slug: "raceready-mobile-app-release", date: "2024-08-25", excerpt: "Competitors can now manage entries, view schedules, and access live timing from their mobile devices." },
      { title: "RaceReady Summit 2024 Registration Open", slug: "raceready-summit-2024-registration", date: "2024-08-10", excerpt: "Join us for the premier motorsport technology event featuring demos, workshops, and networking." }
    ],
    eventDocuments: [
      { label: 'Platform Guide', url: 'https://cdn.syzmic.com.au/sites/raceready/documents/platform-guide.pdf' },
      { label: 'Event Schedule', url: 'https://cdn.syzmic.com.au/sites/raceready/documents/schedule.pdf' },
      { label: 'Supplementary Regulations', url: 'https://cdn.syzmic.com.au/sites/raceready/documents/regulations.pdf' },
      { label: 'Entry Form', url: 'https://cdn.syzmic.com.au/sites/raceready/documents/entry-form.pdf' }
    ]
  },
  mra: {
    sponsors: [allSponsors[1], allSponsors[0], allSponsors[2], allSponsors[3], allSponsors[5], allSponsors[6], allSponsors[7], allSponsors[8], allSponsors[9], allSponsors[10], allSponsors[11], allSponsors[13]],
    news: [
      { title: "MRA Championship 2024 Season Review - Record Breaking Year", slug: "mra-2024-season-review", date: "2024-10-08", excerpt: "The 2024 season saw record entries across all categories with thrilling competition at every round." },
      { title: "2025 Technical Regulations Announced", slug: "mra-2025-tech-regulations", date: "2024-09-25", excerpt: "Updated regulations focus on sustainability and cost control for competitors while maintaining performance." },
      { title: "MRA Expands to Three New Venues in 2025", slug: "mra-new-venues-2025", date: "2024-09-15", excerpt: "Championship calendar grows with addition of Queensland Raceway, Sandown Park, and Winton Motor Raceway." },
      { title: "Junior Development Program Launches", slug: "mra-junior-development-program", date: "2024-08-30", excerpt: "New initiative provides pathways for young drivers to progress through motorsport ranks." },
      { title: "MRA Finals at Bathurst - Preview", slug: "mra-bathurst-finals-preview", date: "2024-08-15", excerpt: "Championship showdown at Mount Panorama promises spectacular racing with titles on the line." }
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
    sponsors: [allSponsors[2], allSponsors[1], allSponsors[0], allSponsors[5], allSponsors[6], allSponsors[7], allSponsors[8], allSponsors[9], allSponsors[10], allSponsors[12], allSponsors[13]],
    news: [
      { title: "SuperTT Championship Finale at Mount Panorama", slug: "supertt-finale-bathurst-preview", date: "2024-10-10", excerpt: "Just 10 points separate the top three drivers heading into the season finale at the iconic Bathurst circuit." },
      { title: "Gen3 Touring Car Regulations for 2025", slug: "supertt-gen3-2025-announcement", date: "2024-09-28", excerpt: "New generation regulations promise closer racing, reduced costs, and improved sustainability." },
      { title: "Record Grid of 38 Cars for Season Finale", slug: "supertt-record-grid-finale", date: "2024-09-18", excerpt: "Biggest field in SuperTT history confirmed to tackle Mount Panorama in championship decider." },
      { title: "SuperTT TV Coverage Expanded for 2025", slug: "supertt-tv-coverage-2025", date: "2024-09-05", excerpt: "All rounds to be broadcast live on Channel 7 and streamed online with enhanced coverage." },
      { title: "International Driver Wildcards Announced", slug: "supertt-international-wildcards", date: "2024-08-20", excerpt: "Three international touring car stars to compete as wildcards in season finale." }
    ],
    eventDocuments: [
      { label: 'SuperTT Regulations', url: 'https://cdn.syzmic.com.au/sites/supertt/documents/regulations.pdf' },
      { label: 'Event Schedule', url: 'https://cdn.syzmic.com.au/sites/supertt/documents/schedule.pdf' },
      { label: 'Technical Regulations', url: 'https://cdn.syzmic.com.au/sites/supertt/documents/tech-regs.pdf' },
      { label: 'Entry Form', url: 'https://cdn.syzmic.com.au/sites/supertt/documents/entry-form.pdf' },
      { label: 'Track Map', url: 'https://cdn.syzmic.com.au/sites/supertt/documents/track-map.pdf' }
    ]
  },
  clubman: {
    sponsors: [allSponsors[3], allSponsors[1], allSponsors[0], allSponsors[5], allSponsors[6], allSponsors[7], allSponsors[8], allSponsors[9], allSponsors[10], allSponsors[11], allSponsors[12]],
    news: [
      { title: "Clubman Championship Celebrates 25th Anniversary", slug: "clubman-25th-anniversary", date: "2024-10-01", excerpt: "Quarter century of grassroots motorsport excellence celebrated with special livery and commemorative events." },
      { title: "2025 Calendar - Eight Round Championship", slug: "clubman-2025-calendar-announcement", date: "2024-09-22", excerpt: "Expanded calendar visits all major NSW and ACT circuits with increased prize money." },
      { title: "Junior Development Program Launched", slug: "clubman-junior-development", date: "2024-09-12", excerpt: "New initiative provides pathway for young drivers to enter circuit racing affordably." },
      { title: "Record 45 Entries for Season Finale", slug: "clubman-record-entries-finale", date: "2024-08-28", excerpt: "Unprecedented grid size demonstrates health and popularity of grassroots motorsport." },
      { title: "Clubman Champions Crowned at SMP", slug: "clubman-champions-crowned", date: "2024-08-15", excerpt: "Thrilling season conclusion sees champions decided in final race at Sydney Motorsport Park." }
    ],
    eventDocuments: [
      { label: 'Championship Rules', url: 'https://cdn.syzmic.com.au/sites/clubman/documents/rules.pdf' },
      { label: 'Event Schedule', url: 'https://cdn.syzmic.com.au/sites/clubman/documents/schedule.pdf' },
      { label: 'Supplementary Regulations', url: 'https://cdn.syzmic.com.au/sites/clubman/documents/regulations.pdf' },
      { label: 'Entry Form', url: 'https://cdn.syzmic.com.au/sites/clubman/documents/entry-form.pdf' }
    ]
  },
  mx5cup: {
    sponsors: [allSponsors[0], allSponsors[1], allSponsors[5], allSponsors[6], allSponsors[7], allSponsors[8], allSponsors[9], allSponsors[10], allSponsors[11], allSponsors[12], allSponsors[13]],
    news: [
      { title: "MX5 Cup Champion Crowned at Phillip Island", slug: "mx5cup-2024-champion-crowned", date: "2024-10-09", excerpt: "Thrilling season concludes with nail-biting finale at Phillip Island Grand Prix Circuit." },
      { title: "Record 45 Entries Already Confirmed for 2025", slug: "mx5cup-record-2025-entries", date: "2024-09-27", excerpt: "Unprecedented interest sees championship expand to two classes for ND and NC MX-5s." },
      { title: "MX5 Cup Australia Joins International Network", slug: "mx5cup-international-network", date: "2024-09-16", excerpt: "Partnership with Global MX-5 Cup enables inter-series events and driver exchanges." },
      { title: "New Scholarship Program for Young Drivers", slug: "mx5cup-scholarship-program", date: "2024-09-05", excerpt: "Mazda Australia partners with MX5 Cup to provide fully-funded drives for talented juniors." },
      { title: "2025 Calendar Visits Six States", slug: "mx5cup-2025-calendar", date: "2024-08-22", excerpt: "National expansion sees championship visit circuits in QLD, NSW, VIC, SA, WA, and TAS." }
    ],
    eventDocuments: [
      { label: 'MX5 Cup Regulations', url: 'https://cdn.syzmic.com.au/sites/mx5cup/documents/regulations.pdf' },
      { label: 'Event Schedule', url: 'https://cdn.syzmic.com.au/sites/mx5cup/documents/schedule.pdf' },
      { label: 'Technical Specifications', url: 'https://cdn.syzmic.com.au/sites/mx5cup/documents/tech-specs.pdf' },
      { label: 'Entry Form', url: 'https://cdn.syzmic.com.au/sites/mx5cup/documents/entry-form.pdf' },
      { label: 'Track Notes', url: 'https://cdn.syzmic.com.au/sites/mx5cup/documents/track-notes.pdf' }
    ]
  },
  extremett: {
    sponsors: [allSponsors[0], allSponsors[1], allSponsors[5], allSponsors[6], allSponsors[7], allSponsors[8], allSponsors[9], allSponsors[10], allSponsors[12], allSponsors[13]],
    news: [
      { title: "ExtremeTT Breaks Lap Records at Sydney Motorsport Park", slug: "extremett-lap-records-smp", date: "2024-10-07", excerpt: "Multiple track records fall as competition intensifies in final time attack round of 2024 season." },
      { title: "Night Racing Added to 2025 Season", slug: "extremett-night-racing-2025", date: "2024-09-26", excerpt: "First-ever night time attack sessions confirmed for 2025 at Sydney Motorsport Park." },
      { title: "Partnership with GT World Challenge Announced", slug: "extremett-gt-world-challenge", date: "2024-09-14", excerpt: "Special time attack exhibition to run alongside GT World Challenge Australia rounds." },
      { title: "Electric Vehicle Class Introduced", slug: "extremett-ev-class", date: "2024-09-02", excerpt: "New EV category welcomes electric performance cars to time attack competition." },
      { title: "ExtremeTT Champion Sets New Benchmark", slug: "extremett-champion-new-record", date: "2024-08-18", excerpt: "Defending champion breaks own lap record with stunning sub-1:30 lap at SMP." }
    ],
    eventDocuments: [
      { label: 'Time Attack Regulations', url: 'https://cdn.syzmic.com.au/sites/extremett/documents/regulations.pdf' },
      { label: 'Event Schedule', url: 'https://cdn.syzmic.com.au/sites/extremett/documents/schedule.pdf' },
      { label: 'Class Specifications', url: 'https://cdn.syzmic.com.au/sites/extremett/documents/class-specs.pdf' },
      { label: 'Safety Requirements', url: 'https://cdn.syzmic.com.au/sites/extremett/documents/safety.pdf' }
    ]
  },
  raceofficial: {
    sponsors: [allSponsors[0], allSponsors[1], allSponsors[5], allSponsors[6], allSponsors[7], allSponsors[8], allSponsors[9], allSponsors[10], allSponsors[11], allSponsors[12]],
    news: [
      { title: "Race Official Academy Launches Training Program", slug: "race-official-academy-launch", date: "2024-10-06", excerpt: "Comprehensive new program offers pathways from grassroots to international officiating." },
      { title: "200+ Officials Complete FIA Level 1 Certification", slug: "race-official-fia-certification", date: "2024-09-24", excerpt: "Record number of Australians achieve international race officiating credentials." },
      { title: "Digital Race Control System Rolled Out", slug: "race-official-digital-system", date: "2024-09-13", excerpt: "State-of-the-art digital tools enhance safety, communication, and decision-making." },
      { title: "International Exchange Program Announced", slug: "race-official-exchange-program", date: "2024-08-30", excerpt: "Australian officials to gain experience at international FIA events." },
      { title: "Officials Summit 2024 Registration Open", slug: "race-official-summit-2024", date: "2024-08-16", excerpt: "Annual gathering brings together officials from across Australia for training and networking." }
    ],
    eventDocuments: [
      { label: 'Training Manual', url: 'https://cdn.syzmic.com.au/sites/raceofficial/documents/training-manual.pdf' },
      { label: 'Event Schedule', url: 'https://cdn.syzmic.com.au/sites/raceofficial/documents/schedule.pdf' },
      { label: 'FIA Standards', url: 'https://cdn.syzmic.com.au/sites/raceofficial/documents/fia-standards.pdf' },
      { label: 'Certification Guide', url: 'https://cdn.syzmic.com.au/sites/raceofficial/documents/certification.pdf' }
    ]
  },
  amrc: {
    sponsors: [allSponsors[0], allSponsors[1], allSponsors[4], allSponsors[5], allSponsors[6], allSponsors[7], allSponsors[8], allSponsors[9], allSponsors[10], allSponsors[11], allSponsors[12], allSponsors[13]],
    news: [
      { title: "AMRC Finals 2024 - Championship Showdown at SMP", slug: "amrc-finals-2024-preview", date: "2024-10-04", excerpt: "Season finale at Sydney Motorsport Park promises thrilling conclusion to 2024 club championship." },
      { title: "Partnership with Sydney Motorsport Park Secured", slug: "amrc-smp-partnership", date: "2024-09-23", excerpt: "Multi-year agreement provides preferred access and enhanced facilities for club members." },
      { title: "Club Membership Reaches Record 850 Members", slug: "amrc-membership-record", date: "2024-09-11", excerpt: "Growing community reflects increasing popularity of club-based motorsport participation." },
      { title: "AMRC Social Events Calendar Released", slug: "amrc-social-events-2025", date: "2024-08-29", excerpt: "2025 social calendar includes track days, workshops, and networking events for members." },
      { title: "New Junior Karting Program Announced", slug: "amrc-junior-karting", date: "2024-08-14", excerpt: "Club introduces affordable karting program to develop next generation of motorsport talent." }
    ],
    eventDocuments: [
      { label: 'Club Regulations', url: 'https://cdn.syzmic.com.au/sites/amrc/documents/regulations.pdf' },
      { label: 'Event Schedule', url: 'https://cdn.syzmic.com.au/sites/amrc/documents/schedule.pdf' },
      { label: 'Membership Guide', url: 'https://cdn.syzmic.com.au/sites/amrc/documents/membership.pdf' },
      { label: 'Track Day Guidelines', url: 'https://cdn.syzmic.com.au/sites/amrc/documents/track-day-guide.pdf' },
      { label: 'Championship Points', url: 'https://cdn.syzmic.com.au/sites/amrc/documents/points.pdf' }
    ]
  }
};

async function updateSiteContent(siteSlug, content) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📦 UPDATING ALL CONTENT FOR: ${siteSlug.toUpperCase()}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  
  try {
    // Get site
    const sitesResponse = await strapiApi.get(`/sites?filters[slug][$eq]=${siteSlug}`);
    const siteData = sitesResponse.data.data[0];
    
    if (!siteData) {
      console.log(`⚠️  Site ${siteSlug} not found, skipping...`);
      return;
    }
    
    const siteDocumentId = siteData.documentId;
    
    // 1. Update Sponsors
    console.log(`\n🤝 Updating ${content.sponsors.length} sponsors...`);
    await strapiApi.put(`/sites/${siteDocumentId}`, {
      data: { sponsors: content.sponsors }
    });
    content.sponsors.forEach((s, i) => console.log(`   ${i + 1}. ${s.name}`));
    console.log(`   ✅ Sponsors updated`);
    
    // 2. Update Event Documents
    console.log(`\n📄 Updating ${content.eventDocuments.length} event documents...`);
    await strapiApi.put(`/sites/${siteDocumentId}`, {
      data: { eventDocuments: content.eventDocuments }
    });
    content.eventDocuments.forEach((d, i) => console.log(`   ${i + 1}. ${d.label}`));
    console.log(`   ✅ Event documents updated`);
    
    // 3. Add News Articles
    console.log(`\n📰 Adding ${content.news.length} news articles...`);
    for (const article of content.news) {
      try {
        const newsData = {
          title: article.title,
          slug: article.slug,
          publishedAt: new Date(article.date).toISOString(),
          content: [
            {
              type: "paragraph",
              children: [{ type: "text", text: article.excerpt }]
            }
          ],
          image: {
            url: `https://cdn.syzmic.com.au/sites/${siteSlug}/news/${article.slug}.jpg`
          },
          sites: {
            connect: [{ documentId: siteDocumentId }]
          }
        };
        
        await strapiApi.post('/news-items', { data: newsData });
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
    
    console.log(`\n✨ ${siteSlug.toUpperCase()} - ALL CONTENT UPDATED SUCCESSFULLY!`);
    
  } catch (error) {
    console.log(`\n❌ Error updating ${siteSlug}: ${error.message}`);
    if (error.response?.data) {
      console.log(`   Details: ${JSON.stringify(error.response.data.error, null, 2)}`);
    }
  }
}

async function main() {
  try {
    console.log('\n🔗 Connecting to Strapi...');
    await strapiApi.get('/sites');
    console.log('✅ Connected successfully!\n');
    
    // Update all sites
    for (const [siteSlug, content] of Object.entries(sitesData)) {
      await updateSiteContent(siteSlug, content);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    }
    
    console.log(`\n\n╔══════════════════════════════════════════════════════════════╗`);
    console.log(`║  🎉 ALL CONTENT POPULATION COMPLETED SUCCESSFULLY!          ║`);
    console.log(`╚══════════════════════════════════════════════════════════════╝\n`);
    
    console.log(`📊 SUMMARY:`);
    console.log(`   ✅ Sites updated: ${Object.keys(sitesData).length}`);
    console.log(`   ✅ Total sponsors: ${Object.values(sitesData).reduce((sum, s) => sum + s.sponsors.length, 0)}`);
    console.log(`   ✅ Total news articles: ${Object.values(sitesData).reduce((sum, s) => sum + s.news.length, 0)}`);
    console.log(`   ✅ Total event documents: ${Object.values(sitesData).reduce((sum, s) => sum + s.eventDocuments.length, 0)}`);
    console.log(`\n🌟 Your multi-tenant motorsport CMS is now fully populated!\n`);
    
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

main();

