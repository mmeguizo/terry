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

console.log('🔧 Fixing Clubman Site Issues...\n');

async function fixIssues() {
  try {
    // 1. Check what content types exist
    console.log('📋 Checking available content types...');
    try {
      const newsCheck = await strapiApi.get('/news-items');
      console.log('✅ news-items exists');
    } catch (e) {
      console.log('❌ news-items does NOT exist - checking alternatives...');
      
      // Try news-item (singular)
      try {
        const newsItemCheck = await strapiApi.get('/news-item');
        console.log('✅ Found: news-item (singular)');
      } catch (e2) {
        console.log('❌ news-item also not found');
        console.log('⚠️  You need to copy the news-item schema to your Strapi!');
        console.log('   From: terry/src/api/news-item/');
        console.log('   To: your-strapi/src/api/news-item/');
      }
    }
    
    // 2. Get site and check data
    console.log('\n📊 Checking Clubman site data...');
    const siteResponse = await strapiApi.get('/sites?filters[slug][$eq]=clubman&populate=*');
    const site = siteResponse.data.data[0];
    
    if (!site) {
      console.log('❌ Clubman site not found!');
      return;
    }
    
    console.log('✅ Site found:', site.siteTitle);
    console.log('   Logo:', site.logoImage);
    console.log('   Sponsors:', site.sponsors?.length || 0);
    console.log('   Menu items:', site.menu?.length || 0);
    console.log('   Hero sections:', site.hero?.length || 0);
    
    // 3. Check logo paths
    console.log('\n🖼️  Checking logo/image paths...');
    if (site.logoImage && !site.logoImage.startsWith('http')) {
      console.log('⚠️  Logo uses relative path:', site.logoImage);
      console.log('   Make sure file exists at: public' + site.logoImage);
    }
    
    if (site.sponsors && site.sponsors.length > 0) {
      const badLogos = site.sponsors.filter(s => 
        s.logo && !s.logo.startsWith('http') && !s.logo.startsWith('/')
      );
      if (badLogos.length > 0) {
        console.log('⚠️  Found', badLogos.length, 'sponsors with invalid logo paths');
      }
      
      // Check for local logo files
      const localLogos = site.sponsors.filter(s => s.logo && s.logo.startsWith('/Logo/'));
      console.log('   Local logos (need files in public/):', localLogos.length);
      localLogos.slice(0, 3).forEach(s => {
        console.log('     -', s.name, '→', s.logo);
      });
    }
    
    // 4. Recommendations
    console.log('\n💡 RECOMMENDATIONS:\n');
    
    console.log('1️⃣  MOBILE UI ISSUE:');
    console.log('   - Check browser width (should be > 768px for desktop)');
    console.log('   - Press F12 and check if device emulation is on');
    console.log('   - The mobile bottom nav appears on screens < 768px\n');
    
    console.log('2️⃣  MISSING NEWS:');
    console.log('   - News Item content type might not exist in your Strapi');
    console.log('   - Copy: terry/src/api/news-item/ → your-strapi/src/api/news-item/');
    console.log('   - Restart Strapi after copying');
    console.log('   - Then run: node populate-clubman-only.js again\n');
    
    console.log('3️⃣  FAILED SPONSOR IMAGES:');
    console.log('   - Logos use paths like: /Logo/Clubmans/Clubman Championship.svg');
    console.log('   - These files should be in: public/Logo/...');
    console.log('   - Check if public/Logo/ directory exists with logo files');
    console.log('   - OR update sponsors to use CDN URLs instead\n');
    
    console.log('4️⃣  QUICK FIX - Use CDN logos:');
    console.log('   - Run the update script to use working CDN URLs');
    console.log('   - This will fix the "Failed to load" issue immediately\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

fixIssues();


