# Clubman Championship Site Setup Guide

This guide will help you set up the Clubman Championship site in your local Strapi instance.

## Prerequisites

1. **Strapi running locally** on `http://localhost:1337`
2. **Node.js and npm** installed
3. **Strapi API Token** - Get this from your Strapi admin panel:
   - Login to Strapi admin: `http://localhost:1337/admin`
   - Go to Settings → API Tokens
   - Create a new token with full access
   - Copy the token

## Setup Steps

### Step 1: Configure Environment Variables

Create a `.env.local` file in the project root with:

```env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_token_here
SITE_SLUG=clubman
SITE_DOMAIN=http://localhost:3000
```

Replace `your_token_here` with your actual Strapi API token.

### Step 2: Install Dependencies

Make sure you have the required npm packages:

```bash
npm install
```

### Step 3: Create the Clubman Site Entry

Run the setup script to create the basic site configuration:

```bash
node setup-clubman-site.js
```

This will create:
- Site entry with slug `clubman`
- Basic branding (colors, logo, title)
- Hero configuration
- Menu items
- Footer and social links

**Expected Output:**
```
✨ SUCCESS! Clubman Championship site created!
📋 Site Details:
   Document ID: [auto-generated-id]
   Slug: clubman
   Title: Clubman Championship
   Primary Color: #FF6B00
```

### Step 4: Populate Content

Run the populate script to add all content:

```bash
node populate-clubman-only.js
```

This will add:
- **11 Sponsors**: Clubman Championship, Motor Racing Australia, RaceReady, and major motorsport brands
- **5 News Articles**: Championship updates, calendar announcements, and event coverage
- **4 Event Documents**: Rules, schedule, regulations, and entry form

**Expected Output:**
```
✨ CLUBMAN CHAMPIONSHIP - CONTENT POPULATED!
📊 SUMMARY:
   ✅ Sponsors: 11
   ✅ News articles: 5
   ✅ Event documents: 4
```

### Step 5: Start Your Next.js App

```bash
npm run dev
```

Visit `http://localhost:3000` to see your Clubman Championship site!

## Content Included

### Sponsors (11)
1. Clubman Championship (primary)
2. Motor Racing Australia
3. RaceReady
4. Motorsport Australia
5. Michelin Tyres
6. Pirelli Motorsport
7. Shell V-Power Racing
8. Castrol Edge
9. Supercheap Auto
10. Repco
11. Penrite Oils

### News Articles (5)
1. **Clubman Championship Celebrates 25th Anniversary** - Quarter century milestone celebration
2. **2025 Calendar - Eight Round Championship** - Expanded calendar announcement
3. **Junior Development Program Launched** - Youth pathway initiative
4. **Record 45 Entries for Season Finale** - Grid size record
5. **Clubman Champions Crowned at SMP** - Season finale results

### Event Documents (4)
1. Championship Rules
2. Event Schedule
3. Supplementary Regulations
4. Entry Form

## Troubleshooting

### Error: "Cannot connect to Strapi"
- Make sure Strapi is running: `npm run develop` (in your Strapi directory)
- Check that STRAPI_URL is correct in `.env.local`

### Error: "Unauthorized"
- Check that STRAPI_API_TOKEN is correct in `.env.local`
- Make sure the token has full access permissions

### Error: "Site already exists"
- If you want to recreate the site, delete it from Strapi admin first
- Or skip to Step 4 to just update the content

### Error: "News already exists"
- This is normal if you've run the script before
- The script will skip existing news articles

## Verify in Strapi Admin

1. Go to `http://localhost:1337/admin`
2. Check **Content Manager → Sites** - You should see "Clubman Championship"
3. Check **Content Manager → News Items** - You should see 5 Clubman news articles
4. Open the Clubman site entry and verify sponsors and documents are populated

## Next Steps

Once your site is set up:
- Customize the branding colors in Strapi
- Upload real images for news articles
- Add more sponsors or documents as needed
- Configure additional menu items
- Set up other sites using the same process

## Related Files

- `setup-clubman-site.js` - Creates basic site entry
- `populate-clubman-only.js` - Populates all content
- `populate-all-content.js` - Reference for all sites data
- `populate-enhanced-data.js` - Additional content options

## Support

If you encounter issues:
1. Check the console output for specific error messages
2. Verify Strapi is running and accessible
3. Check that all environment variables are set correctly
4. Review the Strapi admin panel for any validation errors

