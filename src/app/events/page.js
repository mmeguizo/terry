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

  // Normalize paths to use /event/ route
  items = items.map(item => ({
    ...item,
    path: item.path || `/event/${item.slug || item.id}`
  }));

  return (
    <main className="container py-12 pt-32">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((e, i) => {
            // Extract venue name if it's an object
            const venueName = typeof e.venue === 'string' 
              ? e.venue 
              : e.venue?.name || e.venue?.display || e.location || 'TBD';
            
            // Format category names
            const categoryNames = Array.isArray(e.categories) 
              ? e.categories.map(c => typeof c === 'string' ? c : c.Name || c.name).filter(Boolean)
              : [];
            
            return (
              <a
                key={e.id ?? i}
                href={e.path || `/event/${e.slug || e.id}`}
                className="group block rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-neutral-200 hover:border-red-600"
              >
                {/* Event Image/Placeholder */}
                {e.image ? (
                  <div className="relative aspect-video bg-neutral-100 overflow-hidden">
                    <Image src={e.image} alt={e.name || e.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center relative overflow-hidden">
                    {/* Racing stripes */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-y-0 left-0 w-2 bg-red-500"></div>
                      <div className="absolute inset-y-0 left-4 w-2 bg-white"></div>
                      <div className="absolute inset-y-0 right-0 w-2 bg-red-500"></div>
                      <div className="absolute inset-y-0 right-4 w-2 bg-white"></div>
                    </div>
                    {/* Checkered flag icon */}
                    <svg className="w-24 h-24 text-white/10 group-hover:text-white/20 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4h4v4H4V4zm4 4h4v4H8V8zm-4 4h4v4H4v-4zm8-8h4v4h-4V4zm4 4h4v4h-4V8zm-4 4h4v4h-4v-4zm4 4h4v4h-4v-4zm-8 0h4v4H8v-4z"/>
                    </svg>
                  </div>
                )}
                
                {/* Event Info */}
                <div className="p-5 bg-white relative">
                  {/* Red accent bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-700"></div>
                  
                  <h3 className="font-black text-xl text-neutral-900 group-hover:text-red-600 transition-colors uppercase tracking-wide leading-tight mt-1">
                    {e.name || e.title || "Event"}
                  </h3>
                  
                  {/* Location */}
                  {venueName && (
                    <div className="flex items-center gap-2 mt-3 text-neutral-600">
                      <svg className="w-4 h-4 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium">{venueName}</span>
                    </div>
                  )}
                  
                  {/* Date */}
                  <div className="flex items-center gap-2 mt-2 text-neutral-600">
                    <svg className="w-4 h-4 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-bold">{e.date || fmtDateRange(e.startDate || e.date, e.endDate)}</span>
                  </div>
                  
                  {/* Categories */}
                  {categoryNames.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {categoryNames.slice(0, 3).map((c, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded">
                          {c}
                        </span>
                      ))}
                      {categoryNames.length > 3 && (
                        <span className="px-2.5 py-1 bg-neutral-200 text-neutral-700 text-xs font-bold rounded">
                          +{categoryNames.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Entry Status */}
                  {(e.event_status === 'entries-open' || e.entries_open) && (
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-bold rounded-lg shadow-md group-hover:shadow-lg transition-shadow uppercase tracking-wide">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        Entries Open
                      </span>
                    </div>
                  )}
                </div>
              </a>
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
    </main>
  );
}