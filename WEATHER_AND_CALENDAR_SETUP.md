# 🌦️📅 Weather & Calendar Features - Setup Guide

## ✅ **What's Been Added**

### **1. Weather Integration** ☁️
- Real-time weather data for event locations
- 7-day forecast
- Current conditions (temperature, wind, humidity, rain, pressure)
- Automatically shows on event pages
- Compact weather widget available for hero sections

### **2. Event Calendar** 📅
- Full calendar view of all events
- Month/Week/Day view options
- Click events to navigate to details
- Export to .ics (Apple Calendar, Outlook)
- Add to Google Calendar
- Color-coded by site's primary color
- Responsive and touch-friendly

---

## 🚀 **Quick Start**

### **Step 1: Get a Weather API Key (FREE)**

1. **Sign up at WeatherAPI.com:**
   - Go to: https://www.weatherapi.com/signup.aspx
   - Create a free account
   - Free tier includes: **1 million API calls/month**
   - No credit card required

2. **Get your API key:**
   - After signup, go to your dashboard
   - Copy your API key

3. **Add to your `.env.local` file:**
   ```env
   WEATHER_API_KEY=your_api_key_here
   ```

### **Step 2: Restart Your Dev Server**

```bash
# Stop current server (Ctrl+C)

# Restart Next.js
SITE_SLUG=supertt npm run dev
```

---

## 📂 **Files Created**

### **Weather Components:**
- `src/app/api/weather/route.js` - Weather API endpoint
- `src/components/weather/EventWeather.js` - Weather widget component

### **Calendar Components:**
- `src/components/calendar/EventCalendar.js` - Calendar component
- `src/app/events/calendar/page.js` - Calendar page

### **Updated Files:**
- `src/app/event/[id]/page.js` - Added weather widget to event pages
- `src/app/events/page.js` - Added calendar view toggle button

---

## 🎨 **How to Use**

### **Weather Widget**

#### **On Event Pages (Automatic)**
Weather automatically appears on event pages if the event has a location/venue.

#### **Manual Usage in Any Component**
```javascript
import EventWeather from '@/components/weather/EventWeather';

// Full widget with 7-day forecast
<EventWeather 
  location="Sydney Motorsport Park" 
  showForecast={true} 
/>

// Compact widget (for hero sections)
<EventWeather 
  location="Wakefield Park" 
  compact={true} 
/>

// Using coordinates instead of location name
<EventWeather 
  lat="-33.8688" 
  lon="151.2093" 
  showForecast={true} 
/>
```

### **Calendar View**

#### **Access the Calendar**
- Navigate to `/events/calendar` on any site
- Or click the "📅 Calendar View" button on the `/events` page

#### **Calendar Features**
- Click any event to go to its detail page
- Use the toolbar to switch between Month/Week/Day views
- Click "Today" to return to current date
- Export all events to your personal calendar

#### **Embedding the Calendar**
```javascript
import EventCalendar from '@/components/calendar/EventCalendar';

<EventCalendar 
  events={eventsArray} 
  onEventClick={(event) => console.log(event)}
  showToolbar={true}
/>
```

---

## 🌐 **Weather API Details**

### **API Endpoint**
`GET /api/weather?location=<location>` or `GET /api/weather?lat=<lat>&lon=<lon>`

### **Response Format**
```json
{
  "location": {
    "name": "Sydney",
    "region": "New South Wales",
    "country": "Australia",
    "lat": -33.87,
    "lon": 151.21
  },
  "current": {
    "temp_c": 22,
    "temp_f": 72,
    "condition": {
      "text": "Partly cloudy",
      "icon": "https://...",
      "code": 1003
    },
    "wind_kph": 15,
    "wind_dir": "NE",
    "humidity": 60,
    "precip_mm": 0,
    "pressure_mb": 1013
  },
  "forecast": [
    {
      "date": "2024-10-12",
      "day": {
        "maxtemp_c": 25,
        "mintemp_c": 18,
        "condition": { "text": "Sunny", "icon": "..." },
        "daily_chance_of_rain": 10
      },
      "hour": [ /* hourly data */ ]
    }
    // ... 6 more days
  ]
}
```

### **Caching**
- Weather data is cached for **30 minutes**
- Reduces API calls
- Ensures fast page loads

### **Error Handling**
- If weather API fails, the widget silently fails (doesn't break the page)
- Weather is treated as non-critical enhancement

---

## 📅 **Calendar Export Features**

### **.ics File Download**
Users can download an `.ics` file containing all events, which can be imported into:
- Apple Calendar (macOS, iOS)
- Microsoft Outlook
- Google Calendar (via import)
- Any other calendar app that supports iCal format

### **Google Calendar Integration**
One-click "Add to Google Calendar" button opens Google Calendar with the event pre-filled.

---

## 🎯 **Customization Options**

### **Weather Widget Styling**
The weather widget automatically uses your site's:
- `primaryColor` for gradients and accents
- `textColor` for text (with white override for readability)
- Backdrop blur and transparency for modern look

### **Calendar Styling**
The calendar automatically uses your site's:
- `primaryColor` for buttons and event colors
- `textColor` for text elements
- Responsive design matches your site's aesthetic

---

## 🔧 **Advanced Configuration**

### **Change Weather Provider**
If you prefer OpenWeatherMap or another provider, edit:
`src/app/api/weather/route.js`

### **Calendar View Options**
Customize FullCalendar options in:
`src/components/calendar/EventCalendar.js`

Available views:
- `dayGridMonth` - Month view (default)
- `timeGridWeek` - Week view with times
- `timeGridDay` - Single day with times
- `listWeek` - List view

### **Event Data Structure**
The calendar expects events with:
```javascript
{
  id: "event-id",
  title: "Event Name",
  startDate: "2024-10-15T10:00:00",
  endDate: "2024-10-15T18:00:00",
  location: "Sydney Motorsport Park",
  description: "Event description"
}
```

---

## 📊 **Weather Data Coverage**

### **Supported Locations**
- ✅ City names: "Sydney", "Melbourne", "Bathurst"
- ✅ Venues: "Sydney Motorsport Park", "Wakefield Park"
- ✅ Coordinates: lat/lon for precise locations
- ✅ Postcodes: Australian postcodes

### **Data Included**
- Current temperature (°C and °F)
- "Feels like" temperature
- Weather condition (Sunny, Cloudy, Rainy, etc.)
- Condition icon
- Wind speed and direction
- Humidity percentage
- Precipitation (mm)
- Air pressure (mb)
- UV index
- 7-day forecast
- Hourly breakdown

---

## 🚨 **Troubleshooting**

### **Weather Not Showing**
1. Check that `WEATHER_API_KEY` is set in `.env.local`
2. Verify the event has a `location` or `venue` field
3. Check browser console for errors
4. Test the API directly: `http://localhost:3000/api/weather?location=Sydney`

### **Calendar Not Loading**
1. Ensure events have `startDate` field
2. Check that events are in correct date format (ISO 8601)
3. Verify FullCalendar packages are installed: `npm list @fullcalendar`

### **"Demo" API Key Warning**
The code includes a fallback `'demo'` key, but this won't work in production. Make sure to add your real API key.

---

## 📈 **Next Steps**

### **Enhancements You Can Add:**

1. **Weather Alerts**
   - Show severe weather warnings
   - Track-specific alerts (lightning delays, etc.)

2. **Historical Weather**
   - Show weather from past events
   - Compare year-over-year conditions

3. **Track Conditions**
   - Estimate track temperature (air temp + solar radiation)
   - Wet/dry track status
   - Grip level predictions

4. **Calendar Features**
   - Filter by event category
   - Personal event selections
   - Sync with user account
   - Recurring events support

5. **Weather-Based Notifications**
   - Alert users to rain on race day
   - Temperature warnings
   - Wind speed alerts

---

## 💰 **Weather API Pricing**

### **WeatherAPI.com Free Tier:**
- ✅ 1 million calls/month
- ✅ Current weather
- ✅ 7-day forecast
- ✅ Hourly forecast
- ✅ No credit card required

### **Typical Usage:**
- ~30-50 API calls per event page view (with caching)
- With 30-minute cache: ~5,000 page views per day
- **Plenty for small-medium motorsport sites!**

### **Upgrade Options:**
If you exceed free tier:
- Paid plans start at $4/month
- Alternative: OpenWeatherMap (similar pricing)

---

## 🎉 **You're All Set!**

### **Test It Out:**
1. Start your dev server
2. Go to `/events/calendar` - see your events in calendar format
3. Click any event - see weather widget in the sidebar
4. Export to your personal calendar
5. Check the 7-day forecast for upcoming events

### **In Production:**
- Add your weather API key to production environment variables
- Weather and calendar work on all 15+ motorsport sites
- Each site's calendar uses its unique branding colors

---

## 📝 **Summary**

**Weather Features:**
- ✅ Real-time conditions
- ✅ 7-day forecast
- ✅ Hourly breakdown
- ✅ Auto-displays on event pages
- ✅ Compact widget option

**Calendar Features:**
- ✅ Month/Week/Day views
- ✅ Event navigation
- ✅ Export to .ics
- ✅ Google Calendar integration
- ✅ Responsive design
- ✅ Branded colors

**Both features work out-of-the-box with your existing event data!** 🏁

