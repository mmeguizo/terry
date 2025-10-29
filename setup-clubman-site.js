const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🏁 Setting up Clubman Championship Site in Strapi...');
console.log('   STRAPI_URL:', STRAPI_URL);

// API client
const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Clubman Championship site configuration
const clubmanSiteData = {
  slug: 'clubman',
  siteTitle: 'Clubman Championship',
  domain: 'clubmanchampionship.com.au',  // Required unique field
  primaryColor: '#FF6B00',
  menuBackground: '#FFFFFF',
  textColor: '#000000',
  logoImage: '/Logo/Clubmans/Clubman Championship.svg',
  
  hero: [
    {
      background: 'https://images.pexels.com/photos/12789668/pexels-photo-12789668.jpeg',
      eventName: 'Clubman Championship 2025',
      eventLocation: 'Sydney Motorsport Park',
      eventDate: '2025-11-15',
      eventInfo: '/event-info'
    }
  ],
  
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
  
  websites: [
    {
      url: 'https://raceready.com.au',
      logo: '/Logo/RaceReady/RaceReady 3.svg',
      label: 'RaceReady'
    },
    {
      url: 'https://motorrace.com.au',
      logo: '/Logo/MRA/MRA-Logo.svg',
      label: 'Motor Racing Australia'
    }
  ],
  
  footer: [
    {
      backgroundColor: '#1a1a1a',
      textColor: '#FFFFFF'
    }
  ],
  
  socials: [
    { platform: 'Facebook', url: 'https://facebook.com/clubmanchampionship' },
    { platform: 'Instagram', url: 'https://instagram.com/clubmanchampionship' },
    { platform: 'Twitter', url: 'https://twitter.com/clubmanchamp' }
  ]
};

async function setupClubmanSite() {
  try {
    console.log('\n🔗 Connecting to Strapi...');
    
    // Test connection
    await strapiApi.get('/sites');
    console.log('✅ Connected successfully!\n');
    
    // Check if site already exists
    console.log('🔍 Checking if Clubman site already exists...');
    const existingResponse = await strapiApi.get(`/sites`);
    
    // Check if any site has slug 'clubman'
    const existingSite = existingResponse.data.data.find(site => site.slug === 'clubman');
    
    if (existingSite) {
      console.log('⚠️  Clubman site already exists!');
      console.log('   Site ID:', existingSite.documentId || existingSite.id);
      console.log('   Title:', existingSite.siteTitle);
      console.log('\n💡 If you want to update it, use the populate script.');
      console.log('   Or delete it from Strapi and run this script again.\n');
      return;
    }
    
    console.log('✅ Site does not exist, creating new entry...\n');
    
    // Create the site
    console.log('🏗️  Creating Clubman Championship site...');
    const response = await strapiApi.post('/sites', {
      data: clubmanSiteData
    });
    
    console.log('\n✨ SUCCESS! Clubman Championship site created!\n');
    console.log('📋 Site Details:');
    console.log('   Document ID:', response.data.data.documentId);
    console.log('   Slug:', response.data.data.slug);
    console.log('   Title:', response.data.data.siteTitle);
    console.log('   Primary Color:', response.data.data.primaryColor);
    console.log('   Logo:', response.data.data.logoImage);
    console.log('\n🎯 Next Steps:');
    console.log('   1. Run: node populate-clubman-only.js');
    console.log('   2. This will add sponsors, news, and documents');
    console.log('   3. Set SITE_SLUG=clubman in your .env.local');
    console.log('   4. Start your Next.js app to see the site!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure Strapi is running on', STRAPI_URL);
    }
    if (!STRAPI_API_TOKEN) {
      console.error('\n💡 Make sure STRAPI_API_TOKEN is set in .env.local');
    }
  }
}

setupClubmanSite();

