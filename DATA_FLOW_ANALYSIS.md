# Data Flow Analysis - Events API

## Problem Discovered

The `/api/events/[id]` route was calling the wrong RaceReady API endpoint and not including the required GUID parameter, resulting in empty data.

## Data Flow Comparison

### ❌ Current (Broken) Flow
```
Frontend → /api/events/21
         → https://raceready.com.au/api/event/?eventid=21 (NO GUID)
         → Returns: Empty/Invalid JSON
```

### ✅ Working Flow  
```
Frontend → /api/raceready-events?view=event&event=1324
         → https://raceready.com.au/api/events/?GUID=xxx&view=event&event=1324
         → Returns: Full event data with ALL fields
```

## RaceReady API Response Structure

When called correctly with GUID, the RaceReady API returns:

```json
{
  "name": "2025 MRA State Championship - Round 1",
  "title": "2025 MRA State Championship - Round 1",
  "location": "Sydney Motorsport Park",
  "permit_number": "AASA080225-101642",  ← PERMIT NUMBER EXISTS!
  "entries_open_date": "2025-01-04T10:00:00",
  "entries_close_date": "2025-02-05T10:00:00",
  "event_status": "past",
  "entry_link": "https://raceready.app/entry/mra/smp/?id=1324",
  
  "venue": {
    "name": "Sydney Motorsport Park",
    "track": "Sydney Motorsport Park",
    "address": "Ferrers Road",
    "suburb": "Eastern Creek",
    "state": "NSW",
    "postcode": "2766",
    "phone": "(02) 9672 1000",
    "website": "https://www.sydneymotorsportpark.com.au/"
  },
  
  "promotor": [{
    "name": "Motor Racing Australia",
    "abn": "49 134 304 822",
    "address": "PO Box 404, St Clair, NSW 2759",
    "phone": "1300885274",
    "email": "events@motorrace.com.au",
    "website": "https://motorrace.com.au"
  }],
  
  "categories": [
    {
      "ID": 5566,
      "Name": "SuperTT - 1 Hour",
      "Fee": 520,
      "entries": [
        {
          "racenumber": 1,
          "name": "Lachlan McBrien (O2T)",
          "sponsor": "Jlm Lubricants",
          "vehicle": "BMW M3"
        },
        // ... more entries
      ]
    },
    // ... more categories
  ]
}
```

## All Required Fields Are Available! ✅

The RaceReady API provides ALL the fields we need:

1. ✅ **Permit Number**: `permit_number`
2. ✅ **Promotor**: `promotor` array with full details
3. ✅ **Event Dates**: `entries_open_date`, `entries_close_date`
4. ✅ **Venue Details**: Full `venue` object with address, phone, email, website
5. ✅ **Entry Status**: `event_status`
6. ✅ **Entry Link**: `entry_link`
7. ✅ **Categories with Entries**: Properly grouped by category
8. ✅ **Documents**: (when available)

## Solution

The `/api/events/[id]` route needs to be updated to:

1. **Use the correct RaceReady API endpoint**: `/api/events/` (not `/api/event/`)
2. **Include GUID parameter**: Required for authentication
3. **Use proper parameters**: `GUID`, `view=event`, `event=ID`

OR

Simply redirect to use the existing `/api/raceready-events` route which already works correctly.

## Field Mapping

The normalizer in `/api/events/[id]/route.js` already checks for these field names:

```javascript
// Current field mappings (CORRECT)
permitNumber: root?.event_permit_number || root?.permitNumber || root?.permit_number || root?.PermitNumber
entriesOpenDate: root?.event_entries_open || root?.entries_open_date || root?.entriesOpenDate
entriesCloseDate: root?.event_entries_close || root?.entries_close_date || root?.entriesCloseDate
promotor: root?.promotor || root?.promoter || root?.Promotor || root?.Promoter
```

These mappings are correct! The issue was just that the API wasn't returning data because:
1. Wrong endpoint (`/api/event/` vs `/api/events/`)
2. Missing GUID parameter

## Conclusion

**All requirements CAN be met!** The data exists in the RaceReady API. We just need to:
1. Fix the API endpoint URL
2. Add the GUID parameter  
3. Use the correct event ID format (numeric ID like `1324`, not slug like `2025-round-1`)

Once fixed, the frontend will receive all the data and display:
- ✅ Permit Number
- ✅ Promotor
- ✅ Entries Open/Close dates
- ✅ Full venue information
- ✅ Entry lists grouped by category
- ✅ All other required fields

