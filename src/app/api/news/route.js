// Simple News API proxy for Next.js (server-side)
// - Reads STRAPI_URL and SITE_SLUG from env
// - Fetches NewsItem records linked to the Site (relation key: "sites")
// - Sorts by "date" first, then falls back to "publishedAt" if Strapi rejects the sort
// - Returns a minimal array of news objects

import { NextResponse } from "next/server";

export async function GET() {
  const base = (process.env.STRAPI_URL || "").replace(/\/+$/, "");
  const siteSlug = process.env.SITE_SLUG || "";
  const token = process.env.STRAPI_API_TOKEN || "";

  // Quick env sanity checks for easier debugging
  if (!base) {
    console.error("STRAPI_URL is not set");
    return NextResponse.json({ error: "STRAPI_URL not set" }, { status: 500 });
  }
  if (!siteSlug) {
    console.error("SITE_SLUG is not set");
    return NextResponse.json({ error: "SITE_SLUG not set" }, { status: 400 });
  }

  // Helper to build the URL (with optional sort)
  const buildUrl = (sort) =>
    `${base}/api/news-items?filters[sites][slug][$eq]=${encodeURIComponent(siteSlug)}${
      sort ? `&sort[0]=${encodeURIComponent(sort)}` : ""
    }`;

  // Try a small set of safe sort keys in order
  const sorts = ["date:desc", "publishedAt:desc"];
  let lastResponse = null;
  let json = null;

  for (const s of sorts) {
    const url = buildUrl(s);
    console.log("Fetching news:", url);
    lastResponse = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });

    if (lastResponse.ok) {
      json = await lastResponse.json();
      break;
    }

    // Log the response body for visibility
    const body = await lastResponse.text().catch(() => "");
    console.warn("News fetch failed:", { status: lastResponse.status, body });

    // Only try next sort if this is a typical "Invalid key ..." 400
    if (!(lastResponse.status === 400 && /Invalid key/i.test(body))) {
      break;
    }
  }

  // Final fallback: no sort at all
  if (!json && lastResponse && !lastResponse.ok) {
    const url = buildUrl("");
    console.log("Retrying news without sort:", url);
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("News fetch (no sort) failed:", { status: res.status, body });
      return NextResponse.json({ error: "Failed to fetch news" }, { status: 502 });
    }
    json = await res.json();
  }

  // Normalize and return a minimal shape for the UI
  const items = Array.isArray(json?.data) ? json.data : [];
  const out = items.map((row) => {
    const a = row?.attributes || row || {};
    return {
      id: row?.id,
      title: a.title || "Untitled",
      slug: a.slug || null,
      // Prefer your "date" field; fall back to Strapi timestamps
      date: a.date || a.publishedAt || a.createdAt || null,
      image: a.image || null, // your model uses Text for image
      url: a.url || (a.slug ? `/news/${a.slug}` : "#"),
    };
  });

  return NextResponse.json(out);
}