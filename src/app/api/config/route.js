import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const STRAPI_URL = process.env.STRAPI_URL || "";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || "";
const PUBLICATION_STATE = process.env.STRAPI_PUBLICATION_STATE || "preview";

// Small helpers
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
  if (/^https?:\/\//i.test(maybeUrl)) return maybeUrl;
  if (!STRAPI_URL) return maybeUrl;
  return STRAPI_URL.replace(/\/$/, "") + (maybeUrl.startsWith("/") ? maybeUrl : `/${maybeUrl}`);
}

function buildPopulateQuery(fields = []) {
  const sp = new URLSearchParams();
  fields.forEach(f => sp.append("populate", f));
  return sp.toString();
}

// Keep hero buttons simple (root-level heroButton[])
function normalizeHeroButtonsFromRoot(attrs = {}) {
  const raw = Array.isArray(attrs.heroButton) ? attrs.heroButton : [];
  return raw.map((b, i) => ({
    id: b?.id ?? i,
    label: b?.label ?? b?.text ?? "Learn more",
    url: b?.url ?? b?.href ?? "#",
    target: b?.target || "_self",
  }));
}

// 2) Update the transformer to use heroButton from root
function transformSiteAttributes(attrs = {}) {
  const heroObj = Array.isArray(attrs?.hero) ? attrs.hero[0] : attrs?.hero || {};
  return {
    siteTitle: attrs.siteTitle || attrs.title || "",
    primaryColor: attrs.primaryColor || "#000000",
    menuBackground: attrs.menuBackground || "#FFFFFF",
    textColor: attrs.textColor || "#000000",
    logoImage: absoluteUrl(attrs.logoImage?.data?.attributes?.url || attrs.logoImage) || null,

    menu: Array.isArray(attrs.menu)
      ? attrs.menu.map((m, i) => ({ id: m.id ?? i, label: m.label, url: m.url }))
      : [],

    // Do NOT nest buttons inside hero
    hero: {
      background: absoluteUrl(heroObj?.background?.data?.attributes?.url || heroObj?.background) || null,
      eventDate: heroObj?.eventDate || heroObj?.date || null,
      eventInfo: heroObj?.eventInfo || heroObj?.eventInfoText || null,
      eventName: heroObj?.eventName || heroObj?.title || null,
      eventLocation: heroObj?.eventLocation || null,
    },

    // NEW: root-level heroButton normalized
    heroButton: normalizeHeroButtonsFromRoot(attrs),

    eventDocuments: Array.isArray(attrs.eventDocuments) ? attrs.eventDocuments : [],
    websites: Array.isArray(attrs.websites)
      ? attrs.websites.map(w => ({
          id: w.id,
          url: w.url,
          logo: absoluteUrl(w.logo?.data?.attributes?.url || w.logo),
          label: w.label,
        }))
      : [],
    newsItems: Array.isArray(attrs.news_item) ? attrs.news_item
             : Array.isArray(attrs.newsItems) ? attrs.newsItems : [],
    sponsors: Array.isArray(attrs.sponsors)
      ? attrs.sponsors.map(s => ({ ...s, logo: absoluteUrl(s.logo?.data?.attributes?.url || s.logo) }))
      : [],
    footer: {
      backgroundColor: (Array.isArray(attrs.footer) ? attrs.footer[0]?.backgroundColor : attrs.footer?.backgroundColor) || "#000000",
      textColor: (Array.isArray(attrs.footer) ? attrs.footer[0]?.textColor : attrs.footer?.textColor) || "#FFFFFF",
    },
    socials: Array.isArray(attrs.socials) ? attrs.socials : [],
  };
}

// 3) Keep the fetch simple; just ensure heroButton is populated
// In your fetchStrapiSite(), update populateFields to include heroButton
// (replace the existing populateFields array)
const populateFields = [
  "hero",
  "heroButton",       // CHANGED: pull root-level heroButton[]
  "menu",
  "websites",
  "websites.logo",
  "eventDocuments",
  "news_item",
  "pages",
  "footer",
  "sponsors",
  "sponsors.logo",
  "socials",
];

async function fetchEventsInternal(request) {
  try {
    const headers = {};
    const siteHost = getSiteFromRequest(request);
    if (siteHost) headers["x-site-host"] = siteHost;

    const origin =
      process.env.NODE_ENV !== "production"
        ? `http://localhost:${process.env.PORT || 3000}`
        : process.env.NEXT_PUBLIC_BASE_URL ||
          process.env.NEXTAUTH_URL ||
          `http://localhost:${process.env.PORT || 3000}`;

    const res = await fetch(new URL("/api/events", origin).toString(), { cache: "no-store", headers });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// New: get desired site slug
function getSiteSlugFromRequest(request) {
  try {
    const u = request?.nextUrl ?? new URL(request.url);
    const sp = u.searchParams;
    const q = sp.get("site") || sp.get("slug");
    const header = request?.headers?.get?.("x-site-slug");
    return (q || header || process.env.DEFAULT_SITE_SLUG || "").trim() || null;
  } catch {
    return process.env.DEFAULT_SITE_SLUG || null;
  }
}

async function fetchStrapiSite(request) {
  if (!STRAPI_URL) return { attrs: null, debug: { error: "STRAPI_URL not set" } };

  const base = STRAPI_URL.replace(/\/$/, "");
  const headers = {};
  if (STRAPI_TOKEN) headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;

  // Choose site by slug if provided
  const slug = getSiteSlugFromRequest(request);
  const filterQS = slug ? `&filters[slug][$eq]=${encodeURIComponent(slug)}` : "";
  const sortQS = `&sort=updatedAt:desc`;
  const pageQS = `&pagination[pageSize]=1`;

  // Readable bracket-style populate (hero + heroButton + common relations)
  const urlPrimary =
    `${base}/api/sites` +
    `?populate[hero]=*` +
    `&populate[heroButton]=*` +
    `&populate[menu]=*` +
    `&populate[websites][populate]=logo` +
    `&populate[eventDocuments]=*` +
    `&populate[newsItems]=*` +        // harmless if field doesn't exist
    `&populate[news_item]=*` +        // actual field in your data
    `&populate[footer]=*` +
    `&populate[sponsors][populate]=logo` +
    `&populate[socials]=*` +
    filterQS + sortQS + pageQS;

  const urlFallback =
    `${base}/api/sites?populate=*` + filterQS + sortQS + pageQS;

  let res = await fetch(urlPrimary, { cache: "no-store", headers });
  console.log(`[config] GET ${urlPrimary} -> ${res.status}`);
  if (!res.ok) {
    res = await fetch(urlFallback, { cache: "no-store", headers });
    console.log(`[config] GET ${urlFallback} -> ${res.status}`);
    if (!res.ok) return { attrs: null, debug: { status: res.status } };
  }

  const json = await res.json().catch(() => null);
  const items = Array.isArray(json?.data) ? json.data : [];
  if (!items.length) return { attrs: null, debug: { note: "no items", slugTried: slug || null } };

  // Extra safety: if API ignored filter, pick by slug manually
  const chosen = slug
    ? (items.find(it => (it.attributes?.slug || it.slug) === slug) || items[0])
    : items[0];

  const attrs = chosen?.attributes || chosen || null;
  return { attrs, debug: { ok: true, slugUsed: slug || null } };
}

export async function GET(request) {
  try {
    const { attrs } = await fetchStrapiSite(request);
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
    return NextResponse.json({ ...cfg, events });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 });
  }
}
