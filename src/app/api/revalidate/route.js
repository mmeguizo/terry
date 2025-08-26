export const runtime = "nodejs";
import { revalidatePath, revalidateTag } from "next/cache";

function unauthorized() {
  return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

async function doRevalidate(req, data = {}) {
  const secret = process.env.REVALIDATE_SECRET;
  const url = new URL(req.url);
  const token = req.headers.get("x-revalidate-token") || url.searchParams.get("token");
  if (!secret || token !== secret) return unauthorized();

  const path = data.path || url.searchParams.get("path");
  const tag = data.tag || url.searchParams.get("tag");

  if (tag) revalidateTag(tag);
  if (path) revalidatePath(path);
  if (!tag && !path) revalidatePath("/");

  return Response.json({ ok: true, revalidated: { path: path || "/", tag: tag || null } });
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  return doRevalidate(req, body);
}

export async function GET(req) {
  return doRevalidate(req, {});
}