const STRAPI_URL = process.env.STRAPI_URL || "";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || process.env.STRAPI_API_TOKEN || "";
const DEFAULT_SITE_SLUG = process.env.SITE_SLUG || process.env.DEFAULT_SITE_SLUG || "";

export function authHeaders() {
  return STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {};
}
export function strapiBase() {
  return STRAPI_URL.replace(/\/$/, "");
}
function normHost(h = "") {
  return String(h).replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// Prefer slug; fall back to domain
export function siteFilterQS({ host, siteSlug } = {}) {
  const slug = siteSlug || DEFAULT_SITE_SLUG;
  if (slug) return `filters[site][slug][$eq]=${encodeURIComponent(slug)}`;
  if (host) return `filters[site][domain][$contains]=${encodeURIComponent(normHost(host))}`;
  return "";
}

/** Page by path; omit site scoping in preview to avoid mismatches */
export function buildPageByPathUrl({ path, host, siteSlug, preview = false, forceSite = false }) {
  const base = strapiBase();
  const parts = [
    (!preview || forceSite) ? siteFilterQS({ host, siteSlug }) : null,
    `filters[path][$eq]=${encodeURIComponent(path)}`,
    `publicationState=${preview ? "preview" : "live"}`,
    "populate=*",
    "pagination[pageSize]=1",
  ].filter(Boolean);
  return `${base}/api/pages?${parts.join("&")}`;
}

/** Build: Menu for a site */
export function buildMenuBySiteUrl({ host, siteSlug }) {
  const base = strapiBase();
  const parts = [
    siteFilterQS({ host, siteSlug }),
    // Keep populate simple (your Strapi choked on deep/bracketed paths)
    "populate=*",
    "pagination[pageSize]=1",
    "sort=updatedAt:desc",
  ].filter(Boolean);
  return `${base}/api/menus?${parts.join("&")}`;
}