import { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CalendarView from '@/components/calendar/CalendarView';

async function getEvents() {
  try {
    const baseUrl = process.env.SITE_DOMAIN || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/events`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch events for calendar');
      return [];
    }

    const events = await response.json();
    return Array.isArray(events) ? events : [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

async function getSiteConfig() {
  try {
    const baseUrl = process.env.SITE_DOMAIN || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/config`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch config');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching config:', error);
    return {};
  }
}

export async function generateMetadata() {
  const config = await getSiteConfig();
  
  return {
    title: `Event Calendar - ${config.siteTitle || 'RaceReady'}`,
    description: `View all upcoming motorsport events for ${config.siteTitle || 'RaceReady'} in calendar format`,
  };
}

function CalendarSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-2xl p-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-7 gap-4">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function EventCalendarPage() {
  const [events, config] = await Promise.all([
    getEvents(),
    getSiteConfig(),
  ]);

  return (
    <>
      <Header />
      
      <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: config.menuBackground || '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 
                  className="text-4xl md:text-5xl font-bold mb-2"
                  style={{ color: config.textColor || '#1a1a1a' }}
                >
                  Event Calendar
                </h1>
                <p 
                  className="text-lg md:text-xl"
                  style={{ color: config.textColor || '#1a1a1a', opacity: 0.8 }}
                >
                  View all upcoming motorsport events at a glance
                </p>
              </div>
              
              {/* View toggle */}
              <div className="flex gap-2">
                <Link
                  href="/events"
                  className="px-4 py-2 rounded-lg border transition-colors duration-200"
                  style={{
                    borderColor: config.primaryColor || '#3b82f6',
                    color: config.textColor || '#1a1a1a',
                  }}
                >
                  📋 List View
                </Link>
                <button
                  className="px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-200"
                  style={{
                    backgroundColor: config.primaryColor || '#3b82f6',
                  }}
                  disabled
                >
                  📅 Calendar View
                </button>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <Suspense fallback={<CalendarSkeleton />}>
            <div className="mb-8">
              <CalendarView events={events} config={config} />
            </div>
          </Suspense>

          {/* Empty state */}
          {events.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ color: config.textColor || '#1a1a1a' }}
              >
                No Events Scheduled
              </h2>
              <p style={{ color: config.textColor || '#1a1a1a', opacity: 0.7 }}>
                Check back soon for upcoming motorsport events
              </p>
            </div>
          )}

          {/* Export options */}
          {events.length > 0 && (
            <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg">
              <h3 
                className="text-xl font-bold mb-4"
                style={{ color: config.textColor || '#1a1a1a' }}
              >
                📥 Export Calendar
              </h3>
              <div className="flex flex-wrap gap-4">
                <button
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg"
                  style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                  onClick={() => {
                    // Generate iCal file
                    const icsContent = generateICS(events, config);
                    downloadICS(icsContent, `${config.slug || 'raceready'}-events.ics`);
                  }}
                >
                  📅 Download .ics (Apple Calendar, Outlook)
                </button>
                <button
                  className="px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-200 hover:shadow-lg"
                  style={{
                    borderColor: config.primaryColor || '#3b82f6',
                    color: config.primaryColor || '#3b82f6',
                  }}
                  onClick={() => {
                    // Open Google Calendar add URL
                    window.open(generateGoogleCalendarUrl(events[0]), '_blank');
                  }}
                >
                  🔗 Add to Google Calendar
                </button>
              </div>
              <p className="text-sm mt-4" style={{ color: config.textColor || '#1a1a1a', opacity: 0.6 }}>
                Export events to your personal calendar application
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

// Helper functions for calendar export
function generateICS(events, config) {
  const icsEvents = events.map(event => {
    const start = new Date(event.startDate || event.date);
    const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 86400000);
    
    return `BEGIN:VEVENT
UID:${event.id}@${config.domain || 'raceready.com.au'}
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:${event.title || event.eventName || 'Event'}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location || event.venue_name || ''}
URL:${config.domain ? `https://${config.domain}/event/${event.id}` : ''}
END:VEVENT`;
  }).join('\n');

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//${config.siteTitle || 'RaceReady'}//Events//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${config.siteTitle || 'RaceReady'} Events
X-WR-TIMEZONE:Australia/Sydney
${icsEvents}
END:VCALENDAR`;
}

function formatICSDate(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function downloadICS(content, filename) {
  const blob = new Blob([content], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function generateGoogleCalendarUrl(event) {
  const start = new Date(event.startDate || event.date);
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 86400000);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title || event.eventName || 'Event',
    dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
    details: event.description || '',
    location: event.location || event.venue_name || '',
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function formatGoogleDate(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

