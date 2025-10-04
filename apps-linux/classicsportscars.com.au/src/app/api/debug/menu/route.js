import { headers } from "next/headers";

const STRAPI_URL = process.env.STRAPI_URL || "";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || process.env.STRAPI_API_TOKEN || "";

function base() {
  return STRAPI_URL.replace(/\/$/, "");
}
function authHeaders() {
  return STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {};
}
function normHost(h = "") {
  return String(h).replace(/^https?:\/\//, "").replace(/\/$/, "");
}
function siteFilterQS({ host, siteSlug }) {
  if (siteSlug) return `filters[site][slug][$eq]=${encodeURIComponent(siteSlug)}`;
  if (host) return `filters[site][domain][$contains]=${encodeURIComponent(normHost(host))}`;
  return "";
}
function siteQS({ host, siteSlug }) {
  if (siteSlug) return `filters[slug][$eq]=${encodeURIComponent(siteSlug)}`;
  if (host) return `filters[domain][$contains]=${encodeURIComponent(normHost(host))}`;
  return "";
}
function normalizeMenu(items = []) {
  return (Array.isArray(items) ? items : []).map((m, i) => ({
    id: m.id ?? i,
    label: m.label || m.title || "Untitled",
    url: m.url || m.path || "/",
  }));
}

export async function GET(req) {
  const url = new URL(req.url);
  const siteSlug = url.searchParams.get("site") || url.searchParams.get("slug") || "";
  const hdrs = await headers();
  const host = hdrs.get("x-site-host") || hdrs.get("x-site-hostname") || hdrs.get("host") || "";

  // 1) Try dedicated Menu CT: /api/menus
  try {
    const menusUrl = `${base()}/api/menus?${siteFilterQS({ host, siteSlug })}&populate=*&pagination[pageSize]=1&sort=updatedAt:desc`;
    const res = await fetch(menusUrl, { headers: authHeaders(), cache: "no-store" });
    if (res.ok) {
      const json = await res.json().catch(() => null);
      const first = Array.isArray(json?.data) ? json.data[0] : null;
      const attrs = first?.attributes || first || null;
      if (attrs?.items) {
        return Response.json({ source: "menus", items: normalizeMenu(attrs.items), raw: json }, { status: 200 });
      }
    }
  } catch (_) {}

  // 2) Fallback: Site.menu from /api/sites
  try {
    const siteUrl = `${base()}/api/sites?${siteQS({ host, siteSlug })}&populate=*&pagination[pageSize]=1&sort=updatedAt:desc`;
    const res = await fetch(siteUrl, { headers: authHeaders(), cache: "no-store" });
    if (res.ok) {
      const json = await res.json().catch(() => null);
      const site = Array.isArray(json?.data) ? json.data[0] : null;
      const attrs = site?.attributes || site || {};
      if (Array.isArray(attrs.menu) && attrs.menu.length) {
        return Response.json({ source: "site.menu", items: normalizeMenu(attrs.menu), raw: json }, { status: 200 });
      }
    }
  } catch (_) {}

  // 3) Derived: top-level Pages (path = "/" or one segment)
  try {
    const pagesUrl = `${base()}/api/pages?${siteFilterQS({ host, siteSlug })}&populate=*&status=published&pagination[pageSize]=100&sort=navOrder:asc`;
    const res = await fetch(pagesUrl, { headers: authHeaders(), cache: "no-store" });
    if (res.ok) {
      const json = await res.json().catch(() => null);
      const items = (Array.isArray(json?.data) ? json.data : [])
        .map((d) => d.attributes || d)
        .filter((p) => {
          const path = String(p.path || "/");
          const depth = path === "/" ? 0 : path.split("/").filter(Boolean).length;
          return p.showInNav === true || (p.showInNav !== false && depth <= 1);
        })
        .sort((a, b) => (a.navOrder ?? 9999) - (b.navOrder ?? 9999))
        .map((p, i) => ({ id: p.id ?? i, label: p.navLabel || p.title || "Page", url: p.path || "/" }));
      return Response.json({ source: "derived", items, rawCount: items.length }, { status: 200 });
    }
  } catch (_) {}

  return Response.json({ source: "none", items: [] }, { status: 200 });
}