# 🏁 Strapi Test Data Setup Guide

## 🎯 **Quick Setup Options**

I've created comprehensive test data for your multi-tenant motorsport Strapi. Here are your options:

### **Option 1: Automated Script** ⚡ **RECOMMENDED**

1. **Install dependencies:**
   ```bash
   npm install axios
   ```

2. **Get your Strapi API token:**
   - Start Strapi: `npm run develop`
   - Go to: `http://localhost:1337/admin`
   - Navigate to: Settings → API Tokens → Create new API token
   - Name: "Data Population"
   - Token type: "Full access"
   - Copy the generated token

3. **Update the script:**
   - Open `populate-strapi-data.js`
   - Replace `your-api-token-here` with your actual token
   - Adjust `STRAPI_URL` if needed (default: `http://localhost:1337`)

4. **Run the script:**
   ```bash
   node populate-strapi-data.js
   ```

### **Option 2: Manual Entry** 📝

Use the data from `strapi-test-data.json` to manually create entries in your Strapi admin panel.

## 📊 **What Gets Created**

### **Sites (5 main ones):**
1. **RaceReady** (`raceready.com.au`)
   - Black/white theme
   - Platform launch event
   
2. **MRA** (`motorace.com.au`) 
   - Red theme (#CC0000)
   - Championship finale at Bathurst
   
3. **SuperTT** (`supertt.com.au`)
   - Orange theme (#EA9216)
   - Season finale at Mount Panorama
   
4. **Clubman Championship** (`clubmanchampionship.com.au`)
   - Dark/red theme (#30232D/#D55053)
   - 25th anniversary celebration
   
5. **MX5 Cup** (`mx5cup.au`)
   - Black/white theme
   - Season finale at Phillip Island

### **News Articles (5 articles):**
- RaceReady platform features
- MRA Round 8 results
- SuperTT Bathurst finale preview
- Clubman 25-year celebration
- MX5 Cup season wrap-up

### **Each Site Includes:**
✅ **Complete branding** (colors, logos, themes)  
✅ **Hero section** with event details  
✅ **Navigation menu** (5 standard items)  
✅ **Sponsors** (relevant to each series)  
✅ **Event documents** (schedule, regulations)  
✅ **Social media links**  
✅ **Cross-site relationships**  

## 🧪 **Testing Multi-Tenancy**

After populating the data, test different sites:

```bash
# Test MRA site (red theme)
SITE_SLUG=mra npm run dev

# Test SuperTT site (orange theme)  
SITE_SLUG=supertt npm run dev

# Test Clubman site (dark/red theme)
SITE_SLUG=clubman npm run dev

# Test MX5 Cup site (black/white theme)
SITE_SLUG=mx5cup npm run dev
```

## 🎨 **Visual Results**

Each site will have:
- **Unique branding colors** from your spreadsheet
- **Site-specific logos** from S3 CDN
- **Relevant news articles** (some shared between related series)
- **Event information** with countdowns
- **Cross-links** to related motorsport sites

## 🔧 **API Endpoints to Test**

```bash
# Get MRA site config
curl "http://localhost:3000/api/config?slug=mra"

# Get SuperTT news
curl "http://localhost:3000/api/news?slug=supertt"

# Get all sites
curl "http://localhost:1337/api/sites"

# Get MRA-specific news
curl "http://localhost:1337/api/news-items?filters[sites][slug][\$eq]=mra"
```

## 🚀 **Next Steps**

1. **Run the population script**
2. **Upload logos to S3** (`.\upload-images.bat`)
3. **Test each site** with different SITE_SLUG values
4. **Add more content** as needed
5. **Deploy to production** using the manage.sh script

## 🎯 **Expected Results**

After setup, you'll have a fully functional multi-tenant motorsport platform with:
- ✅ 5+ different racing websites
- ✅ Unique branding per site
- ✅ Site-specific and shared news content
- ✅ Complete event management system
- ✅ Cross-site relationships and navigation
- ✅ Ready for production deployment

This matches the production architecture you saw in the spreadsheet! 🏆
