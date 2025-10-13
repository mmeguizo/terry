const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

// Configuration from environment variables
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🚀 Starting Enhanced Data Population...');
console.log('   STRAPI_URL:', STRAPI_URL);

// API client
const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Enhanced sponsors data (more sponsors per site)
const commonSponsors = [
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
    name: 'Pirelli Motorsport',
    logo: 'https://cdn.syzmic.com.au/common/sponsors/pirelli-logo.svg',
    url: 'https://www.pirelli.com'
  },
  {
    name: 'Supercheap Auto',
    logo: 'https://cdn.syzmic.com.au/common/sponsors/supercheap-auto.svg',
    url: 'https://www.supercheapauto.com.au'
  }
];

// Enhanced news articles with more variety
const enhancedNews = {
  raceready: [
    {
      title: "RaceReady Platform 3.0 Launches with Revolutionary Features",
      slug: "raceready-platform-30-launch",
      publishedAt: new Date('2024-10-05'),
      category: "Platform Updates",
      excerpt: "Major update brings AI-powered race scheduling and real-time competitor analytics."
    },
    {
      title: "Over 1000 Events Now Managed Through RaceReady",
      slug: "raceready-1000-events-milestone",
      publishedAt: new Date('2024-09-20'),
      category: "Milestones",
      excerpt: "The platform reaches a significant milestone as motorsport organizers embrace digital transformation."
    },
    {
      title: "RaceReady Partners with FIA for Global Standards",
      slug: "raceready-fia-partnership",
      publishedAt: new Date('2024-09-10'),
      category: "Partnerships",
      excerpt: "Strategic partnership ensures compliance with international motorsport regulations."
    }
  ],
  mra: [
    {
      title: "MRA Championship 2024 Season Review - Record Breaking Year",
      slug: "mra-2024-season-review",
      publishedAt: new Date('2024-10-08'),
      category: "Championship",
      excerpt: "The 2024 season saw record entries across all categories with thrilling competition."
    },
    {
      title: "New 2025 Technical Regulations Announced",
      slug: "mra-2025-tech-regulations",
      publishedAt: new Date('2024-09-25'),
      category: "Technical",
      excerpt: "Updated regulations focus on sustainability and cost control for competitors."
    },
    {
      title: "MRA Expands to Three New Venues in 2025",
      slug: "mra-new-venues-2025",
      publishedAt: new Date('2024-09-15'),
      category: "News",
      excerpt: "Championship calendar grows with addition of Queensland Raceway, Sandown, and Winton."
    }
  ],
  supertt: [
    {
      title: "SuperTT Championship Finale: Battle for the Title at Mount Panorama",
      slug: "supertt-finale-bathurst-preview",
      publishedAt: new Date('2024-10-10'),
      category: "Racing",
      excerpt: "Just 10 points separate the top three drivers heading into the season finale."
    },
    {
      title: "SuperTT Announces Gen3 Touring Car Regulations for 2025",
      slug: "supertt-gen3-2025-announcement",
      publishedAt: new Date('2024-09-28'),
      category: "Technical",
      excerpt: "New generation regulations promise closer racing and reduced costs."
    },
    {
      title: "Record Grid of 38 Cars Confirmed for Season Finale",
      slug: "supertt-record-grid-finale",
      publishedAt: new Date('2024-09-18'),
      category: "Entry List",
      excerpt: "Biggest field in SuperTT history to tackle Mount Panorama."
    }
  ],
  clubman: [
    {
      title: "Clubman Championship Celebrates 25th Anniversary Season",
      slug: "clubman-25th-anniversary",
      publishedAt: new Date('2024-10-01'),
      category: "Milestone",
      excerpt: "Quarter century of grassroots motorsport excellence celebrated with special events."
    },
    {
      title: "2025 Calendar Announced - Eight Round Championship",
      slug: "clubman-2025-calendar-announcement",
      publishedAt: new Date('2024-09-22'),
      category: "Calendar",
      excerpt: "Expanded calendar visits all major NSW and ACT circuits."
    },
    {
      title: "New Junior Development Program Launched",
      slug: "clubman-junior-development-program",
      publishedAt: new Date('2024-09-12'),
      category: "Development",
      excerpt: "Initiative provides pathway for young drivers to enter circuit racing."
    }
  ],
  mx5cup: [
    {
      title: "MX5 Cup 2024 Champion Crowned at Phillip Island",
      slug: "mx5cup-2024-champion-crowned",
      publishedAt: new Date('2024-10-09'),
      category: "Championship",
      excerpt: "Thrilling season concludes with nail-biting finale at Phillip Island."
    },
    {
      title: "Record 45 Entries for 2025 Season Already Confirmed",
      slug: "mx5cup-record-2025-entries",
      publishedAt: new Date('2024-09-27'),
      category: "Entries",
      excerpt: "Unprecedented interest sees championship expand to two classes."
    },
    {
      title: "MX5 Cup Australia Joins International MX5 Series Network",
      slug: "mx5cup-international-network",
      publishedAt: new Date('2024-09-16'),
      category: "International",
      excerpt: "Partnership enables inter-series events and driver exchanges."
    }
  ],
  extremett: [
    {
      title: "ExtremeTT Time Attack Series Breaks Lap Records at SMP",
      slug: "extremett-lap-records-smp",
      publishedAt: new Date('2024-10-07'),
      category: "Records",
      excerpt: "Multiple track records fall as competition intensifies in final round."
    },
    {
      title: "2025 Season to Feature Night Racing at Sydney Motorsport Park",
      slug: "extremett-night-racing-2025",
      publishedAt: new Date('2024-09-26'),
      category: "Innovation",
      excerpt: "First-ever night time attack sessions added to 2025 calendar."
    },
    {
      title: "ExtremeTT Partners with GT World Challenge for Exhibition Event",
      slug: "extremett-gt-world-challenge-partnership",
      publishedAt: new Date('2024-09-14'),
      category: "Events",
      excerpt: "Special time attack exhibition to run alongside GT World Challenge Australia."
    }
  ],
  raceofficial: [
    {
      title: "Race Official Academy Launches Comprehensive Training Program",
      slug: "race-official-academy-launch",
      publishedAt: new Date('2024-10-06'),
      category: "Education",
      excerpt: "New program offers pathways from grassroots to international officiating."
    },
    {
      title: "200+ Officials Complete FIA Level 1 Certification",
      slug: "race-official-fia-certification-milestone",
      publishedAt: new Date('2024-09-24'),
      category: "Training",
      excerpt: "Record number of Australians achieve international officiating credentials."
    },
    {
      title: "Digital Race Control System Rolled Out Nationwide",
      slug: "race-official-digital-race-control",
      publishedAt: new Date('2024-09-13'),
      category: "Technology",
      excerpt: "State-of-the-art digital tools enhance safety and decision-making."
    }
  ],
  amrc: [
    {
      title: "AMRC Finals 2024: Championsship Showdown at Sydney Motorsport Park",
      slug: "amrc-finals-2024-preview",
      publishedAt: new Date('2024-10-04'),
      category: "Championship",
      excerpt: "Season finale promises thrilling conclusion to 2024 club championship."
    },
    {
      title: "AMRC Announces Partnership with Sydney Motorsport Park",
      slug: "amrc-smp-partnership",
      publishedAt: new Date('2024-09-23'),
      category: "Partnerships",
      excerpt: "Multi-year agreement secures preferred access and enhanced facilities."
    },
    {
      title: "Club Membership Reaches All-Time High of 850 Members",
      slug: "amrc-membership-record",
      publishedAt: new Date('2024-09-11'),
      category: "Club News",
      excerpt: "Growing community reflects increasing popularity of club motorsport."
    }
  ]
};

async function addNewsToSite(siteSlug, newsArticles) {
  console.log(`\n📰 Adding ${newsArticles.length} news articles for ${siteSlug}...`);
  
  try {
    // Get the site documentId (Strapi v5)
    const sitesResponse = await strapiApi.get(`/sites?filters[slug][$eq]=${siteSlug}`);
    const siteData = sitesResponse.data.data[0];
    
    if (!siteData) {
      console.log(`   ⚠️  Site ${siteSlug} not found, skipping news`);
      return;
    }
    
    const siteDocumentId = siteData.documentId;
    
    for (const article of newsArticles) {
      try {
        const newsData = {
          title: article.title,
          slug: article.slug,
          publishedAt: article.publishedAt.toISOString(),
          content: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  text: `${article.category}: ${article.excerpt}`
                }
              ]
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
        if (error.response?.status === 400) {
          const errorMsg = error.response?.data?.error?.message || '';
          if (errorMsg.includes('unique') || errorMsg.includes('already exists')) {
            console.log(`   ⏭️  ${article.title} (already exists)`);
          } else {
            console.log(`   ❌ ${article.title}: ${errorMsg}`);
          }
        } else {
          console.log(`   ❌ ${article.title}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.log(`   ❌ Error adding news: ${error.message}`);
  }
}

async function addSponsorsToSite(siteSlug, sponsors) {
  console.log(`\n🤝 Adding ${sponsors.length} sponsors for ${siteSlug}...`);
  
  try {
    // Get the site (Strapi v5 uses documentId)
    const sitesResponse = await strapiApi.get(`/sites?filters[slug][$eq]=${siteSlug}`);
    const siteData = sitesResponse.data.data[0];
    
    if (!siteData) {
      console.log(`   ⚠️  Site ${siteSlug} not found`);
      return;
    }
    
    // Prepare sponsors data
    const sponsorsData = sponsors.map(sponsor => ({
      name: sponsor.name,
      logo: sponsor.logo,
      url: sponsor.url
    }));
    
    // Update site with sponsors using documentId
    await strapiApi.put(`/sites/${siteData.documentId}`, {
      data: {
        sponsors: sponsorsData
      }
    });
    
    console.log(`   ✅ Added ${sponsors.length} sponsors successfully`);
  } catch (error) {
    console.log(`   ❌ Error adding sponsors: ${error.message}`);
    if (error.response?.data) {
      console.log(`      Details: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

async function main() {
  try {
    console.log('\n🔗 Connecting to Strapi...');
    await strapiApi.get('/sites');
    console.log('✅ Connected successfully!\n');
    
    // Sites to populate with enhanced data
    const sitesToEnhance = ['raceready', 'mra', 'supertt', 'clubman', 'mx5cup', 'extremett', 'raceofficial', 'amrc'];
    
    // Add news articles to each site
    for (const siteSlug of sitesToEnhance) {
      if (enhancedNews[siteSlug]) {
        await addNewsToSite(siteSlug, enhancedNews[siteSlug]);
      }
    }
    
    // Add more sponsors to each site
    console.log('\n\n🤝 ADDING SPONSORS TO SITES\n');
    for (const siteSlug of sitesToEnhance) {
      // Mix of common sponsors + RaceReady
      const siteSponsors = [
        {
          name: 'RaceReady',
          logo: 'https://cdn.syzmic.com.au/sites/raceready/logos/RaceReady-3.svg',
          url: 'https://raceready.com.au'
        },
        ...commonSponsors.slice(0, 5) // Add 5 common sponsors
      ];
      
      await addSponsorsToSite(siteSlug, siteSponsors);
    }
    
    console.log('\n\n🎉 Enhanced data population completed!\n');
    console.log('📊 Summary:');
    console.log(`   - Sites enhanced: ${sitesToEnhance.length}`);
    console.log(`   - News articles added: ${Object.values(enhancedNews).flat().length}`);
    console.log(`   - Sponsors per site: 6`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

main();

