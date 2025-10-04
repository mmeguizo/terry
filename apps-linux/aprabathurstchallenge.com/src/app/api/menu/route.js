import { headers } from "next/headers";
import { STRAPI_URL, authHeaders, siteFilterQS } from "@/lib/strapiQueries";
import { notFound } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

function isTopLevelPath(p) {
  const s = String(p || "");
  return s === "/" || /^\/[^/]+$/.test(s);
}
function toItemsFromPages(rows = []) {
  return rows
    .filter((row) => isTopLevelPath(row?.path || row?.attributes?.path))
    .map((row) => ({
      id: row?.id,
      title: row?.title || row?.attributes?.title || "Untitled",
      path: row?.path || row?.attributes?.path || "#",
    }));
}

async function fetchJSON(url, init) {
  const res = await fetch(url, init);
  const json = await res.json().catch(() => ({}));
  return { res, json };
}

export async function GET(req) {
  const hdrs = await headers();
  const host = hdrs.get("x-site-host") || hdrs.get("host") || "";
  const u = new URL(req.url);
  const siteParam = u.searchParams.get("site") || u.searchParams.get("sites") || "";
  const noSite = u.searchParams.get("nosite") === "1";
  const includeHome = u.searchParams.get("includeHome") !== "0"; // default true

  // 1) Try config first (your /api/config already returns menu)
  const origin = u.origin; // e.g. http://localhost:3000
  const configUrl = siteParam
    ? `${origin}/api/config?site=${encodeURIComponent(siteParam)}`
    : `${origin}/api/config`;
  console.log("[menu] try config →", configUrl);

  try {
    const { res, json } = await fetchJSON(configUrl, { cache: "no-store" });
    if (res.ok && Array.isArray(json?.menu) && json.menu.length) {
      let items = json.menu.map((m) => ({
        id: m.id ?? m.documentId ?? m.slug ?? m.label,
        title: m.label || m.title || "Untitled",
        path: m.url || m.path || "#",
      }));
      if (!includeHome) items = items.filter((i) => i.path !== "/");
      console.log("[menu] from config →", items.length);
      return Response.json(items);
    }
  } catch (e) {
    console.warn("[menu] config fetch failed:", e?.message || e);
  }

  // 2) Fallback: derive from Pages (status=published)
  const siteQS = noSite ? "" : siteFilterQS({ host, siteSlug: siteParam });
  const base = `${STRAPI_URL}/api/pages`;
  const qs = `status=published&populate=*&sort=navOrder:asc&pagination[pageSize]=200`;
  const pagesUrl = siteQS ? `${base}?${siteQS}&${qs}` : `${base}?${qs}`;
  console.log("[menu] fallback pages →", pagesUrl);

  try {
    const { res, json } = await fetchJSON(pagesUrl, { headers: authHeaders(), cache: "no-store" });
    if (!res.ok) {
      console.warn("[menu] pages HTTP", res.status);
      return Response.json([]);
    }
    let rows = Array.isArray(json?.data) ? json.data : [];
    let items = toItemsFromPages(rows);
    if (!items.length && siteQS) {
      const noSiteUrl = `${base}?${qs}`;
      console.log("[menu] retry nosite →", noSiteUrl);
      const second = await fetchJSON(noSiteUrl, { headers: authHeaders(), cache: "no-store" });
      rows = Array.isArray(second.json?.data) ? second.json.data : [];
      items = toItemsFromPages(rows);
    }
    if (!includeHome) items = items.filter((i) => i.path !== "/");
    console.log("[menu] items →", items.length);
    return Response.json(items);
  } catch (e) {
    console.warn("[menu] pages fetch failed:", e?.message || e);
    return Response.json([]);
  }
}

async function fetchNewsBySlug(slug, siteSlug) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/news?sites=${siteSlug}&slug=${slug}`;
  console.log("[news] fetch →", url);

  const res = await fetch(url);
  const json = await res.json().catch(() => ({}));
  const item = Array.isArray(json) && json[0] ? json[0] : null;
  console.log("[news] result →", { status: res.status, found: !!item, id: item?.id });
  return item;
}

async function fetchRelatedNews(siteSlug, excludeId) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/news?sites=${siteSlug}&limit=3&exclude=${excludeId}`;
  console.log("[news] related fetch →", url);

  const res = await fetch(url);
  const json = await res.json().catch(() => []);
  const related = Array.isArray(json) ? json.filter((n) => n.id !== excludeId).slice(0, 3) : [];
  console.log("[news] related →", related.length);
  return related;
}

export default async function NewsPage({ params }) {
  const awaitedParams = await params;
  const slug = awaitedParams?.slug;
  const siteSlug = process.env.SITE_SLUG || "gt-world-challenge";
  console.log("[news] request →", { slug, siteSlug });

  const news = await fetchNewsBySlug(slug, siteSlug);
  if (!news) {
    console.log("[news] notFound");
    notFound();
  }

  const related = await fetchRelatedNews(siteSlug, news.id);

  return (
    <main className="pt-16 md:pt-24">
      {/* Hero */}
      <section
        className="relative h-64 md:h-80 bg-neutral-800"
        style={{
          backgroundImage: news.image ? `url(${news.image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-end px-4 pb-6">
          <div className="max-w-4xl">
            <h1 className="text-2xl md:text-4xl font-bold text-white">{news.title}</h1>
            <p className="mt-2 text-white/80 text-sm">
              {new Date(news.date).toLocaleDateString()} • By {news.author || "Staff"}
            </p>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="px-4 py-10">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <article className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: news.content || "No content" }} />
            </article>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Tags */}
              {news.tags && (
                <div className="rounded-md border border-neutral-200 bg-white p-4">
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {news.tags.map((tag, i) => (
                      <span key={i} className="inline-block bg-neutral-100 px-2 py-1 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="rounded-md border border-neutral-200 bg-white p-4">
                <h3 className="font-semibold mb-2">Share</h3>
                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Facebook</button>
                  <button className="bg-sky-500 text-white px-3 py-1 rounded text-sm">Twitter</button>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">WhatsApp</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related News */}
      {related.length > 0 && (
        <section className="px-4 py-10 bg-neutral-50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-xl font-bold mb-6">Related News</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((item) => (
                <div key={item.id} className="rounded-md border border-neutral-200 bg-white overflow-hidden">
                  {item.image && (
                    <div className="relative w-full h-40">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill
                        className="object-cover" 
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-xs text-neutral-600 mt-1">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                    <a
                      href={`/news/${item.slug}`}
                      className="text-blue-600 text-sm mt-2 inline-block"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const siteSlug = process.env.SITE_SLUG || "gt-world-challenge";
  const news = await fetchNewsBySlug(slug, siteSlug);

  if (!news) return { title: "News Not Found" };

  return {
    title: `${news.title} | News`,
    description: news.content?.substring(0, 160) || "Latest news",
    openGraph: {
      title: news.title,
      description: news.content?.substring(0, 160),
      images: news.image ? [news.image] : undefined,
    },
  };
}