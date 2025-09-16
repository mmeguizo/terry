// /app/api/news/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const siteSlug = process.env.SITE_SLUG;
    if (!siteSlug) {
      return NextResponse.json({ error: "SITE_SLUG not set" }, { status: 400 });
    }

    // Fetch news related to this site by slug
    // Use a valid sortable field for Strapi v5; fall back if datePublished is not present
    const newsUrl = `${process.env.STRAPI_URL}/api/news-items?filters[sites][slug][$eq]=${siteSlug}&sort[0]=publishedAt:desc&populate[image]=*`;
    console.log('Fetching news with URL:', newsUrl);
    const newsRes = await fetch(newsUrl, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    console.log('News response status:', newsRes.status);
    const newsData = await newsRes.json();
    const strapiUrl = process.env.STRAPI_URL || "";
    console.log({ newsData });

    // Transform data (Strapi v5: flat structure)
    const transformedNews = (newsData.data || []).map((item) => ({
      id: item.id,
      documentId: item.documentId,
      title: item.title,
      slug: item.slug,
      // Prefer specific date field if present, otherwise use publishedAt or createdAt
      date: item.datePublished || item.publishedAt || item.createdAt,
      image: item.image?.url || item.image?.formats?.medium?.url || item.image?.formats?.small?.url || item.image || null,
      url: item.url,
      content: item.content,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      publishedAt: item.publishedAt,
    }));

    // Normalize Strapi absolute URL if needed
    const base = process.env.STRAPI_URL?.replace(/\/$/, '') || '';
    const normalized = transformedNews.map(n => ({
      ...n,
      image: n.image && n.image.startsWith('http') ? n.image : (n.image ? `${base}${n.image}` : null),
    }));

    return NextResponse.json(normalized);
  } catch (err) {
    console.error("Error loading news items:", err);
    return NextResponse.json([], { status: 500 });
  }
}
