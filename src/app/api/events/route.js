//// javascript
// filepath: c:\Users\PC\Desktop\SIDELINE\terry\src\app\api\events\route.js
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

function slugify(input) {
  return String(input || "")
    .toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
const toAbs = (base, v) =>
  !v ? null : /^https?:\/\//i.test(String(v)) ? String(v) : `${base}/${String(v).replace(/^\/+/, "")}`;

async function fetchJson(url, headers) {
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function GET() {
  const base = (process.env.STRAPI_URL || "").replace(/\/+$/, "");
  const siteSlug = process.env.SITE_SLUG || "";
  const token = process.env.STRAPI_API_TOKEN || "";
  if (!base || !siteSlug) return NextResponse.json([]);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Try a few common API IDs and relation keys
  const ENDPOINTS = ["events", "event-items", "race-events"];
  const RELS = ["sites", "site"];
  const SORTS = ["startDate:asc", "date:asc", "createdAt:desc"];

  for (const ep of ENDPOINTS) {
    for (const rel of RELS) {
      for (const sort of SORTS) {
        const url =
          `${base}/api/${ep}?filters[${rel}][slug][$eq]=${encodeURIComponent(siteSlug)}` +
          `&populate=*&sort[0]=${encodeURIComponent(sort)}&pagination[limit]=50`;
        try {
          const json = await fetchJson(url, headers);
          const rows = Array.isArray(json?.data) ? json.data : [];
          if (!rows.length) continue;

          const items = rows.map((row) => {
            const a = row?.attributes || row || {};
            const slug = a.slug || slugify(a.title) || String(row?.id || "");
            const dateStr = a.startDate || a.date || a.eventDate || null;
            const year = dateStr ? new Date(dateStr).getFullYear() : null;

            const image =
              a.image?.data?.attributes?.url ||
              a.poster?.data?.attributes?.url ||
              a.cover?.data?.attributes?.url ||
              a.thumbnail?.data?.attributes?.url ||
              a.image || a.imageUrl || null;

            const path = slug ? `/events/${slug}` : "#";
            const altPath = year && slug ? `/${year}/${slug}` : null;

            return {
              id: row?.id,
              title: a.title || a.name || "Untitled",
              slug,
              date: dateStr,
              endDate: a.endDate || null,
              location: a.location || a.venue || null,
              image: toAbs(base, image),
              url: a.url || path,
              path,
              altPath, // optional: /<year>/<slug>
            };
          });

          return NextResponse.json(items);
        } catch {
          // try next combo
        }
      }
    }
  }

  return NextResponse.json([]);
}