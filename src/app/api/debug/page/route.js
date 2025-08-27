import { headers, draftMode } from "next/headers";
import { buildPageByPathUrl, authHeaders } from "@/lib/strapiQueries";

export async function GET(req) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "/";
  const previewOverride = url.searchParams.get("preview") === "1";
  const noSite = url.searchParams.get("nosite") === "1";
  const siteParam = url.searchParams.get("site") || "";

  const hdrs = await headers();
  const host = noSite ? "" : (hdrs.get("x-site-host") || hdrs.get("x-site-hostname") || hdrs.get("host") || "");
  const { isEnabled } = await draftMode();
  const preview = previewOverride || isEnabled;

  const strapiUrl = buildPageByPathUrl({ path, host, siteSlug: siteParam, preview });
  const res = await fetch(strapiUrl, { headers: authHeaders(), cache: "no-store" });
  const json = await res.json().catch(() => ({}));

  // Optional draft-only fallback (publishedAt null isn’t needed in v5, but keep for safety)
  let draftFallback = null;
  if (preview && Array.isArray(json?.data) && json.data.length === 0) {
    const draftUrl = buildPageByPathUrl({ path, host, siteSlug: siteParam, preview: true, draftOnly: true });
    const dRes = await fetch(draftUrl, { headers: authHeaders(), cache: "no-store" });
    const dJson = await dRes.json().catch(() => ({}));
    draftFallback = { draftUrl, status: dRes.status, dataCount: Array.isArray(dJson?.data) ? dJson.data.length : null, raw: dJson };
  }

  return Response.json({
    ok: res.ok,
    status: res.status,
    preview,
    host,
    siteSlug: siteParam,
    path,
    strapiUrl,
    dataCount: Array.isArray(json?.data) ? json.data.length : null,
    raw: json,
    draftFallback,
  }, { status: res.status });
}