/**
 * Automated Demo/Kiosk Mode for Motorsport CMS
 * 
 * This script automatically navigates through the website,
 * scrolling, clicking buttons, and changing pages every 10 minutes.
 * Perfect for demo displays, kiosks, or testing.
 * 
 * Usage: node auto-demo-kiosk.js
 */

const { chromium } = require('playwright');

// Configuration
const CONFIG = {
  url: 'http://localhost:3000',
  cycleInterval: 10 * 60 * 1000, // 10 minutes in milliseconds
  scrollSpeed: 1000, // milliseconds between scrolls
  scrollAmount: 300, // pixels to scroll each time
  screenshotDir: './kiosk-screenshots',
  headless: false, // Set to true for headless mode
};

// Demo sequence - defines what to do in each cycle
const DEMO_SEQUENCE = [
  {
    name: 'Homepage Hero',
    action: async (page) => {
      await page.goto(CONFIG.url);
      await page.waitForLoadState('networkidle');
      await smoothScrollTo(page, 0);
      await wait(5000); // Stay on hero for 5 seconds
    }
  },
  {
    name: 'Event Documents Section',
    action: async (page) => {
      await smoothScrollTo(page, 800);
      await wait(3000);
      // Hover over document buttons
      const docButtons = await page.locator('a[href*="documents"]').all();
      for (const button of docButtons.slice(0, 3)) {
        await button.hover();
        await wait(1000);
      }
    }
  },
  {
    name: 'Latest News Section',
    action: async (page) => {
      await smoothScrollTo(page, 1500);
      await wait(3000);
      // Hover over news cards
      const newsCards = await page.locator('a[href*="/news/"]').all();
      for (const card of newsCards.slice(0, 3)) {
        await card.hover();
        await wait(1000);
      }
    }
  },
  {
    name: 'Sponsors Section',
    action: async (page) => {
      await smoothScrollTo(page, 2500);
      await wait(5000); // Watch sponsors scroll
    }
  },
  {
    name: 'Footer',
    action: async (page) => {
      await smoothScrollTo(page, 3500);
      await wait(3000);
    }
  },
  {
    name: 'Open Websites Menu',
    action: async (page) => {
      await smoothScrollTo(page, 0);
      const websitesBtn = page.locator('button:has-text("Websites")');
      await websitesBtn.click();
      await wait(5000); // Show websites menu
      
      // Close menu
      const closeBtn = page.locator('button:has-text("Close websites menu")');
      await closeBtn.click();
      await wait(1000);
    }
  },
  {
    name: 'Privacy Policy Page',
    action: async (page) => {
      await page.goto(`${CONFIG.url}/privacy`);
      await page.waitForLoadState('networkidle');
      await smoothScrollTo(page, 0);
      await wait(2000);
      
      // Scroll through privacy policy
      await smoothScrollTo(page, 1000);
      await wait(2000);
      await smoothScrollTo(page, 2000);
      await wait(2000);
      
      // Go back to home
      const backBtn = page.locator('a:has-text("Back to Home")').first();
      await backBtn.click();
      await wait(1000);
    }
  },
  {
    name: 'Terms & Conditions Page',
    action: async (page) => {
      await page.goto(`${CONFIG.url}/terms`);
      await page.waitForLoadState('networkidle');
      await smoothScrollTo(page, 0);
      await wait(2000);
      
      // Scroll through terms
      await smoothScrollTo(page, 1500);
      await wait(2000);
      await smoothScrollTo(page, 3000);
      await wait(2000);
      
      // Go back to home
      const backBtn = page.locator('a:has-text("Back to Home")').first();
      await backBtn.click();
      await wait(1000);
    }
  },
  {
    name: 'Contact Page',
    action: async (page) => {
      await page.goto(`${CONFIG.url}/contact`);
      await page.waitForLoadState('networkidle');
      await smoothScrollTo(page, 0);
      await wait(3000);
      
      // Interact with form (hover over fields)
      await page.locator('input[name="name"]').hover();
      await wait(500);
      await page.locator('input[name="email"]').hover();
      await wait(500);
      await page.locator('select[name="subject"]').hover();
      await wait(500);
      
      await smoothScrollTo(page, 500);
      await wait(2000);
      
      // Go back to home
      const backBtn = page.locator('a:has-text("Back to Home")');
      await backBtn.click();
      await wait(1000);
    }
  },
  {
    name: 'News Article Page',
    action: async (page) => {
      // Click on first news article
      await page.goto(CONFIG.url);
      await page.waitForLoadState('networkidle');
      await smoothScrollTo(page, 1500);
      await wait(1000);
      
      const firstNews = page.locator('a[href*="/news/"]').first();
      await firstNews.click();
      await page.waitForLoadState('networkidle');
      
      await smoothScrollTo(page, 0);
      await wait(3000);
      
      // Scroll through article
      await smoothScrollTo(page, 800);
      await wait(2000);
      
      // Go back to news
      const backBtn = page.locator('a:has-text("Back to News")');
      await backBtn.click();
      await wait(1000);
    }
  },
];

// Helper functions
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function smoothScrollTo(page, targetY) {
  await page.evaluate((target) => {
    window.scrollTo({
      top: target,
      behavior: 'smooth'
    });
  }, targetY);
  await wait(1000); // Wait for scroll animation
}

async function takeScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${CONFIG.screenshotDir}/${timestamp}_${name}.png`;
  await page.screenshot({ path: filename, fullPage: false });
  console.log(`📸 Screenshot saved: ${filename}`);
}

// Main demo loop
async function runDemoLoop() {
  console.log('\n🏁 Starting Automated Demo/Kiosk Mode');
  console.log(`📍 URL: ${CONFIG.url}`);
  console.log(`⏱️  Cycle Interval: ${CONFIG.cycleInterval / 1000 / 60} minutes`);
  console.log(`🔄 Running indefinitely... Press Ctrl+C to stop\n`);

  const browser = await chromium.launch({
    headless: CONFIG.headless,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  let cycleCount = 0;

  // Run forever
  while (true) {
    cycleCount++;
    const cycleStartTime = Date.now();
    
    console.log(`\n┌─────────────────────────────────────────────┐`);
    console.log(`│  🔄 CYCLE #${cycleCount} - ${new Date().toLocaleTimeString()}  │`);
    console.log(`└─────────────────────────────────────────────┘\n`);

    for (const step of DEMO_SEQUENCE) {
      try {
        console.log(`▶️  ${step.name}...`);
        await step.action(page);
        console.log(`✅ ${step.name} complete`);
      } catch (error) {
        console.error(`❌ Error in ${step.name}:`, error.message);
        // Continue to next step even if one fails
      }
    }

    const cycleEndTime = Date.now();
    const cycleDuration = cycleEndTime - cycleStartTime;
    const remainingTime = CONFIG.cycleInterval - cycleDuration;

    console.log(`\n✨ Cycle #${cycleCount} completed in ${(cycleDuration / 1000).toFixed(1)}s`);
    
    if (remainingTime > 0) {
      const waitMinutes = Math.floor(remainingTime / 60000);
      const waitSeconds = Math.floor((remainingTime % 60000) / 1000);
      console.log(`⏳ Waiting ${waitMinutes}m ${waitSeconds}s until next cycle...`);
      await wait(remainingTime);
    } else {
      console.log(`⚠️  Cycle took longer than interval, starting next cycle immediately`);
    }
  }

  // This code is unreachable but kept for completeness
  // await browser.close();
}

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down demo mode...');
  process.exit(0);
});

// Error handler
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Start the demo
runDemoLoop().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

