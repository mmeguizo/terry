import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  (await draftMode()).disable();

  const url = new URL(req.url);
  const redirectParam = url.searchParams.get("redirect") || "/";
  const redirectUrl = new URL(redirectParam, url.origin); // make absolute
  return NextResponse.redirect(redirectUrl);
}