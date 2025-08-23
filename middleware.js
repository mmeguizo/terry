import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const hostHeader = req.headers.get("host") || url.host;

  // pass-through existing headers + add our site hints
  const headers = new Headers(req.headers);
  headers.set("x-site-host", hostHeader);
  headers.set("x-site-hostname", url.hostname);

  // allow selecting site via query (?site= or ?slug=) or env default
  const slug = url.searchParams.get("site")
    || url.searchParams.get("slug")
    || process.env.DEFAULT_SITE_SLUG
    || process.env.SITE_SLUG
    || "";
  if (slug) headers.set("x-site-slug", slug);

  return NextResponse.next({ request: { headers } });
}

// Exclude assets but include pages and API so /api/config sees the headers
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|gif|svg|ico)$).*)",
  ],
};