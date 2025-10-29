# Add raceReadyGUID Field to Strapi - 2 Minutes ⚡

## The Error You're Seeing

```
❌ Failed: 400 - Invalid key raceReadyGUID
```

**This means**: The `raceReadyGUID` field doesn't exist in your Strapi Site content type yet.

---

## Quick Fix (2 Minutes)

### Step 1: Login to Strapi Admin
Open: `https://studio.raceready.com.au/admin`

### Step 2: Open Content-Type Builder
1. Click **"Content-Type Builder"** in the left sidebar
2. Under **"COLLECTION TYPES"**, find and click **"Site"**

### Step 3: Add New Field
1. Click the **"+ Add another field to this collection type"** button
2. Select **"Text"** (short text field)
3. In the "Name" field, type: `raceReadyGUID`
4. Click **"Add another field"** (optional settings):
   - Type: Text
   - Name: `raceReadyGUID`
   - **Advanced Settings** tab:
     - Max length: `100`
     - Private field: `No` (unchecked)
     - Required field: `No` (unchecked)
     - Unique field: `No` (unchecked)
5. Click **"Finish"**
6. Click **"Save"** (top right corner)

### Step 4: Wait for Strapi to Restart
Strapi will automatically restart (takes ~30 seconds)

You'll see a message: "Waiting for restart..."

### Step 5: Run the Script Again
Once Strapi has restarted, run:
```bash
node add-guid-to-strapi.js
```

Now you should see:
```
✅ Updating MRA - Motor Racing Australia (mra)...
   GUID: 84368220-881D-42A8-8B08-A38A4FE11A96
   ✓ Success!
```

### Step 6: Restart Your Next.js Dev Server
```bash
npm run dev
```

### Step 7: Test It!
Open: `http://localhost:3000`

**You should now see**:
- ✅ Real event name in hero
- ✅ Real countdown numbers (not 00:00:00:00)
- ✅ Real venue/location

---

## Visual Guide

```
Strapi Admin
├── Content-Type Builder (left sidebar)
│   └── COLLECTION TYPES
│       └── Site (click this)
│           └── + Add another field (click this)
│               └── Text (select this)
│                   └── Name: raceReadyGUID
│                   └── Finish → Save
│
└── Wait for restart... (automatic)
```

---

## Alternative: Manual Entry (If Script Still Fails)

If the script doesn't work after adding the field, you can add the GUID manually:

1. **Content Manager** (left sidebar)
2. Click **"Site"** under Collection Types
3. Find **"MRA - Motor Racing Australia"**
4. Click to edit
5. Scroll down to find **"raceReadyGUID"** field
6. Paste: `84368220-881D-42A8-8B08-A38A4FE11A96`
7. Click **"Save"**
8. Click **"Publish"**

Done! Restart Next.js and test.

---

## Troubleshooting

### "I don't see Content-Type Builder"
**Solution**: You need admin permissions. Login with an admin account.

### "Save button is disabled"
**Solution**: The field name might be invalid. Make sure it's exactly: `raceReadyGUID` (case-sensitive, no spaces)

### "Strapi won't restart"
**Solution**: 
1. Check Strapi logs for errors
2. Try manually restarting Strapi
3. Or just add the field and the GUID manually (see Alternative above)

---

## What Happens After This

Once the field is added and GUID is set:

✅ Homepage will load real event data from RaceReady API  
✅ Countdown will show actual time remaining  
✅ Event name, venue, and date will be real  
✅ Events page will list all RaceReady events  
✅ Event detail pages will show full info  

**You only need to do this ONCE** - then you can use the script to add GUIDs to all other sites!

---

**Time**: 2 minutes  
**Difficulty**: Easy  
**Result**: Working RaceReady integration! 🏁


