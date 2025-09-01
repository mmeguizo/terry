// Simple News API proxy for Next.js (server-side)
// Strapi v5: uses status=published
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normHost(h = "") {
  return String(h).replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export async function GET(req) {
  const base = (process.env.STRAPI_URL || "").replace(/\/+$/, "");
  const token = process.env.STRAPI_API_TOKEN || "";

  // Prefer site from header (middleware sets x-site-host); allow ?site= override; fallback to env
  const url = new URL(req.url);
  const siteFromQuery = url.searchParams.get("site") || "";
  const host = req.headers.get("x-site-host") || req.headers.get("host") || "";
  const defaultSite = process.env.SITE_SLUG || "";
  const siteSlug = siteFromQuery || defaultSite;

  if (!base || !siteSlug) {
    console.warn("[news] missing STRAPI_URL or SITE_SLUG", { base: !!base, siteSlug });
    return NextResponse.json([]);
  }

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const RELS = ["sites", "site"]; // support M2M or M2O
  const SORTS = ["date:desc", "publishedAt:desc", "createdAt:desc"];

  const toAbs = (v) =>
    !v ? null : /^https?:\/\//i.test(String(v)) ? String(v) : `${base}/${String(v).replace(/^\/+/, "")}`;

  console.log("[news] request →", { siteSlug, host: normHost(host) });

  for (const rel of RELS) {
    for (const sort of SORTS) {
      const urlStr =
        `${base}/api/news-items?filters[${rel}][slug][$eq]=${encodeURIComponent(siteSlug)}` +
        `&status=published&sort[0]=${encodeURIComponent(sort)}&pagination[limit]=8`;

      try {
        const res = await fetch(urlStr, { headers, cache: "no-store" });
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          if (!(res.status === 400 && /Invalid key/i.test(body))) {
            console.warn("[news] fetch failed:", res.status, body);
            break;
          }
          continue;
        }

        const json = await res.json();
        const items = Array.isArray(json?.data) ? json.data : [];
        console.log("[news] try:", { rel, sort, count: items.length });
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
        console.warn("[news] network error:", e.message || e);
      }
    }
  }

  // Final fallback without sort
  try {
    const urlStr =
      `${base}/api/news-items?filters[sites][slug][$eq]=${encodeURIComponent(siteSlug)}` +
      `&status=published&pagination[limit]=8`;
    const res = await fetch(urlStr, { headers, cache: "no-store" });
    if (!res.ok) return NextResponse.json([]);
    const json = await res.json();
    const items = Array.isArray(json?.data) ? json.data : [];
    console.log("[news] fallback count:", items.length);
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