import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function fmtDate(d) {
  try {
    return d ? new Date(d).toLocaleDateString() : "";
  } catch {
    return d || "";
  }
}
function fmtRange(start, end) {
  const s = fmtDate(start);
  const e = fmtDate(end);
  return s && e && s !== e ? `${s} — ${e}` : s || e || "";
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
  return json.event;
}

function SectionTitle({ id, children }) {
  return (
    <h2 id={id} className="text-xl font-bold scroll-mt-28">
      {children}
    </h2>
  );
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
  const sponsors = event.sponsors || [];
  console.log("[event-page] counts →", {
    docs: docs.length,
    entries: entries.length,
    categories: cats.length,
    sponsors: sponsors.length,
  });

  return (
    <main className="pt-16 md:pt-24">
      {/* Hero */}
      <section
        className="relative h-72 md:h-[28rem] bg-neutral-800"
        style={{
          backgroundImage: event.heroImage ? `url(${event.heroImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 grid place-items-center text-center px-4">
          <div className="max-w-5xl">
            <p className="text-white/70 text-sm md:text-base tracking-wide uppercase">
              {dateStr}{event.location ? (dateStr ? " · " : "") + event.location : ""}
            </p>
            <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-white">{event.title || "Event"}</h1>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/event-info"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md"
              >
                Event Info
              </Link>
              {Array.isArray(event.buttons) &&
                event.buttons.map((b) => (
                  <a
                    key={b.id}
                    href={b.url}
                    target={b.target || "_self"}
                    rel={b.target === "_blank" ? "noopener noreferrer" : undefined}
                    className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md"
                  >
                    {b.label}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky sub‑nav */}
      <nav className="sticky top-16 md:top-24 z-20 bg-white/85 backdrop-blur border-b">
        <div className="container mx-auto max-w-6xl">
          <ul className="flex flex-wrap gap-4 px-4 py-3 text-sm font-semibold">
            <li><a href="#overview" className="hover:text-red-600">Overview</a></li>
            <li><a href="#documents" className="hover:text-red-600">Documents{docs.length ? ` (${docs.length})` : ""}</a></li>
            <li><a href="#entries" className="hover:text-red-600">Entry List{entries.length ? ` (${entries.length})` : ""}</a></li>
            <li><a href="#categories" className="hover:text-red-600">Categories{cats.length ? ` (${cats.length})` : ""}</a></li>
            <li><a href="#sponsors" className="hover:text-red-600">Sponsors</a></li>
            <li><a href="#schedule" className="hover:text-red-600">Schedule</a></li>
          </ul>
        </div>
      </nav>

      {/* Top stats */}
      <section className="px-4 py-8">
        <div className="container mx-auto max-w-6xl grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border border-neutral-200 bg-white p-4">
            <p className="text-xs uppercase text-neutral-500">Date</p>
            <p className="mt-1 font-semibold">{dateStr || "TBC"}</p>
          </div>
          <div className="rounded-md border border-neutral-200 bg-white p-4">
            <p className="text-xs uppercase text-neutral-500">Location</p>
            <p className="mt-1 font-semibold">{event.location || "TBC"}</p>
          </div>
          <div className="rounded-md border border-neutral-200 bg-white p-4">
            <p className="text-xs uppercase text-neutral-500">Categories</p>
            <p className="mt-1 font-semibold">{cats.length || 0}</p>
          </div>
          <div className="rounded-md border border-neutral-200 bg-white p-4">
            <p className="text-xs uppercase text-neutral-500">Entries</p>
            <p className="mt-1 font-semibold">{entries.length || 0}</p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="px-4 py-10">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SectionTitle id="overview">Overview</SectionTitle>
            <p className="mt-3 text-neutral-700 leading-relaxed">
              {event.description || "Event details coming soon."}
            </p>

            {cats.length ? (
              <div className="mt-6">
                <h3 className="font-semibold">Categories</h3>
                <div className="mt-2 flex flex-wrap gap-2" id="categories">
                  {cats.map((c, i) => (
                    <span key={i} className="inline-block rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1 text-sm">
                      {String(c)}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Actions / Quick links */}
          <aside className="lg:col-span-1">
            <div className="rounded-md border border-neutral-200 bg-white p-4">
              <h3 className="font-semibold">Event Actions</h3>
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/event-info"
                  className="text-center rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                >
                  Event Info
                </Link>
                {(event.buttons || []).map((b) => (
                  <a
                    key={b.id}
                    href={(() => {
                      if (!b.url || typeof b.url !== 'string') return '#';
                      if (b.url.startsWith('/')) return b.url;
                      if (b.label?.toLowerCase().includes('event')) return '/events';
                      if (b.label?.toLowerCase().includes('document')) return '#documents';
                      return '#';
                    })()}
                    className="text-center rounded-md border border-neutral-200 hover:bg-neutral-50 px-4 py-2"
                  >
                    {b.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Documents */}
      <section className="px-4 py-10 bg-neutral-50">
        <div className="container mx-auto max-w-6xl">
          <SectionTitle id="documents">Documents</SectionTitle>
          {docs.length ? (
            <ul className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {docs.map((doc) => (
                <li key={doc.id}>
                  <a
                    href={doc.url}
                    className="block rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 px-4 py-3"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {doc.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-neutral-600">No documents yet.</p>
          )}
        </div>
      </section>

      {/* Entry List */}
      <section className="px-4 py-10">
        <div className="container mx-auto max-w-6xl">
          <SectionTitle id="entries">Entry List</SectionTitle>
          {entries.length ? (
            <div className="mt-4 overflow-x-auto rounded-md border border-neutral-200">
              <table className="min-w-full bg-white text-sm">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="text-left px-3 py-2">No.</th>
                    <th className="text-left px-3 py-2">Name / Team</th>
                    <th className="text-left px-3 py-2">Vehicle</th>
                    <th className="text-left px-3 py-2">Category</th>
                    <th className="text-left px-3 py-2">Country</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id} className="border-t">
                      <td className="px-3 py-2">{e.number || "-"}</td>
                      <td className="px-3 py-2">{e.name || "-"}</td>
                      <td className="px-3 py-2">{e.vehicle || "-"}</td>
                      <td className="px-3 py-2">{e.category || "-"}</td>
                      <td className="px-3 py-2">{e.nationality || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-neutral-600">No entries published yet.</p>
          )}
        </div>
      </section>

      {/* Sponsors */}
      <section className="px-4 py-10 bg-neutral-50">
        <div className="container mx-auto max-w-6xl">
          <SectionTitle id="sponsors">Sponsors</SectionTitle>
          {sponsors.length ? (
            <div className="mt-4 flex flex-wrap gap-6 items-center">
                {sponsors.map((s) => (
                <div key={s.id} className="block cursor-pointer">
                  {s.logo ? (
                    <div className="relative h-12 w-24">
                      <Image src={s.logo} alt={s.name} fill className="object-contain" />
                    </div>
                  ) : (
                    <span className="text-sm">{s.name}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-neutral-600">Sponsors to be announced.</p>
          )}
        </div>
      </section>

      {/* Schedule */}
      <section className="px-4 py-10">
        <div className="container mx-auto max-w-6xl">
          <SectionTitle id="schedule">Schedule</SectionTitle>
          <div className="mt-3 rounded-md border border-neutral-200 bg-white p-4">
            <p className="text-neutral-700">Coming soon. Check back for the full timetable.</p>
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