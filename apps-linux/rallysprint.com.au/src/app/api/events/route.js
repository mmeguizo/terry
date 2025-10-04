//// javascript
// filepath: c:\Users\PC\Desktop\SIDELINE\terry\src\app\api\events\route.js
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

function getSiteFromRequest(request) {
  return (
    request?.headers?.get?.("x-site-host") ||
    request?.headers?.get?.("x-site-hostname") ||
    null
  );
}

// existing helper to build origin
function getOrigin() {
  const isDev = process.env.NODE_ENV !== "production";
  const local = `http://localhost:${process.env.PORT || 3000}`;
  return isDev ? local : (process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || local);
}

export async function GET(request) {
  const siteHost = getSiteFromRequest(request);

  // If you support query params (e.g., ?siteHost=...), prefer header then query
  const url = new URL(request.url);
  const qsSite = url.searchParams.get("siteHost");
  const effectiveSite = siteHost || qsSite || null;

  try {
    // When listing events from Strapi or internal API, forward the site identifier
    const fetchInit = {
      headers: effectiveSite ? { "x-site-host": effectiveSite } : undefined,
      cache: "no-store",
    };

    // Try Strapi-backed events first (example)
    const strapiUrl = process.env.STRAPI_URL;
    // adjust your Strapi query to filter by site host if you have such a field:
    // e.g. /api/events?filters[site][host][$eq]=<hostname>&populate=deep
    const eventsRes = await fetch(
      `${strapiUrl}/api/events?populate=deep${effectiveSite ? `&filters[site][host][$eq]=${encodeURIComponent(effectiveSite)}` : ""}`,
      fetchInit
    );

    if (eventsRes.ok) {
      const json = await eventsRes.json();
      // normalize to array expected by callers
      const items = Array.isArray(json?.data) ? json.data.map(d => /* map attributes */ d.attributes) : [];
      return NextResponse.json(items);
    }

    // fallback: synthesize from Site.hero if no events collection
    const siteRes = await fetch(`${strapiUrl}/api/site?populate=deep`, fetchInit);
    const siteJson = siteRes.ok ? await siteRes.json() : null;
    const siteAttrs = siteJson?.data?.attributes;
    const synthesized = siteAttrs ? [ /* create event object from siteAttrs.hero */ transformSiteHeroToEvent(siteAttrs) ] : [];
    return NextResponse.json(synthesized);
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Failed to fetch events" }, { status: 500 });
  }
}

// helper used above - implement according to your transform
function transformSiteHeroToEvent(siteAttrs) {
  const heroObj = Array.isArray(siteAttrs?.hero) ? siteAttrs.hero[0] : siteAttrs?.hero;
  return {
    id: siteAttrs?.id ?? "site-hero",
    title: heroObj?.eventName || heroObj?.title || siteAttrs?.siteTitle,
    slug: heroObj?.slug || slugify(heroObj?.eventName || siteAttrs?.siteTitle),
    startDate: heroObj?.eventDate,
    image: heroObj?.background,
    path: `/events/${heroObj?.slug || (heroObj?.eventName ? slugify(heroObj.eventName) : siteAttrs.id)}`,
    // ...other fields as required
  };
}