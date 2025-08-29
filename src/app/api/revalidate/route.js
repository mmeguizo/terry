export const runtime = "nodejs";

function json(data, status = 200) {
  return Response.json(data, { status });
}
function unauthorized() {
  return json({ ok: false, error: "Unauthorized" }, 401);
}
function normalizePath(p) {
  if (!p) return "/";
  let out = String(p).trim();
  if (!out.startsWith("/")) out = `/${out}`;
  return out.replace(/\/{2,}/g, "/");
}

async function doRevalidate(path, reason = "manual") {
  const p = normalizePath(path);
  console.log("[revalidate] revalidatePath →", p, "| reason:", reason);
  // Next's API
  const { revalidatePath } = await import("next/cache");
  revalidatePath(p);
  return json({ ok: true, path: p, reason });
}

function extractPathFromStrapi(body) {
  // Strapi default webhook body (v4/v5) commonly: { event, model, entry: { path, ... } }
  if (body?.path) return body.path;
  if (body?.entry?.path) return body.entry.path;
  if (body?.data?.path) return body.data.path; // safety
  return null;
}

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  if (!process.env.REVALIDATE_SECRET || token !== process.env.REVALIDATE_SECRET) {
    console.warn("[revalidate][GET] invalid token");
    return unauthorized();
  }
  const path = url.searchParams.get("path") || "/";
  return doRevalidate(path, "GET");
}

export async function POST(req) {
  const url = new URL(req.url);
  const token = req.headers.get("x-revalidate-token") || url.searchParams.get("token") || "";
  if (!process.env.REVALIDATE_SECRET || token !== process.env.REVALIDATE_SECRET) {
    console.warn("[revalidate][POST] invalid token");
    return unauthorized();
  }
  const body = await req.json().catch(() => ({}));

  // Prefer explicit path; else extract from Strapi payload
  const path =
    body.path ||
    extractPathFromStrapi(body) ||
    url.searchParams.get("path") ||
    "/";

  const reason =
    body.reason ||
    (body?.event ? String(body.event) : "POST");

  console.log("[revalidate][POST] payload summary:", {
    event: body?.event,
    model: body?.model,
    path,
  });

  return doRevalidate(path, reason);
}