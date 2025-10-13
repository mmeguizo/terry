# Contrast Fixes Summary

## ✅ Completed Fixes (October 11, 2025)

### Sites Fixed
1. **AMRC (Australian Motor Racing Club)**
   - Issue: Light cyan text (#A8DADC) on light background (#F1FAEE)
   - Fix: Changed `textColor` to `#1a1a1a` (very dark gray)
   - Result: Excellent contrast, all text clearly visible

2. **SuperTT**
   - Issue: Dark gray text (#313841) on dark background (#3A4750)
   - Fix: Changed `textColor` to `#ffffff` (white)
   - Result: Perfect white text on dark backgrounds

### Component Fixes
1. **EventDocuments.js** (Line 85)
   - Removed: `opacity-80` class from section subtitle
   - Result: Full opacity text, much clearer

2. **LatestNews.js** (Line 186)
   - Removed: `opacity-80` class from section subtitle
   - Result: Full opacity text, improved readability

3. **Sponsors.js** (Lines 53-58)
   - Changed: `text-gray-600` to dynamic `config.textColor`
   - Result: Proper contrast based on site configuration

4. **Links.js** (IconLinkButton component)
   - Added: Explicit `config.textColor` for button text
   - Added: `bg-white/80` background for event document buttons
   - Removed: Problematic `smart-text-primary` class override
   - Result: Text always visible in document buttons

5. **Header.js** (Menu items)
   - Changed: Menu text to always use `config.textColor` (dark)
   - Removed: White text at top of page that was invisible
   - Removed: Debug console.log statements
   - Result: Menu text always dark and readable

### Sites Verified ✅
1. AMRC - Fixed ✅
2. SuperTT - Fixed ✅
3. Clubman Championship - Perfect ✅
4. MX5 Cup - Perfect ✅
5. ExtremeTT - Perfect ✅
6. Race Official - Perfect ✅
7. MRA (Motor Racing Australia) - Perfect ✅
8. RaceReady - Perfect ✅

## Files Modified

### Strapi Data
- `populate-strapi-data.js` - Updated color values for AMRC and SuperTT

### Frontend Components
- `src/components/sections/EventDocuments.js`
- `src/components/sections/LatestNews.js`
- `src/components/sections/Sponsors.js`
- `src/components/ui/Links.js`
- `src/components/layout/Header.js`

## Color Guidelines for Future Sites

### Good Contrast Examples
- **Dark backgrounds**: Use white or very light text (`#ffffff`, `#f0f0f0`)
  - Example: SuperTT (#3A4750 bg → #ffffff text)
  - Example: MRA (#404040 bg → #CCCCCC text)

- **Light backgrounds**: Use very dark text (`#1a1a1a`, `#000000`)
  - Example: AMRC (#F1FAEE bg → #1a1a1a text)
  - Example: RaceReady (#FFFFFF bg → #000000 text)

### Avoid These Combinations
- ❌ Light text on light background (e.g., #A8DADC on #F1FAEE)
- ❌ Dark text on dark background (e.g., #313841 on #3A4750)
- ❌ Using `opacity` to fade text (reduces contrast)

### Testing Checklist
When adding new sites, verify:
1. ✅ Header menu text visible (scrolled and at top)
2. ✅ Section headings clearly readable
3. ✅ Body text has good contrast
4. ✅ Event document button text visible
5. ✅ Footer text readable
6. ✅ Hero text visible over background images

## Automatic Contrast Handling
The system now automatically:
- Uses `config.textColor` for all dynamic text
- Removes opacity overlays that reduce contrast
- Applies consistent styling across all sites
- Uses white backgrounds with slight transparency for button labels

## Browser Cache Note
After color changes in Strapi:
1. Stop Next.js dev server (Ctrl+C)
2. Restart Next.js dev server
3. Hard refresh browser (Ctrl+Shift+R)

