import { headers, draftMode } from "next/headers";
import { notFound } from "next/navigation";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export const revalidate = 120;

const STRAPI_URL = process.env.STRAPI_URL || "";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || process.env.STRAPI_API_TOKEN || "";

// Simple helpers
function authHeaders() {
  return STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {};
}
function populateQS() {
  // Strapi in your env rejects bracketed populate paths; keep it simple.
  return "populate=*";
}
function normalizePath(p = "/") {
  let out = String(p || "/").replace(/\/+/g, "/").replace(/\/$/, "");
  if (out === "") out = "/";
  return out;
}
function slugify(s = "") {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function joinPath(base = "/", seg = "") {
  if (!seg) return base === "/" ? "/" : base.replace(/\/+$/, "");
  return (`${base === "/" ? "" : base}/${seg}`).replace(/\/+/g, "/") || "/";
}
function computePagePath(page = {}) {
  const attrs = page.attributes || page;
  if (attrs?.path) return normalizePath(attrs.path);
  const isHome = !!attrs?.isHome;
  const seg = isHome ? "" : slugify(attrs?.slug || attrs?.title || "");
  const parent =
    attrs?.parent?.data?.attributes ||
    attrs?.parent?.attributes ||
    attrs?.parent ||
    null;
  const parentPath = parent?.path
    ? normalizePath(parent.path)
    : parent?.slug
    ? joinPath("/", slugify(parent.slug))
    : "/";
  return normalizePath(joinPath(parentPath, seg));
}

// Fetch helpers
async function fetchByPath(pathname, preview) {
  if (!STRAPI_URL) return null;
  const base = STRAPI_URL.replace(/\/$/, "");
  const qs = [
    `filters[path][$eq]=${encodeURIComponent(pathname)}`,
    `publicationState=${preview ? "preview" : "live"}`,
    populateQS(),
    "pagination[pageSize]=1",
  ].join("&");
  const url = `${base}/api/pages?${qs}`;
  console.log("[pages] fetchByPath ->", url, "AUTH:", Boolean(STRAPI_TOKEN));
  const res = await fetch(url, { cache: "no-store", headers: authHeaders() });
  console.log("[pages] status", res.status, res.statusText);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.log("[pages] body:", body.slice(0, 500));
    return null;
  }
  const json = await res.json().catch(() => null);
  const item = Array.isArray(json?.data) ? json.data[0] : null;
  return item?.attributes || item || null;
}

async function fetchCandidatesBySlug(lastSeg, preview) {
  if (!STRAPI_URL) return [];
  const base = STRAPI_URL.replace(/\/$/, "");
  const parts = [
    `filters[slug][$eq]=${encodeURIComponent(lastSeg)}`,
    `publicationState=${preview ? "preview" : "live"}`,
    populateQS(),
    "pagination[pageSize]=20",
    "sort=updatedAt:desc",
  ];
  const url = `${base}/api/pages?${parts.join("&")}`;
  console.log("[pages] fetchCandidatesBySlug ->", url);
  const res = await fetch(url, { cache: "no-store", headers: authHeaders() });
  console.log("[pages] candidates status", res.status, res.statusText);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.log("[pages] candidates body:", body.slice(0, 500));
    return [];
  }
  const json = await res.json().catch(() => null);
  return Array.isArray(json?.data) ? json.data.map((d) => d.attributes || d) : [];
}

// Page entry
export default async function Page(props) {
  const p = await props.params;
  const segs = Array.isArray(p?.slug) ? p.slug : [];
  const requestPath = normalizePath(segs.length ? `/${segs.join("/")}` : "/");
  const { isEnabled: preview } = await draftMode();

  let page = await fetchByPath(requestPath, preview);

  if (!page) {
    const lastSeg = segs[segs.length - 1] || "";
    const hdrs = await headers();
    console.log("[pages] request host:", hdrs.get("x-site-hostname") || hdrs.get("host"));
    const candidates = await fetchCandidatesBySlug(lastSeg, preview);
    page = candidates.find((p) => computePagePath(p) === requestPath) || null;

    if (!page && candidates.length) {
      console.warn(
        "[pages] no candidate matched requestPath:",
        requestPath,
        "candidates:",
        candidates.map((c) => ({ id: c.id, title: c.title, computed: computePagePath(c) }))
      );
    }
  }

  if (!page) notFound();

  // Fallback render if no blocks yet
  const blocks = Array.isArray(page.blocks) ? page.blocks : Array.isArray(page.sections) ? page.sections : [];

  if (!blocks.length) {
    return (
      <main className="min-h-[calc(100vh-14rem)] pt-28 pb-24 px-4 grid place-items-center">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold">{page.title || "Page"}</h1>
          <p className="mt-4 opacity-70">No content yet for this page.</p>
          <p className="mt-2 text-sm opacity-60">Path: {requestPath}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1 className="sr-only">{page.title || "Page"}</h1>
      <BlockRenderer blocks={blocks} />
    </main>
  );
}