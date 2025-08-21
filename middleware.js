import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const requestHeaders = new Headers(req.headers);

  requestHeaders.set("x-site-host", url.host);
  requestHeaders.set("x-site-hostname", url.hostname);

  url.searchParams.forEach((value, key) => {
    requestHeaders.set(`x-q-${key}`, value);
  });

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};