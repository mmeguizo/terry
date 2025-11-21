import Link from "next/link";
import Image from "next/image";

// Disable ALL caching completely
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const isDev = process.env.NODE_ENV !== "production";
const local = `http://localhost:${process.env.PORT || 3000}`;
const origin = isDev ? local : (process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || local);

async function fetchJson(path) {
  const res = await fetch(new URL(path, origin).toString(), { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
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

export default async function EventsIndexPage() {
  // 1) Try RaceReady Events API first
  let items = (await fetchJson("/api/raceready-events?view=events")) || [];

  // 2) Fallback to Strapi-backed /api/events (or synthesized from Site.hero)
  if (!Array.isArray(items) || items.length === 0) {
    items = (await fetchJson("/api/events")) || [];
  }

  // 3) Final fallback to env event id normalized via old RaceReady proxy
  if (!Array.isArray(items) || items.length === 0) {
    const id = process.env.NEXT_PUBLIC_EVENT_ID || "1389";
    // Try old API endpoint for backward compatibility
    const one = await fetchJson(`/api/raceready/event/${id}`);
    items = one ? [ { ...one, path: `/event/${one.slug || id}` } ] : [];
  }

  // Normalize paths to use /events/ route (redesigned page)
  items = items.map(item => ({
    ...item,
    path: item.path || `/events/${item.slug || item.id}`
  }));

  return (
    <main className="min-h-screen bg-neutral-900 pt-32">
      {/* Hero Section */}
      <div className="border-b border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-12 bg-red-600 rounded-full"></div>
              <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-white">Events</h1>
            </div>
            <p className="text-lg text-neutral-400 font-normal">Upcoming racing championships and events</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* View Toggle */}
        <div className="flex justify-end gap-3 mb-12">
          <Link
            href="/events"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold uppercase text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
          >
            List View
          </Link>
          <Link
            href="/events/calendar"
            className="px-6 py-3 border-2 border-neutral-700 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800 rounded-lg font-semibold uppercase text-sm tracking-wide transition-all duration-300"
          >
            Calendar View
          </Link>
        </div>

        {/* Events Grid */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-500 text-lg">No events available at this time.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {items.map((e, i) => {
              // Extract venue name - prioritize location field from normalization
              const venueName = e.location ||
                (typeof e.venue === 'string' ? e.venue : e.venue?.name || e.venue?.display) ||
                'TBD';

              // Determine event status
              const eventDate = e.startDate || e.date;
              const eventStatus = eventDate ? (
                new Date(eventDate) > new Date() ? 'Upcoming' : 'Past'
              ) : 'TBD';

              // Extract date parts for red date block
              const dateObj = eventDate ? new Date(eventDate) : null;
              const dateDay = dateObj ? dateObj.getDate() : '?';
              const dateMonth = dateObj ? dateObj.toLocaleDateString("en-US", { month: 'short' }).toUpperCase() : '?';

              return (
                <div
                  key={e.id ?? i}
                  className="group relative overflow-hidden bg-neutral-800 border border-neutral-700 rounded-xl transition-all duration-300 hover:shadow-2xl hover:border-red-600"
                >
                  {/* Red Date Block - Top Right Corner */}
                  <div className="absolute top-6 right-6 z-10">
                    <div className="bg-red-600 text-white rounded-lg overflow-hidden shadow-xl min-w-[80px]">
                      <div className="bg-red-700 text-center py-1 px-3">
                        <p className="text-xs font-bold uppercase tracking-wider">{dateMonth}</p>
                      </div>
                      <div className="text-center py-2 px-3">
                        <p className="text-3xl font-bold leading-none">{dateDay}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge - Top Right Below Date */}
                  <div className="absolute top-32 right-6 z-10">
                    <div className={`px-4 py-2 rounded-lg font-semibold uppercase text-xs whitespace-nowrap shadow-lg ${
                      eventStatus === 'Upcoming'
                        ? 'bg-green-600 text-white'
                        : 'bg-neutral-600 text-neutral-200'
                    }`}>
                      {eventStatus}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-10 pr-32">
                    {/* Event Title */}
                    <div className="mb-6">
                      <h2 className="text-4xl font-bold uppercase text-white mb-3 group-hover:text-red-500 transition-colors leading-tight">
                        {e.name || e.title || "Event"}
                      </h2>
                      {(e.shortName || e.series) && (
                        <p className="text-sm text-red-500 font-medium uppercase tracking-wide">{e.shortName || e.series}</p>
                      )}
                    </div>

                    {/* Info grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      {/* Date Info */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-neutral-700 border border-neutral-600">
                            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wider mb-2">Date</p>
                          <p className="text-base font-medium text-neutral-200">
                            {e.date || fmtDateRange(e.startDate || e.date, e.endDate) || "TBD"}
                          </p>
                        </div>
                      </div>

                      {/* Track Info */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-neutral-700 border border-neutral-600">
                            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wider mb-2">Track</p>
                          <p className="text-base font-medium text-neutral-200">{venueName}</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <a
                      href={e.path || `/event/${e.slug || e.id}`}
                      className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold uppercase text-sm px-10 py-4 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                    >
                      <span>View Details</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}