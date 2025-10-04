# Strapi Schema Documentation

## 🏁 Multi-Tenant Racing Website CMS Structure

This directory contains the **production-proven Strapi schemas** copied from the live racing website system. These schemas power 16+ racing websites with a single codebase.

## 📂 Schema Structure

### Content Types

#### 🏢 Site (`/api/site/content-types/site/schema.json`)
**Main configuration for each racing website**
- `siteTitle`, `slug` (UID)
- `primaryColor`, `menuBackground`, `textColor` - Branding
- `logoImage` - Site logo
- `domain` - Unique domain identifier
- `eventId` - **RaceReady API integration** 🔥
- Relations: `news_item` (many-to-many), `pages` (one-to-many)

#### 📰 News Item (`/api/news-item/content-types/news-item/schema.json`)
**Multi-site news system**
- `title`, `slug` (UID)
- `date`, `image`, `url`
- `content` (blocks) - Rich text content
- `sites` (many-to-many) - **Link articles to multiple websites**

#### 📄 Page (`/api/page/content-types/page/schema.json`)
**Hierarchical page structure**
- `title`, `slug` (UID), `path`
- `site` (many-to-one) - Site ownership
- `parent`/`children` - **Nested page hierarchy**
- `isHome` - Homepage flag

### Components (`/components/shared/`)

#### 🎯 Hero (`hero.json`)
- `background`, `eventDate`, `eventInfo`
- `eventName`, `eventLocation`

#### 🔗 Hero Button (`hero-button.json`)
- `label`, `url`

#### 📋 Menu Item (`menu-item.json`)
- `label`, `url`

#### 🏢 Sponsor (`sponsor.json`)
- `name`, `logo`, `url`

#### 🌐 Website (`website.json`)
- `name`, `url`, `logo` - **Cross-site navigation**

#### 📄 Event Document (`event-document.json`)
- `label`, `url`

#### 🔗 Social Link (`social-link.json`)
- `platform`, `url`

#### 🎨 Footer Style (`footer-style.json`)
- `backgroundColor`, `textColor`

## 🚀 Key Features

### **Multi-Site Content Sharing**
- **News items** can appear on multiple sites
- **Websites component** creates cross-site navigation
- **Event documents** shared across related events

### **RaceReady Integration**
- `eventId` field links to RaceReady API
- `/api/raceready/event/[id]` endpoint for live data
- Event details, entries, documents, schedules

### **Dynamic Branding**
- Site-specific colors, logos, styling
- Component-based hero sections
- Configurable menus and footer

### **SEO & i18n Ready**
- All content types support internationalization
- UID slugs for SEO-friendly URLs
- Draft & publish workflow

## 📡 API Integration

### Strapi Endpoints
```javascript
// Site Configuration
GET /api/sites?filters[slug][$eq]=${siteSlug}&populate=*

// Multi-Site News
GET /api/news-items?filters[sites][slug][$eq]=${siteSlug}&sort[0]=publishedAt:desc&populate[image]=*

// Pages
GET /api/pages?filters[site][slug][$eq]=${siteSlug}&populate=*
```

### RaceReady API
```javascript
// Event Data
GET https://raceready.com.au/api/event/?eventid=${eventId}
```

## 🎯 Next Steps

1. **Set up Strapi** with these schemas
2. **Create site entries** with unique slugs
3. **Configure environment variables**:
   ```env
   SITE_SLUG=your-event-slug
   STRAPI_URL=https://your-strapi-instance.com
   STRAPI_API_TOKEN=your-api-token
   ```
4. **Deploy multiple sites** with different `SITE_SLUG` values

## 🏆 Production Ready

This schema structure is **battle-tested** in production, powering:
- Motor Racing Australia events
- GT World Challenge
- MX5 Cup
- Wakefield 300
- And 12+ more racing websites!

Transform your site by changing one environment variable! 🏁
