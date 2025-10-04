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

// Site updates with proper content
const siteUpdates = {
  'mra': {
    siteTitle: 'MRA - Motor Racing Australia',
    primaryColor: '#CC0000',
    menuBackground: '#404040', 
    textColor: '#CCCCCC',
    logoImage: 'https://cdn.syzmic.com.au/sites/mra/logos/MRA-Logo.svg',
    menu: [
      { label: 'Home', url: '/' },
      { label: 'Events', url: '/events' },
      { label: 'Event Info', url: '/event-info' },
      { label: 'News', url: '/#news' },
      { label: 'Documents', url: '/#documents' }
    ],
    hero: [{
      background: 'https://cdn.syzmic.com.au/sites/mra/hero/mra-hero.jpg',
      eventDate: '2024-11-16',
      eventInfo: 'Championship Round 8',
      eventName: 'MRA FINALE',
      eventLocation: 'BATHURST MOTOR RACING CIRCUIT'
    }],
    sponsors: [
      {
        name: 'MRA',
        logo: 'https://cdn.syzmic.com.au/sites/mra/logos/MRA-Logo.svg',
        url: 'https://motorace.com.au'
      },
      {
        name: 'Sydney Motorsport Park',
        logo: 'https://cdn.syzmic.com.au/common/sponsors/smp-logo.png',
        url: 'https://sydneymotorsportpark.com.au'
      }
    ],
    websites: [
      {
        label: 'SuperTT',
        url: 'https://supertt.com.au',
        logo: 'https://cdn.syzmic.com.au/sites/supertt/logos/SuperTT.png'
      },
      {
        label: 'Clubman Championship',
        url: 'https://clubmanchampionship.com.au',
        logo: 'https://cdn.syzmic.com.au/sites/clubman/logos/Clubman-Championship.svg'
      }
    ],
    eventDocuments: [
      {
        label: 'Event Schedule',
        url: 'https://cdn.syzmic.com.au/sites/mra/documents/schedule.pdf'
      },
      {
        label: 'Supplementary Regulations',
        url: 'https://cdn.syzmic.com.au/sites/mra/documents/regulations.pdf'
      }
    ]
  },
  'supertt': {
    siteTitle: 'SuperTT',
    primaryColor: '#EA9216',
    menuBackground: '#3A4750',
    textColor: '#313841',
    logoImage: 'https://cdn.syzmic.com.au/sites/supertt/logos/SuperTT.png',
    eventId: 'EEEEEE',
    menu: [
      { label: 'Home', url: '/' },
      { label: 'Events', url: '/events' },
      { label: 'Event Info', url: '/event-info' },
      { label: 'News', url: '/#news' },
      { label: 'Documents', url: '/#documents' }
    ],
    hero: [{
      background: 'https://cdn.syzmic.com.au/sites/supertt/hero/supertt-hero.jpg',
      eventDate: '2024-11-10',
      eventInfo: 'Championship Finale',
      eventName: 'SUPERTT SHOWDOWN',
      eventLocation: 'MOUNT PANORAMA'
    }],
    sponsors: [
      {
        name: 'SuperTT',
        logo: 'https://cdn.syzmic.com.au/sites/supertt/logos/SuperTT.png',
        url: 'https://supertt.com.au'
      }
    ]
  },
  'clubman': {
    siteTitle: 'Clubman Championship',
    primaryColor: '#30232D',
    menuBackground: '#D55053',
    textColor: '#F1C095',
    logoImage: 'https://cdn.syzmic.com.au/sites/clubman/logos/Clubman-Championship.svg',
    eventId: 'FAE907',
    menu: [
      { label: 'Home', url: '/' },
      { label: 'Events', url: '/events' },
      { label: 'Event Info', url: '/event-info' },
      { label: 'News', url: '/#news' },
      { label: 'Documents', url: '/#documents' }
    ],
    hero: [{
      background: 'https://cdn.syzmic.com.au/sites/clubman/hero/clubman-hero.jpg',
      eventDate: '2024-11-03',
      eventInfo: '25th Anniversary Round',
      eventName: 'CLUBMAN CELEBRATION',
      eventLocation: 'WAKEFIELD PARK'
    }],
    sponsors: [
      {
        name: 'Clubman Championship',
        logo: 'https://cdn.syzmic.com.au/sites/clubman/logos/Clubman-Championship.svg',
        url: 'https://clubmanchampionship.com.au'
      }
    ]
  }
};

async function updateExistingSites() {
  try {
    console.log('🔄 Updating existing sites with proper content...');
    
    // Get all existing sites
    const response = await strapiApi.get('/sites');
    const existingSites = response.data.data || [];
    
    console.log(`📋 Found ${existingSites.length} existing sites`);
    
    for (const site of existingSites) {
      const slug = site.attributes?.slug;
      if (!slug || !siteUpdates[slug]) {
        console.log(`⏭️  Skipping site: ${slug || 'unknown'} (no update data)`);
        continue;
      }
      
      const updateData = siteUpdates[slug];
      
      try {
        console.log(`🔄 Updating site: ${updateData.siteTitle}`);
        
        await strapiApi.put(`/sites/${site.id}`, {
          data: {
            ...updateData,
            publishedAt: new Date().toISOString()
          }
        });
        
        console.log(`✅ Updated: ${updateData.siteTitle}`);
        
      } catch (error) {
        console.error(`❌ Error updating ${updateData.siteTitle}:`, error.response?.data || error.message);
      }
    }
    
    console.log('🎉 Site updates completed!');
    
  } catch (error) {
    console.error('💥 Error updating sites:', error.response?.data || error.message);
  }
}

// Run the update
updateExistingSites();
