import Hero from "@/components/sections/Hero";
import EventDocuments from "@/components/sections/EventDocuments";
import LatestNews from "@/components/sections/LatestNews";
import Sponsors from "@/components/sections/Sponsors";

export const dynamic = "force-dynamic"; // avoid caching during dev

async function fetchJson(url, token) {
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text().catch(() => "")}`);
  return res.json();
}

async function getHomePage() {
  const base = (process.env.STRAPI_URL || "").replace(/\/+$/, "");
  const slug = process.env.SITE_SLUG || "";
  const token = process.env.STRAPI_API_TOKEN || "";
  if (!base || !slug) return null;

  // 1) Try isHome=true
  const byHome = `${base}/api/pages?filters[site][slug][$eq]=${encodeURIComponent(
    slug
  )}&filters[isHome][$eq]=true&pagination[limit]=1`;
  try {
    const j1 = await fetchJson(byHome, token);
    if (j1?.data?.[0]) return j1.data[0].attributes || j1.data[0];
  } catch (e) {
    console.warn("getHomePage by isHome failed:", e.message);
  }

  // 2) Fallback to path="/"
  const byPath = `${base}/api/pages?filters[site][slug][$eq]=${encodeURIComponent(
    slug
  )}&filters[path][$eq]=%2F&pagination[limit]=1`;
  try {
    const j2 = await fetchJson(byPath, token);
    if (j2?.data?.[0]) return j2.data[0].attributes || j2.data[0];
  } catch (e) {
    console.warn('getHomePage by path="/" failed:', e.message);
  }

  return null;
}

export default async function Home() {
  const page = await getHomePage();

  if (!page) {
    return (
      <main style={{ padding: 24 }}>
        <h1>No home page found</h1>
        <p>Check isHome=true or path=&quot;/&quot; on a Page for this site.</p>
      </main>
    );
  }

  return (
    <>
      <Hero />
      <EventDocuments />
      <LatestNews />
      <Sponsors />
    </>
  );
}