# Route Conflict Fix - [id] vs [slug]

## Issue
Next.js error: `You cannot use different slug names for the same dynamic path ('id' !== 'slug')`

## Cause
Two conflicting dynamic routes existed in the same path:
- `src/app/event/[id]/page.js` (old route using event IDs)
- `src/app/event/[slug]/page.js` (new route using event slugs)

Next.js doesn't allow different dynamic parameter names in the same path.

## Solution

### Removed
- ❌ `src/app/event/[id]/page.js`
- ❌ `src/app/event/[id]/loading.js`

### Kept & Enhanced
- ✅ `src/app/event/[slug]/page.js` - Now handles both slugs and IDs
- ✅ `src/app/event/[slug]/loading.js` - Added loading state

## Backward Compatibility

The new `[slug]` route maintains backward compatibility by:

1. **Primary Method**: Fetches from `/api/raceready-events?view=event&event={slug}`
2. **Fallback Method**: If primary fails, tries old RaceReady API directly with ID
3. **Data Transformation**: Converts old API format to new expected format

### Code Addition
```javascript
// Fallback: try old API endpoint if new one fails (for backward compatibility with IDs)
if (!event) {
  try {
    const oldApiUrl = `https://raceready.com.au/api/event/?eventid=${encodeURIComponent(slug)}`;
    const res = await fetch(oldApiUrl, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      // Transform to match expected format
      event = {
        id: data.id || data.eventid,
        slug: data.slug || slug,
        // ... more transformations
      };
    }
  } catch (error) {
    console.error('Failed to fetch from fallback API:', error);
  }
}
```

## URLs Supported

Both of these now work with the same route:

- ✅ `/event/2025-round-1` (slug)
- ✅ `/event/1389` (legacy ID)
- ✅ `/event/any-event-identifier`

## Testing

To verify the fix:

```bash
# Dev server should now start without errors
npm run dev
```

Expected output:
```
✓ Compiled middleware in 123ms
✓ Ready in 2.5s
```

## Benefits

1. **Single Route**: Simplified routing structure
2. **Backward Compatible**: Existing ID-based URLs still work
3. **Future Proof**: Primary method uses new GUID-based API
4. **Graceful Fallback**: Multiple layers of fallback for reliability
5. **No Breaking Changes**: Old links continue to function

## Related Files

- `src/app/event/[slug]/page.js` - Main event detail page
- `src/app/event/[slug]/loading.js` - Loading skeleton
- `src/app/api/raceready-events/route.js` - New API endpoint
- `src/app/events/page.js` - Links to event detail pages

---

**Status**: ✅ Fixed  
**Date**: October 29, 2025

