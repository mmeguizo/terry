const STRAPI_URL = process.env.STRAPI_URL || "";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || process.env.STRAPI_API_TOKEN || "";
const DEFAULT_SITE_SLUG = process.env.SITE_SLUG || process.env.DEFAULT_SITE_SLUG || "";

export function strapiBase() {
  return STRAPI_URL.replace(/\/$/, "");
}

export function authHeaders() {
  return STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {};
}

function normHost(h = "") {
  return String(h).replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function siteFilterQS({ host, siteSlug } = {}) {
  const slug = siteSlug || DEFAULT_SITE_SLUG;
  if (slug) return `filters[site][slug][$eq]=${encodeURIComponent(slug)}`;
  if (host) return `filters[site][domain][$contains]=${encodeURIComponent(normHost(host))}`;
  return "";
}

// Strapi v5 publication param
function publicationQS({ preview = false, draftOnly = false } = {}) {
  const isDraft = preview || draftOnly;
  return `status=${isDraft ? "draft" : "published"}`;
}

// Page by exact path
export function buildPageByPathUrl({ path, host, siteSlug, preview = false, draftOnly = false }) {
  const base = strapiBase();
  const parts = [
    siteFilterQS({ host, siteSlug }),
    `filters[path][$eq]=${encodeURIComponent(path)}`,
    publicationQS({ preview, draftOnly }),
    "populate=*",
    "pagination[pageSize]=1",
  ].filter(Boolean);
  return `${base}/api/pages?${parts.join("&")}`;
}