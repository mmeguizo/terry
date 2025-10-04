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

async function fixMRASite() {
  try {
    console.log('🔧 Fixing MRA site content...');
    
    const updateData = {
      data: {
        siteTitle: 'MRA - Motor Racing Australia',
        slug: 'mra',
        domain: 'motorace.com.au',
        primaryColor: '#CC0000',
        menuBackground: '#404040',
        textColor: '#CCCCCC',
        logoImage: 'https://cdn.syzmic.com.au/sites/mra/logos/MRA-Logo.svg',
        eventInfo: 'Championship Round 8',
        eventId: null,
        publishedAt: new Date().toISOString(),
        
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
          },
          {
            name: 'Bathurst Motor Racing Circuit',
            logo: 'https://cdn.syzmic.com.au/common/sponsors/bathurst-logo.png',
            url: 'https://mountpanorama.com.au'
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
          },
          {
            label: 'MX5 Cup',
            url: 'https://mx5cup.au',
            logo: 'https://cdn.syzmic.com.au/sites/mx5cup/logos/mx5cup-logo.svg'
          },
          {
            label: 'RaceReady',
            url: 'https://raceready.com.au',
            logo: 'https://cdn.syzmic.com.au/sites/raceready/logos/RaceReady-3.svg'
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
          },
          {
            label: 'Entry List',
            url: 'https://cdn.syzmic.com.au/sites/mra/documents/entry-list.pdf'
          }
        ],
        
        socials: [
          {
            platform: 'Facebook',
            url: 'https://facebook.com/motorracingaustralia'
          },
          {
            platform: 'Instagram',
            url: 'https://instagram.com/motorracingaustralia'
          },
          {
            platform: 'YouTube',
            url: 'https://youtube.com/motorracingaustralia'
          }
        ],
        
        footer: [{
          backgroundColor: '#CC0000',
          textColor: '#FFFFFF'
        }],
        
        heroButton: [
          {
            label: 'Event Info',
            url: '/event-info'
          },
          {
            label: 'Enter Now',
            url: '/events'
          }
        ]
      }
    };
    
    // Update site using documentId (MRA)
    const response = await strapiApi.put('/sites/rfr4r70bv8a5hy4774uzmlkq', updateData);
    
    console.log('✅ MRA site updated successfully!');
    console.log('📊 Updated site ID:', response.data.data.id);
    console.log('🎨 Primary color:', response.data.data.attributes.primaryColor);
    console.log('🏆 Event name:', response.data.data.attributes.hero?.[0]?.eventName);
    
  } catch (error) {
    console.error('💥 Error updating MRA site:', error.response?.data || error.message);
  }
}

fixMRASite();
