import { headers } from "next/headers";
import { STRAPI_URL, authHeaders, siteFilterQS } from "@/lib/strapiQueries";

export const dynamic = "force-dynamic";

function isTopLevelPath(p) {
  const s = String(p || "");
  return s === "/" || /^\/[^/]+$/.test(s);
}
function toItemsFromPages(rows = []) {
  return rows
    .filter((row) => isTopLevelPath(row?.path || row?.attributes?.path))
    .map((row) => ({
      id: row?.id,
      title: row?.title || row?.attributes?.title || "Untitled",
      path: row?.path || row?.attributes?.path || "#",
    }));
}

async function fetchJSON(url, init) {
  const res = await fetch(url, init);
  const json = await res.json().catch(() => ({}));
  return { res, json };
}

export async function GET(req) {
  const hdrs = await headers();
  const host = hdrs.get("x-site-host") || hdrs.get("host") || "";
  const u = new URL(req.url);
  const siteParam = u.searchParams.get("site") || u.searchParams.get("sites") || "";
  const noSite = u.searchParams.get("nosite") === "1";
  const includeHome = u.searchParams.get("includeHome") !== "0"; // default true

  // 1) Try config first (your /api/config already returns menu)
  const origin = u.origin; // e.g. http://localhost:3000
  const configUrl = siteParam
    ? `${origin}/api/config?site=${encodeURIComponent(siteParam)}`
    : `${origin}/api/config`;
  console.log("[menu] try config →", configUrl);

  try {
    const { res, json } = await fetchJSON(configUrl, { cache: "no-store" });
    if (res.ok && Array.isArray(json?.menu) && json.menu.length) {
      let items = json.menu.map((m) => ({
        id: m.id ?? m.documentId ?? m.slug ?? m.label,
        title: m.label || m.title || "Untitled",
        path: m.url || m.path || "#",
      }));
      if (!includeHome) items = items.filter((i) => i.path !== "/");
      console.log("[menu] from config →", items.length);
      return Response.json(items);
    }
  } catch (e) {
    console.warn("[menu] config fetch failed:", e?.message || e);
  }

  // 2) Fallback: derive from Pages (status=published)
  const siteQS = noSite ? "" : siteFilterQS({ host, siteSlug: siteParam });
  const base = `${STRAPI_URL}/api/pages`;
  const qs = `status=published&populate=*&sort=navOrder:asc&pagination[pageSize]=200`;
  const pagesUrl = siteQS ? `${base}?${siteQS}&${qs}` : `${base}?${qs}`;
  console.log("[menu] fallback pages →", pagesUrl);

  try {
    const { res, json } = await fetchJSON(pagesUrl, { headers: authHeaders(), cache: "no-store" });
    if (!res.ok) {
      console.warn("[menu] pages HTTP", res.status);
      return Response.json([]);
    }
    let rows = Array.isArray(json?.data) ? json.data : [];
    let items = toItemsFromPages(rows);
    if (!items.length && siteQS) {
      const noSiteUrl = `${base}?${qs}`;
      console.log("[menu] retry nosite →", noSiteUrl);
      const second = await fetchJSON(noSiteUrl, { headers: authHeaders(), cache: "no-store" });
      rows = Array.isArray(second.json?.data) ? second.json.data : [];
      items = toItemsFromPages(rows);
    }
    if (!includeHome) items = items.filter((i) => i.path !== "/");
    console.log("[menu] items →", items.length);
    return Response.json(items);
  } catch (e) {
    console.warn("[menu] pages fetch failed:", e?.message || e);
    return Response.json([]);
  }
}