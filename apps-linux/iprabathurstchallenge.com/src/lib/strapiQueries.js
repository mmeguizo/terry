/* Simple Strapi v5 client (with logs) */

export const STRAPI_URL = (process.env.STRAPI_URL || "").replace(/\/$/, "");
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || process.env.STRAPI_API_TOKEN || "";
const DEFAULT_SITE_SLUG = process.env.SITE_SLUG || process.env.DEFAULT_SITE_SLUG || "";

/** Headers for Strapi requests */
export function authHeaders() {
  return STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {};
}

function normHost(h = "") {
  return String(h).replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** Build site filter query (prefer slug, fallback to request host) */
export function siteFilterQS({ host, siteSlug } = {}) {
  const slug = siteSlug || DEFAULT_SITE_SLUG;
  if (slug) return `filters[site][slug][$eq]=${encodeURIComponent(slug)}`;
  const hostNorm = host ? normHost(host) : "";
  if (hostNorm) return `filters[site][domain][$contains]=${encodeURIComponent(hostNorm)}`;
  return "";
}

/** Build URL to fetch a Page by its full path. Uses Strapi v5 status param. */
export function buildPageByPathUrl({ path, host, siteSlug, preview = false }) {
  const parts = [
    siteFilterQS({ host, siteSlug }),
    `filters[path][$eq]=${encodeURIComponent(path)}`,
    `status=${preview ? "draft" : "published"}`,
    "populate=*",
    "pagination[pageSize]=1",
  ].filter(Boolean);
  return `${STRAPI_URL}/api/pages?${parts.join("&")}`;
}

/** Fetch a Page by path with logs. In preview: no-store. Otherwise: allow ISR. */
export async function fetchPageByPath({ path, host, siteSlug, preview = false }) {
  const url = buildPageByPathUrl({ path, host, siteSlug, preview });
  const init = preview ? { headers: authHeaders(), cache: "no-store" } : { headers: authHeaders() };

  console.log("[strapi] fetchPageByPath →", { path, preview, host, siteSlug: siteSlug || DEFAULT_SITE_SLUG, url });

  const res = await fetch(url, init);
  if (!res.ok) {
    console.warn("[strapi] fetchPageByPath HTTP", res.status, url);
    return { page: null, url, status: res.status, dataCount: 0 };
  }
  const json = await res.json().catch(() => ({}));
  const page = Array.isArray(json?.data) && json.data[0] ? json.data[0] : null;
  const dataCount = Array.isArray(json?.data) ? json.data.length : 0;

  console.log("[strapi] fetchPageByPath result →", { status: res.status, dataCount, id: page?.id, path: page?.path });
  return { page, url, status: res.status, dataCount, raw: json };
}