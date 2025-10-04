import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

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
  // 1) Try Strapi-backed /api/events (or synthesized from Site.hero)
  let items = (await fetchJson("/api/events")) || [];

  // 2) Fallback to env event id normalized via RaceReady proxy
  if (!Array.isArray(items) || items.length === 0) {
    const id = process.env.NEXT_PUBLIC_EVENT_ID || "1389";
    const one = await fetchJson(`/api/raceready/event/${id}`);
    items = one ? [ { ...one, path: `/events/${one.slug || id}` } ] : [];
  }

  return (
    <main className="container py-12">
      <h1 className="text-3xl font-semibold mb-6">Events</h1>

      {items.length === 0 ? (
        <p className="text-neutral-500">No events yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((e, i) => (
            <a
              key={e.id ?? i}
              href={e.path || `/events/${e.slug || e.id}`}
              className="group block rounded overflow-hidden ring-1 ring-neutral-200 hover:shadow-md transition"
            >
              {e.image ? (
                <div className="relative aspect-video bg-neutral-100">
                  <Image src={e.image} alt={e.title || e.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="aspect-video bg-neutral-100" />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg">
                  {e.title || e.name || "Event"}
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                  {fmtDateRange(e.startDate || e.date, e.endDate)}
                </p>
                {Array.isArray(e.categories) && e.categories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {e.categories.slice(0, 3).map((c, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
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