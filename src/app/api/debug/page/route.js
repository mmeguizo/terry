import { headers, draftMode } from "next/headers";
import { buildPageByPathUrl, authHeaders } from "@/lib/strapiQueries";

export async function GET(req) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "/";
  const siteSlug = url.searchParams.get("site") || "";
  const forceSite = url.searchParams.get("forceSite") === "1";

  const hdrs = await headers();
  const host = hdrs.get("x-site-host") || hdrs.get("x-site-hostname") || hdrs.get("host") || "";

  const { isEnabled } = await draftMode();
  const strapiUrl = buildPageByPathUrl({ path, host, siteSlug, preview: isEnabled, forceSite });
  const res = await fetch(strapiUrl, { headers: authHeaders() });
  const body = await res.text().catch(() => "");
  try {
    const json = JSON.parse(body || "{}");
    return Response.json({
      ok: res.ok,
      status: res.status,
      preview: isEnabled,
      host,
      siteSlug,
      path,
      strapiUrl,
      dataCount: Array.isArray(json?.data) ? json.data.length : null,
      raw: json,
    }, { status: res.status });
  } catch {
    return new Response(body, { status: res.status, headers: { "content-type": "application/json" } });
  }
}