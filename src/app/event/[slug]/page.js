import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

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

function calculateEventStatus(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate || startDate);

  if (now < start) return 'upcoming';
  if (now <= end) return 'live';
  return 'past';
}

function getTimeRemaining(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;

  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
}

// Event Information Section
function EventInfoSection({ event, venueName, dateRange }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 lg:p-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
        <h2 className="text-2xl font-black uppercase tracking-wide text-neutral-900">Event Information</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Promotor */}
        <div>
          <p className="text-xs font-bold uppercase text-neutral-500 tracking-wider mb-2">Promoter</p>
          <p className="text-lg font-semibold text-neutral-900">{event.promoter || 'Motor Racing Australia Pty Ltd'}</p>
        </div>

        {/* Event Date */}
        <div>
          <p className="text-xs font-bold uppercase text-neutral-500 tracking-wider mb-2">Event Date</p>
          <p className="text-lg font-semibold text-neutral-900">{dateRange || 'TBD'}</p>
        </div>

        {/* Permit Number */}
        <div>
          <p className="text-xs font-bold uppercase text-neutral-500 tracking-wider mb-2">Permit Number</p>
          <p className="text-lg font-semibold text-neutral-900">{event.permit || 'TBD'}</p>
        </div>

        {/* Entries Info */}
        <div>
          <p className="text-xs font-bold uppercase text-neutral-500 tracking-wider mb-2">Entry Status</p>
          <p className="text-lg font-semibold text-neutral-900">{event.entries_open ? 'Open' : 'Closed'}</p>
        </div>
      </div>
    </div>
  );
}

// Track Information Section
function TrackInfoSection({ event, venueName }) {
  const venue = typeof event.venue === 'object' ? event.venue : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 lg:p-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
        <h2 className="text-2xl font-black uppercase tracking-wide text-neutral-900">Track Information</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Track Name */}
        <div>
          <p className="text-xs font-bold uppercase text-neutral-500 tracking-wider mb-2">Track Name</p>
          <p className="text-lg font-semibold text-neutral-900">{venueName}</p>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <p className="text-xs font-bold uppercase text-neutral-500 tracking-wider mb-2">Address</p>
          <p className="text-lg font-semibold text-neutral-900">
            {venue?.address || 'Ferrers Rd, Eastern Creek NSW 2766'}
          </p>
        </div>

        {/* Phone */}
        {venue?.phone && (
          <div>
            <p className="text-xs font-bold uppercase text-neutral-500 tracking-wider mb-2">Phone</p>
            <p className="text-lg font-semibold text-neutral-900">{venue.phone}</p>
          </div>
        )}

        {/* Email */}
        {venue?.email && (
          <div>
            <p className="text-xs font-bold uppercase text-neutral-500 tracking-wider mb-2">Email</p>
            <p className="text-lg font-semibold text-neutral-900 truncate">{venue.email}</p>
          </div>
        )}

        {/* Website */}
        {venue?.website && (
          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase text-neutral-500 tracking-wider mb-2">Website</p>
            <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-red-600 hover:text-red-700 break-all">
              {venue.website}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Entry Status Section
function EntryStatusSection({ event, dateRange }) {
  const status = calculateEventStatus(event.startDate || event.date, event.endDate);
  const timeRemaining = event.entries_open_date ? getTimeRemaining(event.entries_open_date) : null;

  let statusDisplay = null;
  let statusColor = '';
  let statusBg = '';

  if (status === 'upcoming' && !event.entries_open) {
    statusDisplay = 'Entries Opening Soon';
    statusColor = 'bg-blue-100 text-blue-800 border-blue-300';
  } else if (event.entries_open) {
    statusDisplay = 'Entries Open';
    statusColor = 'bg-green-100 text-green-800 border-green-300';
  } else if (status === 'live') {
    statusDisplay = 'Event Live';
    statusColor = 'bg-yellow-100 text-yellow-800 border-yellow-300';
  } else {
    statusDisplay = 'Entries Closed';
    statusColor = 'bg-red-100 text-red-800 border-red-300';
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 lg:p-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
        <h2 className="text-2xl font-black uppercase tracking-wide text-neutral-900">Entry Status</h2>
      </div>

      {/* Status Badge */}
      <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-lg border-2 mb-6 ${statusColor}`}>
        <div className="w-3 h-3 rounded-full bg-current"></div>
        <span className="font-black uppercase text-lg tracking-wide">{statusDisplay}</span>
      </div>

      {/* Status Message */}
      <div className="space-y-4">
        {status === 'upcoming' && !event.entries_open && timeRemaining && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-sm text-blue-700 font-medium">
              Entries opening in <strong>{timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m</strong>
            </p>
          </div>
        )}

        {event.entries_open && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <p className="text-sm text-green-700 font-medium">
              Entries are now open! Click below to register your entry.
            </p>
            <a
              href={event.entry_url || '#'}
              className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold uppercase text-sm px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <span>Enter Now</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        )}

        {status === 'live' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm text-yellow-700 font-medium">
              ✨ The event is happening now! Come out and see us!
            </p>
          </div>
        )}

        {status === 'past' && (
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
            <p className="text-sm text-gray-700 font-medium">
              This event has concluded. Thank you for participating!
            </p>
          </div>
        )}

        {!event.entries_open && status !== 'upcoming' && status !== 'live' && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-sm text-red-700 font-medium">
              Entries for this event are now closed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Event Documents Section
function EventDocumentsSection({ documents }) {
  if (!Array.isArray(documents) || documents.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 lg:p-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
        <h2 className="text-2xl font-black uppercase tracking-wide text-neutral-900">Event Documents</h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200">
        <table className="w-full">
          <tbody>
            {documents.map((doc, idx) => (
              <tr
                key={idx}
                className={`border-b border-neutral-200 hover:bg-red-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-neutral-50' : 'bg-white'
                }`}
              >
                <td className="px-6 py-4">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-red-600 hover:text-red-700 font-semibold group"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="group-hover:underline">{doc.name || doc.label || doc.title}</span>
                  </a>
                </td>
                <td className="px-6 py-4 text-right">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-neutral-500 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Entry List Section by Category
function EntryListSection({ entries, categories }) {
  if (!entries || entries.length === 0) {
    return null;
  }

  // Group entries by category
  const entriesByCategory = {};
  entries.forEach(entry => {
    const categoryName = entry.category || entry.class || 'Other';
    if (!entriesByCategory[categoryName]) {
      entriesByCategory[categoryName] = [];
    }
    entriesByCategory[categoryName].push(entry);
  });

  return (
    <div className="space-y-8">
      {Object.entries(entriesByCategory).map(([categoryName, categoryEntries]) => (
        <div key={categoryName} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
            <h2 className="text-2xl font-black uppercase tracking-wide text-neutral-900">{categoryName}</h2>
            <span className="ml-auto bg-red-100 text-red-800 px-3 py-1 rounded-lg font-bold text-sm">
              {categoryEntries.length} entries
            </span>
          </div>

          <div className="overflow-hidden rounded-lg border border-neutral-200">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-200">
                  <th className="px-6 py-3 text-left text-xs font-black uppercase text-neutral-700 tracking-wider w-16">No.</th>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase text-neutral-700 tracking-wider">Driver / Entry</th>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase text-neutral-700 tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase text-neutral-700 tracking-wider">Sponsor</th>
                </tr>
              </thead>
              <tbody>
                {categoryEntries.map((entry, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-neutral-200 hover:bg-red-50 transition-colors ${
                      idx % 2 === 0 ? 'bg-neutral-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-black text-lg text-red-600">{entry.number || entry.raceNumber || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900">{entry.driver || entry.name || 'TBD'}</div>
                      {entry.secondDriver && (
                        <div className="text-sm text-neutral-600">{entry.secondDriver}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-neutral-900">{entry.vehicle || entry.car || 'TBD'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-600 text-sm">{entry.sponsor || '-'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
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

  // Handle venue - can be string or object
  const venueName = typeof event.venue === 'string'
    ? event.venue
    : event.venue?.name || event.venue?.display || event.location || 'Venue TBA';

  return (
    <main className="min-h-screen bg-neutral-50 pt-32">
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-white mb-3 drop-shadow-lg">
              {event.name || event.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/90">
              {venueName && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm md:text-base font-semibold">{venueName}</span>
                </div>
              )}
              {dateRange && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm md:text-base font-semibold">{dateRange}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="container py-12 md:py-16">
        <div className="space-y-8">
          {/* Event Information & Track Information - Side by Side on Desktop */}
          <div className="grid lg:grid-cols-2 gap-8">
            <EventInfoSection event={event} venueName={venueName} dateRange={dateRange} />
            <TrackInfoSection event={event} venueName={venueName} />
          </div>

          {/* Entry Status */}
          <EntryStatusSection event={event} dateRange={dateRange} />

          {/* Event Documents */}
          <EventDocumentsSection documents={event.documents} />

          {/* Entry List by Category */}
          <EntryListSection entries={event.entries} categories={event.categories} />

          {/* Back Button */}
          <div className="pt-8">
            <Link
              href="/events"
              className="inline-flex items-center gap-3 text-red-600 hover:text-red-700 font-bold uppercase text-sm tracking-wide group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Events
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
