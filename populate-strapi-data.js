const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

// Configuration from environment variables
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🔧 Configuration:');
console.log('   STRAPI_URL:', STRAPI_URL);
console.log('   STRAPI_API_TOKEN:', STRAPI_API_TOKEN ? `${STRAPI_API_TOKEN.substring(0, 20)}...` : 'NOT SET');

// API client
const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Complete site data from your spreadsheet
const sites = [
  {
    siteTitle: "RaceReady",
    slug: "raceready",
    domain: "raceready.com.au",
    primaryColor: "#000000",
    menuBackground: "#FFFFFF",
    textColor: "#000000",
    logoImage: "https://cdn.syzmic.com.au/sites/raceready/logos/RaceReady-3.svg",
    eventId: null,
    port: 3001
  },
  {
    siteTitle: "MRA - Motor Racing Australia",
    slug: "mra",
    domain: "motorrace.com.au",
    primaryColor: "#CC0000",
    menuBackground: "#404040",
    textColor: "#CCCCCC",
    logoImage: "https://cdn.syzmic.com.au/sites/mra/logos/MRA-Logo.svg",
    eventId: null,
    port: 3002
  },
  {
    siteTitle: "SuperTT",
    slug: "supertt",
    domain: "supertt.com.au",
    primaryColor: "#EA9216",
    menuBackground: "#3A4750",
    textColor: "#ffffff",
    logoImage: "https://cdn.syzmic.com.au/sites/supertt/logos/SuperTT.png",
    eventId: "EEEEEE",
    port: 3003
  },
  {
    siteTitle: "Clubman Championship",
    slug: "clubman",
    domain: "clubmanchampionship.com",
    primaryColor: "#30232D",
    menuBackground: "#D55053",
    textColor: "#F1C095",
    logoImage: "https://cdn.syzmic.com.au/sites/clubman/logos/Clubman-Championship.svg",
    eventId: "FAE907",
    port: 3004
  },
  {
    siteTitle: "MX5 Cup",
    slug: "mx5cup",
    domain: "mx5cup.au",
    primaryColor: "#000000",
    menuBackground: "#FFFFFF",
    textColor: "#000000",
    logoImage: "https://cdn.syzmic.com.au/sites/mx5cup/logos/mx5cup-logo.svg",
    eventId: null,
    port: 3005
  },
  {
    siteTitle: "ExtremeTT",
    slug: "extremett",
    domain: "extremett.com.au",
    primaryColor: "#9DBDB8",
    menuBackground: "#F0E7D6",
    textColor: "#EA2E00",
    logoImage: "https://cdn.syzmic.com.au/sites/extremett/logos/extremett-logo.svg",
    eventId: "E6512C",
    port: 3006
  },
  {
    siteTitle: "Race Official",
    slug: "raceofficial",
    domain: "raceofficial.com.au",
    primaryColor: "#000000",
    menuBackground: "#FFFFFF",
    textColor: "#000000",
    logoImage: "https://cdn.syzmic.com.au/sites/raceofficial/logos/raceofficial-logo.svg",
    eventId: null,
    port: 3007
  },
  {
    siteTitle: "Sydney 300",
    slug: "sydney300",
    domain: "sydney300.com.au",
    primaryColor: "#000000",
    menuBackground: "#FFFFFF",
    textColor: "#000000",
    logoImage: "https://cdn.syzmic.com.au/sites/sydney300/logos/Sydney300-Logo.png",
    eventId: null,
    port: 3008
  },
  {
    siteTitle: "Wakefield 300",
    slug: "wakefield300",
    domain: "wakefield300.com.au",
    primaryColor: "#000000",
    menuBackground: "#FFFFFF",
    textColor: "#000000",
    logoImage: "https://cdn.syzmic.com.au/sites/wakefield300/logos/wakefield300-logo.svg",
    eventId: null,
    port: 3009
  },
  {
    siteTitle: "Classic Sports Cars",
    slug: "classicsportscars",
    domain: "classicsportscars.com.au",
    primaryColor: "#E66C32",
    menuBackground: "#0E3F18",
    textColor: "#385A42",
    logoImage: "https://cdn.syzmic.com.au/sites/classicsportscars/logos/csc-logo.svg",
    eventId: "EEEEEE",
    port: 3010
  },
  {
    siteTitle: "Australian Motor Racing Club",
    slug: "amrc",
    domain: "amrc.com.au",
    primaryColor: "#E63946",
    menuBackground: "#F1FAEE",
    textColor: "#1a1a1a",
    logoImage: "https://cdn.syzmic.com.au/sites/amrc/logos/amrc-logo.svg",
    eventId: "457B9D",
    port: 3011
  },
  {
    siteTitle: "APRA Bathurst Challenge",
    slug: "aprabathurst",
    domain: "aprabathurstchallenge.com",
    primaryColor: "#000000",
    menuBackground: "#FFFFFF",
    textColor: "#000000",
    logoImage: "https://cdn.syzmic.com.au/sites/aprabathurst/logos/apra-logo.svg",
    eventId: null,
    port: 3012
  },
  {
    siteTitle: "IPRA Bathurst Challenge",
    slug: "iprabathurst",
    domain: "iprabathurstchallenge.com",
    primaryColor: "#000000",
    menuBackground: "#FFFFFF",
    textColor: "#000000",
    logoImage: "https://cdn.syzmic.com.au/sites/iprabathurst/logos/ipra-logo.svg",
    eventId: null,
    port: 3013
  },
  {
    siteTitle: "TC2 Racing",
    slug: "tc2",
    domain: "tc2.au",
    primaryColor: "#000000",
    menuBackground: "#FFFFFF",
    textColor: "#000000",
    logoImage: "https://cdn.syzmic.com.au/sites/tc2/logos/tc2-logo.svg",
    eventId: null,
    port: 3014
  },
  {
    siteTitle: "MX5 Nationals",
    slug: "mx5nationals",
    domain: "mx5nationals.com.au",
    primaryColor: "#000000",
    menuBackground: "#FFFFFF",
    textColor: "#000000",
    logoImage: "https://cdn.syzmic.com.au/sites/mx5nationals/logos/mx5nationals-logo.svg",
    eventId: null,
    port: 3015
  }
];

// News articles for each site (expanded with all sites)
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
              text: "The 2024 MX5 Cup season has concluded with some of the closest racing ever seen in the category, with multiple race winners and championship battles going down to the wire. The spec nature of the series continues to produce incredible on-track action."
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
              text: "ExtremeTT is thrilled to announce an expanded 2025 calendar, featuring six rounds across Australia's most challenging circuits. The series will visit both classic venues and exciting new locations for intense time attack competition."
            }
          ]
        }
      ]
    }
  ],
  raceofficial: [
    {
      title: "Race Official Training Program Launches for 2025 Season",
      slug: "raceofficial-training-2025",
      date: "2024-09-23",
      image: "https://cdn.syzmic.com.au/sites/raceofficial/news/training-program.jpg",
      url: "/news/raceofficial-training-2025",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "Race Official is proud to announce the launch of our comprehensive training program for aspiring motorsport officials. The program covers all aspects of race control, flag marshaling, and safety procedures."
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
              text: "The 2024 Sydney 300 has attracted an incredible entry list featuring current and former Supercars champions, international stars, and rising local talent for this prestigious endurance race."
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
              text: "The Wakefield 300 returns for 2024 with significant safety enhancements, ensuring the highest standards of competitor and spectator safety at this classic endurance event."
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
              text: "The Classic Sports Cars Championship continues to celebrate Australia's rich motorsport heritage with incredible displays of vintage racing machinery from the 1950s through to the 1990s."
            }
          ]
        }
      ]
    }
  ],
  amrc: [
    {
      title: "AMRC Announces 2025 Championship Calendar",
      slug: "amrc-2025-calendar-announced",
      date: "2024-09-22",
      image: "https://cdn.syzmic.com.au/sites/amrc/news/2025-calendar.jpg",
      url: "/news/amrc-2025-calendar-announced",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "The Australian Motor Racing Club is excited to reveal its 2025 championship calendar, featuring rounds at premier venues across NSW including Sydney Motorsport Park, Wakefield Park, and Pheasant Wood Circuit."
            }
          ]
        }
      ]
    }
  ],
  aprabathurst: [
    {
      title: "APRA Bathurst Challenge Returns to Mount Panorama",
      slug: "apra-bathurst-2024-announcement",
      date: "2024-09-20",
      image: "https://cdn.syzmic.com.au/sites/aprabathurst/news/bathurst-return.jpg",
      url: "/news/apra-bathurst-2024-announcement",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "The APRA Bathurst Challenge returns to the iconic Mount Panorama circuit, bringing Production Car racing back to the mountain for an unforgettable weekend of motorsport action."
            }
          ]
        }
      ]
    }
  ],
  iprabathurst: [
    {
      title: "IPRA Bathurst Challenge Celebrates Improved Production Cars",
      slug: "ipra-bathurst-2024-preview",
      date: "2024-09-19",
      image: "https://cdn.syzmic.com.au/sites/iprabathurst/news/ipra-preview.jpg",
      url: "/news/ipra-bathurst-2024-preview",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "The IPRA Bathurst Challenge showcases Improved Production racing at Australia's most famous circuit, with modified production cars tackling the legendary mountain in spectacular fashion."
            }
          ]
        }
      ]
    }
  ],
  tc2: [
    {
      title: "TC2 Racing Series Gains Momentum in Second Season",
      slug: "tc2-season-2-update",
      date: "2024-09-18",
      image: "https://cdn.syzmic.com.au/sites/tc2/news/season-update.jpg",
      url: "/news/tc2-season-2-update",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "TC2 Racing continues to grow with an exciting second season of affordable touring car racing. The series has attracted strong grids and competitive action across all rounds."
            }
          ]
        }
      ]
    }
  ],
  mx5nationals: [
    {
      title: "MX5 Nationals Brings National-Level Competition to MX5 Racers",
      slug: "mx5nationals-championship-overview",
      date: "2024-09-17",
      image: "https://cdn.syzmic.com.au/sites/mx5nationals/news/nationals-overview.jpg",
      url: "/news/mx5nationals-championship-overview",
      content: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "The MX5 Nationals championship provides a national platform for MX5 racers to compete at the highest level, with rounds at major circuits across Australia and excellent support from Mazda Australia."
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
  },
  extremett: {
    background: "https://cdn.syzmic.com.au/sites/extremett/hero/extremett-hero.jpg",
    eventDate: "2024-10-20",
    eventInfo: "Time Attack Championship",
    eventName: "EXTREMETT CHALLENGE",
    eventLocation: "SYDNEY MOTORSPORT PARK"
  },
  raceofficial: {
    background: "https://cdn.syzmic.com.au/sites/raceofficial/hero/raceofficial-hero.jpg",
    eventDate: "2025-02-01",
    eventInfo: "Training Program Launch",
    eventName: "OFFICIALS ACADEMY",
    eventLocation: "ONLINE & TRACKSIDE"
  },
  sydney300: {
    background: "https://cdn.syzmic.com.au/sites/sydney300/hero/sydney300-hero.jpg",
    eventDate: "2024-11-30",
    eventInfo: "Endurance Classic",
    eventName: "SYDNEY 300",
    eventLocation: "SYDNEY MOTORSPORT PARK"
  },
  wakefield300: {
    background: "https://cdn.syzmic.com.au/sites/wakefield300/hero/wakefield300-hero.jpg",
    eventDate: "2024-10-19",
    eventInfo: "Endurance Classic",
    eventName: "WAKEFIELD 300",
    eventLocation: "WAKEFIELD PARK"
  },
  classicsportscars: {
    background: "https://cdn.syzmic.com.au/sites/classicsportscars/hero/csc-hero.jpg",
    eventDate: "2024-11-24",
    eventInfo: "Heritage Racing",
    eventName: "CLASSIC CHAMPIONSHIP",
    eventLocation: "EASTERN CREEK"
  },
  amrc: {
    background: "https://cdn.syzmic.com.au/sites/amrc/hero/amrc-hero.jpg",
    eventDate: "2024-12-08",
    eventInfo: "Club Championship",
    eventName: "AMRC FINALS",
    eventLocation: "SYDNEY MOTORSPORT PARK"
  },
  aprabathurst: {
    background: "https://cdn.syzmic.com.au/sites/aprabathurst/hero/apra-hero.jpg",
    eventDate: "2024-11-23",
    eventInfo: "Production Car Challenge",
    eventName: "APRA BATHURST",
    eventLocation: "MOUNT PANORAMA"
  },
  iprabathurst: {
    background: "https://cdn.syzmic.com.au/sites/iprabathurst/hero/ipra-hero.jpg",
    eventDate: "2024-11-24",
    eventInfo: "Improved Production Challenge",
    eventName: "IPRA BATHURST",
    eventLocation: "MOUNT PANORAMA"
  },
  tc2: {
    background: "https://cdn.syzmic.com.au/sites/tc2/hero/tc2-hero.jpg",
    eventDate: "2024-12-01",
    eventInfo: "Touring Car Championship",
    eventName: "TC2 SEASON FINALE",
    eventLocation: "WAKEFIELD PARK"
  },
  mx5nationals: {
    background: "https://cdn.syzmic.com.au/sites/mx5nationals/hero/mx5nationals-hero.jpg",
    eventDate: "2024-12-15",
    eventInfo: "National Championship",
    eventName: "MX5 NATIONALS FINALE",
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
      // Check if site already exists
      const existingSite = existingSites.find(s => s.attributes?.slug === site.slug);
      if (existingSite) {
        console.log(`⚠️  Site ${site.siteTitle} already exists, skipping...`);
        continue;
      }

      const heroConfig = heroConfigs[site.slug] || {
        background: "https://cdn.syzmic.com.au/sites/default/hero/default-hero.jpg",
        eventDate: "2024-12-31",
        eventInfo: "Coming Soon",
        eventName: site.siteTitle.toUpperCase(),
        eventLocation: "TBA"
      };
      
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
          menu: defaultMenuItems,
          hero: [heroConfig],
          sponsors: defaultSponsors,
          websites: sites
            .filter(s => s.slug !== site.slug)
            .slice(0, 6)
            .map(s => ({
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
      console.error(`❌ Error creating site ${site.siteTitle}:`, error.response?.data?.error || error.message);
      // Log detailed validation errors
      if (error.response?.data?.error?.details?.errors) {
        console.error('   Validation details:', JSON.stringify(error.response.data.error.details.errors, null, 2));
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
            sites: [site.id]
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
    console.log(`📊 Summary:`);
    console.log(`   - Total sites: ${sites.length}`);
    console.log(`   - Sites created: ${createdSites.length}`);
    console.log(`   - News articles: ${Object.values(newsArticles).flat().length}`);
    
    console.log('\n🏁 All motorsport sites populated:');
    sites.forEach(site => {
      console.log(`   ✓ ${site.siteTitle} (${site.slug}) - ${site.domain}`);
    });
    
  } catch (error) {
    console.error('💥 Error populating Strapi:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('🔑 Authentication failed! Check your STRAPI_API_TOKEN.');
    }
  }
}

// Run the population
populateStrapi();
