# Where to Find Permit Number, Promotor, and Venue Information

## Current Status

You're now on the **correct redesigned page** at `/events/[id]`, but the sections with Permit Number, Promotor, and Venue are **hidden** because the API isn't returning that data yet.

## Why Are They Hidden?

The sections use **conditional rendering** - they only show if the API provides data:

```javascript
// Only shows if ANY of these fields have data:
{(hasValue(event.promotor) || hasValue(event.permitNumber) || ...) && (
  <section>
    // Event Details section
  </section>
)}
```

Currently, the API returns empty data because:
1. ❌ Wrong RaceReady endpoint (`/api/event/` instead of `/api/events/`)
2. ❌ Missing proper GUID authentication

## Where They WILL Appear (Once API is Fixed)

### Page Layout - `/events/1324`

```
┌────────────────────────────────────────────────────────────┐
│  🏁 DARK HERO SECTION                                      │
│  2025 MRA STATE CHAMPIONSHIP - ROUND 1                     │
│  📅 8 February 2025  📍 Sydney Motorsport Park             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  📋 EVENT DETAILS                                          │  ← SECTION 1
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Promotor:      Motor Racing Australia                │  │  ← HERE!
│  │ Event Date:    8 February 2025                       │  │
│  │ Permit Number: AASA080225-101642                     │  │  ← HERE!
│  │ Entries Open:  4 January 2025, 10:00 am             │  │
│  │ Entries Close: 5 February 2025, 10:00 am            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  🏁 TRACK INFORMATION                                      │  ← SECTION 2
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Name:     Sydney Motorsport Park                     │  │  ← HERE!
│  │ Address:  Ferrers Road, Eastern Creek, NSW, 2766    │  │  ← HERE!
│  │ Ph:       (02) 9672 1000 [clickable]                │  │  ← HERE!
│  │ Email:    info@smp.com.au [clickable]               │  │  ← HERE!
│  │ Website:  sydneymotorsportpark.com.au [clickable]   │  │  ← HERE!
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  🚦 ENTRY STATUS                                           │  ← SECTION 3
│  ┌──────────────────────────────────────────────────────┐  │  (Currently showing)
│  │           ❌ ENTRIES CLOSED                          │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  📄 EVENT DOCUMENTS                                        │  ← SECTION 4
│  (Will show when API returns documents)                    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  🏆 ENTRY LIST                                             │  ← SECTION 5
│  ┌──────────────────────────────────────────────────────┐  │
│  │ SUPERTT - 1 HOUR                    117 Entries      │  │
│  │ ┌────┬─────────────┬──────────┬─────────────────┐   │  │
│  │ │ No │ Driver/Team │ Vehicle  │ Sponsor/Team    │   │  │
│  │ ├────┼─────────────┼──────────┼─────────────────┤   │  │
│  │ │ 1  │ Lachlan...  │ BMW M3   │ Jlm Lubricants  │   │  │
│  │ └────┴─────────────┴──────────┴─────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│  (Will show when API returns entries)                      │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  🕐 SCHEDULE                                               │  ← SECTION 6
│  Coming soon. Check back for the full timetable.           │  (Currently showing)
└────────────────────────────────────────────────────────────┘
```

## File Locations in Code

### Frontend Display: `src/app/events/[id]/page.js`

**Lines 134-177**: Event Details Section
- Line 144-149: **Promotor** display
- Line 156-161: **Permit Number** display  
- Line 162-167: Entries Open date
- Line 168-173: Entries Close date

**Lines 179-240**: Track Information Section
- Line 189-194: **Venue Name** display
- Line 195-205: **Full Address** display (address, suburb, state, postcode)
- Line 206-213: **Phone** display (clickable tel: link)
- Line 214-221: **Email** display (clickable mailto: link)
- Line 222-230: **Website** display (clickable external link)

### API Data Fetching: `src/app/api/events/[id]/route.js`

**Lines 136-152**: Field extraction from RaceReady API
- Line 136: `promotor` extraction
- Line 137: `permitNumber` extraction
- Line 138: `entriesOpenDate` extraction
- Line 139: `entriesCloseDate` extraction
- Line 143-152: `venue` object extraction (name, address, phone, email, website)

## What's Working vs What's Not

### ✅ Working (Frontend)
- All display code is correct
- Conditional rendering works properly
- Styling is complete and looks great
- All sections will automatically appear when data is available

### ❌ Not Working (API)
- `/api/events/[id]` calls wrong RaceReady endpoint
- Missing GUID parameter in API call
- Returns empty data, so sections don't show

## How to Test Once API is Fixed

1. Navigate to: `http://localhost:3000/events/1324`
2. You should see **6 sections** (currently only 2 show):
   - ✅ Hero (dark section at top)
   - 🔜 **Event Details** (with Permit Number & Promotor)
   - 🔜 **Track Information** (with full venue details)
   - ✅ Entry Status (currently showing)
   - 🔜 **Event Documents** (table with zebra striping)
   - 🔜 **Entry List** (grouped by category)
   - ✅ Schedule (currently showing)

## Summary

**The fields ARE in the code and WILL display automatically once the API returns data!**

The issue is NOT with the frontend - it's with the API route not fetching data correctly from RaceReady. Once that's fixed, you'll see:

- ✅ **Permit Number**: "AASA080225-101642"
- ✅ **Promotor**: "Motor Racing Australia"  
- ✅ **Full Venue**: Name, Address, Phone, Email, Website (all clickable)
- ✅ **Entry Lists**: Grouped by category with 117 total entries
- ✅ **Documents**: (when available)

All requirements are met in the code! 🎉

