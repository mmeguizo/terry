# ⚡ Quick Start: Weather & Calendar

## 🚀 **Get Running in 5 Minutes**

### **Step 1: Get Weather API Key (2 mins)**
1. Go to: https://www.weatherapi.com/signup.aspx
2. Sign up (free, no credit card)
3. Copy your API key

### **Step 2: Add API Key (30 seconds)**
Edit `.env.local`:
```env
WEATHER_API_KEY=your_api_key_here
```

### **Step 3: Restart Server (30 seconds)**
```bash
# Stop server (Ctrl+C)
# Restart
SITE_SLUG=supertt npm run dev
```

### **Step 4: Test It! (2 mins)**

**Test Calendar:**
- Go to: `http://localhost:3000/events/calendar`
- See your events in calendar view
- Click an event
- Try Month/Week/Day views

**Test Weather:**
- Go to any event page
- Look in the sidebar
- See current weather + 7-day forecast

---

## 📍 **Where to Find Everything**

| Feature | URL | Location |
|---------|-----|----------|
| Calendar View | `/events/calendar` | Full-page calendar |
| Events List | `/events` | Has "Calendar View" button |
| Event Weather | `/event/[id]` | Sidebar widget |
| Weather API | `/api/weather?location=Sydney` | JSON endpoint |

---

## 🎯 **Quick Tips**

### **Weather:**
- Shows automatically on event pages with locations
- Updates every 30 minutes
- Use compact mode for hero: `<EventWeather compact={true} />`

### **Calendar:**
- Export to .ics → Import to your personal calendar
- Google Calendar link → One-click add to Google
- Click any event → Navigate to details

---

## 🔧 **Customization**

### **Change Calendar Colors:**
Edit `src/components/calendar/EventCalendar.js` - search for `backgroundColor`

### **Change Weather Location:**
Events need `location`, `venue`, or `venue_name` field

### **Add Weather to Homepage:**
```javascript
import EventWeather from '@/components/weather/EventWeather';

<EventWeather location="Sydney" compact={true} />
```

---

## 📞 **Need Help?**

- **Setup Guide:** `WEATHER_AND_CALENDAR_SETUP.md`
- **Full Documentation:** `WEATHER_CALENDAR_IMPLEMENTATION_COMPLETE.md`
- **Enhancements:** `WEBSITE_ENHANCEMENTS.md`

---

## ✅ **Checklist**

- [ ] Got Weather API key from WeatherAPI.com
- [ ] Added `WEATHER_API_KEY` to `.env.local`
- [ ] Restarted dev server
- [ ] Tested `/events/calendar` page
- [ ] Checked weather on event page
- [ ] Tried exporting calendar

**Done? You're all set!** 🎉

