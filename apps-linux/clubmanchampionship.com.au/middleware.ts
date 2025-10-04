import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const url = new URL(req.url);
  const host = url.host; // e.g. localhost:3000
  const headers = new Headers(req.headers);
  headers.set("x-site-host", host);

  console.log("[mw] x-site-host →", host, "|", url.pathname + url.search);

  return NextResponse.next({ request: { headers } });
}

// Avoid running on static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets|images|fonts).*)"],
};