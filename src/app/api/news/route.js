// Simple News API proxy for Next.js (server-side)
// - Reads STRAPI_URL and SITE_SLUG from env
// - Fetches NewsItem records linked to the Site (relation key: "sites")
// - Sorts by "date" first, then falls back to "publishedAt" if Strapi rejects the sort
// - Returns a minimal array of news objects

export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

// Slug helper
function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  const base = (process.env.STRAPI_URL || "").replace(/\/+$/, "");
  const siteSlug = process.env.SITE_SLUG || "";
  const token = process.env.STRAPI_API_TOKEN || "";

  if (!base || !siteSlug) {
    console.warn("api/news: missing STRAPI_URL or SITE_SLUG");
    return NextResponse.json([]);
  }

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const RELS = ["sites", "site"]; // support M2M or M2O
  const SORTS = ["date:desc", "publishedAt:desc", "createdAt:desc"];

  const toAbs = (v) =>
    !v ? null : /^https?:\/\//i.test(String(v)) ? String(v) : `${base}/${String(v).replace(/^\/+/, "")}`;

  // Try combinations of relation + sort
  for (const rel of RELS) {
    for (const sort of SORTS) {
      const url =
        `${base}/api/news-items?filters[${rel}][slug][$eq]=${encodeURIComponent(siteSlug)}` +
        `&sort[0]=${encodeURIComponent(sort)}&pagination[limit]=8`;

      try {
        const res = await fetch(url, { headers, cache: "no-store" });
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          // Only keep looping on "Invalid key ..." 400s
          if (!(res.status === 400 && /Invalid key/i.test(body))) {
            console.warn("api/news fetch failed:", res.status, body);
            break;
          }
          continue;
        }

        const json = await res.json();
        const items = Array.isArray(json?.data) ? json.data : [];
        if (!items.length) continue;

        const out = items.map((row) => {
          const a = row?.attributes || row || {};
          const image =
            a.image?.data?.attributes?.url ||
            a.cover?.data?.attributes?.url ||
            a.thumbnail?.data?.attributes?.url ||
            a.image ||
            a.imageUrl ||
            null;

          const slug = a.slug || slugify(a.title) || String(row?.id || "");
          const path = slug ? `/news/${slug}` : "#";

          return {
            id: row?.id,
            title: a.title || "Untitled",
            slug,
            date: a.date || a.publishedAt || a.createdAt || null,
            image: toAbs(image),
            url: a.url || path,
            path,
          };
        });

        return NextResponse.json(out);
      } catch (e) {
        console.warn("api/news network error:", e.message || e);
      }
    }
  }

  // Final fallback: no sort
  try {
    const url =
      `${base}/api/news-items?filters[sites][slug][$eq]=${encodeURIComponent(siteSlug)}` +
      `&pagination[limit]=8`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) return NextResponse.json([]);
    const json = await res.json();
    const items = Array.isArray(json?.data) ? json.data : [];
    const out = items.map((row) => {
      const a = row?.attributes || row || {};
      const slug = a.slug || slugify(a.title) || String(row?.id || "");
      const path = slug ? `/news/${slug}` : "#";
      return {
        id: row?.id,
        title: a.title || "Untitled",
        slug,
        date: a.date || a.publishedAt || a.createdAt || null,
        image: toAbs(
          a.image?.data?.attributes?.url ||
            a.cover?.data?.attributes?.url ||
            a.thumbnail?.data?.attributes?.url ||
            a.image ||
            a.imageUrl ||
            null
        ),
        url: a.url || path,
        path,
      };
    });
    return NextResponse.json(out);
  } catch {
    return NextResponse.json([]);
  }
}