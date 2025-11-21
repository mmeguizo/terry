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

      <main className="min-h-screen pt-32 pb-16 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-2 h-12 bg-red-600 rounded-full"></div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Event Calendar
                  </h1>
                </div>
                <p className="text-lg md:text-xl text-neutral-400">
                  View all upcoming motorsport events at a glance
                </p>
              </div>

              {/* View toggle */}
              <div className="flex gap-3">
                <Link
                  href="/events"
                  className="px-6 py-3 border-2 border-neutral-700 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800 rounded-lg font-semibold uppercase text-sm tracking-wide transition-all duration-300"
                >
                  List View
                </Link>
                <button
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold uppercase text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled
                >
                  Calendar View
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

        </div>
      </main>

      <Footer />
    </>
  );
}

