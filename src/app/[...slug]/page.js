import { draftMode, headers as nextHeaders } from "next/headers";
import { notFound } from "next/navigation";
import { fetchPageByPath } from "@/lib/strapiQueries";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export const revalidate = 120;

export default async function Page({ params }) {
  const awaitedParams = await params
  const segs = Array.isArray(awaitedParams?.slug) ? awaitedParams.slug : [];
  const path = segs.length ? `/${segs.join("/")}` : "/";

  const { isEnabled: preview } = await draftMode();
  const hdrs = await nextHeaders();
  const host =
    hdrs.get("x-site-host") ||
    hdrs.get("x-site-hostname") ||
    hdrs.get("host") ||
    "";

  console.log("[page] request →", { path, preview, host });

  // SITE_SLUG/DEFAULT_SITE_SLUG can be set in .env.local; leave undefined to use host
  const siteSlug = process.env.SITE_SLUG || process.env.DEFAULT_SITE_SLUG;

  const { page, url, dataCount, status } = await fetchPageByPath({
    path,
    host,
    siteSlug,
    preview,
  });

  console.log("[page] fetch summary →", { url, status, dataCount, foundId: page?.id });

  if (!page) {
    console.log("[page] notFound()");
    notFound();
  }
     
  const blocks = Array.isArray(page.blocks)
    ? page.blocks
    : Array.isArray(page.sections)
    ? page.sections
    : [];

  if (!blocks.length) {
    return (
      <main className="min-h-[calc(100vh-14rem)] pt-28 xl:pt-32 2xl:pt-36 pb-24 xl:pb-28 2xl:pb-32 px-4 grid place-items-center">
        <div className="container mx-auto max-w-3xl xl:max-w-6xl 2xl:max-w-7xl text-center">
          <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold">{page.title || "Page"}</h1>
          <p className="mt-4 xl:mt-6 2xl:mt-8 opacity-70 text-lg xl:text-xl 2xl:text-2xl">No content yet for this page.</p>
          <p className="mt-2 xl:mt-3 2xl:mt-4 text-sm xl:text-base 2xl:text-lg opacity-60">Path: {path}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1 className="sr-only">{page.title || "Page"}</h1>
      <BlockRenderer blocks={blocks} />
    </main>
  );
}