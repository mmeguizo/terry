import { NextResponse } from "next/server";

export function middleware(req) {
  const requestHeaders = new Headers(req.headers);
  // Forward host in stable headers (used by your fetchers)
  requestHeaders.set("x-site-hostname", req.nextUrl.host);
  requestHeaders.set("x-site-host", `${req.nextUrl.protocol}//${req.nextUrl.host}`);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

// Exclude static assets, include pages and API
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|gif|svg|webp|ico)).*)",
  ],
};