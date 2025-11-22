/**
 * Script to add placeholder images to news articles in Strapi
 * Uses motorsport-themed stock photos from Pexels/Unsplash
 *
 * Usage: node scripts/add-news-placeholder-images.js
 */

require('dotenv').config({ path: '.env.local' });

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Motorsport-themed placeholder images from Pexels (free to use)
const motorsportImages = [
  'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg', // Red race car
  'https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg', // F1 car
  'https://images.pexels.com/photos/544290/pexels-photo-544290.jpeg', // Blue race car
  'https://images.pexels.com/photos/192334/pexels-photo-192334.jpeg', // Racing pit
  'https://images.pexels.com/photos/274399/pexels-photo-274399.jpeg', // GT car
  'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg', // Black race car
  'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg', // Track
  'https://images.pexels.com/photos/137577/pexels-photo-137577.jpeg', // White GT car
];

if (!STRAPI_URL || !STRAPI_API_TOKEN) {
  console.error('❌ Error: STRAPI_URL and STRAPI_API_TOKEN must be set in .env.local');
  process.exit(1);
}

async function addNewsPlaceholderImages() {
  try {
    console.log('🔍 Fetching news articles from Strapi...');
    console.log(`   URL: ${STRAPI_URL}`);

    // Step 1: Try fetching from articles endpoint first
    let newsUrl = `${STRAPI_URL}/api/articles?sort[0]=publishedAt:desc&pagination[limit]=100`;
    let fetchResponse = await fetch(newsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    // If articles fails, try news-items
    if (!fetchResponse.ok) {
      console.log('   Trying news-items endpoint...');
      newsUrl = `${STRAPI_URL}/api/news-items?sort[0]=publishedAt:desc&pagination[limit]=100`;
      fetchResponse = await fetch(newsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
    }

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch news: ${fetchResponse.status} ${fetchResponse.statusText}`);
    }

    const newsData = await fetchResponse.json();
    const articles = newsData.data || [];

    console.log(`✅ Found ${articles.length} news articles`);

    if (articles.length === 0) {
      console.log('\n⚠️  No articles found. Nothing to update.');
      return;
    }

    // Step 2: Find articles without images
    const articlesWithoutImages = articles.filter(article => !article.image);

    console.log(`📝 ${articlesWithoutImages.length} articles need placeholder images`);

    if (articlesWithoutImages.length === 0) {
      console.log('\n✅ All articles already have images!');
      return;
    }

    console.log('\n⚠️  Unable to update via API - Strapi articles collection is read-only.');
    console.log('\n📋 Manual Update Instructions:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Open Strapi Admin Panel:');
    console.log(`   ${STRAPI_URL}/admin`);
    console.log('\n2. Navigate to:');
    console.log('   Content Manager → Collection Types → Articles (or News Items)');
    console.log('\n3. Add images to these articles:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    articlesWithoutImages.forEach((article, index) => {
      const imageIndex = index % motorsportImages.length;
      console.log(`\n   ${index + 1}. ${article.title}`);
      console.log(`      Suggested placeholder image:`);
      console.log(`      ${motorsportImages[imageIndex]}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n4. For each article:');
    console.log('   - Click the article to edit');
    console.log('   - Find the "Image" field');
    console.log('   - Either:');
    console.log('     a) Upload your own motorsport image');
    console.log('     b) Use "Media Library" to add existing images');
    console.log('     c) Copy/paste the suggested placeholder URL above');
    console.log('\n5. Click "Save" for each article');
    console.log('\n6. Refresh your website to see the images!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n💡 Tip: You can bulk edit articles by selecting multiple and using "Set Image"');
    console.log('   if your Strapi version supports bulk operations.');

  } catch (error) {
    console.error('\n❌ Error processing news articles:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the script
addNewsPlaceholderImages();
