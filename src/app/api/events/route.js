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
  try {
    // Try RaceReady Events API first
    const origin = getOrigin();
    const raceReadyRes = await fetch(`${origin}/api/raceready-events?view=events`, {
      cache: "no-store",
    });

    if (raceReadyRes.ok) {
      const events = await raceReadyRes.json();
      if (Array.isArray(events) && events.length > 0) {
        console.log('✅ Returning events from RaceReady:', events.length);
        return NextResponse.json(events);
      }
    }

    // Fallback to Strapi (legacy)
    const siteHost = getSiteFromRequest(request);
    const url = new URL(request.url);
    const qsSite = url.searchParams.get("siteHost");
    const effectiveSite = siteHost || qsSite || null;

    const fetchInit = {
      headers: effectiveSite ? { "x-site-host": effectiveSite } : undefined,
      cache: "no-store",
    };

    const strapiUrl = process.env.STRAPI_URL;
    const eventsRes = await fetch(
      `${strapiUrl}/api/events?populate=deep${effectiveSite ? `&filters[site][host][$eq]=${encodeURIComponent(effectiveSite)}` : ""}`,
      fetchInit
    );

    if (eventsRes.ok) {
      const json = await eventsRes.json();
      const items = Array.isArray(json?.data) ? json.data.map(d => d.attributes) : [];
      return NextResponse.json(items);
    }

    // Final fallback: synthesize from Site.hero
    const siteRes = await fetch(`${strapiUrl}/api/site?populate=deep`, fetchInit);
    const siteJson = siteRes.ok ? await siteRes.json() : null;
    const siteAttrs = siteJson?.data?.attributes;
    const synthesized = siteAttrs ? [transformSiteHeroToEvent(siteAttrs)] : [];
    return NextResponse.json(synthesized);
  } catch (e) {
    console.error('Events API error:', e);
    return NextResponse.json({ error: e?.message || "Failed to fetch events" }, { status: 500 });
  }
}

// Helper to slugify strings
function slugify(str) {
  if (!str) return '';
  return str.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// helper used above - implement according to your transform
function transformSiteHeroToEvent(siteAttrs) {
  const heroObj = Array.isArray(siteAttrs?.hero) ? siteAttrs.hero[0] : siteAttrs?.hero;
  return {
    id: siteAttrs?.id ?? "site-hero",
    title: heroObj?.eventName || heroObj?.title || siteAttrs?.siteTitle,
    name: heroObj?.eventName || heroObj?.title || siteAttrs?.siteTitle,
    slug: heroObj?.slug || slugify(heroObj?.eventName || siteAttrs?.siteTitle),
    startDate: heroObj?.eventDate,
    date: heroObj?.eventDate,
    image: heroObj?.background,
    venue: heroObj?.eventLocation || heroObj?.venue || 'TBD',
    location: heroObj?.eventLocation || heroObj?.venue || 'TBD',
    path: `/events/${heroObj?.slug || (heroObj?.eventName ? slugify(heroObj.eventName) : siteAttrs.id)}`,
  };
}