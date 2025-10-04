import { headers } from "next/headers";
import { buildPageByPathUrl, authHeaders } from "@/lib/strapiQueries";

export async function GET(req) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "/";
  const preview = url.searchParams.get("preview") === "1";
  const siteParam = url.searchParams.get("site") || "";

  const hdrs = await headers();
  const host = hdrs.get("x-site-host") || hdrs.get("x-site-hostname") || hdrs.get("host") || "";

  const strapiUrl = buildPageByPathUrl({ path, host, siteSlug: siteParam, preview });
  console.log("[debug/api] GET", { path, preview, host, siteParam, strapiUrl });

  const res = await fetch(strapiUrl, { headers: authHeaders(), cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  const dataCount = Array.isArray(json?.data) ? json.data.length : null;

  return Response.json(
    {
      ok: res.ok,
      status: res.status,
      preview,
      host,
      siteSlug: siteParam,
      path,
      strapiUrl,
      dataCount,
      raw: json,
    },
    { status: res.status }
  );
}