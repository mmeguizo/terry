# 🏁 Automated Demo/Kiosk Mode

This script automatically navigates through your motorsport website, scrolling through pages, clicking buttons, and demonstrating features every 10 minutes indefinitely.

## 🎯 Use Cases

- **Trade Show Displays** - Automated booth demonstrations
- **Kiosk Mode** - Public display terminals
- **Demo Videos** - Automated screen recording
- **Testing** - Continuous UI testing
- **Client Presentations** - Hands-free demos

---

## 🚀 Quick Start

### 1. Install Playwright (if not already installed)

```bash
npm install playwright
```

### 2. Start Your Site

Make sure your site is running:

```bash
npm run dev
```

### 3. Run the Kiosk Mode

In a new terminal:

```bash
node auto-demo-kiosk.js
```

### 4. Stop the Demo

Press `Ctrl+C` to stop the demo at any time.

---

## ⚙️ Configuration

Edit the `CONFIG` object in `auto-demo-kiosk.js`:

```javascript
const CONFIG = {
  url: 'http://localhost:3000',          // Your site URL
  cycleInterval: 10 * 60 * 1000,         // 10 minutes (in milliseconds)
  scrollSpeed: 1000,                      // Speed between scrolls (ms)
  scrollAmount: 300,                      // Pixels per scroll
  screenshotDir: './kiosk-screenshots',  // Screenshot directory
  headless: false,                        // false = visible browser, true = background
};
```

### Change Cycle Interval

```javascript
// 5 minutes
cycleInterval: 5 * 60 * 1000

// 15 minutes  
cycleInterval: 15 * 60 * 1000

// 1 hour
cycleInterval: 60 * 60 * 1000
```

### Run in Headless Mode

```javascript
headless: true  // Runs in background (no visible browser)
```

---

## 🎬 Demo Sequence

The script performs this sequence every cycle:

1. **Homepage Hero** (5s)
   - Scrolls to top
   - Shows countdown and event info

2. **Event Documents** (3s)
   - Scrolls to documents section
   - Hovers over document buttons

3. **Latest News** (3s)
   - Scrolls to news section
   - Hovers over news cards

4. **Sponsors** (5s)
   - Scrolls to sponsors
   - Watches sponsor animation

5. **Footer** (3s)
   - Scrolls to footer
   - Shows all footer links

6. **Websites Menu** (5s)
   - Opens websites network menu
   - Shows all network sites
   - Closes menu

7. **Privacy Policy** (6s)
   - Navigates to privacy page
   - Scrolls through content
   - Returns to homepage

8. **Terms & Conditions** (6s)
   - Navigates to terms page
   - Scrolls through content
   - Returns to homepage

9. **Contact Page** (5s)
   - Navigates to contact page
   - Hovers over form fields
   - Returns to homepage

10. **News Article** (6s)
    - Clicks first news article
    - Scrolls through article
    - Returns to homepage

**Total Duration:** ~47 seconds per sequence  
**Wait Time:** Remaining time until 10 minutes

---

## 🎨 Customization

### Add Your Own Steps

Edit the `DEMO_SEQUENCE` array:

```javascript
{
  name: 'My Custom Step',
  action: async (page) => {
    // Your custom actions
    await page.goto('http://localhost:3000/my-page');
    await wait(3000);
    await page.click('button.my-button');
  }
}
```

### Available Actions

```javascript
// Navigate
await page.goto('http://localhost:3000/page');

// Wait
await wait(5000); // 5 seconds

// Scroll
await smoothScrollTo(page, 500); // Scroll to 500px

// Click
await page.click('button.my-class');
await page.locator('text=Click Me').click();

// Hover
await page.hover('.my-element');
await page.locator('button').hover();

// Type
await page.fill('input[name="email"]', 'test@example.com');
await page.type('textarea', 'My message', { delay: 100 });

// Screenshot
await takeScreenshot(page, 'my-screenshot');
```

---

## 📸 Screenshots

To enable automatic screenshots, add to any step:

```javascript
{
  name: 'Homepage Screenshot',
  action: async (page) => {
    await page.goto(CONFIG.url);
    await wait(2000);
    await takeScreenshot(page, 'homepage');
  }
}
```

Screenshots save to: `./kiosk-screenshots/`

---

## 🖥️ Command Line Options

### Run in Background (Headless)

```bash
# Edit auto-demo-kiosk.js and set:
headless: true
```

### Different URL

```bash
# Edit auto-demo-kiosk.js and set:
url: 'http://localhost:3001'
# or
url: 'https://yoursite.com'
```

### Change Site (Multi-Tenant)

To demo different sites, change the `SITE_SLUG` in your `.env.local`:

```env
SITE_SLUG=raceready    # RaceReady site
SITE_SLUG=supertt      # SuperTT site
SITE_SLUG=mra          # MRA site
```

Then restart both your Next.js server and the kiosk script.

---

## 🔧 Troubleshooting

### Browser Doesn't Open

```bash
# Install Playwright browsers
npx playwright install chromium
```

### Site Not Loading

Make sure your dev server is running:
```bash
npm run dev
```

### Script Errors

Check that Playwright is installed:
```bash
npm list playwright
```

If not installed:
```bash
npm install playwright
```

### Memory Issues

If running for extended periods, restart the script every few hours:

```bash
# Linux/Mac - restart every 4 hours
while true; do
  timeout 14400 node auto-demo-kiosk.js
  echo "Restarting..."
  sleep 5
done
```

```powershell
# Windows PowerShell - restart every 4 hours
while($true) {
  Start-Process node -ArgumentList "auto-demo-kiosk.js" -Wait
  Start-Sleep -Seconds 5
}
```

---

## 🎥 Recording Demo Videos

### Option 1: Using Playwright Video

Edit `auto-demo-kiosk.js`:

```javascript
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: {
    dir: './videos/',
    size: { width: 1920, height: 1080 }
  }
});
```

### Option 2: Using OBS Studio

1. Install OBS Studio
2. Add "Window Capture" source
3. Select the Playwright browser window
4. Click "Start Recording"

### Option 3: Using Screen Recording Software

- **Windows**: Xbox Game Bar (Win+G)
- **Mac**: QuickTime Player
- **Linux**: SimpleScreenRecorder

---

## 📊 Monitoring

The script outputs progress in real-time:

```
🏁 Starting Automated Demo/Kiosk Mode
📍 URL: http://localhost:3000
⏱️  Cycle Interval: 10 minutes
🔄 Running indefinitely... Press Ctrl+C to stop

┌─────────────────────────────────────────────┐
│  🔄 CYCLE #1 - 10:30:15 AM                  │
└─────────────────────────────────────────────┘

▶️  Homepage Hero...
✅ Homepage Hero complete
▶️  Event Documents Section...
✅ Event Documents Section complete
...
✨ Cycle #1 completed in 47.3s
⏳ Waiting 9m 12s until next cycle...
```

---

## 🚀 Production Deployment

### For Public Kiosks

1. **Run in Kiosk Mode:**
   ```bash
   # Full screen, no browser UI
   chromium --kiosk --app=http://localhost:3000
   ```

2. **Auto-start on Boot:**
   
   **Windows:** Create a startup script
   
   **Linux:** Add to crontab
   ```bash
   @reboot cd /path/to/project && node auto-demo-kiosk.js
   ```

3. **Disable Sleep Mode:**
   - Windows: Power & Sleep settings
   - Linux: `xset s off -dpms`

### For Trade Shows

1. Connect laptop to display
2. Run in full screen mode
3. Disable screensaver
4. Set `cycleInterval` to 5-7 minutes for more engagement

---

## ✨ Advanced Features

### Multi-Site Rotation

To rotate between different sites every cycle:

```javascript
const SITES = ['raceready', 'supertt', 'mra', 'clubman'];
let currentSiteIndex = 0;

// Before each cycle, add:
CONFIG.url = `http://localhost:300${currentSiteIndex}`;
currentSiteIndex = (currentSiteIndex + 1) % SITES.length;
```

### Interactive Mode

Add mouse movements for more natural demo:

```javascript
await page.mouse.move(100, 100);
await page.mouse.move(500, 300, { steps: 10 }); // Smooth movement
```

### Random Navigation

Make the demo less predictable:

```javascript
// Shuffle demo sequence
DEMO_SEQUENCE.sort(() => Math.random() - 0.5);
```

---

## 📝 Example Configurations

### Quick Demo (2 minutes)
```javascript
cycleInterval: 2 * 60 * 1000
```

### Long Demo (30 minutes)
```javascript
cycleInterval: 30 * 60 * 1000
```

### Trade Show (5 minutes with screenshots)
```javascript
cycleInterval: 5 * 60 * 1000,
screenshotDir: './trade-show-captures',
// Add screenshots to each step
```

---

## 🆘 Support

If you encounter issues:

1. Check that Node.js is installed: `node --version`
2. Check that Playwright is installed: `npm list playwright`
3. Verify your site is running: Open browser to `http://localhost:3000`
4. Check console for error messages

---

## 📄 License

This kiosk mode script is part of the Motorsport Multi-Tenant CMS project.

---

**🏁 Happy Demoing!**

