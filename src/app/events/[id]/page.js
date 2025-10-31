import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CountdownTimer from "@/components/CountdownTimer";
import { calculateEventStatus } from "@/utils/eventStatus";

export const dynamic = "force-dynamic";

function fmtDate(d) {
  try {
    return d ? new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) : "";
  } catch {
    return d || "";
  }
}
function fmtRange(start, end) {
  const s = fmtDate(start);
  const e = fmtDate(end);
  return s && e && s !== e ? `${s} — ${e}` : s || e || "";
}
function fmtDateTime(d) {
  try {
    return d ? new Date(d).toLocaleString("en-AU", { 
      day: "numeric", 
      month: "long", 
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true 
    }) : "";
  } catch {
    return d || "";
  }
}

async function fetchEventFromApi(id) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/events/${encodeURIComponent(id)}`;
  const finalUrl = url.startsWith("/") ? `http://localhost:3000${url}` : url || `http://localhost:3000/api/events/${id}`;
  console.log("[event-page] fetch →", finalUrl);

  const res = await fetch(finalUrl, { cache: "no-store" });
  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json?.ok || !json?.event) {
    console.warn("[event-page] not ok:", res.status, json?.error);
    return null;
  }

  console.log("[event-page] found →", {
    id: json.event.id,
    title: json.event.title,
    docs: json.event.documents?.length || 0,
    entries: json.event.entries?.length || 0,
    categories: json.event.categories?.length || 0,
  });
  
  // Debug: Log all event fields to see what data we're getting
  console.log("[event-page] FULL EVENT DATA →", json.event);
  
  return json.event;
}

export default async function EventPage({ params }) {
  const awaited = await params;
  const id = awaited?.id;
  console.log("[event-page] request →", { id });

  const event = await fetchEventFromApi(id);
  if (!event) {
    console.log("[event-page] notFound");
    notFound();
  }

  const dateStr = fmtRange(event.startDate, event.endDate);
  const docs = event.documents || [];
  const entries = event.entries || [];
  const cats = event.categories || [];
  const categoriesWithEntries = event.categoriesWithEntries || [];
  const sponsors = event.sponsors || [];
  const eventStatus = calculateEventStatus(event);
  
  // Extract promotor name from array (RaceReady API returns array of promotor objects)
  const promotorName = Array.isArray(event.promotor) && event.promotor.length > 0
    ? event.promotor[0].name
    : typeof event.promotor === 'string' 
      ? event.promotor 
      : null;
  
  console.log("[event-page] counts →", {
    docs: docs.length,
    entries: entries.length,
    categories: cats.length,
    status: eventStatus,
  });

  // Helper to check if field has value
  const hasValue = (val) => val !== null && val !== undefined && val !== "";

  return (
    <main className="pt-16 md:pt-24 bg-neutral-50">
      {/* Page Title - Hero Style */}
      <section className="relative px-4 py-12 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
        {/* Racing stripes background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-red-600"></div>
          <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>
          <div className="absolute top-0 right-0 w-2 h-full bg-red-600"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-1 h-16 bg-red-600"></div>
            <h1 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tight">
              {event.title || "Event"}
            </h1>
          </div>
          
          {/* Quick info badges */}
          <div className="flex flex-wrap gap-4 mt-6">
            {dateStr && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white font-semibold">{dateStr}</span>
              </div>
            )}
            {event.venue?.name && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-white font-semibold">{event.venue.name}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 1: Event Information */}
      {(hasValue(promotorName) || hasValue(dateStr) || hasValue(event.permitNumber) || 
        hasValue(event.entriesOpenDate) || hasValue(event.entriesCloseDate)) && (
        <section className="px-4 py-10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-red-600"></div>
              <h2 className="text-3xl font-black uppercase text-neutral-900">Event Details</h2>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-600 space-y-4">
              {hasValue(promotorName) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <p className="font-bold uppercase text-neutral-900">Promotor:</p>
                  <p className="md:col-span-2 text-neutral-700">{promotorName}</p>
                </div>
              )}
              {hasValue(dateStr) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <p className="font-bold uppercase text-neutral-900">Event Date:</p>
                  <p className="md:col-span-2 text-neutral-700">{dateStr}</p>
                </div>
              )}
              {hasValue(event.permitNumber) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <p className="font-bold uppercase text-neutral-900">Permit Number:</p>
                  <p className="md:col-span-2 text-neutral-700">{event.permitNumber}</p>
                </div>
              )}
              {hasValue(event.entriesOpenDate) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <p className="font-bold uppercase text-neutral-900">Entries Open:</p>
                  <p className="md:col-span-2 text-neutral-700">{fmtDateTime(event.entriesOpenDate)}</p>
                </div>
              )}
              {hasValue(event.entriesCloseDate) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <p className="font-bold uppercase text-neutral-900">Entries Close:</p>
                  <p className="md:col-span-2 text-neutral-700">{fmtDateTime(event.entriesCloseDate)}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Section 2: Track Information */}
      {event.venue && (hasValue(event.venue.name) || hasValue(event.venue.address) || 
        hasValue(event.venue.phone) || hasValue(event.venue.email) || hasValue(event.venue.website)) && (
        <section className="px-4 py-10 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-neutral-800"></div>
              <h2 className="text-3xl font-black uppercase text-neutral-900">Track Information</h2>
            </div>
            <div className="bg-gradient-to-br from-neutral-50 to-white p-8 rounded-xl shadow-lg border-l-4 border-neutral-800 space-y-4">
              {hasValue(event.venue.name) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <p className="font-bold uppercase text-neutral-900">Name:</p>
                  <p className="md:col-span-2 text-neutral-700">{event.venue.name}</p>
                </div>
              )}
              {(hasValue(event.venue.address) || hasValue(event.venue.suburb) || 
                hasValue(event.venue.state) || hasValue(event.venue.postcode)) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <p className="font-bold uppercase text-neutral-900">Address:</p>
                  <p className="md:col-span-2 text-neutral-700">
                    {[event.venue.address, event.venue.suburb, event.venue.state, event.venue.postcode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
              {hasValue(event.venue.phone) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <p className="font-bold uppercase text-neutral-900">Ph:</p>
                  <p className="md:col-span-2 text-neutral-700">
                    <a href={`tel:${event.venue.phone}`} className="text-red-600 hover:underline">
                      {event.venue.phone}
                    </a>
                  </p>
                </div>
              )}
              {hasValue(event.venue.email) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <p className="font-bold uppercase text-neutral-900">Email:</p>
                  <p className="md:col-span-2 text-neutral-700">
                    <a href={`mailto:${event.venue.email}`} className="text-red-600 hover:underline">
                      {event.venue.email}
                    </a>
                  </p>
                </div>
              )}
              {hasValue(event.venue.website) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <p className="font-bold uppercase text-neutral-900">Website:</p>
                  <p className="md:col-span-2 text-neutral-700">
                    <a 
                      href={event.venue.website.startsWith('http') ? event.venue.website : `https://${event.venue.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline"
                    >
                      {event.venue.website}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Entry Status */}
      <section className="px-4 py-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-red-600"></div>
            <h2 className="text-3xl font-black uppercase text-neutral-900">Entry Status</h2>
          </div>
          <div className="bg-gradient-to-br from-white to-neutral-50 p-10 rounded-xl shadow-xl border-2 border-neutral-200">
            {eventStatus === 'entries-opening-soon' && event.entriesOpenDate && (
              <div>
                <CountdownTimer targetDate={event.entriesOpenDate} />
              </div>
            )}
            
            {eventStatus === 'entries-open' && (
              <div className="text-center py-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-600 text-white rounded-lg mb-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-xl font-black uppercase">Entries Open</span>
                </div>
                {event.entryLink && (
                  <a
                    href={event.entryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold uppercase px-8 py-4 text-lg transition-colors"
                  >
                    Enter Now »
                  </a>
                )}
              </div>
            )}
            
            {eventStatus === 'entries-closed' && (
              <div className="text-center py-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-600 text-white rounded-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-xl font-black uppercase">Entries Closed</span>
                </div>
              </div>
            )}
            
            {eventStatus === 'event-live' && (
              <div className="text-center py-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-orange-600 text-white rounded-lg mb-4 animate-pulse">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  <span className="text-xl font-black uppercase">Event Happening Now!</span>
                </div>
                <p className="text-lg text-neutral-700 mt-4">
                  The event is happening now, come out and see us!
                </p>
              </div>
            )}
            
            {eventStatus === 'event-past' && (
              <div className="text-center py-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-neutral-600 text-white rounded-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                    <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-xl font-black uppercase">Event Concluded</span>
                </div>
                <p className="text-neutral-600 mt-4">This event has concluded. Thank you to all participants!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 4: Event Documents */}
      {docs.length > 0 && (
        <section className="px-4 py-10 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-blue-600"></div>
              <h2 className="text-3xl font-black uppercase text-neutral-900">Event Documents</h2>
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg border border-neutral-200">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-neutral-800 to-neutral-900">
                  <tr>
                    <th className="text-left px-6 py-4 font-black uppercase text-sm text-white tracking-wider">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Document Name
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {docs.map((doc, idx) => (
                    <tr 
                      key={doc.id} 
                      className={`border-b border-neutral-100 transition-colors hover:bg-blue-50 ${idx % 2 === 0 ? "bg-white" : "bg-neutral-50"}`}
                    >
                      <td className="px-6 py-4">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-blue-600 hover:text-blue-800 font-semibold group"
                        >
                          <svg className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="group-hover:underline">{doc.label}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Section 5: Entry Lists by Category */}
      {eventStatus !== 'entries-opening-soon' && categoriesWithEntries.length > 0 && 
       categoriesWithEntries.some(cat => cat.entries && cat.entries.length > 0) && (
        <section className="px-4 py-10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-red-600"></div>
              <h2 className="text-3xl font-black uppercase text-neutral-900">Entry List</h2>
            </div>
            <div className="space-y-8">
              {categoriesWithEntries.map((cat, catIdx) => {
                if (!cat.entries || cat.entries.length === 0) return null;
                
                return (
                  <div key={catIdx} className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-neutral-800">
                    <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 px-6 py-4">
                      <h3 className="text-xl font-black uppercase text-white flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        {cat.name}
                        <span className="ml-auto text-sm font-normal bg-white/20 px-3 py-1 rounded-full">
                          {cat.entries.length} {cat.entries.length === 1 ? 'Entry' : 'Entries'}
                        </span>
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-neutral-800 text-white">
                          <tr>
                            <th className="text-left px-4 py-3 font-bold uppercase text-xs tracking-wider">No.</th>
                            <th className="text-left px-4 py-3 font-bold uppercase text-xs tracking-wider">Driver / Team</th>
                            <th className="text-left px-4 py-3 font-bold uppercase text-xs tracking-wider">Vehicle</th>
                            <th className="text-left px-4 py-3 font-bold uppercase text-xs tracking-wider">Sponsor / Team</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.entries.map((entry, idx) => (
                            <tr 
                              key={entry.id} 
                              className={`border-b border-neutral-100 transition-colors ${
                                idx % 2 === 0 ? "bg-white hover:bg-red-50" : "bg-neutral-50 hover:bg-red-50"
                              }`}
                            >
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-neutral-800 text-white font-bold rounded-lg text-xs">
                                  {entry.number || "-"}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-semibold text-neutral-900">{entry.name || "-"}</td>
                              <td className="px-4 py-3 text-neutral-700">{entry.vehicle || "-"}</td>
                              <td className="px-4 py-3 text-neutral-600">{entry.sponsor || entry.category || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Section 6: Schedule */}
      <section className="px-4 py-10 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-orange-600"></div>
            <h2 className="text-3xl font-black uppercase text-neutral-900">Schedule</h2>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-xl shadow-lg border-l-4 border-orange-600">
            <div className="flex items-center gap-3 text-neutral-600">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-semibold">Coming soon. Check back for the full timetable.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }) {
  const { id: handle } = await params;
  const isNum = /^\d+$/.test(String(handle));
  const event = isNum ? await fetchEventFromApi(handle) : null;

  if (!event) return { title: "Event Not Found" };

  const title = event.title || event.name || "Event";
  const description =
    event.description ||
    (Array.isArray(event.categories) && event.categories.length
      ? `Categories: ${event.categories.join(", ")}`
      : undefined);

  const images = event.heroImage ? [event.heroImage] : undefined;
  const canonical = `/events/${handle}`;

  return {
    title: `${title} | ${process.env.SITE_SLUG || "Site"}`,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "article",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}