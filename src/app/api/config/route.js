import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const STRAPI_URL = process.env.STRAPI_URL || "";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || "";

// Lazy-load local default site config safely. If the file doesn't exist, return null.
async function loadDefaultSiteConfig() {
  try {
    const mod = await import("@/config/site-config.json");
    return mod?.default || mod;
  } catch {
    return null;
  }
}

function getSiteFromRequest(request) {
  // Check common headers set by middleware, then query-hint headers (x-q-*), then URL query params
  const h = request?.headers;
  const tryHeader = (name) => (h && h.get ? h.get(name) : null);
  const headerCandidates = [
    tryHeader("x-site-host"),
    tryHeader("x-site-hostname"),
    tryHeader("x-site-hostname"),
    tryHeader("x-q-site"),
    tryHeader("x-q-slug"),
    tryHeader("x-q-host"),
  ].filter(Boolean);
  if (headerCandidates.length) return headerCandidates[0];

  try {
    const url = new URL(request.url);
    return url.searchParams.get("site") || url.searchParams.get("siteHost") || url.searchParams.get("q") || null;
  } catch (e) {
    return null;
  }
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
  menu: Array.isArray(attrs.menu) ? attrs.menu.map((m, i) => ({ id: m.id ?? i, label: m.label, url: m.url })) : Array.isArray(attrs.Menu) ? attrs.Menu : [],
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
      : Array.isArray(attrs.website)
      ? attrs.website.map(w => ({ id: w.id, url: w.url, logo: absoluteUrl(w.logo?.data?.attributes?.url || w.logo), label: w.label }))
      : [],
    newsItems: Array.isArray(attrs.newsItems) ? attrs.newsItems : Array.isArray(attrs.news_item) ? attrs.news_item : [],
    sponsors: Array.isArray(attrs.sponsors)
      ? attrs.sponsors.map(s => ({ ...s, logo: absoluteUrl(s.logo?.data?.attributes?.url || s.logo) }))
      : Array.isArray(attrs.sponsor)
      ? attrs.sponsor.map(s => ({ ...s, logo: absoluteUrl(s.logo?.data?.attributes?.url || s.logo) }))
      : [],
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
  const maybe = (obj, keys) => keys.some(k => Array.isArray(obj?.[k]) && obj[k].length > 0);
  if (maybe(h, ["button", "buttons"])) return true;

  // some Strapi shapes put components under nested keys e.g. { hero: { data: { attributes: { buttons: [...] }}}}
  const nested = h.data?.attributes || h.attributes || {};
  if (maybe(nested, ["button", "buttons"])) return true;

  // fallback: check raw attrs for any top-level buttons array
  if (Array.isArray(attrs?.buttons) && attrs.buttons.length > 0) return true;

  return false;
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
    // Prefer collection endpoints first (your Strapi uses /api/sites)
    "/api/sites?populate[hero][populate][button][populate]=*",
    "/api/sites?populate[hero][populate]=*",
    "/api/sites?populate[menu]=*&populate[websites][populate]=logo&populate[eventDocuments]=*&populate[newsItems]=*&populate[news_item]=*&populate[footer]=*&populate[sponsors][populate]=logo&populate[socials]=*",
    "/api/sites?populate=*",

    // // Then single-type fallbacks
    // "/api/site?populate[hero][populate][button][populate]=*",
    // "/api/site?populate[hero][populate]=*",
    // "/api/site?populate[menu]=*&populate[websites][populate]=logo&populate[eventDocuments]=*&populate[newsItems]=*&populate[news_item]=*&populate[footer]=*&populate[sponsors][populate]=logo&populate[socials]=*",
    // "/api/site?populate=*",

    // // Bare endpoints last
    // "/api/sites",
    // "/api/site",
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
        // Decide if this response contains more than just a hero button
        const hasUsefulContent =
          (Array.isArray(attrs.menu) && attrs.menu.length > 0) ||
          (Array.isArray(attrs.websites) && attrs.websites.length > 0) ||
          (Array.isArray(attrs.newsItems) && attrs.newsItems.length > 0) ||
          (Array.isArray(attrs.news_item) && attrs.news_item.length > 0) ||
          (Array.isArray(attrs.sponsors) && attrs.sponsors.length > 0) ||
          (Array.isArray(attrs.socials) && attrs.socials.length > 0) ||
          (attrs.footer && Object.keys(attrs.footer).length > 0);

        if (hasUsefulContent) {
          console.log("[config] found useful site content via:", path);
          return { attrs, debug };
        }

        if (hasHeroButtons(attrs)) {
          console.log("[config] found hero.button via (keeping looking):", path);
          lastOk = { attrs, debug };
          continue;
        }

        // remember and keep trying more explicit populates
        lastOk = { attrs, debug };
        continue;
      }

      // Single-type response
      const attrs = json?.data?.attributes ?? null;
      if (attrs) {
        const hasUsefulContent =
          (Array.isArray(attrs.menu) && attrs.menu.length > 0) ||
          (Array.isArray(attrs.websites) && attrs.websites.length > 0) ||
          (Array.isArray(attrs.newsItems) && attrs.newsItems.length > 0) ||
          (Array.isArray(attrs.news_item) && attrs.news_item.length > 0) ||
          (Array.isArray(attrs.sponsors) && attrs.sponsors.length > 0) ||
          (Array.isArray(attrs.socials) && attrs.socials.length > 0) ||
          (attrs.footer && Object.keys(attrs.footer).length > 0);

        if (hasUsefulContent) {
          console.log("[config] found useful site content via:", path);
          return { attrs, debug };
        }

        if (hasHeroButtons(attrs)) {
          console.log("[config] found hero.button via (keeping looking):", path);
          lastOk = { attrs, debug };
          continue;
        }

        lastOk = { attrs, debug };
        continue;
      }

      // Raw attrs (no data wrapper)
      if (json && Object.keys(json).length && !("data" in json)) {
        const rawAttrs = json;
        const hasUsefulContent =
          (Array.isArray(rawAttrs.menu) && rawAttrs.menu.length > 0) ||
          (Array.isArray(rawAttrs.websites) && rawAttrs.websites.length > 0) ||
          (Array.isArray(rawAttrs.newsItems) && rawAttrs.newsItems.length > 0) ||
          (Array.isArray(rawAttrs.news_item) && rawAttrs.news_item.length > 0) ||
          (Array.isArray(rawAttrs.sponsors) && rawAttrs.sponsors.length > 0) ||
          (Array.isArray(rawAttrs.socials) && rawAttrs.socials.length > 0) ||
          (rawAttrs.footer && Object.keys(rawAttrs.footer).length > 0);

        if (hasUsefulContent) {
          console.log("[config] found useful site content via raw:", path);
          return { attrs: rawAttrs, debug };
        }

        if (hasHeroButtons(rawAttrs)) {
          console.log("[config] found hero.button via raw (keeping looking):", path);
          lastOk = { attrs: rawAttrs, debug };
        } else {
          lastOk = { attrs: rawAttrs, debug };
        }
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
  const urlObj = new URL(request.url);
  const wantDebug = (request.headers?.get?.("x-debug") === "1") || urlObj.searchParams.get("debug") === "1";
    let cfg;
    if (attrs) {
      cfg = transformSiteAttributes(attrs);
      // Merge missing sections from the default local config only
      const fallbackCfg = (await loadDefaultSiteConfig()) || {};
      if (!Array.isArray(cfg.menu) || cfg.menu.length === 0) cfg.menu = fallbackCfg.menu || [];
      if (!Array.isArray(cfg.websites) || cfg.websites.length === 0) cfg.websites = fallbackCfg.websites || [];
      if (!Array.isArray(cfg.newsItems) || cfg.newsItems.length === 0) cfg.newsItems = fallbackCfg.newsItems || [];
      if (!Array.isArray(cfg.sponsors) || cfg.sponsors.length === 0) cfg.sponsors = fallbackCfg.sponsors || [];
      if (!cfg.hero || !Array.isArray(cfg.hero.buttons) || cfg.hero.buttons.length === 0) {
        cfg.hero = { ...(cfg.hero || {}), buttons: fallbackCfg?.hero?.buttons || [] };
      }
    } else {
      // Local fallback: try the default site-config.json, else return a minimal object
      const cfgFromFile = await loadDefaultSiteConfig();
      cfg = cfgFromFile || {
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
    // If caller requested debug, include Strapi debug info and the raw attrs
    if (wantDebug) {
      return NextResponse.json({ ...enriched, _debug: debug, _attrs: attrs || null }, { status: 200 });
    }

    // If STRAPI_URL present but no attrs, still return a plain config shape and attach minimal debug hints
    if (STRAPI_URL && !attrs) {
      return NextResponse.json({ ...enriched, _ok: false, _message: "no site found", _debug: debug }, { status: 200 });
    }

    return NextResponse.json(enriched);
  } catch (e) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 });
  }
}
