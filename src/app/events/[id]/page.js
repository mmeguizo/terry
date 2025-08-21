export const dynamic = "force-dynamic";
import Image from "next/image";

function fmtRange(start, end) {
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
    const one = (s || e).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
    return one;
  } catch {
    return start || end;
  }
}

const isNumeric = (v) => /^\d+$/.test(String(v));

function getOrigin() {
  const isDev = process.env.NODE_ENV !== "production";
  const local = `http://localhost:${process.env.PORT || 3000}`;
  return isDev ? local : (process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || local);
}

async function getEventById(id) {
  const url = new URL(`/api/raceready/event/${id}`, getOrigin()).toString();
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function getEventBySlug(slug) {
  // 1) Try env-driven single event
  const envId = process.env.NEXT_PUBLIC_EVENT_ID;
  if (envId) {
    const ev = await getEventById(envId);
    if (ev && String(ev.slug || "").toLowerCase() === String(slug).toLowerCase()) return ev;
  }

  // 2) Fallback: try /api/events to map slug -> id/data
  try {
    const listRes = await fetch(new URL("/api/events", getOrigin()).toString(), { cache: "no-store" });
    if (!listRes.ok) return null;
    const list = await listRes.json();
    const found = Array.isArray(list)
      ? list.find((it) => String(it.slug || "").toLowerCase() === String(slug).toLowerCase())
      : null;
    if (!found) return null;

    if (found.id && isNumeric(found.id)) {
      return await getEventById(found.id);
    }
    return found;
  } catch {
    return null;
  }
}

export default async function EventPage({ params }) {
  const { id: handle } = await params; // supports numeric id or slug
  const event = isNumeric(handle) ? await getEventById(handle) : await getEventBySlug(handle);

  if (!event) {
    return (
      <main className="container py-14">
        <h1 className="text-3xl font-semibold mb-2">Event Not Found</h1>
        <p className="text-neutral-500">The event you’re looking for doesn’t exist or failed to load.</p>
      </main>
    );
  }

  const dateRange = fmtRange(event.startDate, event.endDate);

  return (
    <main>
      <section className="bg-[#0f1216] text-white">
        <div className="container py-10">
          <div className="grid md:grid-cols-[2fr_1fr] items-center gap-8">
            <div>
              <h1 className="text-4xl font-bold mb-3">{event.name}</h1>
              <div className="text-white/80 space-x-3">
                {dateRange && <span>{dateRange}</span>}
                {event.venue && (
                  <>
                    <span className="opacity-50">•</span>
                    <span>{event.venue}</span>
                  </>
                )}
              </div>
              {event.description && <p className="mt-6 text-white/80 max-w-3xl">{event.description}</p>}
            </div>
            {event.heroImage ? (
              <div className="relative w-full aspect-video rounded overflow-hidden ring-1 ring-white/10">
                <Image
                  src={event.heroImage}
                  alt={event.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-[#171717]">
        <div className="container py-10">
          <h2 className="text-xl font-semibold text-white mb-4">Event Documents</h2>
          {Array.isArray(event.documents) && event.documents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.documents.map((d) => (
                <a
                  key={d.id}
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded bg-white/5 text-white hover:bg-white/10 transition"
                >
                  {d.label}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-white/70">No documents yet.</p>
          )}
        </div>
      </section>

      <section className="bg-white">
        <div className="container py-10">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-3">Categories</h2>
              {Array.isArray(event.categories) && event.categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {event.categories.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-neutral-100 rounded-full text-neutral-700 text-sm">
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500">No categories yet.</p>
              )}
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-3">Entry List</h2>
              {Array.isArray(event.entries) && event.entries.length > 0 ? (
                <div className="overflow-x-auto ring-1 ring-neutral-200 rounded">
                  <table className="min-w-[680px] w-full text-sm">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="text-left font-medium p-3">#</th>
                        <th className="text-left font-medium p-3">Team</th>
                        <th className="text-left font-medium p-3">Drivers</th>
                        <th className="text-left font-medium p-3">Car</th>
                        <th className="text-left font-medium p-3">Class</th>
                      </tr>
                    </thead>
                    <tbody>
                      {event.entries.map((e) => (
                        <tr key={e.id} className="border-t">
                          <td className="p-3">{e.number ?? "-"}</td>
                          <td className="p-3">{e.team ?? "-"}</td>
                          <td className="p-3">{Array.isArray(e.drivers) ? e.drivers.join(", ") : "-"}</td>
                          <td className="p-3">{e.car ?? "-"}</td>
                          <td className="p-3">{e.class ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-neutral-500">No entries yet.</p>
              )}
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
  const event = isNum ? await getEventById(handle) : await getEventBySlug(handle);

  if (!event) return { title: "Event Not Found" };

  const title = event.name || "Event";
  const description =
    event.description ||
    (Array.isArray(event.categories) && event.categories.length ? `Categories: ${event.categories.join(", ")}` : undefined) ||
    undefined;

  return {
    title: `${title} | Wakefield 300`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: event.heroImage ? [event.heroImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: event.heroImage ? [event.heroImage] : undefined,
    },
  };
}