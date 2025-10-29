# Testing Guide - RaceReady Integration

## Quick Start Testing

### 1. Prerequisites

Before testing, ensure:
- ✅ Strapi is running with the `raceReadyGUID` field added to Site content type
- ✅ GUIDs are configured for each site in Strapi
- ✅ Next.js development server is running (`npm run dev`)

### 2. Test Sequence

#### Test 1: Homepage Hero Section
**URL**: `http://localhost:3000/`

**What to check:**
- ✅ Countdown displays with clean, minimal dark boxes
- ✅ Numbers are smaller (text-4xl instead of text-6xl)
- ✅ No hover effects or decorations
- ✅ Event name, location, and date are displayed
- ✅ Data loads from RaceReady API (check browser console for "✅ Next event loaded")

**Expected Console Output:**
```
✅ Next event loaded from RaceReady: {name: "...", location: "...", ...}
```

#### Test 2: Events List Page
**URL**: `http://localhost:3000/events`

**What to check:**
- ✅ Events load from RaceReady API
- ✅ Event cards display with images
- ✅ "Enter Now" badge appears for events with `event_status === 'entries-open'`
- ✅ Clicking an event navigates to `/event/[slug]`

**Expected Behavior:**
- Events grid with 2-3 columns
- Green "Enter Now" badge on applicable events
- Smooth navigation to detail pages

#### Test 3: Event Detail Page
**URL**: `http://localhost:3000/event/2025-round-1`

**What to check:**
- ✅ Hero section with event image
- ✅ Event name, location, and date display
- ✅ Event description renders
- ✅ Session schedule displays (if available)
- ✅ Entry list table shows (if available)
- ✅ Sidebar with documents, weather, track map
- ✅ "Enter Now" button appears when entries open

**Expected Layout:**
```
┌─────────────────────────────────────┐
│  Hero Image with Event Info         │
├─────────────────┬───────────────────┤
│  Description    │  Enter Now Button │
│  Schedule       │  Documents        │
│  Entry List     │  Weather          │
│                 │  Track Map        │
└─────────────────┴───────────────────┘
```

#### Test 4: Typography & Spacing
**Check these elements:**

**Header Navigation:**
- ✅ Desktop menu items are smaller (text-sm)
- ✅ Mobile menu items are smaller (text-base)
- ✅ Reduced padding throughout

**Event Documents Section:**
- ✅ Section padding reduced (py-12 instead of py-20)
- ✅ Document cards are more compact
- ✅ Text is smaller (text-xs instead of text-sm)

**Hero Countdown:**
- ✅ Dark boxes (bg-black/60)
- ✅ Minimal padding
- ✅ No decorative elements
- ✅ Smaller font sizes

#### Test 5: Video Background (if configured)
**URL**: `http://localhost:3000/`

**What to check:**
- ✅ Video plays automatically
- ✅ Video is muted
- ✅ Video loops continuously
- ✅ Image shows as poster until video loads
- ✅ Falls back to image if no video configured

### 3. API Testing

#### Test API Endpoints Directly

**Next Event:**
```bash
curl http://localhost:3000/api/raceready-events?view=next
```

**All Events:**
```bash
curl http://localhost:3000/api/raceready-events?view=events
```

**Specific Event:**
```bash
curl http://localhost:3000/api/raceready-events?view=event&event=2025-round-1
```

**Expected Response Format:**
```json
{
  "id": "...",
  "slug": "2025-round-1",
  "name": "Event Name",
  "location": "Track Name",
  "startDate": "2025-03-15",
  "endDate": "2025-03-17",
  "event_status": "entries-open",
  "entries_open": true,
  "description": "...",
  "sessions": [...],
  "entries": [...],
  "documents": [...]
}
```

### 4. Error Handling Tests

#### Test 1: Missing GUID
**Action:** Remove GUID from Strapi site config

**Expected:**
- API returns 503 error
- Hero falls back to Strapi config data
- Events page shows Strapi events or fallback message

#### Test 2: Invalid Event Slug
**URL:** `http://localhost:3000/event/invalid-slug`

**Expected:**
- 404 Not Found page displays
- User can navigate back to events list

#### Test 3: Network Error
**Action:** Disconnect from internet or block RaceReady API

**Expected:**
- Graceful fallback to Strapi data
- Console warning logged
- No UI crashes

### 5. Responsive Design Tests

#### Mobile (< 768px)
- ✅ Countdown shows 2 columns (Days/Hours on top, Mins/Secs below)
- ✅ Typography scales appropriately
- ✅ Event detail page sidebar moves below content
- ✅ Navigation menu works correctly

#### Tablet (768px - 1024px)
- ✅ Countdown shows 4 columns
- ✅ Event cards show 2 columns
- ✅ All spacing looks balanced

#### Desktop (> 1024px)
- ✅ Countdown shows 4 columns
- ✅ Event cards show 3 columns
- ✅ Event detail page shows sidebar layout
- ✅ All elements properly aligned

### 6. Browser Compatibility

Test in:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

### 7. Performance Tests

**Check:**
- ✅ Page load time < 2 seconds
- ✅ API response time < 500ms
- ✅ No console errors
- ✅ Images load progressively
- ✅ Video doesn't block page render

**Tools:**
- Chrome DevTools Performance tab
- Network tab for API timing
- Lighthouse for overall score

### 8. Accessibility Tests

**Check:**
- ✅ Keyboard navigation works
- ✅ Screen reader announces content correctly
- ✅ Color contrast meets WCAG AA standards
- ✅ Focus indicators visible
- ✅ ARIA labels present

**Tools:**
- Chrome DevTools Accessibility tab
- axe DevTools extension
- WAVE browser extension

## Common Issues & Solutions

### Issue: Events not loading
**Solution:**
1. Check GUID is correct in Strapi
2. Verify RaceReady API is accessible
3. Check browser console for errors
4. Test API endpoint directly

### Issue: Countdown shows 00:00:00:00
**Solution:**
1. Verify event has valid `startDate` or `date`
2. Check date format is ISO 8601
3. Ensure date is in the future

### Issue: "Enter Now" button not showing
**Solution:**
1. Check event has `event_status: 'entries-open'`
2. Verify API response includes status field
3. Check console for data structure

### Issue: Video not playing
**Solution:**
1. Verify video URL is correct
2. Check video format (MP4 recommended)
3. Ensure autoplay is supported in browser
4. Check video file size (< 10MB recommended)

### Issue: Styles look wrong
**Solution:**
1. Clear browser cache
2. Rebuild Next.js (`npm run build`)
3. Check Tailwind classes are correct
4. Verify no CSS conflicts

## Success Criteria

All tests pass when:
- ✅ Hero displays next event with clean countdown
- ✅ Events page shows all events from RaceReady
- ✅ Event detail pages render correctly
- ✅ "Enter Now" buttons appear appropriately
- ✅ Typography is reduced and cleaner
- ✅ Video backgrounds work (if configured)
- ✅ Mobile responsive design maintained
- ✅ No console errors
- ✅ API calls succeed with proper GUID
- ✅ Fallbacks work when API unavailable

## Next Steps After Testing

1. ✅ Fix any issues found during testing
2. ✅ Update Strapi with production GUIDs
3. ✅ Deploy to staging environment
4. ✅ Run full regression tests
5. ✅ Deploy to production
6. ✅ Monitor API performance
7. ✅ Gather user feedback

## Support

For issues:
- **Code issues**: Check implementation files
- **API issues**: Review `src/app/api/raceready-events/route.js`
- **Strapi issues**: See `RACEREADY_GUID_SETUP.md`
- **Design issues**: See `DESIGN_CHANGES_SUMMARY.md`

---

**Last Updated**: October 29, 2025  
**Status**: Ready for Testing

