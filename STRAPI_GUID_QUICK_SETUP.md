# Quick GUID Setup for Strapi - 5 Minutes ⚡

## Option 1: Manual Setup (Recommended for First Time)

### Step 1: Add Field to Strapi (2 minutes)

1. **Login to Strapi Admin**: `https://your-strapi-url.com/admin`

2. **Go to Content-Type Builder**:
   - Click "Content-Type Builder" in left menu
   - Click "Site" under "Collection Types"

3. **Add New Field**:
   - Click "+ Add another field"
   - Select "Text" (short text)
   - Name: `raceReadyGUID`
   - Advanced Settings:
     - Max length: 100
     - Default value: (leave empty)
     - Required: No
     - Unique: No
   - Click "Finish"
   - Click "Save"

4. **Restart Strapi** (if required)

### Step 2: Add GUID to Motor Racing Australia (1 minute)

1. **Go to Content Manager**:
   - Click "Content Manager" in left menu
   - Click "Sites" under "Collection Types"

2. **Edit Motor Racing Australia**:
   - Find the site with slug `motorrace`
   - Click to edit

3. **Add GUID**:
   - Scroll to find `raceReadyGUID` field
   - Paste: `84368220-881D-42A8-8B08-A38A4FE11A96`
   - Click "Save"
   - Click "Publish"

### Step 3: Test It Works (1 minute)

Restart your Next.js dev server:
```bash
npm run dev
```

Open in browser:
```
http://localhost:3000/api/raceready-events?view=next
```

**Expected**: You should see event data like:
```json
{
  "event_name": "2025 MRA State Championship - Round 2",
  "event_date": "4 April 2025 - 6 April 2025",
  "venue": {
    "name": "One Raceway - Wakefield Circuit"
  },
  "categories": [...]
}
```

**Homepage**: Countdown should now show real numbers instead of 00:00:00:00!

---

## Option 2: Script Setup (For Multiple Sites)

If you have multiple sites and want to update them all at once:

### Step 1: Get Your Strapi API Token

1. Login to Strapi Admin
2. Go to Settings → API Tokens
3. Click "Create new API Token"
4. Name: `GUID Setup`
5. Token type: `Full access`
6. Copy the token (you'll only see it once!)

### Step 2: Configure the Script

1. Open `add-guid-to-strapi.js`
2. Update at the top:
   ```javascript
   const STRAPI_URL = 'https://your-actual-strapi.com';
   const STRAPI_API_TOKEN = 'your-actual-token-here';
   ```

3. Add all your GUIDs from Google Sheet:
   ```javascript
   const SITE_GUIDS = {
     'motorrace': '84368220-881D-42A8-8B08-A38A4FE11A96',
     'supertt': 'YOUR-SUPERTT-GUID',
     'mx5cup': 'YOUR-MX5CUP-GUID',
     // ... etc
   };
   ```

### Step 3: Run the Script

```bash
node add-guid-to-strapi.js
```

**Expected output:**
```
🏁 Fetching all sites from Strapi...

Found 15 sites

✅ Updating Motor Racing Australia (motorrace)...
   GUID: 84368220-881D-42A8-8B08-A38A4FE11A96
   ✓ Success!

✅ Updating SuperTT Championship (supertt)...
   GUID: YOUR-SUPERTT-GUID
   ✓ Success!

🎉 All sites updated successfully!
```

---

## Option 3: Temporary Workaround (Testing Only)

If you just want to test RIGHT NOW without Strapi:

Create `.env.local` file in project root:
```env
RACEREADY_GUID=84368220-881D-42A8-8B08-A38A4FE11A96
```

Restart dev server:
```bash
npm run dev
```

This will work, but **only for one site at a time**. For multi-tenant, you need to add GUIDs to Strapi.

---

## Troubleshooting

### "Field raceReadyGUID not found"
**Solution**: You need to add the field to Strapi first (Option 1, Step 1)

### "403 Forbidden"
**Solution**: Your API token doesn't have permission. Create a new "Full access" token.

### "Site not found"
**Solution**: Check your slug matches exactly (case-sensitive)

### Still showing 00:00:00:00
**Solution**: 
1. Check browser console for errors
2. Test API: `http://localhost:3000/api/raceready-events?view=next`
3. Make sure you restarted the dev server after adding GUID

---

## What Each Site Needs

From your Google Sheet, you need the GUID for each site:

| Site Slug | Domain | GUID |
|-----------|--------|------|
| `motorrace` | motorrace.com.au | `84368220-881D-42A8-8B08-A38A4FE11A96` |
| `supertt` | supertt.com.au | (from Google Sheet) |
| `mx5cup` | mx5cup.com.au | (from Google Sheet) |
| `clubmanchampionship` | clubmanchampionship.com.au | (from Google Sheet) |
| ... | ... | ... |

---

## After Setup

Once GUIDs are added, your site will:

✅ **Homepage**: Display real event name, location, and countdown  
✅ **Events Page**: List all events from RaceReady  
✅ **Event Details**: Full event info with entries, schedule, documents  
✅ **"Enter Now" Buttons**: Appear when entries are open  

---

## Quick Start (Fastest Way)

**For immediate testing on Motor Racing Australia site:**

1. Login to Strapi Admin
2. Content Manager → Sites → Edit "Motor Racing Australia"
3. Find `raceReadyGUID` field (if not there, add it first via Content-Type Builder)
4. Paste: `84368220-881D-42A8-8B08-A38A4FE11A96`
5. Save & Publish
6. Restart Next.js: `npm run dev`
7. Refresh homepage

**Done! 🎉** Your countdown should now show real data!

---

**Time to complete**: 5 minutes  
**Difficulty**: Easy  
**Result**: Working RaceReady integration with live event data

