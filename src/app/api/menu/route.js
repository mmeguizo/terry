export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { STRAPI_URL, authHeaders, siteFilterQS } from "@/lib/strapiQueries";

function topLevel(rows = []) {
  // Works for Strapi v5 (flat fields) and v4 (attributes.*)
  return rows.filter((row) => {
    const p = row?.path || row?.attributes?.path || "";
    return p === "/" || /^\/[^/]+$/.test(String(p)); // "/" or "/one-segment"
  });
}
async function get(url) {
  const res = await fetch(url, { headers: authHeaders(), cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  const rows = Array.isArray(json?.data) ? json.data : [];
  return { ok: res.ok, status: res.status, url, rows };
}

export async function GET(req) {
  const hdrs = await headers();
  const host = hdrs.get("x-site-host") || hdrs.get("host") || "";

  const u = new URL(req.url);
  const siteParam = u.searchParams.get("site") || "";
  const noSite = u.searchParams.get("nosite") === "1";
  const siteQS = noSite ? "" : siteFilterQS({ host, siteSlug: siteParam });

  const base = `${STRAPI_URL}/api/pages`;
  const common = "status=published&populate=*&sort=navOrder:asc&pagination[pageSize]=100";

  // Try multiple variants (relation null filter differs between setups)
  const urls = [
    siteQS ? `${base}?${siteQS}&filters[parent][id][$null]=true&${common}` : null,
    siteQS ? `${base}?${siteQS}&filters[parent][$null]=true&${common}` : null,
    siteQS ? `${base}?${siteQS}&${common}` : `${base}?${common}`, // no parent filter; we’ll filter top-level client-side
  ].filter(Boolean);

  let picked = null;
  for (const url of urls) {
    const r = await get(url);
    console.log("[menu] try →", { url: r.url, status: r.status, count: r.rows.length });
    if (!r.ok) continue;

    let rows = r.rows;
    // If we didn’t filter parent=null in Strapi, filter top-level here
    if (!/filters\[parent]/.test(url)) {
      rows = topLevel(rows);
      console.log("[menu] client-filter top-level →", rows.length);
    }
    if (rows.length) {
      picked = rows;
      break;
    }
  }

  // If still empty and we scoped by site, try without site filter once.
  if (!picked && siteQS) {
    const url = `${base}?${common}`;
    const r = await get(url);
    console.log("[menu] fallback nosite →", { url: r.url, status: r.status, count: r.rows.length });
    picked = topLevel(r.rows);
  }

  const items = (picked || []).map((row) => ({
    id: row?.id,
    title: row?.title || row?.attributes?.title || "Untitled",
    path: row?.path || row?.attributes?.path || "#",
  }));

  console.log("[menu] items →", items.length);
  return Response.json(items);
}