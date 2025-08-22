import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const STRAPI_URL = process.env.STRAPI_URL || "";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || "";

function getSiteFromRequest(request) {
  return (
    request?.headers?.get?.("x-site-host") ||
    request?.headers?.get?.("x-site-hostname") ||
    null
  );
}

function absoluteUrl(maybeUrl) {
  if (!maybeUrl) return null;
  if (typeof maybeUrl !== "string") return null;
  if (maybeUrl.startsWith("http")) return maybeUrl;
  if (!STRAPI_URL) return maybeUrl;
  return STRAPI_URL.replace(/\/$/, "") + (maybeUrl.startsWith("/") ? maybeUrl : `/${maybeUrl}`);
}

function slugify(input = "") {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeHeroButtons(heroObj) {
  // accept multiple possible container names
  let raw =
    Array.isArray(heroObj?.button) ? heroObj.button :
    Array.isArray(heroObj?.buttons) ? heroObj.buttons :
    Array.isArray(heroObj?.Button) ? heroObj.Button :
    [];

  // unwrap common Strapi shapes and normalize fields
  const unwrap = (item) => {
    if (!item) return null;
    // media/component wrapped in { data: { attributes: { ... } } }
    if (item.data && item.data.attributes) return item.data.attributes;
    // direct attributes
    if (item.attributes) return item.attributes;
    // some nested component fields may be under an inner key (e.g. { button: { label, url } })
    const innerKeys = Object.keys(item).filter(k => typeof item[k] === "object" && item[k] !== null);
    if (innerKeys.length === 1 && (item[innerKeys[0]]?.label || item[innerKeys[0]]?.url)) {
      return item[innerKeys[0]];
    }
    return item;
  };

  return raw
    .map(unwrap)
    .filter(Boolean)
    .map((b, i) => {
      const label =
        (typeof b === "string" ? b : null) ??
        b?.label ??
        b?.text ??
        b?.title ??
        b?.buttonLabel ??
        b?.name ??
        null;

      const url =
        b?.url ??
        b?.href ??
        b?.link ??
        b?.targetUrl ??
        b?.linkUrl ??
        b?.path ??
        null;

      return {
        id: b?.id ?? i,
        label: label ?? "Learn more",
        url: url ?? "#",
        target: b?.target || "_self",
      };
    });
}

function transformSiteAttributes(attrs = {}) {
  const heroObj = Array.isArray(attrs?.hero) ? attrs.hero[0] : attrs?.hero || {};
  return {
    siteTitle: attrs.siteTitle || attrs.title || "",
    primaryColor: attrs.primaryColor || "#000000",
    menuBackground: attrs.menuBackground || "#FFFFFF",
    textColor: attrs.textColor || "#000000",
    logoImage: absoluteUrl(attrs.logoImage?.data?.attributes?.url || attrs.logoImage) || null,
    menu: Array.isArray(attrs.menu) ? attrs.menu.map((m, i) => ({ id: m.id ?? i, label: m.label, url: m.url })) : [],
    hero: {
      background: absoluteUrl(heroObj?.background?.data?.attributes?.url || heroObj?.background) || null,
      eventDate: heroObj?.eventDate || heroObj?.date || null,
      eventInfo: heroObj?.eventInfo || heroObj?.eventInfoText || null,
      eventName: heroObj?.eventName || heroObj?.title || null,
      eventLocation: heroObj?.eventLocation || null,
      buttons: normalizeHeroButtons(heroObj),
    },
    eventDocuments: Array.isArray(attrs.eventDocuments) ? attrs.eventDocuments : [],
    websites: Array.isArray(attrs.websites)
      ? attrs.websites.map(w => ({ id: w.id, url: w.url, logo: absoluteUrl(w.logo?.data?.attributes?.url || w.logo), label: w.label }))
      : [],
    newsItems: Array.isArray(attrs.newsItems) ? attrs.newsItems : [],
    sponsors: Array.isArray(attrs.sponsors) ? attrs.sponsors.map(s => ({ ...s, logo: absoluteUrl(s.logo?.data?.attributes?.url || s.logo) })) : [],
    footer: {
      backgroundColor: (Array.isArray(attrs.footer) ? attrs.footer[0]?.backgroundColor : attrs.footer?.backgroundColor) || "#000000",
      textColor: (Array.isArray(attrs.footer) ? attrs.footer[0]?.textColor : attrs.footer?.textColor) || "#FFFFFF",
    },
    socials: Array.isArray(attrs.socials) ? attrs.socials : [],
  };
}

function hasHeroButtons(attrs) {
  const heroArr = Array.isArray(attrs?.hero) ? attrs.hero : attrs?.hero ? [attrs.hero] : [];
  const h = heroArr[0] || {};
  return (Array.isArray(h.button) && h.button.length > 0) || (Array.isArray(h.buttons) && h.buttons.length > 0);
}

async function fetchEventsInternal(request) {
  try {
    const headers = {};
    const siteHost = getSiteFromRequest(request);
    if (siteHost) headers["x-site-host"] = siteHost;

    const origin = (process.env.NODE_ENV !== "production")
      ? `http://localhost:${process.env.PORT || 3000}`
      : (process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`);

    const res = await fetch(new URL("/api/events", origin).toString(), { cache: "no-store", headers });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function fetchStrapiSite(request) {
  const debug = { STRAPI_URL: STRAPI_URL || null, tried: [], tokenUsed: !!STRAPI_TOKEN };
  if (!STRAPI_URL) return { attrs: null, debug: { error: "STRAPI_URL not set" } };

  const base = STRAPI_URL.replace(/\/$/, "");
  // Try most explicit nested populates first, then fallbacks
  const candidates = [
    "/api/sites?populate[hero][populate][button][populate]=*",
    "/api/sites?populate[hero][populate]=button",
    "/api/sites?populate=hero.button,hero,menu,websites,eventDocuments,news_item,footer,sponsors,socials",
    "/api/sites?populate[hero][populate]=*",
    "/api/sites?populate=*",
    "/api/site?populate[hero][populate][button][populate]=*",
    "/api/site?populate[hero][populate]=button",
    "/api/site?populate=hero.button,hero,menu,websites,eventDocuments,news_item,footer,sponsors,socials",
    "/api/site?populate[hero][populate]=*",
    "/api/site?populate=*",
    "/api/sites",
    "/api/site",
  ];

  const siteHost = getSiteFromRequest(request);
  const headers = {};
  if (siteHost) headers["x-site-host"] = siteHost;
  if (STRAPI_TOKEN) headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;

  let lastOk = null; // remember the best ok response even if buttons not present

  for (const path of candidates) {
    const url = `${base}${path}`;
    debug.tried.push(url);
    try {
      const res = await fetch(url, { cache: "no-store", headers });
      const text = await res.text().catch(() => "");
      debug[url] = { status: res.status, ok: res.ok, snippet: text ? (text.length > 300 ? text.slice(0, 300) + "…" : text) : null };
      console.log(`[config] tried ${url} -> status=${res.status} ok=${res.ok}`);
      if (!res.ok) continue;

      let json = {};
      try { json = text ? JSON.parse(text) : {}; } catch (e) { debug.parseError = String(e.message || e); continue; }

      // Collection response
      if (Array.isArray(json?.data)) {
        const items = json.data;
        const match = siteHost ? items.find((it) => {
          const a = it.attributes || {};
          const hostCandidates = [a.host, a.hostname, a.domain, a.slug, a.siteSlug, a.siteId].filter(Boolean).map(String);
          return hostCandidates.some(h => siteHost.includes(h) || siteHost === h);
        }) : null;
        const chosen = match ?? items[0];
        if (!chosen) continue;

        const attrs = chosen.attributes || chosen;
        if (hasHeroButtons(attrs)) {
          console.log("[config] found hero.button via:", path);
          return { attrs, debug };
        }
        // remember and keep trying more explicit populates
        lastOk = { attrs, debug };
        continue;
      }

      // Single-type response
      const attrs = json?.data?.attributes ?? null;
      if (attrs) {
        if (hasHeroButtons(attrs)) {
          console.log("[config] found hero.button via:", path);
          return { attrs, debug };
        }
        lastOk = { attrs, debug };
        continue;
      }

      // Raw attrs (no data wrapper)
      if (json && Object.keys(json).length && !("data" in json)) {
        if (hasHeroButtons(json)) {
          console.log("[config] found hero.button via raw:", path);
          return { attrs: json, debug };
        }
        lastOk = { attrs: json, debug };
      }
    } catch (err) {
      debug.error = String(err?.message || err);
    }
  }

  if (lastOk) return lastOk; // fallback to the best ok result even if no buttons populated
  console.log("[config] no matching site endpoint found. debug:", JSON.stringify(debug, null, 2));
  return { attrs: null, debug };
}

export async function GET(request) {
  try {
    const { attrs, debug } = await fetchStrapiSite(request);
    let cfg;
    if (attrs) {
      cfg = transformSiteAttributes(attrs);
    } else {
      cfg = {
        siteTitle: process.env.SITE_TITLE || "Site",
        primaryColor: process.env.PRIMARY_COLOR || "#000000",
        menuBackground: "#FFFFFF",
        textColor: "#000000",
        logoImage: null,
        menu: [],
        hero: { buttons: [] },
        eventDocuments: [],
        websites: [],
        newsItems: [],
        sponsors: [],
        footer: { backgroundColor: "#000000", textColor: "#FFFFFF" },
        socials: [],
      };
    }

    const events = await fetchEventsInternal(request);
    const enriched = { ...cfg, events };

    // Return debug when STRAPI_URL present but no attrs (helps troubleshooting)
    if (STRAPI_URL && !attrs) {
      return NextResponse.json({ ok: false, message: "no site found", debug, result: enriched }, { status: 200 });
    }

    return NextResponse.json(enriched);
  } catch (e) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 });
  }
}
