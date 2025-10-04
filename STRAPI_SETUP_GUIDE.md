# 🏁 Multi-Tenant Motorsport Strapi Setup Guide

## 🎯 **Overview**
This guide sets up a single Strapi instance to manage **15+ motorsport websites** with complete multi-tenancy.

## 📋 **What's Been Created**

### ✅ **Strapi Schema Files**
- `src/api/site/content-types/site/schema.json` - Main site collection
- `src/components/shared/hero.json` - Hero section component
- `src/components/shared/menu-item.json` - Navigation items
- `src/components/shared/sponsor.json` - Sponsor information
- `src/components/shared/website.json` - Related websites
- `src/components/shared/event-document.json` - Event documents
- `src/components/shared/footer-style.json` - Footer styling
- `src/components/shared/hero-button.json` - Hero buttons
- `src/components/shared/social-link.json` - Social media links

### 📊 **Site Data**
- `MULTI_SITE_DATA.json` - Complete site configurations for all 15+ motorsport sites

## 🚀 **Next Steps**

### **Step 1: Set Up Local Strapi**
```bash
# If you don't have Strapi installed locally
npx create-strapi-app@latest strapi-cms --quickstart

# Or use the existing production setup
cd apps-linux/studio.raceready.com.au
npm install
npm run develop
```

### **Step 2: Import Schema**
1. Copy all schema files from `src/` to your Strapi `src/` directory
2. Restart Strapi to load the new content types
3. The admin panel will show:
   - **Sites** collection type
   - **News Items** collection type  
   - **Pages** collection type
   - All shared components

### **Step 3: Create Site Entries**
Use the data from `MULTI_SITE_DATA.json` to create entries for:

**Main Sites:**
- RaceReady (`raceready.com.au`)
- MRA (`motorace.com.au`) 
- SuperTT (`supertt.com.au`)
- Clubman Championship (`clubmanchampionship.com.au`)
- MX5 Cup (`mx5cup.au`)
- ExtremeTT (`extremett.com.au`)
- Sydney 300 (`sydney300.com.au`)
- Wakefield 300 (`wakefield300.com.au`)
- Classic Sports Cars (`classicsportscars.com.au`)
- Australian Motor Racing Club (`amrc.com.au`)
- APRA Bathurst Challenge (`aprabathurstchallenge.com.au`)
- IPRA Bathurst Challenge (`iprabathurstchallenge.com.au`)
- TC2 Racing (`tc2.au`)
- MX5 Nationals (`mx5nationals.com.au`)

**For Each Site, Configure:**
- ✅ Site Title & Slug
- ✅ Domain (unique)
- ✅ Primary Color & Menu Background
- ✅ Logo Image (S3 URL)
- ✅ Event ID (for RaceReady integration)
- ✅ Menu Items (5 standard items)
- ✅ Hero Section (event info, dates, location)
- ✅ Sponsors (related motorsport partners)
- ✅ Related Sites (cross-linking)

### **Step 4: Upload Logos to S3**
```bash
# Run the upload script
.\upload-images.bat
```

This will organize logos by site:
- `https://cdn.syzmic.com.au/sites/mra/logos/`
- `https://cdn.syzmic.com.au/sites/supertt/logos/`
- `https://cdn.syzmic.com.au/sites/clubman/logos/`
- etc.

### **Step 5: Configure News Filtering**
The news system uses **many-to-many relationships**:
- Each news item can be associated with multiple sites
- Each site displays only its related news items
- Filter by `sites` relationship in API calls

### **Step 6: Test Multi-Tenancy**
```bash
# Test different sites
SITE_SLUG=mra npm run dev           # MRA site
SITE_SLUG=supertt npm run dev       # SuperTT site  
SITE_SLUG=clubman npm run dev       # Clubman site
```

## 🎨 **Site Branding Examples**

### **MRA (Motor Racing Australia)**
- **Colors**: Red primary (#CC0000), dark menu (#404040)
- **Logo**: MRA-Logo.svg
- **Domain**: motorace.com.au
- **Related**: SuperTT, Clubman, Sydney300, etc.

### **SuperTT**
- **Colors**: Orange primary (#EA9216), blue menu (#3A4750)  
- **Logo**: SuperTT.png
- **Domain**: supertt.com.au
- **Event ID**: EEEEEE

### **Clubman Championship**
- **Colors**: Dark primary (#30232D), red menu (#D55053)
- **Logo**: Clubman-Championship.svg
- **Domain**: clubmanchampionship.com.au
- **Event ID**: FAE907

## 🔧 **API Integration**

### **Frontend API Calls**
```javascript
// Get site config
const config = await fetch(`/api/config?slug=${siteSlug}`);

// Get site-specific news
const news = await fetch(`/api/news?slug=${siteSlug}`);

// Get event data (RaceReady integration)
const event = await fetch(`/api/raceready/event/${eventId}`);
```

### **Strapi API Endpoints**
```
GET /api/sites?filters[slug][$eq]=mra&populate=*
GET /api/news-items?filters[sites][slug][$eq]=mra
GET /api/pages?filters[site][slug][$eq]=mra
```

## 🌐 **Multi-Domain Setup**

Each site can have its own domain:
- `motorace.com.au` → MRA site
- `supertt.com.au` → SuperTT site
- `clubmanchampionship.com.au` → Clubman site
- etc.

The `SITE_SLUG` environment variable determines which site content to load.

## 📱 **Deployment**

### **Production Deployment**
```bash
# Use the manage.sh script
cd apps-linux/scripts
./manage.sh deploy raceready.com.au

# Or deploy specific sites
./manage.sh deploy motorace.com.au
./manage.sh deploy supertt.com.au
```

### **Environment Variables**
```env
SITE_SLUG=mra                           # Which site to display
STRAPI_URL=https://studio.raceready.com.au
STRAPI_API_TOKEN=your_token
SITE_DOMAIN=https://motorace.com.au
```

## 🎯 **Benefits**

✅ **Single Codebase** - One Next.js app serves all sites  
✅ **Single Strapi** - One CMS manages all content  
✅ **Dynamic Branding** - Colors, logos, content per site  
✅ **Shared Components** - Consistent UI across all sites  
✅ **Cross-Site Linking** - Related motorsport sites  
✅ **Centralized Management** - Update all sites from one place  
✅ **Scalable** - Easy to add new racing series/events  

## 🚀 **Ready to Launch!**

Your multi-tenant motorsport platform is now configured to handle:
- 15+ different racing websites
- Dynamic branding and content
- Shared news and event management  
- Cross-site relationships
- Centralized logo and asset management

Just run the Strapi setup, upload the logos, and you're ready to manage the entire Australian motorsport ecosystem! 🏁
