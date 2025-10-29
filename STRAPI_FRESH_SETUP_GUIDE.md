# Fresh Strapi Setup Guide for Clubman Championship

## 🚨 IMPORTANT: Fresh Strapi Setup Required

Since you have a **brand new Strapi instance**, you need to set up the content types first before populating data.

## Step 1: Copy Strapi Schema Files

Your Strapi instance needs the following content types and components:

### Content Types to Create

Copy these folders from this project to your Strapi `src/` directory:

```
terry/src/api/site/          → your-strapi/src/api/site/
terry/src/api/news-item/     → your-strapi/src/api/news-item/
terry/src/api/page/          → your-strapi/src/api/page/
```

### Components to Create

Copy the components folder:

```
terry/src/components/shared/ → your-strapi/src/components/shared/
```

This includes:
- `event-document.json`
- `footer-style.json`
- `hero-button.json`
- `hero.json`
- `menu-item.json`
- `social-link.json`
- `sponsor.json`
- `website.json`

## Step 2: Restart Strapi

After copying the schema files:

```bash
cd your-strapi-directory
npm run develop
```

Strapi will automatically detect the new content types and create the database tables.

## Step 3: Enable i18n Plugin (if not already)

The schemas use the i18n plugin. Make sure it's installed:

```bash
npm install @strapi/plugin-i18n
```

## Step 4: Verify Content Types in Strapi Admin

1. Go to `http://localhost:1337/admin`
2. Check **Content-Type Builder**
3. You should see:
   - **Site** (with fields: siteTitle, slug, primaryColor, domain, etc.)
   - **News Item** (with fields: title, slug, content, sites relation)
   - **Page** (with fields: title, slug, path, site relation)

## Step 5: Set Up API Permissions

1. Go to **Settings → Users & Permissions → Roles → Public**
2. Enable these permissions:
   - **Site**: `find`, `findOne`
   - **News-item**: `find`, `findOne`
   - **Page**: `find`, `findOne`

3. Create an API Token:
   - Go to **Settings → API Tokens**
   - Click **Create new API Token**
   - Name: `Content Population`
   - Token type: `Full access`
   - **Copy the token** - you'll need it for `.env.local`

## Step 6: Configure Environment Variables

Create `.env.local` in the terry project root:

```env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_token_from_step_5
SITE_SLUG=clubman
SITE_DOMAIN=http://localhost:3000
```

## Step 7: Run the Population Scripts

Now you can run the scripts to populate data:

```bash
# Create the Clubman site entry
node setup-clubman-site.js

# Populate all content (sponsors, news, documents)
node populate-clubman-only.js
```

## Alternative: Manual Schema Creation

If you prefer to create the schema manually in Strapi admin:

### Create "Site" Content Type

1. Go to **Content-Type Builder → Create new collection type**
2. Display name: `Site`
3. Add these fields:

| Field Name | Type | Settings |
|------------|------|----------|
| siteTitle | Text | - |
| slug | UID | Target field: siteTitle |
| primaryColor | Text | - |
| secondaryColor | Text | - |
| menuBackground | Text | - |
| textColor | Text | - |
| logoImage | Text | - |
| domain | Text | Required, Unique |
| eventId | Text | - |
| eventInfo | Text | - |

4. Add Components (repeatable):
   - menu (Menu Item component)
   - hero (Hero component)
   - heroButton (Hero Button component)
   - eventDocuments (Event Document component)
   - sponsors (Sponsor component)
   - websites (Website component)
   - socials (Social Link component)
   - footer (Footer Style component)

5. Add Relations:
   - news_item: Many-to-Many with News Item
   - pages: One-to-Many with Page

### Create Components

For each component, go to **Content-Type Builder → Create new component**:

#### Menu Item Component
- label (Text)
- url (Text)

#### Hero Component
- background (Text)
- eventName (Text)
- eventLocation (Text)
- eventDate (DateTime)
- eventInfo (Text)

#### Hero Button Component
- label (Text)
- url (Text)

#### Sponsor Component
- name (Text)
- logo (Text)
- url (Text)

#### Event Document Component
- label (Text)
- url (Text)

#### Website Component
- name (Text)
- url (Text)
- logo (Text)
- label (Text)

#### Social Link Component
- platform (Text)
- url (Text)

#### Footer Style Component
- backgroundColor (Text)
- textColor (Text)

### Create "News Item" Content Type

1. Display name: `NewsItem`
2. Add fields:

| Field Name | Type | Settings |
|------------|------|----------|
| title | Text | - |
| slug | UID | Target field: title |
| date | Date | - |
| image | Text | - |
| url | Text | - |
| content | Rich Text (blocks) | - |

3. Add Relation:
   - sites: Many-to-Many with Site

## Troubleshooting

### Error: "Invalid key slug"
- Your Strapi doesn't have the schema set up yet
- Follow Step 1 to copy the schema files

### Error: "domain is required"
- The Site content type requires a unique domain field
- The updated script now includes this

### Error: "Component not found"
- You need to copy the component schemas
- See Step 1 for component files

### Strapi doesn't detect new schemas
- Make sure you copied to the correct `src/` directory
- Restart Strapi completely
- Check file permissions

## Quick Copy Command (if Strapi is in same parent directory)

```bash
# From the terry directory
cp -r src/api/site ../your-strapi-dir/src/api/
cp -r src/api/news-item ../your-strapi-dir/src/api/
cp -r src/api/page ../your-strapi-dir/src/api/
cp -r src/components/shared ../your-strapi-dir/src/components/
```

Then restart Strapi.

## What Happens After Setup

Once your Strapi has the content types:
1. The `setup-clubman-site.js` script will create a Site entry
2. The `populate-clubman-only.js` script will add:
   - 11 sponsors
   - 5 news articles
   - 4 event documents
3. Your Next.js app will fetch this data via the API
4. Change `SITE_SLUG` to switch between different sites

## Need Help?

If you're stuck, check:
1. Strapi console for error messages
2. Strapi admin Content-Type Builder to verify schemas
3. API Token permissions in Settings
4. Database connection in Strapi

The schema files are production-tested and power 16+ racing websites!


