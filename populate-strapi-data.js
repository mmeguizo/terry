const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

// Configuration from environment variables
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// API client
const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Site data from your spreadsheet
const sites = [
  {
    siteTitle: "RaceReady",
    slug: "raceready",
    domain: "raceready.com.au",
    primaryColor: "#000000",
    menuBackground: "#FFFFFF",
    textColor: "#000000",
    logoImage: "https://cdn.syzmic.com.au/sites/raceready/logos/RaceReady-3.svg",
    eventId: null
  },
  {
    siteTitle: "MRA - Motor Racing Australia",
    slug: "mra",
    domain: "motorace.com.au",
    primaryColor: "#CC0000",
    menuBackground: "#404040",
    textColor: "#CCCCCC",
    logoImage: "https://cdn.syzmic.com.au/sites/mra/logos/MRA-Logo.svg",
    eventId: null
  },
  {
    siteTitle: "SuperTT",
    slug: "supertt",
    domain: "supertt.com.au",
    primaryColor: "#EA9216",
    menuBackground: "#3A4750",
    textColor: "#313841",
    logoImage: "https://cdn.syzmic.com.au/sites/supertt/logos/SuperTT.png",
    eventId: "EEEEEE"
  },
  {
    siteTitle: "Clubman Championship",
    slug: "clubman",
    domain: "clubmanchampionship.com.au",
    primaryColor: "#30232D",
    menuBackground: "#D55053",
    textColor: "#F1C095",
    logoImage: "https://cdn.syzmic.com.au/sites/clubman/logos/Clubman-Championship.svg",
    eventId: "FAE907"
  },
  {
    siteTitle: "MX5 Cup",
    slug: "mx5cup",
    domain: "mx5cup.au",
    primaryColor: "#000000",
    menuBackground: "#FFFFFF",
    textColor: "#000000",
    logoImage: "https://cdn.syzmic.com.au/sites/mx5cup/logos/mx5cup-logo.svg",
    eventId: null
  },
  {
    siteTitle: "ExtremeTT",
    slug: "extremett",
    domain: "extremett.com.au",
    primaryColor: "#9DBDB8",
    menuBackground: "#F0E7D6",
    textColor: "#EA2E00",
    logoImage: "https://cdn.syzmic.com.au/sites/extremett/logos/extremett-logo.svg",
    eventId: "E6512C"
  },
  {
    siteTitle: "Sydney 300",
    slug: "sydney300",
    domain: "sydney300.com.au",
    primaryColor: "#000000",
    menuBackground: "#FFFFFF",
    textColor: "#000000",
    logoImage: "https://cdn.syzmic.com.au/sites/sydney300/logos/Sydney300-Logo.png",
    eventId: null
  },
  {
    siteTitle: "Wakefield 300",
    slug: "wakefield300",
    domain: "wakefield300.com.au",
    primaryColor: "#000000",
    menuBackground: "#FFFFFF",
    textColor: "#000000",
    logoImage: "https://cdn.syzmic.com.au/sites/wakefield300/logos/wakefield300-logo.svg",
    eventId: null
  },
  {
    siteTitle: "Classic Sports Cars",
    slug: "classicsportscars",
    domain: "classicsportscars.com.au",
    primaryColor: "#E66C32",
    menuBackground: "#0E3F18",
    textColor: "#385A42",
    logoImage: "https://cdn.syzmic.com.au/sites/classicsportscars/logos/csc-logo.svg",
    eventId: "EEEEEE"
  }
];

// News articles for each site (1 per site)
const newsArticles = {
  raceready: [
    {
      title: "RaceReady Platform Launches New Event Management Features",
      slug: "raceready-new-features-2024",
      date: "2024-09-25",
      image: "https://cdn.syzmic.com.au/sites/raceready/news/raceready-features.jpg",
      url: "/news/raceready-new-features-2024",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "RaceReady is excited to announce the launch of our enhanced event management platform, designed specifically for motorsport organizers across Australia. The new features include real-time entry management, automated timing integration, and comprehensive competitor communication tools."
            }
          ]
        }
      ]
    }
  ],
  mra: [
    {
      title: "MRA Championship Round 8 Results - Thrilling Finish at Sydney Motorsport Park",
      slug: "mra-round-8-results-smp",
      date: "2024-09-28",
      image: "https://cdn.syzmic.com.au/sites/mra/news/round8-results.jpg",
      url: "/news/mra-round-8-results-smp",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "The eighth round of the MRA Championship delivered spectacular racing at Sydney Motorsport Park, with close battles across all categories. The SuperTT category saw an incredible three-way battle for the lead, while the Clubman Championship provided non-stop action throughout the field."
            }
          ]
        }
      ]
    }
  ],
  supertt: [
    {
      title: "SuperTT Championship Heads to Bathurst for Epic Season Finale",
      slug: "supertt-bathurst-finale-2024",
      date: "2024-09-30",
      image: "https://cdn.syzmic.com.au/sites/supertt/news/bathurst-finale.jpg",
      url: "/news/supertt-bathurst-finale-2024",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "The 2024 SuperTT Championship will conclude with a spectacular finale at Mount Panorama, Bathurst, promising an unforgettable weekend of touring car racing. With only 15 points separating the top three drivers, this weekend's races will determine the 2024 champion."
            }
          ]
        }
      ]
    }
  ],
  clubman: [
    {
      title: "Clubman Championship Celebrates 25 Years of Grassroots Racing",
      slug: "clubman-25-years-celebration",
      date: "2024-09-28",
      image: "https://cdn.syzmic.com.au/sites/clubman/news/25-years.jpg",
      url: "/news/clubman-25-years-celebration",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "The Clubman Championship marks its 25th anniversary this year, celebrating a quarter-century of providing affordable, competitive motorsport for enthusiasts across Australia. From humble beginnings with just 12 competitors, the championship now regularly attracts over 40 entries per round."
            }
          ]
        }
      ]
    }
  ],
  mx5cup: [
    {
      title: "MX5 Cup 2024 Season Wrap-Up - Incredible Racing Throughout",
      slug: "mx5cup-2024-season-wrap",
      date: "2024-09-29",
      image: "https://cdn.syzmic.com.au/sites/mx5cup/news/season-wrap.jpg",
      url: "/news/mx5cup-2024-season-wrap",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "The 2024 MX5 Cup season has concluded with some of the closest racing ever seen in the category, with multiple race winners and championship battles going down to the wire."
            }
          ]
        }
      ]
    }
  ],
  extremett: [
    {
      title: "ExtremeTT Announces Expanded 2025 Calendar",
      slug: "extremett-2025-calendar-expansion",
      date: "2024-09-26",
      image: "https://cdn.syzmic.com.au/sites/extremett/news/2025-calendar.jpg",
      url: "/news/extremett-2025-calendar-expansion",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "ExtremeTT is thrilled to announce an expanded 2025 calendar, featuring six rounds across Australia's most challenging circuits."
            }
          ]
        }
      ]
    }
  ],
  sydney300: [
    {
      title: "Sydney 300 Announces Star-Studded Entry List for 2024",
      slug: "sydney300-entry-list-2024",
      date: "2024-09-24",
      image: "https://cdn.syzmic.com.au/sites/sydney300/news/entry-list.jpg",
      url: "/news/sydney300-entry-list-2024",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "The 2024 Sydney 300 has attracted an incredible entry list featuring current and former Supercars champions, international stars, and rising local talent."
            }
          ]
        }
      ]
    }
  ],
  wakefield300: [
    {
      title: "Wakefield 300 Returns with Enhanced Safety Features",
      slug: "wakefield300-safety-enhancements",
      date: "2024-09-21",
      image: "https://cdn.syzmic.com.au/sites/wakefield300/news/safety-features.jpg",
      url: "/news/wakefield300-safety-enhancements",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "The Wakefield 300 returns for 2024 with significant safety enhancements, ensuring the highest standards of competitor and spectator safety."
            }
          ]
        }
      ]
    }
  ],
  classicsportscars: [
    {
      title: "Classic Sports Cars Championship Celebrates Heritage Racing",
      slug: "csc-heritage-racing-celebration",
      date: "2024-09-27",
      image: "https://cdn.syzmic.com.au/sites/classicsportscars/news/heritage.jpg",
      url: "/news/csc-heritage-racing-celebration",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "The Classic Sports Cars Championship continues to celebrate Australia's rich motorsport heritage with incredible displays of vintage racing machinery."
            }
          ]
        }
      ]
    }
  ]
};

// Default menu items for all sites
const defaultMenuItems = [
  { label: "Home", url: "/" },
  { label: "Events", url: "/events" },
  { label: "Event Info", url: "/event-info" },
  { label: "News", url: "/#news" },
  { label: "Documents", url: "/#documents" }
];

// Default sponsors
const defaultSponsors = [
  {
    name: "RaceReady",
    logo: "https://cdn.syzmic.com.au/sites/raceready/logos/RaceReady-3.svg",
    url: "https://raceready.com.au"
  },
  {
    name: "Motorsport Australia",
    logo: "https://cdn.syzmic.com.au/common/sponsors/motorsport-australia.png",
    url: "https://motorsport.org.au"
  }
];

// Hero configurations per site
const heroConfigs = {
  raceready: {
    background: "https://cdn.syzmic.com.au/sites/raceready/hero/raceready-hero.jpg",
    eventDate: "2024-12-15",
    eventInfo: "Platform Launch Event",
    eventName: "RACEREADY SUMMIT",
    eventLocation: "SYDNEY MOTORSPORT PARK"
  },
  mra: {
    background: "https://cdn.syzmic.com.au/sites/mra/hero/mra-hero.jpg",
    eventDate: "2024-11-16",
    eventInfo: "Championship Round 8",
    eventName: "MRA FINALE",
    eventLocation: "BATHURST MOTOR RACING CIRCUIT"
  },
  supertt: {
    background: "https://cdn.syzmic.com.au/sites/supertt/hero/supertt-hero.jpg",
    eventDate: "2024-11-10",
    eventInfo: "Championship Finale",
    eventName: "SUPERTT SHOWDOWN",
    eventLocation: "MOUNT PANORAMA"
  },
  clubman: {
    background: "https://cdn.syzmic.com.au/sites/clubman/hero/clubman-hero.jpg",
    eventDate: "2024-11-03",
    eventInfo: "25th Anniversary Round",
    eventName: "CLUBMAN CELEBRATION",
    eventLocation: "WAKEFIELD PARK"
  },
  mx5cup: {
    background: "https://cdn.syzmic.com.au/sites/mx5cup/hero/mx5cup-hero.jpg",
    eventDate: "2024-10-27",
    eventInfo: "Season Finale",
    eventName: "MX5 CUP FINALE",
    eventLocation: "PHILLIP ISLAND"
  }
};

// Function to get existing sites
async function getExistingSites() {
  try {
    const response = await strapiApi.get('/sites');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching existing sites:', error.response?.data || error.message);
    return [];
  }
}

// Function to create sites
async function createSites() {
  console.log('🏁 Creating sites...');
  
  // First, get existing sites
  const existingSites = await getExistingSites();
  console.log(`📋 Found ${existingSites.length} existing sites`);
  
  const createdSites = [...existingSites]; // Include existing sites
  
  for (const site of sites) {
    try {
      const heroConfig = heroConfigs[site.slug] || heroConfigs.raceready;
      
      const siteData = {
        data: {
          siteTitle: site.siteTitle,
          slug: site.slug,
          domain: site.domain,
          primaryColor: site.primaryColor,
          menuBackground: site.menuBackground,
          textColor: site.textColor,
          logoImage: site.logoImage,
          eventId: site.eventId,
          publishedAt: new Date().toISOString(),
          menu: defaultMenuItems,
          hero: [heroConfig],
          sponsors: defaultSponsors,
          websites: sites.filter(s => s.slug !== site.slug).slice(0, 5).map(s => ({
            label: s.siteTitle,
            url: `https://${s.domain}`,
            logo: s.logoImage
          })),
          eventDocuments: [
            {
              label: "Event Schedule",
              url: `https://cdn.syzmic.com.au/sites/${site.slug}/documents/schedule.pdf`
            },
            {
              label: "Supplementary Regulations",
              url: `https://cdn.syzmic.com.au/sites/${site.slug}/documents/regulations.pdf`
            }
          ],
          socials: [
            {
              platform: "Facebook",
              url: `https://facebook.com/${site.slug}`
            },
            {
              platform: "Instagram", 
              url: `https://instagram.com/${site.slug}`
            }
          ],
          footer: [{
            backgroundColor: site.primaryColor,
            textColor: site.textColor
          }]
        }
      };
      
      const response = await strapiApi.post('/sites', siteData);
      createdSites.push(response.data.data);
      console.log(`✅ Created site: ${site.siteTitle}`);
      
    } catch (error) {
      if (error.response?.data?.error?.message?.includes('unique')) {
        console.log(`⚠️  Site ${site.siteTitle} already exists, skipping...`);
        // Try to find the existing site
        const existingSite = existingSites.find(s => s.attributes?.slug === site.slug);
        if (existingSite && !createdSites.find(cs => cs.id === existingSite.id)) {
          createdSites.push(existingSite);
        }
      } else {
        console.error(`❌ Error creating site ${site.siteTitle}:`, error.response?.data || error.message);
        // Log detailed validation errors
        if (error.response?.data?.error?.details?.errors) {
          console.error('   Validation details:', error.response.data.error.details.errors);
        }
      }
    }
  }
  
  return createdSites;
}

// Function to create news items
async function createNewsItems(createdSites) {
  console.log('📰 Creating news items...');
  
  for (const site of createdSites) {
    const siteSlug = site.attributes?.slug;
    if (!siteSlug) continue;
    
    const articles = newsArticles[siteSlug] || [];
    
    for (const article of articles) {
      try {
        const newsData = {
          data: {
            title: article.title,
            slug: article.slug,
            date: article.date,
            image: article.image,
            url: article.url,
            content: article.content,
            sites: [site.id],
            publishedAt: new Date().toISOString()
          }
        };
        
        await strapiApi.post('/news-items', newsData);
        console.log(`✅ Created news: ${article.title} (for ${siteSlug})`);
        
      } catch (error) {
        if (error.response?.data?.error?.message?.includes('unique')) {
          console.log(`⚠️  News "${article.title}" already exists, skipping...`);
        } else {
          console.error(`❌ Error creating news ${article.title}:`, error.response?.data || error.message);
        }
      }
    }
  }
}

// Main execution function
async function populateStrapi() {
  try {
    console.log('🚀 Starting Strapi data population...');
    console.log(`📡 Connecting to: ${STRAPI_URL}`);
    
    // Check if API token is provided
    if (!STRAPI_API_TOKEN) {
      console.error('❌ STRAPI_API_TOKEN not found in .env.local file!');
      console.log('💡 Make sure your .env.local file contains:');
      console.log('   STRAPI_URL=http://localhost:1337');
      console.log('   STRAPI_API_TOKEN=your-actual-token-here');
      return;
    }
    
    console.log(`🔑 Using API token: ${STRAPI_API_TOKEN.substring(0, 10)}...`);
    
    // Test connection
    await strapiApi.get('/sites');
    console.log('✅ Connected to Strapi successfully!');
    
    // Create sites
    const createdSites = await createSites();
    
    // Create news items
    await createNewsItems(createdSites);
    
    console.log('🎉 Strapi population completed successfully!');
    console.log(`📊 Created ${createdSites.length} sites and ${Object.values(newsArticles).flat().length} news articles`);
    
  } catch (error) {
    console.error('💥 Error populating Strapi:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('🔑 Make sure to set your STRAPI_API_TOKEN in the script!');
    }
  }
}

// Run the population
populateStrapi();
