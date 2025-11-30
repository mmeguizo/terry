# Developer Handbook - RaceReady Multi-Tenant Platform

> Comprehensive guide for developers taking over the RaceReady Multi-Tenant Motorsport CMS Platform

**Last Updated**: November 30, 2025
**Project Status**: Production Ready
**Version**: 0.1.0

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Configuration System](#configuration-system)
7. [Development Workflow](#development-workflow)
8. [Key Features](#key-features)
9. [API Integration](#api-integration)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Scripts & Utilities](#scripts--utilities)
13. [Best Practices](#best-practices)
14. [Additional Resources](#additional-resources)

---

## Project Overview

### What is This Project?

This is a **multi-tenant Next.js application** that powers 15+ motorsport racing websites from a single codebase. Each website has unique branding, content, and configuration while sharing the same underlying application.

### Key Capabilities

- **Single Codebase, Multiple Sites**: One deployment serves different racing event websites
- **Centralized Content Management**: All content managed through Strapi CMS
- **Dynamic Branding**: Each site has unique colors, logos, and styling
- **Shared & Site-Specific Content**: News can be shared across multiple sites or kept site-specific
- **RaceReady API Integration**: Live event data from RaceReady platform
- **PWA Support**: Progressive Web App capabilities for offline access
- **Event Management**: Comprehensive event information, schedules, documents, and results

### Supported Sites

The platform currently powers these racing websites:

| Site | Domain | Slug | Primary Color |
|------|--------|------|---------------|
| Motor Racing Australia | motorrace.com.au | mra | #CC0000 |
| Clubman Championship | clubmanchampionship.com.au | clubman | #30232D |
| SuperTT | supertt.com.au | supertt | #EA9216 |
| Sydney 300 | sydney300.com.au | sydney300 | #000000 |
| Wakefield 300 | wakefield300.com.au | wakefield300 | #000000 |
| Classic Sports Cars | classicsportscars.com.au | classicsportscars | #E66C32 |
| AMRC | amrc.com.au | amrc | #000000 |
| APRA Bathurst | aprabathurstchallenge.com | aprabathurst | #EA2E00 |
| IPRA Bathurst | iprabathurstchallenge.com | iprabathurst | #9DBDB8 |
| ExtremeTT | extremett.com.au | extremett | #9DBDB8 |
| MX5 Cup | mx5cup.com.au | mx5cup | #000000 |
| MX5 Nationals | mx5nationals.com.au | mx5nationals | #000000 |
| TC2 Racing | tc2.au | tc2 | #000000 |
| Race Official | raceofficial.com.au | raceofficial | #CC0000 |
| RaceReady | raceready.com.au | raceready | #000000 |

---

## Architecture

### Multi-Tenant Design

```
┌─────────────────────────────────────────────────────┐
│           Single Next.js Application                │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Site A      │  │  Site B      │  │  Site C   │ │
│  │  (MRA)       │  │  (Clubman)   │  │ (SuperTT) │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│         │                  │                │        │
│         └──────────────────┴────────────────┘        │
│                       │                               │
└───────────────────────┼───────────────────────────────┘
                        │
                        ▼
            ┌────────────────────────┐
            │   Strapi CMS           │
            │   (Centralized)        │
            └────────────────────────┘
                        │
                        ▼
            ┌────────────────────────┐
            │   RaceReady API        │
            │   (Event Data)         │
            └────────────────────────┘
```

### Key Architectural Principles

1. **Environment-Based Site Selection**: Sites are selected via `SITE_SLUG` environment variable
2. **Shared Components**: All UI components are reusable across sites
3. **Dynamic Configuration**: Branding and content loaded from Strapi
4. **API-First**: External data fetched from RaceReady API
5. **Static Generation**: Next.js static site generation for performance

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.4.4 (App Router)
- **React**: 19.1.0
- **Styling**: Tailwind CSS 4.0
- **Icons**: React Icons 5.5.0
- **Calendar**: FullCalendar 6.1.19
- **Carousel**: Swiper 11.2.10

### Backend & CMS
- **CMS**: Strapi v4
- **Database**: PostgreSQL (for Strapi)
- **API Client**: Axios 1.12.2

### Development Tools
- **TypeScript**: 24.1.0 (for type definitions)
- **ESLint**: 9.x with Next.js config
- **Playwright**: 1.56.0 (for testing)

### Hosting & Infrastructure
- **Strapi URL**: https://studio.raceready.com.au
- **CDN**: https://cdn.syzmic.com.au/sites/
- **Deployment**: Individual site instances in `/apps-linux/`

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Git
- Access to Strapi instance
- Strapi API token

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd terry
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   SITE_SLUG=mra
   SITE_DOMAIN=http://localhost:3000
   STRAPI_URL=https://studio.raceready.com.au
   STRAPI_API_TOKEN=your-api-token-here
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open browser**:
   Navigate to http://localhost:3000

### Switching Between Sites

To switch between different racing websites, simply change the `SITE_SLUG` in `.env.local`:

```env
# For Motor Racing Australia
SITE_SLUG=mra

# For Clubman Championship
SITE_SLUG=clubman

# For SuperTT
SITE_SLUG=supertt
```

Restart the development server after changing the environment variable.

---

## Project Structure

```
terry/
├── .claude/                  # Claude Code configuration
├── .next/                    # Next.js build output (generated)
├── apps-linux/               # Deployed site instances (15+ sites)
│   ├── amrc.com.au/
│   ├── clubmanchampionship.com.au/
│   ├── motorrace.com.au/
│   └── ...
├── docs/                     # Additional documentation
├── internal/                 # Internal tools and scripts
├── node_modules/             # Dependencies (generated)
├── public/                   # Static assets
│   ├── Logo/                 # Brand logos (AI, EPS, PNG, SVG)
│   ├── icons/                # App icons
│   └── images/               # Static images
├── scripts/                  # Build and automation scripts
├── sprints/                  # Sprint planning documents
├── src/                      # Source code
│   ├── api/                  # API controllers
│   │   └── controllers/
│   │       └── site.js       # Site data controller
│   ├── app/                  # Next.js App Router pages
│   │   ├── [...slug]/        # Dynamic page routes
│   │   ├── api/              # API routes
│   │   ├── contact/          # Contact page
│   │   ├── dashboard/        # Dashboard (admin)
│   │   ├── event/            # Event detail page
│   │   ├── events/           # Events listing
│   │   ├── event-info/       # Event information
│   │   ├── event-timetable/  # Event schedule
│   │   ├── news/             # News articles
│   │   ├── noticeboard/      # Notice board
│   │   ├── offline/          # PWA offline page
│   │   ├── privacy/          # Privacy policy
│   │   ├── results/          # Race results
│   │   ├── terms/            # Terms of service
│   │   ├── globals.css       # Global styles
│   │   ├── layout.js         # Root layout
│   │   └── page.js           # Homepage
│   ├── components/           # React components
│   │   ├── blocks/           # Content blocks
│   │   ├── calendar/         # Calendar components
│   │   ├── debug/            # Debug utilities
│   │   ├── error/            # Error components
│   │   ├── events/           # Event components
│   │   ├── layout/           # Layout components (Header, Footer)
│   │   ├── navigation/       # Navigation components
│   │   ├── pwa/              # PWA components
│   │   ├── racing/           # Racing-specific components
│   │   ├── sections/         # Page sections
│   │   ├── shared/           # Shared utilities
│   │   ├── ui/               # UI components (Cards, Buttons)
│   │   ├── weather/          # Weather widgets
│   │   ├── CountdownTimer.js # Event countdown
│   │   └── SectionTitle.js   # Section headers
│   ├── config/               # Configuration files
│   │   ├── site-config.json              # Local config (dev)
│   │   ├── site-config-gt4australia.json # GT4 Australia config
│   │   └── site-config-gtworldchallenge.json # GT World Challenge
│   ├── content/              # Static content
│   │   └── news/             # Local news articles (JSON)
│   ├── context/              # React Context providers
│   │   └── ConfigProvider.js # Site configuration context
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   └── utils/                # Helper functions
├── .cursorrules              # Cursor IDE rules
├── .env.local                # Environment variables (DO NOT COMMIT)
├── .gitignore                # Git ignore rules
├── eslint.config.mjs         # ESLint configuration
├── jsconfig.json             # JavaScript configuration
├── middleware.js/.ts         # Next.js middleware
├── next.config.mjs           # Next.js configuration
├── package.json              # Dependencies and scripts
├── package-lock.json         # Dependency lock file
├── postcss.config.mjs        # PostCSS configuration
├── README.md                 # Basic project readme
├── PROJECT_CHANGELOG.md      # Detailed project history
└── [various .md files]       # Feature-specific documentation
```

### Key Directories Explained

#### `/src/app/` - Next.js Pages
All pages use the Next.js 13+ App Router convention:
- `page.js` - Route component
- `layout.js` - Layout wrapper
- `[dynamic]/` - Dynamic route segments

#### `/src/components/` - Reusable Components
- **blocks**: Large content sections (Hero, Sponsors, Latest News)
- **layout**: Header, Footer, MobileNav
- **ui**: Small reusable UI elements (Button, Card, Link)
- **events**: Event-specific components
- **calendar**: FullCalendar integration
- **racing**: Racing-specific widgets (lap times, results)

#### `/src/config/` - Configuration Files
- JSON files containing fallback configurations
- Used when Strapi is unavailable or during development
- Each site can have its own config file

#### `/apps-linux/` - Production Deployments
- Contains individual site deployments
- Each directory is a complete site instance
- Used for multi-site hosting on Linux servers

---

## Configuration System

### Environment Variables

The application uses environment variables for site-specific configuration:

```env
# Site identification (REQUIRED)
SITE_SLUG=mra

# Site domain (for canonical URLs, metadata)
SITE_DOMAIN=https://motorrace.com.au

# Strapi CMS connection (REQUIRED)
STRAPI_URL=https://studio.raceready.com.au
STRAPI_API_TOKEN=your-api-token-here
```

### Configuration Priority

The application loads configuration in this order:

1. **Strapi CMS** (primary source) - fetched at build/runtime
2. **Local JSON config** (`src/config/site-config.json`) - fallback
3. **Environment variables** - override specific values

### Site Configuration Structure

Each site configuration includes:

```json
{
  "siteTitle": "Motor Racing Australia",
  "primaryColor": "#CC0000",
  "menuBackground": "#FFFFFF",
  "textColor": "#000000",
  "logoImage": "/Logo/MRA/MRA_white.png",
  "currentEventId": 1389,
  "hero": {
    "background": "https://...",
    "backgroundVideo": "https://...",
    "eventDate": "2025-08-30T10:00:00-05:00",
    "eventName": "ROAD AMERICA",
    "eventLocation": "ONE RACEWAY",
    "buttons": [...]
  },
  "menu": [...],
  "actions": [...],
  "websites": [...],
  "eventDocuments": [...],
  "newsItems": [...],
  "sponsors": [...],
  "footer": {...},
  "socials": [...]
}
```

### Accessing Configuration in Components

Use the ConfigProvider context:

```javascript
import { useConfig } from '@/context/ConfigProvider';

export default function MyComponent() {
  const config = useConfig();

  return (
    <div style={{ color: config.primaryColor }}>
      <h1>{config.siteTitle}</h1>
    </div>
  );
}
```

---

## Development Workflow

### Running Development Server

```bash
# Standard development mode
npm run dev

# With Turbopack (faster)
npm run dev --turbopack
```

The app will be available at http://localhost:3000

### Building for Production

```bash
# Build the application
npm run build

# Run production build locally
npm start
```

### Linting

```bash
npm run lint
```

### Testing Different Sites Locally

1. Stop the development server
2. Edit `.env.local` to change `SITE_SLUG`
3. Restart the development server
4. The site will reload with the new configuration

---

## Key Features

### 1. Multi-Tenant System

**How it Works**:
- Each site is identified by a unique `SITE_SLUG`
- Configuration is fetched from Strapi based on the slug
- Components render dynamically based on configuration
- Content is filtered by site relationships

**Adding a New Site**:
1. Create site entry in Strapi with unique slug
2. Configure branding (colors, logo, menu)
3. Add content (news, events, sponsors)
4. Deploy with `SITE_SLUG` environment variable

### 2. Dynamic Hero Section

The hero section is fully configurable:
- Background image or video
- Event countdown timer
- Call-to-action buttons
- Event information display

Location: `src/components/blocks/Hero.js`

### 3. News Management

**Features**:
- News articles can be shared across multiple sites
- Rich text content with image support
- Automatic slug generation
- SEO-friendly URLs

**API Endpoint**:
```
GET /api/news-items?filters[sites][slug][$eq]=${siteSlug}&sort[0]=publishedAt:desc&populate[image]=*
```

### 4. Event Integration

**RaceReady API Integration**:
- Live event data fetching
- Event schedules and timetables
- Entry lists and results
- Document downloads

**Local Configuration**:
- Event documents (regulations, allocations)
- Event information pages
- Custom event branding

### 5. Calendar & Schedule

**Features**:
- FullCalendar integration
- Event date visualization
- Multi-day event support
- Responsive design

Location: `src/components/calendar/`

### 6. Progressive Web App (PWA)

**Features**:
- Offline support
- Add to home screen
- Service worker caching
- App-like experience

Files:
- `public/manifest.json` (generated per site)
- `public/sw-lifecycle.js` (service worker)

### 7. Sponsors & Partners

**Display Options**:
- Grid layout
- Carousel/slider
- Logo with links
- Configurable per site

Location: `src/components/sections/Sponsors.js`

### 8. Mobile Navigation

**Features**:
- Responsive hamburger menu
- White theme with accent colors
- Smooth animations
- Touch-friendly

Location: `src/components/layout/MobileNav.js`

---

## API Integration

### Strapi CMS API

**Base URL**: https://studio.raceready.com.au

#### Fetching Site Configuration

```javascript
const response = await axios.get(
  `${process.env.STRAPI_URL}/api/sites`,
  {
    params: {
      'filters[slug][$eq]': process.env.SITE_SLUG,
      populate: '*'
    },
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`
    }
  }
);

const siteData = response.data.data[0];
```

#### Fetching News

```javascript
const response = await axios.get(
  `${process.env.STRAPI_URL}/api/news-items`,
  {
    params: {
      'filters[sites][slug][$eq]': process.env.SITE_SLUG,
      'sort[0]': 'publishedAt:desc',
      'populate[image]': '*',
      'populate[sites]': '*'
    },
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`
    }
  }
);

const newsItems = response.data.data;
```

#### Fetching Pages

```javascript
const response = await axios.get(
  `${process.env.STRAPI_URL}/api/pages`,
  {
    params: {
      'filters[site][slug][$eq]': process.env.SITE_SLUG,
      populate: '*'
    },
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`
    }
  }
);

const pages = response.data.data;
```

### RaceReady API

**Base URL**: https://raceready.com.au

#### Fetching Event Data

```javascript
const response = await axios.get(
  `https://raceready.com.au/api/event/`,
  {
    params: {
      eventid: config.currentEventId
    }
  }
);

const eventData = response.data;
```

#### Available Event Endpoints

- `/api/event/?eventid={id}` - Event details
- `/api/event/entries/?eventid={id}` - Entry list
- `/api/event/documents/?eventid={id}` - Documents
- `/api/event/schedule/?eventid={id}` - Event schedule
- `/api/event/results/?eventid={id}` - Race results

---

## Deployment

### Production Deployment Structure

The `/apps-linux/` directory contains individual site deployments:

```
apps-linux/
├── motorrace.com.au/         # Full Next.js app
├── clubmanchampionship.com.au/
├── supertt.com.au/
└── ...
```

Each site directory is a complete application with:
- Own `.env.local` with unique `SITE_SLUG`
- Built assets in `.next/`
- Public files
- Node modules

### Deployment Process

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Copy to deployment directory**:
   ```bash
   cp -r .next/ apps-linux/motorrace.com.au/
   cp -r public/ apps-linux/motorrace.com.au/
   cp -r src/ apps-linux/motorrace.com.au/
   ```

3. **Configure environment**:
   ```bash
   cd apps-linux/motorrace.com.au/
   echo "SITE_SLUG=mra" > .env.local
   echo "SITE_DOMAIN=https://motorrace.com.au" >> .env.local
   ```

4. **Start with PM2** (on server):
   ```bash
   pm2 start npm --name "mra" -- start
   ```

### Deployment Script

Use the provided deployment script:

```bash
node deploy-to-apps-linux.js
```

This script:
- Builds the application
- Copies files to specified site directory
- Updates environment variables
- Restarts the process

### Nginx Configuration

Each site needs its own nginx configuration:

```nginx
server {
    listen 80;
    server_name motorrace.com.au;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Troubleshooting

### Common Issues

#### 1. Site Configuration Not Loading

**Symptoms**: Default/incorrect branding appears

**Solutions**:
- Check `SITE_SLUG` in `.env.local`
- Verify Strapi API token is valid
- Check Strapi has site with matching slug
- Check network connectivity to Strapi URL
- Review browser console for API errors

**Debug Command**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://studio.raceready.com.au/api/sites?filters[slug][$eq]=mra"
```

#### 2. Images Not Loading

**Symptoms**: Broken image icons

**Solutions**:
- Verify image URLs in Strapi
- Check CDN is accessible
- Ensure `next.config.mjs` allows image domains
- Check public folder has logo files

**Configuration**:
```javascript
// next.config.mjs
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '**' },
    { protocol: 'http', hostname: '**' }
  ],
  unoptimized: true
}
```

#### 3. Build Errors

**Symptoms**: Build fails with TypeScript/ESLint errors

**Solutions**:
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for syntax errors in modified files
- Run linter: `npm run lint`

#### 4. Environment Variables Not Working

**Symptoms**: Configuration not loading, API calls failing

**Solutions**:
- Restart development server after changing `.env.local`
- Verify variable names match exactly
- Check no extra spaces in `.env.local`
- Ensure `.env.local` is in project root

#### 5. Multiple Sites Showing Same Content

**Symptoms**: All sites show identical content

**Solutions**:
- Verify each deployment has unique `SITE_SLUG`
- Check Strapi site entries have correct relationships
- Clear Next.js cache
- Verify API responses include site filtering

### Debug Mode

Enable debug output by setting:
```env
NODE_ENV=development
```

Access debug endpoints:
- `/api/debug/menu` - Current menu configuration
- `/api/debug/page` - Current page data

---

## Scripts & Utilities

### Data Management Scripts

#### `populate-strapi-data.js`
Populates Strapi with initial site data.

```bash
node populate-strapi-data.js
```

Creates:
- Site entries for all configured motorsport sites
- News articles with relationships
- Sample content and configurations

#### `populate-all-content.js`
Comprehensive content population for all sites.

```bash
node populate-all-content.js
```

#### `populate-three-sites.js`
Populates data for three specific test sites.

```bash
node populate-three-sites.js
```

#### `populate-clubman-only.js`
Specific script for Clubman Championship site.

```bash
node populate-clubman-only.js
```

### Site Management Scripts

#### `check-all-sites.js`
Verifies all site configurations and connectivity.

```bash
node check-all-sites.js
```

#### `fix-site-slugs.js`
Repairs incorrect site slugs in Strapi.

```bash
node fix-site-slugs.js
```

#### `verify-strapi-setup.js`
Tests Strapi connection and authentication.

```bash
node verify-strapi-setup.js
```

#### `test-strapi-connection.js`
Simple connectivity test to Strapi API.

```bash
node test-strapi-connection.js
```

### Strapi Schema Scripts

#### `add-guid-to-strapi.js`
Adds GUID field to Strapi schema for RaceReady integration.

```bash
node add-guid-to-strapi.js
```

#### `create-guid-field-in-strapi.js`
Alternative GUID field creation script.

```bash
node create-guid-field-in-strapi.js
```

### Deployment Scripts

#### `deploy-to-apps-linux.js`
Automated deployment to Linux apps directory.

```bash
node deploy-to-apps-linux.js --site=mra
```

### Testing Scripts

#### `auto-demo-kiosk.js`
Automated demo/kiosk mode for presentations.

```bash
node auto-demo-kiosk.js
```

### Package.json Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

---

## Best Practices

### Code Style

1. **Use Next.js Image Component**:
   ```javascript
   // Good
   import Image from 'next/image';
   <Image src="/logo.png" width={200} height={100} alt="Logo" />

   // Avoid
   <img src="/logo.png" alt="Logo" />
   ```

2. **Use Next.js Link Component**:
   ```javascript
   // Good
   import Link from 'next/link';
   <Link href="/events">Events</Link>

   // Avoid
   <a href="/events">Events</a>
   ```

3. **Use ConfigProvider for Site Data**:
   ```javascript
   // Good
   import { useConfig } from '@/context/ConfigProvider';
   const config = useConfig();

   // Avoid
   // Hardcoding site-specific values
   ```

4. **Component Organization**:
   - Keep components small and focused
   - Use descriptive file names
   - Group related components in directories
   - Export default for page components

5. **Styling**:
   - Use Tailwind CSS utility classes
   - Keep custom CSS in `globals.css`
   - Use CSS variables for theme colors
   - Follow mobile-first responsive design

### Performance

1. **Image Optimization**:
   - Use Next.js Image component
   - Specify width and height
   - Use appropriate image formats (WebP)
   - Lazy load images below the fold

2. **API Calls**:
   - Cache API responses when possible
   - Use static generation for public pages
   - Implement error boundaries
   - Handle loading states

3. **Bundle Size**:
   - Import only needed components
   - Use dynamic imports for heavy components
   - Minimize client-side JavaScript

### Security

1. **Environment Variables**:
   - Never commit `.env.local`
   - Use server-side API calls for sensitive data
   - Validate all user inputs
   - Sanitize data from external APIs

2. **API Tokens**:
   - Store tokens in environment variables
   - Rotate tokens regularly
   - Use read-only tokens when possible
   - Never expose tokens in client-side code

3. **Content Security**:
   - Validate data from Strapi
   - Sanitize rich text content
   - Implement proper error handling
   - Use HTTPS in production

### Multi-Tenant Considerations

1. **Site Isolation**:
   - Always filter content by site slug
   - Verify site relationships in Strapi
   - Test cross-site scenarios
   - Prevent data leakage between sites

2. **Configuration Management**:
   - Keep site configs in Strapi
   - Use local JSON as fallback only
   - Document configuration changes
   - Version control config changes

3. **Testing**:
   - Test each site individually
   - Verify shared content appears correctly
   - Check site-specific branding
   - Test mobile responsiveness per site

---

## Additional Resources

### Documentation Files

This project includes extensive documentation:

| File | Purpose |
|------|---------|
| `PROJECT_CHANGELOG.md` | Complete project history and accomplishments |
| `STRAPI_SETUP_GUIDE.md` | Setting up Strapi CMS |
| `STRAPI_SCHEMA_README.md` | Strapi schema documentation |
| `STRAPI_DATA_SETUP.md` | Data population guide |
| `STRAPI_GUID_QUICK_SETUP.md` | GUID field setup |
| `RACEREADY_INTEGRATION_COMPLETE.md` | RaceReady API integration |
| `PWA_SETUP_GUIDE.md` | Progressive Web App setup |
| `TESTING_GUIDE.md` | Testing procedures |
| `ERROR_HANDLING_GUIDE.md` | Error handling patterns |
| `KIOSK_MODE_README.md` | Kiosk/demo mode guide |
| `WHERE_TO_FIND_FIELDS.md` | Field location reference |

### Site-Specific Documentation

- `CLUBMAN_SETUP_README.md` - Clubman Championship specific setup
- `MULTI_SITE_TESTING_SUMMARY.md` - Multi-site testing results
- `EVENT_PAGES_REDESIGN_SUMMARY.md` - Event pages documentation
- `MOBILE_NAV_QUICK_GUIDE.md` - Mobile navigation guide
- `WEATHER_CALENDAR_IMPLEMENTATION_COMPLETE.md` - Weather & calendar features

### Configuration Files

- `MULTI_SITE_DATA.json` - Complete site configurations
- `site-color-configurations.json` - Color schemes
- `strapi-test-data.json` - Test data samples

### External Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Strapi Documentation**: https://docs.strapi.io
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Documentation**: https://react.dev

### Support

For questions or issues:
1. Check existing documentation files
2. Review git commit history for context
3. Check Strapi admin panel for configuration
4. Review browser console for errors
5. Test with different `SITE_SLUG` values

---

## Quick Reference

### Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint

# Populate Strapi data
node populate-strapi-data.js

# Check all sites
node check-all-sites.js

# Test Strapi connection
node test-strapi-connection.js
```

### Environment Variables Template

```env
# Site Configuration
SITE_SLUG=mra
SITE_DOMAIN=https://motorrace.com.au

# Strapi CMS
STRAPI_URL=https://studio.raceready.com.au
STRAPI_API_TOKEN=your-api-token-here
```

### File Locations Cheat Sheet

| What | Where |
|------|-------|
| Pages | `src/app/[page-name]/page.js` |
| Components | `src/components/` |
| Layouts | `src/components/layout/` |
| Configuration | `src/config/` |
| API Routes | `src/app/api/` |
| Styles | `src/app/globals.css` |
| Public Assets | `public/` |
| Logos | `public/Logo/` |
| Scripts | `*.js` in root directory |

### Key Concepts

- **SITE_SLUG**: Unique identifier for each racing website
- **Multi-Tenant**: One codebase serves multiple sites
- **Strapi**: Centralized CMS for all content
- **ConfigProvider**: React context for site configuration
- **RaceReady API**: External event data source
- **PWA**: Progressive Web App capabilities

---

## Conclusion

This handbook provides a comprehensive overview of the RaceReady Multi-Tenant Platform. The system is production-ready and powers 15+ motorsport websites from a single codebase.

Key takeaways:
- **One codebase, many sites**: Change `SITE_SLUG` to switch sites
- **Centralized content**: All managed in Strapi CMS
- **Well-documented**: Extensive documentation for all features
- **Production-tested**: Battle-tested on live racing websites
- **Scalable**: Easy to add new sites

For specific feature documentation, refer to the individual markdown files in the project root.

**Happy coding and good luck with the project!**

---

**Document Version**: 1.0
**Created**: November 30, 2025
**Author**: Development Team
**Project**: RaceReady Multi-Tenant Platform
