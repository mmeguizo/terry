import { NextResponse } from "next/server";
import Image from "next/image";
export const dynamic = "force-dynamic";

function fmtRange(start, end) {
  if (!start && !end) return null;
  try {
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    if (s && e) {
      const sameMonth =
        s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
      const sStr = s.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const eStr = e.toLocaleDateString("en-AU", {
        day: "numeric",
        month: sameMonth ? undefined : "long",
        year: sameMonth ? undefined : "numeric",
      });
      return `${sStr} – ${eStr}`;
    }
    const one = (s || e).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return one;
  } catch {
    return start || end;
  }
}

async function getEventFromEnvId() {
  const id = process.env.NEXT_PUBLIC_EVENT_ID || "1389";
  const isDev = process.env.NODE_ENV !== "production";
  const localOrigin = `http://localhost:${process.env.PORT || 3000}`;
  const origin =
    isDev
      ? localOrigin
      : process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || localOrigin;
  const url = new URL(`/api/raceready/event/${id}`, origin).toString();

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function EventSlugPage({ params }) {
  const { slug } = await params; // Next.js 15: params is a promise
  const event = await getEventFromEnvId();

  if (
    !event ||
    String(event.slug || "").toLowerCase() !== String(slug || "").toLowerCase()
  ) {
    return (
      <main className="container py-14">
        <h1 className="text-3xl font-semibold mb-2">Event Not Found</h1>
        <p className="text-neutral-500">
          The event you’re looking for doesn’t exist or failed to load.
        </p>
      </main>
    );
  }

  const dateRange = fmtRange(event.startDate, event.endDate);

  return (
    <main>
      {/* Hero */}
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
              {event.description && (
                <p className="mt-6 text-white/80 max-w-3xl">
                  {event.description}
                </p>
              )}
            </div>
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
              </div>
        </div>
      </section>

      {/* Documents */}
      <section className="bg-[#171717]">
        <div className="container py-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            Event Documents
          </h2>
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

      {/* Categories and Entries */}
      <section className="bg-white">
        <div className="container py-10">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-3">Categories</h2>
              {Array.isArray(event.categories) && event.categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {event.categories.map((c, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-neutral-100 rounded-full text-neutral-700 text-sm"
                    >
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
                          <td className="p-3">
                            {Array.isArray(e.drivers)
                              ? e.drivers.join(", ")
                              : "-"}
                          </td>
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



export async function GET() {
  try {
    const siteSlug = process.env.SITE_SLUG;

    if (!siteSlug) {
      throw new Error("SITE_SLUG environment variable is not defined");
    }

    const queryUrl =
      `${process.env.STRAPI_URL}/api/sites?filters[slug][$eq]=${siteSlug}` +
      `&populate[footer]=*` +
      `&populate[socials]=*` +
      `&populate[sponsors]=*` +
      `&populate[eventDocuments]=*` +
      `&populate[menu]=*` +
      `&populate[websites]=*` +
      `&populate[hero][populate][button]=*`;

    // Fetch site configuration from Strapi based on slug
    const strapiResponse = await fetch(
      // `${process.env.STRAPI_URL}/api/sites?filters[slug][$eq]=${siteSlug}&populate=*`,
      queryUrl,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: "no-store", // Disable caching for dynamic content
      }
    );

    if (!strapiResponse.ok) {
      console.error(`Strapi API failed with status: ${strapiResponse.status}`);
      console.error(`Request URL: ${queryUrl}`);
      console.error(`Response: ${await strapiResponse.text()}`);
      throw new Error(
        `Strapi API failed with status: ${strapiResponse.status}`
      );
    }

    const strapiData = await strapiResponse.json();

    // Check if we got a site with the requested slug
    if (!strapiData.data || strapiData.data.length === 0) {
      throw new Error(`No site found with slug: ${siteSlug}`);
    }

    // Transform Strapi data to match your existing structure
    const transformedConfig = transformStrapiData(strapiData.data[0]);
    return NextResponse.json(transformedConfig);
  } catch (error) {
    console.warn("Falling back to local JSON config:", error);
    const configModule = await import("@/config/site-config.json");
    return NextResponse.json(configModule.default);
  }
}

// Transform Strapi data structure to match your existing JSON structure
function transformStrapiData(data) {
  // console.log("Transforming Strapi data:", data);

  // The data is already in the format we need, no need to access 'attributes'
  const strapiUrl = process.env.STRAPI_URL || "";

  // Use this pattern before mapping
  const sponsors = Array.isArray(data?.sponsors) ? data.sponsors : [];
  const docs = Array.isArray(data?.eventDocuments) ? data.eventDocuments : [];
  const buttons = Array.isArray(data?.hero?.buttons) ? data.hero.buttons : [];

  return {
    siteTitle: data.siteTitle,
    primaryColor: data.primaryColor,
    menuBackground: data.menuBackground,
    textColor: data.textColor,
    logoImage: data.logoImage,
    menu: data.menu || [],
    hero: {
      background: data.hero?.[0]?.background?.data?.attributes?.url
        ? `${strapiUrl}${data.hero[0].background.data.attributes.url}`
        : data.hero?.[0]?.background,
      eventDate: data.hero?.[0]?.eventDate,
      eventInfo: data.hero?.[0]?.eventInfo,
      eventName: data.hero?.[0]?.eventName,
      eventLocation: data.hero?.[0]?.eventLocation,
      buttons: buttons,
    },

    eventDocuments: docs,
    websites: data.websites || [],
    newsItems: (data.newsItems || []).map((item) => ({
      ...item,
      image: item.image?.data?.attributes?.url
        ? `${strapiUrl}${item.image.data.attributes.url}`
        : item.image,
    })),
    sponsors: sponsors.map((sponsor) => ({
      ...sponsor,
      logo: sponsor.logo?.data?.attributes?.url
        ? `${strapiUrl}${sponsor.logo.data.attributes.url}`
        : sponsor.logo,
    })),
    // footer: data.footer ||[],
    footer: {
      backgroundColor: data.footer?.[0]?.backgroundColor || "#000000",
      textColor: data.footer?.[0]?.textColor || "#FFFFFF",
    },
    socials: data.socials || [],
  };
}
