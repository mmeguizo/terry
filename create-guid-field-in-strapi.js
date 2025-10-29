/**
 * Automatically create the raceReadyGUID field in Strapi Site content type
 * 
 * Usage: node create-guid-field-in-strapi.js
 * 
 * This uses Strapi's Content-Type Builder API to add the field programmatically
 */

require('dotenv').config({ path: '.env.local' });

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function createGUIDField() {
  try {
    console.log('\n🏁 Creating raceReadyGUID field in Strapi...\n');
    console.log(`Strapi URL: ${STRAPI_URL}\n`);

    // First, get the current Site schema
    console.log('📖 Fetching current Site schema...');
    
    const getSchemaUrl = `${STRAPI_URL}/api/content-type-builder/content-types/api::site.site`;
    
    const getResponse = await fetch(getSchemaUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });

    if (!getResponse.ok) {
      const error = await getResponse.text();
      console.error('❌ Failed to fetch schema:', getResponse.status);
      console.error(error);
      console.error('\n💡 This might be because:');
      console.error('- The Content-Type Builder API is not accessible with this token');
      console.error('- You need to add the field manually via Strapi Admin UI');
      console.error('\nPlease follow: ADD_GUID_FIELD_TO_STRAPI.md\n');
      return;
    }

    const currentSchema = await getResponse.json();
    console.log('✅ Current schema fetched\n');

    // Check if field already exists
    if (currentSchema.data?.schema?.attributes?.raceReadyGUID) {
      console.log('✅ Field raceReadyGUID already exists!');
      console.log('\nYou can now run: node add-guid-to-strapi.js\n');
      return;
    }

    // Add the new field to the schema
    console.log('➕ Adding raceReadyGUID field to schema...');
    
    const updatedSchema = {
      ...currentSchema.data,
      schema: {
        ...currentSchema.data.schema,
        attributes: {
          ...currentSchema.data.schema.attributes,
          raceReadyGUID: {
            type: 'string',
            maxLength: 100,
            required: false,
            unique: false,
            private: false,
          }
        }
      }
    };

    // Update the schema
    const updateResponse = await fetch(getSchemaUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedSchema)
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      console.error('❌ Failed to update schema:', updateResponse.status);
      console.error(error);
      console.error('\n💡 Strapi Content-Type Builder API might be restricted.');
      console.error('Please add the field manually via Strapi Admin UI.');
      console.error('See: ADD_GUID_FIELD_TO_STRAPI.md\n');
      return;
    }

    console.log('✅ Field added to schema!\n');
    console.log('⏳ Strapi is restarting to apply changes...');
    console.log('   (This takes about 30-60 seconds)\n');
    
    // Wait a bit for Strapi to restart
    console.log('⏱️  Waiting 45 seconds for Strapi to restart...\n');
    await new Promise(resolve => setTimeout(resolve, 45000));

    console.log('✅ Strapi should be ready now!\n');
    console.log('📋 Next steps:');
    console.log('1. Run: node add-guid-to-strapi.js');
    console.log('2. Restart Next.js: npm run dev');
    console.log('3. Check homepage - countdown should work!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Solution:');
    console.error('The Content-Type Builder API might not be accessible.');
    console.error('Please add the field manually via Strapi Admin UI.');
    console.error('\nFollow the guide: ADD_GUID_FIELD_TO_STRAPI.md');
    console.error('\nIt only takes 2 minutes! 🚀\n');
  }
}

// Check credentials
if (!STRAPI_URL || !STRAPI_API_TOKEN) {
  console.error('\n❌ Error: Could not load Strapi credentials from .env.local\n');
  process.exit(1);
}

// Run
createGUIDField();


