# Countdown Showing 00:00:00:00 - Debug Guide

## Why It's Showing Zeros

The countdown is showing `00:00:00:00` because it can't find a valid event date. Here's the cascade:

### Data Flow
```
1. Try RaceReady API (/api/raceready-events?view=next)
   ↓ FAILS (no GUID or API error)
   
2. Fall back to Strapi config (config.hero.eventDate)
   ↓ PROBABLY EMPTY or INVALID DATE
   
3. Show 00:00:00:00 (default)
```

## How to Fix

### Option 1: Add GUID to Strapi (Recommended)

1. **Open Strapi Admin** (`http://your-strapi-url/admin`)

2. **Add `raceReadyGUID` field to Site content type**:
   - Go to Content-Type Builder
   - Select "Site"
   - Add new field: `raceReadyGUID` (Text, short)
   - Save and restart Strapi

3. **Add GUID to your site**:
   - Go to Content Manager → Sites
   - Edit your site (e.g., Motor Racing Australia)
   - Add GUID: `84368220-881D-42A8-8B08-A38A4FE11A96`
   - Save

4. **Restart Next.js** and check browser console for:
   ```
   ✅ Next event loaded from RaceReady: {name: "...", startDate: "..."}
   ```

### Option 2: Use Environment Variable (Quick Test)

Add to `.env.local`:
```env
RACEREADY_GUID=84368220-881D-42A8-8B08-A38A4FE11A96
```

Restart dev server:
```bash
npm run dev
```

### Option 3: Add Manual Event Date to Strapi (Fallback)

1. **Open Strapi Admin**
2. **Go to your Site entry**
3. **In Hero section**, add:
   - `eventDate`: `2025-03-15T10:00:00Z` (future date in ISO format)
   - `eventName`: `Test Event`
   - `eventLocation`: `Test Track`

4. **Save and restart Next.js**

## Debug Steps

### 1. Check Browser Console

Open DevTools Console and look for:

**✅ Success:**
```
✅ Next event loaded from RaceReady: {
  name: "Event Name",
  startDate: "2025-03-15T10:00:00Z",
  location: "Track Name"
}
```

**❌ Failure:**
```
Failed to fetch next event from RaceReady: Error...
```

### 2. Test API Directly

Open in browser:
```
http://localhost:3000/api/raceready-events?view=next
```

**Expected (Success):**
```json
{
  "id": "...",
  "name": "Event Name",
  "startDate": "2025-03-15T10:00:00Z",
  "location": "Track",
  ...
}
```

**Expected (No GUID):**
```json
{
  "error": "RaceReady GUID not configured for this site"
}
```

### 3. Check Config API

Open in browser:
```
http://localhost:3000/api/config
```

Look for:
```json
{
  "raceReadyGUID": "84368220-...",  // Should have this
  "hero": {
    "eventDate": "2025-03-15...",   // Or this
    "eventName": "...",
    ...
  }
}
```

## Common Issues & Solutions

### Issue: API returns "GUID not configured"

**Cause**: No GUID in Strapi or .env

**Solution**:
```env
# Add to .env.local
RACEREADY_GUID=84368220-881D-42A8-8B08-A38A4FE11A96
```

### Issue: API returns empty data

**Cause**: 
- GUID is wrong
- No events in RaceReady for that GUID

**Solution**:
1. Verify GUID is correct from Google Sheet
2. Test directly: `https://raceready.com.au/api/events/?GUID=YOUR-GUID&view=next`

### Issue: Date is in the past

**Cause**: Event date has already passed

**Solution**: Countdown shows 00:00:00:00 for past dates (by design)

**To test**: Use a future date in Strapi hero.eventDate

### Issue: "Failed to fetch" in console

**Cause**: API route error

**Solution**:
1. Check terminal for errors
2. Restart dev server
3. Check `/api/raceready-events` exists

## Quick Test Commands

### Test RaceReady API Directly
```bash
# PowerShell
curl http://localhost:3000/api/raceready-events?view=next

# Or in browser
http://localhost:3000/api/raceready-events?view=next
```

### Check Config
```bash
curl http://localhost:3000/api/config
```

### Test External RaceReady API
```bash
curl "https://raceready.com.au/api/events/?GUID=84368220-881D-42A8-8B08-A38A4FE11A96&view=next"
```

## Expected Timeline

Once fixed, you should see:

**Homepage Hero:**
- ✅ Real event name from RaceReady
- ✅ Real location from RaceReady
- ✅ Live countdown to event date
- ✅ Event image as background

**Browser Console:**
```
✅ Next event loaded from RaceReady: {...}
```

**Countdown:**
```
11 DAYS  11 HOURS  23 MINS  45 SECS
```

## Need More Help?

1. **Share browser console output** - Any errors?
2. **Test API endpoint** - What does `/api/raceready-events?view=next` return?
3. **Check .env.local** - Is `RACEREADY_GUID` set?
4. **Verify Strapi** - Does the GUID field exist and have a value?

---

**Remember**: The countdown works perfectly - it just needs valid event data from either:
- ✅ RaceReady API (with GUID) - **Preferred**
- ✅ Strapi hero.eventDate - **Fallback**

Without either, it defaults to `00:00:00:00` ✨

