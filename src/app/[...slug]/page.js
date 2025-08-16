export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";

// Tiny fetch helper
async function fetchJson(url, token) {
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

// ["about"] -> "/about", ["about","team"] -> "/about/team"
function buildPath(segments) {
  const parts = (segments || []).map((s) => String(s || "").trim()).filter(Boolean);
  return `/${parts.join("/")}`.replace(/\/+/g, "/");
}

async function getPageByPath(path) {
  const base = (process.env.STRAPI_URL || "").replace(/\/+$/, "");
  const siteSlug = process.env.SITE_SLUG || "";
  const token = process.env.STRAPI_API_TOKEN || "";
  if (!base || !siteSlug) return null;

  const url =
    `${base}/api/pages?filters[site][slug][$eq]=${encodeURIComponent(siteSlug)}` +
    `&filters[path][$eq]=${encodeURIComponent(path)}&pagination[limit]=1`;

  const json = await fetchJson(url, token);
  const row = json?.data?.[0];
  return row ? row.attributes || row : null;
}

export default async function Page({ params }) {
  // params is a Promise in Next 15
  const { slug } = await params;

  const path = buildPath(slug);
  const page = await getPageByPath(path);
  if (!page) return notFound();

  return (
    <main style={{ padding: 24 }}>
      <h1>{page.title}</h1>
      <p>Path: {page.path}</p>
      <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 6 }}>
        {JSON.stringify(page, null, 2)}
      </pre>
    </main>
  );
}