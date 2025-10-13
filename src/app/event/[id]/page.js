import { notFound } from "next/navigation";
import { LinkButton, IconLinkButton } from "@/components/ui/Links";
import EntryCountdown from "@/components/events/EntryCountdown";
import EventHeaderBand from "@/components/events/EventHeaderBand";
import SectionTitle from "@/components/SectionTitle";
import EventBrandVars from "@/components/events/EventBrandVars";
import EventWeather from "@/components/weather/EventWeather";
import { HiChevronRight, HiCalendarDays, HiFolder, HiMapPin, HiGlobeAlt } from "react-icons/hi2";

async function fetchEvent(eventId) {
  try {
    const url = `https://raceready.com.au/api/event/?eventid=${encodeURIComponent(eventId)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function getEventState(eventData) {
  // Prefer explicit eventState from API if present
  if (eventData?.eventState) return eventData.eventState;

  // Fallback: derive from entry window if available
  const now = Date.now();
  const opens = eventData?.entriesOpenAt ? new Date(eventData.entriesOpenAt).getTime() : null;
  const closes = eventData?.entriesCloseAt ? new Date(eventData.entriesCloseAt).getTime() : null;
  if (opens && now < opens) return "upcoming_notopen";
  if (opens && closes && now >= opens && now <= closes) return "upcoming_open";
  if (closes && now > closes) return "completed";
  return "live"; // sensible default
}

function getPrimaryCtas(eventData, eventState) {
  const ctas = [];
  const enterUrl = eventData?.enterUrl || eventData?.entryFormUrl || eventData?.links?.enter || null;
  if (eventState === "upcoming_open" && enterUrl) {
    ctas.push({ label: "Enter now", url: enterUrl });
  }
  const infoUrl = eventData?.infoUrl || eventData?.links?.info || null;
  if (infoUrl) {
    ctas.push({ label: "Event info", url: infoUrl });
  }
  return ctas;
}

export default async function EventPage({ params }) {
  const { id } = params;
  const eventData = await fetchEvent(id);
  if (!eventData) notFound();

  const title = eventData?.title || eventData?.name || "Event";
  const venue = eventData?.venue || eventData?.location || "";
  const start = eventData?.startDate || eventData?.start || null;
  const end = eventData?.endDate || eventData?.end || null;
  const documents = eventData?.documents || eventData?.eventDocuments || [];
  const categories = eventData?.categories || [];

  // Optional metadata commonly present in feeds like RaceReady
  const promoter = eventData?.promoter || eventData?.organiser || eventData?.organizer || null;
  const entriesOpenAt = eventData?.entriesOpenAt || eventData?.entries?.openAt || null;
  const entriesCloseAt = eventData?.entriesCloseAt || eventData?.entries?.closeAt || null;
  const track = eventData?.track || eventData?.circuit || {};
  const trackName = track?.name || eventData?.trackName || venue || "TBA";
  const trackLength = track?.length || eventData?.trackLength || "TBA";
  const trackDirection = track?.direction || eventData?.trackDirection || "TBA";
  const trackTurns = track?.turns || eventData?.trackTurns || "TBA";
  const trackAddress = track?.address || eventData?.trackAddress || null;
  const trackWebsite = track?.website || eventData?.trackWebsite || null;

  const eventState = getEventState(eventData);
  const ctas = getPrimaryCtas(eventData, eventState);

  const opensAt = eventData?.entriesOpenAt || eventData?.entries?.openAt || null;

  return (
    <EventBrandVars>
      <EventHeaderBand title={title} venue={venue} eventState={eventState} opensAt={opensAt} />

      <section className="event-surface py-16">
        <div className="container">
          {ctas.length > 0 ? (
            <div className="flex flex-wrap gap-3 mb-10">
              {ctas.map((cta, idx) => (
                <IconLinkButton key={idx} href={cta.url} newTab>
                  <HiChevronRight />
                  {cta.label}
                </IconLinkButton>
              ))}
            </div>
          ) : null}

          <div className="grid gap-10 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
            <section id="about" className="xl:col-span-2 lg:col-span-2 scroll-mt-24">
              <SectionTitle>About this event</SectionTitle>
              {eventData?.description ? (
                <div className="text-white/90 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: eventData.description }} />
                </div>
              ) : (
                <p className="text-neutral-300">Event description will appear here.</p>
              )}

              <div id="schedule" className="grid sm:grid-cols-2 gap-6 mt-8 scroll-mt-24">
                <div className="event-card h-full">
                  <div className="event-card-title">
                    <HiCalendarDays className="text-white/80" />
                    <h3>Schedule</h3>
                  </div>
                  <p className="text-sm text-neutral-200">Start: {start ? new Date(start).toLocaleString() : "TBC"}</p>
                  <p className="text-sm text-neutral-200">End: {end ? new Date(end).toLocaleString() : "TBC"}</p>
                </div>

                <div className="event-card h-full">
                  <div className="event-card-title">
                    <HiFolder className="text-white/80" />
                    <h3>Categories</h3>
                  </div>
                  {categories?.length ? (
                    <ul className="text-sm text-neutral-200 list-disc ms-5">
                      {categories.map((c, i) => (
                        <li key={i}>{typeof c === "string" ? c : c?.name || "Category"}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-neutral-200">TBC</p>
                  )}
                </div>
              </div>

              <div id="track" className="grid lg:grid-cols-2 gap-6 mt-8 scroll-mt-24">
                <div className="event-card">
                  <div className="event-card-title"><h3>Event details</h3></div>
                  <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-neutral-200">
                    <div><dt className="text-neutral-400">Promoter</dt><dd className="font-medium text-white/90">{promoter || "TBC"}</dd></div>
                    <div><dt className="text-neutral-400">Event date</dt><dd className="font-medium text-white/90">{start ? new Date(start).toLocaleString() : "TBC"}{end ? ` – ${new Date(end).toLocaleString()}` : ""}</dd></div>
                    <div><dt className="text-neutral-400">Entries open</dt><dd className="font-medium text-white/90">{entriesOpenAt ? new Date(entriesOpenAt).toLocaleString() : "TBC"}</dd></div>
                    <div><dt className="text-neutral-400">Entries close</dt><dd className="font-medium text-white/90">{entriesCloseAt ? new Date(entriesCloseAt).toLocaleString() : "TBC"}</dd></div>
                  </dl>
                </div>

                <div className="event-card">
                  <div className="event-card-title"><h3>Track information</h3></div>
                  <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-neutral-200">
                    <div><dt className="text-neutral-400">Name</dt><dd className="font-medium text-white/90">{trackName}</dd></div>
                    <div><dt className="text-neutral-400">Length</dt><dd className="font-medium text-white/90">{trackLength}</dd></div>
                    <div><dt className="text-neutral-400">Direction</dt><dd className="font-medium text-white/90">{trackDirection}</dd></div>
                    <div><dt className="text-neutral-400">Turns</dt><dd className="font-medium text-white/90">{trackTurns}</dd></div>
                    <div className="sm:col-span-2 flex items-start gap-2 mt-2">
                      <HiMapPin className="mt-0.5 text-white/80" />
                      <span className="text-sm">{trackAddress || venue || ""}</span>
                    </div>
                    {trackWebsite ? (
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <HiGlobeAlt className="text-white/80" />
                        <span className="text-sm text-white/90">{trackWebsite}</span>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </div>
            </section>

            <aside id="documents" className="scroll-mt-24 space-y-6">
              {/* Weather Widget */}
              {venue && (
                <div>
                  <EventWeather location={venue} showForecast={true} />
                </div>
              )}

              {/* Event Documents */}
              <div className="event-card">
                <SectionTitle className="mb-4">Event documents</SectionTitle>
                {documents?.length ? (
                  <div className="flex flex-col gap-2">
                    {documents.map((doc, idx) => (
                      <IconLinkButton key={idx} href={doc.url || doc.href || "#"} newTab>
                        <HiChevronRight />
                        {doc.label || doc.name || doc.title || `Document ${idx + 1}`}
                      </IconLinkButton>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-200">No documents available yet.</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </EventBrandVars>
  );
}

export async function generateMetadata({ params }) {
  const { id } = params;
  const data = await fetchEvent(id);
  if (!data) return { title: "Event" };
  const title = data?.title || data?.name || "Event";
  return { title };
}


