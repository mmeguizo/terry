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
    <main className="min-h-screen bg-neutral-50 py-12 pt-32">
      <div className="container mx-auto px-4">
        {/* Page Header - Racing Style */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-1 h-10 bg-red-600"></div>
            <h1 className="text-4xl font-black uppercase tracking-wider text-neutral-900">Events</h1>
          </div>
        <div className="flex gap-3">
          <Link
            href="/events"
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-bold uppercase text-sm tracking-wide hover:shadow-lg transition-all duration-300"
          >
            📋 List View
          </Link>
          <Link
            href="/events/calendar"
            className="px-5 py-2.5 border-2 border-neutral-700 text-neutral-700 rounded-lg font-bold uppercase text-sm tracking-wide hover:bg-neutral-700 hover:text-white transition-all duration-300"
          >
            📅 Calendar
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-neutral-500">No events yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((e, i) => {
            // Extract venue name if it's an object
            const venueName = typeof e.venue === 'string' 
              ? e.venue 
              : e.venue?.name || e.venue?.display || e.location || 'TBD';
            
            return (
              <div
                key={e.id ?? i}
                className="group relative bg-gradient-to-r from-white to-neutral-50 border-l-4 border-red-600 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Animated background accent */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative p-6">
                  <h2 className="text-3xl font-black uppercase text-red-600 mb-4 group-hover:text-red-700 transition-colors">
                    {e.name || e.title || "Event"}
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wide">Date</p>
                        <p className="text-sm font-bold text-neutral-900">
                          {e.date || fmtDateRange(e.startDate || e.date, e.endDate) || "TBD"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wide">Track</p>
                        <p className="text-sm font-bold text-neutral-900">{venueName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <a
                    href={e.path || `/events/${e.slug || e.id}`}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                  >
                    <span>Event Details</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
        <div className="mt-8">
          <Link
            href="/event-info"
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8M13 11h8m-9 4h9"
              />
            </svg>
            Event info
          </Link>
        </div>
      </div>
    </main>
  );
}