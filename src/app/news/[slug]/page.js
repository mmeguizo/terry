export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import configData from "@/config/site-config.json";
import fs from "fs";
import path from "path";
import Image from "next/image";

// Keep generateStaticParams but guard when configData.newsItems is missing
export async function generateStaticParams() {
  const items = Array.isArray(configData?.newsItems) ? configData.newsItems : [];
  return items.map((item) => ({
    slug: String(item.url || "").replace(/^\/news\//, "").replace(/\/+$/, ""),
  }));
}

// Function to get news item by slug
async function getNewsItem(slug) {
  try {
    // First, check if the news item exists in our config
    const newsItem = configData.newsItems.find((item) =>
      item.url === `/news/${slug}`
    );

    if (!newsItem) {
      return null;
    }

    // Try to load detailed content from JSON file
    const contentPath = path.join(
      process.cwd(),
      "src",
      "content",
      "news",
      `${slug}.json`
    );

    if (fs.existsSync(contentPath)) {
      const fileContent = fs.readFileSync(contentPath, "utf8");
      const detailedContent = JSON.parse(fileContent);

      // Merge config data with detailed content
      return {
        ...newsItem,
        ...detailedContent,
        // Ensure we keep the original URL from config
        url: newsItem.url,
      };
    } else {
      // Fallback to basic content if JSON file doesn't exist
      return {
        ...newsItem,
        body: [
          "This news item doesn't have detailed content yet. Please check back later for the full article.",
        ],
        author: "News Team",
        tags: ["motorsport", "event"],
        category: "General",
        readTime: "1 min read",
      };
    }
  } catch (error) {
    console.error(`Error loading news item ${slug}:`, error);
    return null;
  }
}

async function fetchJson(url, headers) {
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function getNewsBySlug(slug) {
  const base = (process.env.STRAPI_URL || "").replace(/\/+$/, "");
  const siteSlug = process.env.SITE_SLUG || "";
  const token = process.env.STRAPI_API_TOKEN || "";
  if (!base || !slug || !siteSlug) return null;

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const toAbs = (v) =>
    !v ? null : /^https?:\/\//i.test(String(v)) ? String(v) : `${base}/${String(v).replace(/^\/+/, "")}`;

  // Try with relation "sites"
  const url1 =
    `${base}/api/news-items?filters[slug][$eq]=${encodeURIComponent(slug)}` +
    `&filters[sites][slug][$eq]=${encodeURIComponent(siteSlug)}` +
    `&populate=*&pagination[limit]=1`;

  let json = await fetchJson(url1, headers);
  let row = json?.data?.[0];

  // Fallback to relation "site"
  if (!row) {
    const url2 =
      `${base}/api/news-items?filters[slug][$eq]=${encodeURIComponent(slug)}` +
      `&filters[site][slug][$eq]=${encodeURIComponent(siteSlug)}` +
      `&populate=*&pagination[limit]=1`;
    json = await fetchJson(url2, headers);
    row = json?.data?.[0];
  }

  if (!row) return null;
  const a = row.attributes || row;

  return {
    id: row.id,
    title: a.title || "Untitled",
    slug: a.slug || slug,
    date: a.date || a.publishedAt || a.createdAt || null,
    image: toAbs(
      a.image?.data?.attributes?.url ||
        a.cover?.data?.attributes?.url ||
        a.thumbnail?.data?.attributes?.url ||
        a.image ||
        null
    ),
    body: a.body || a.content || a.description || null,
    category: a.category || null,
    readTime: a.readTime || null,
    tags: Array.isArray(a.tags) ? a.tags : [],
    author: a.author || null,
  };
}

export default async function NewsPage({ params }) {
  const { slug } = await params; // Next 15: await params

  // Try Strapi first, then fallback to local config
  const fromStrapi = await getNewsBySlug(slug);
  const newsItem = fromStrapi || (await getNewsItem(slug));

  if (!newsItem) return notFound();

  return (
    <div className="">
      <div className="">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative w-full aspect-video max-h-[600px] overflow-hidden mb-6">
            <Image
              src={newsItem.image}
              alt={newsItem.title}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="container mx-auto">
            <div>
              {/* Category and Read Time */}
              <div className="flex items-center gap-4 mb-4">
                {newsItem.category && (
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                    {newsItem.category}
                  </span>
                )}
                {newsItem.readTime && (
                  <span className="text-gray-600 text-sm">
                    {newsItem.readTime}
                  </span>
                )}
                {newsItem.featured && (
                  <span className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {newsItem.title}
              </h1>
              {/* Excerpt */}
              {newsItem.excerpt && (
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {newsItem.excerpt}
                </p>
              )}
              <div className="flex items-center text-gray-600 mb-6">
                {newsItem.date && (
                  <time className="text-sm">
                    {new Date(newsItem.date).toLocaleDateString("en-AU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
                {newsItem.author && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-sm">By {newsItem.author}</span>
                  </>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div>
              <div className="">
                <div className="prose prose-lg max-w-none">
                  {Array.isArray(newsItem.body) ? (
                    newsItem.body.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-lg text-gray-700 leading-relaxed mb-6"
                      >
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {newsItem.body}
                    </p>
                  )}
                  {newsItem.tags && newsItem.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Tags:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {newsItem.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params; // await params
  const fromStrapi = await getNewsBySlug(slug);
  const newsItem = fromStrapi || (await getNewsItem(slug));

  if (!newsItem) {
    return { title: "News Not Found" };
  }

  const description =
    newsItem.seo?.metaDescription ||
    newsItem.excerpt ||
    (Array.isArray(newsItem.body)
      ? newsItem.body[0]?.substring(0, 160)
      : newsItem.body?.substring(0, 160)) ||
    `Read about ${newsItem.title}`;

  return {
    title: `${newsItem.title} | Wakefield 300`,
    description,
    keywords: newsItem.seo?.keywords?.join(", "),
    openGraph: {
      title: newsItem.title,
      description,
      images: [newsItem.image],
      type: "article",
      publishedTime: newsItem.date || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: newsItem.title,
      description,
      images: [newsItem.image],
    },
  };
}