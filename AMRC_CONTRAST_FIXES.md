# AMRC Site - Contrast Fixes Documentation

## Issues Found & Fixed

### 1. **Original Color Problem**
- **menuBackground**: `#F1FAEE` (very light cream/white)
- **textColor**: `#A8DADC` (light cyan) ❌ **INVISIBLE on light background!**

### 2. **Solution Applied**

#### Updated Colors in Strapi:
- **textColor**: Changed from `#A8DADC` to `#1a1a1a` (very dark gray, almost black)
- **Result**: Perfect contrast on light background

#### Files Modified:

**1. `populate-strapi-data.js`**
- Updated AMRC textColor to `#1a1a1a` for future site creation

**2. `src/components/ui/Links.js`**
- Updated `IconLinkButton` component to use `config.textColor` for button text
- Changed button background from `bg-white/10` to `bg-white/80` for better contrast
- Icon background uses `primaryColor` directly

**3. `src/components/layout/Header.js`**
- Menu links now consistently use `config.textColor` (no longer switching between white/dark)
- Removed conditional color switching based on scroll state
- Menu text is always dark and readable

### 3. **Final AMRC Colors**
```javascript
{
  primaryColor: "#E63946",      // Red
  menuBackground: "#F1FAEE",    // Light cream
  textColor: "#1a1a1a",         // Very dark gray
}
```

### 4. **Components Fixed**
✅ Section headings (EVENT DOCUMENTS, LATEST NEWS)
✅ Body text in sections
✅ Event document button labels
✅ Header navigation menu
✅ Mobile menu text

### 5. **Testing Checklist**
- [x] Header menu visible at top
- [x] Header menu visible when scrolled
- [x] Section headings readable
- [x] Button text in cards readable
- [x] Body text readable

## Notes for Other Sites
- Always check `textColor` vs `menuBackground` contrast
- Light backgrounds need dark text (`#1a1a1a` or similar)
- Dark backgrounds need light text (`#ffffff` or similar)
- Use textColor consistently across all components

