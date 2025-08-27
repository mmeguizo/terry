import { draftMode, headers as nextHeaders } from "next/headers";
import { notFound } from "next/navigation"; // <-- add this
import { strapiBase, siteFilterQS, authHeaders } from "@/lib/strapiQueries";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export const revalidate = 120;

function pageQuery({ path, preview, siteQS }) {
  const pub = preview ? "draft" : "published"; // Strapi v5
  return [
    siteQS,
    `filters[path][$eq]=${encodeURIComponent(path)}`,
    `status=${pub}`,
    "populate=*",
    "pagination[pageSize]=1",
  ]
    .filter(Boolean)
    .join("&");
}

// Fetch helpers
async function fetchByPath(path, preview, host, siteSlug) {
  const siteQS = siteFilterQS({ host, siteSlug });
  const url = `${strapiBase()}/api/pages?${pageQuery({ path, preview, siteQS })}`;
  const init = preview
    ? { headers: authHeaders(), cache: "no-store" } // live preview
    : { headers: authHeaders() };                   // allow ISR
  const res = await fetch(url, init);
  if (!res.ok) return null;
  const json = await res.json().catch(() => ({}));
  return Array.isArray(json?.data) && json.data[0] ? json.data[0] : null;
}

// Page entry
export default async function Page({ params }) {
  const segs = Array.isArray(params?.slug) ? params.slug : [];
  const path = segs.length ? `/${segs.join("/")}` : "/";
  const { isEnabled: preview } = await draftMode();
  const hdrs = await nextHeaders();
  const host = hdrs.get("x-site-host") || hdrs.get("x-site-hostname") || hdrs.get("host") || "";

  const page = await fetchByPath(path, preview, host, process.env.SITE_SLUG || process.env.DEFAULT_SITE_SLUG);
  if (!page) notFound();

  const blocks = Array.isArray(page.blocks) ? page.blocks : Array.isArray(page.sections) ? page.sections : [];

  if (!blocks.length) {
    return (
      <main className="min-h-[calc(100vh-14rem)] pt-28 pb-24 px-4 grid place-items-center">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold">{page.title || "Page"}</h1>
          <p className="mt-4 opacity-70">No content yet for this page.</p>
          <p className="mt-2 text-sm opacity-60">Path: {path}</p>
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