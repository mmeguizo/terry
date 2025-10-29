import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import EventEntryList from "@/components/sections/EventEntryList";

// Disable ALL caching completely
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const isDev = process.env.NODE_ENV !== "production";
const local = `http://localhost:${process.env.PORT || 3000}`;
const origin = isDev ? local : (process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || local);

async function fetchJson(path) {
  try {
    const res = await fetch(new URL(path, origin).toString(), { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

function fmtDateRange(start, end) {
  if (!start && !end) return null;
  try {
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    if (s && e) {
      const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
      const sStr = s.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
      const eStr = e.toLocaleDateString("en-AU", {
        day: "numeric",
        month: sameMonth ? undefined : "long",
        year: sameMonth ? undefined : "numeric",
      });
      return `${sStr} – ${eStr}`;
    }
    return (s || e).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return start || end;
  }
}

export default async function EventDetailPage({ params }) {
  // Next.js 15: await params before accessing properties
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Fetch event data from RaceReady API (supports both slug and ID)
  let event = await fetchJson(`/api/raceready-events?view=event&event=${slug}`);

  // Fallback: try old API endpoint if new one fails (for backward compatibility with IDs)
  if (!event) {
    try {
      const oldApiUrl = `https://raceready.com.au/api/event/?eventid=${encodeURIComponent(slug)}`;
      const res = await fetch(oldApiUrl, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        
        // Extract venue name if it's an object
        const venueData = data.venue || data.location;
        const locationName = typeof venueData === 'string' 
          ? venueData 
          : venueData?.name || venueData?.display || venueData?.track || null;
        
        // Transform to match expected format
        event = {
          id: data.id || data.eventid,
          slug: data.slug || slug,
          name: data.title || data.name,
          title: data.title || data.name,
          location: locationName,
          venue: venueData,
          startDate: data.startDate || data.start,
          endDate: data.endDate || data.end,
          date: data.startDate || data.start,
          description: data.description,
          image: data.image || data.banner,
          event_status: data.eventState === 'upcoming_open' ? 'entries-open' : data.eventState,
          entries_open: data.eventState === 'upcoming_open',
          sessions: data.sessions || [],
          entries: data.entries || [],
          documents: data.documents || data.eventDocuments || [],
          categories: data.categories || [],
          weather: data.weather || null,
          track_map: data.trackMap || data.track?.map,
        };
      }
    } catch (error) {
      console.error('Failed to fetch from fallback API:', error);
    }
  }

  if (!event) {
    notFound();
  }

  // Use event.date directly if it's a formatted range, otherwise build it
  const dateRange = event.date && event.date.includes(' - ') 
    ? event.date 
    : fmtDateRange(event.startDate || event.date, event.endDate);
  
  const showEnterButton = event.event_status === 'entries-open' || event.entries_open;
  
  // Handle venue - can be string or object
  const venueName = typeof event.venue === 'string' 
    ? event.venue 
    : event.venue?.name || event.venue?.display || event.location || 'Venue TBA';
  
  // Sort entries by race number
  const sortedEntries = event.entries 
    ? [...event.entries].sort((a, b) => (a.number || 0) - (b.number || 0))
    : [];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-64 md:h-80 lg:h-96 bg-neutral-800"
        style={{
          backgroundImage: event.image ? `url(${event.image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
        <div className="container relative h-full flex flex-col justify-end pb-8 md:pb-12">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              {event.name || event.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              {venueName && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm md:text-base">{venueName}</span>
                </div>
              )}
              {dateRange && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm md:text-base">{dateRange}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Description */}
            {event.description && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Event Information</h2>
                <div className="prose max-w-none">
                  <p className="text-neutral-700 leading-relaxed">{event.description}</p>
                </div>
              </div>
            )}

            {/* Event Sessions/Schedule */}
            {Array.isArray(event.sessions) && event.sessions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Schedule</h2>
                <div className="space-y-3">
                  {event.sessions.map((session, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {session.time || idx + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{session.name || session.title}</h3>
                        {session.description && (
                          <p className="text-sm text-neutral-600 mt-1">{session.description}</p>
                        )}
                        {session.duration && (
                          <p className="text-xs text-neutral-500 mt-1">Duration: {session.duration}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Entry List with Category Filter */}
            {sortedEntries.length > 0 && (
              <EventEntryList 
                entries={sortedEntries} 
                categories={event.categories || []} 
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enter Now Button */}
            {showEnterButton && (
              <div className="bg-green-600 text-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-2">Entries Open!</h3>
                <p className="text-sm mb-4 text-green-50">
                  Register now to secure your spot in this event.
                </p>
                <a
                  href={event.entry_url || '#'}
                  className="block w-full bg-white text-green-600 text-center font-bold py-3 px-4 rounded-lg hover:bg-green-50 transition"
                >
                  Enter Now
                </a>
              </div>
            )}

            {/* Event Documents */}
            {Array.isArray(event.documents) && event.documents.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">Documents</h3>
                <div className="space-y-2">
                  {event.documents.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition"
                    >
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium flex-1">{doc.name || doc.label || doc.title}</span>
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Weather Info */}
            {event.weather && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">Weather</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {event.weather.temperature || 'N/A'}
                  </div>
                  <p className="text-sm text-neutral-600">{event.weather.condition || 'Check closer to event date'}</p>
                </div>
              </div>
            )}

            {/* Track Map */}
            {event.track_map && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">Track Map</h3>
                <div className="relative aspect-video bg-neutral-100 rounded-lg overflow-hidden">
                  <Image
                    src={event.track_map}
                    alt="Track Map"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Back to Events */}
        <div className="mt-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Events
          </Link>
        </div>
      </section>
    </main>
  );
}

