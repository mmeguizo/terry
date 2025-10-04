import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (token !== process.env.DRAFT_SECRET) return new NextResponse("Unauthorized", { status: 401 });

  (await draftMode()).enable();

  const redirectParam = url.searchParams.get("redirect") || "/";
  const redirectUrl = new URL(redirectParam, url.origin); // make absolute
  return NextResponse.redirect(redirectUrl);
}