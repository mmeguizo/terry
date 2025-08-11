// /app/api/news/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const siteSlug = process.env.SITE_SLUG;
    if (!siteSlug) {
      return NextResponse.json({ error: "SITE_SLUG not set" }, { status: 400 });
    }

    // Fetch news related to this site by slug
    const newsUrl = `${process.env.STRAPI_URL}/api/news-items?filters[sites][slug][$eq]=${siteSlug}&sort[0]=datePublished:desc`;
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
      date: item.datePublished,
      image: item.image || null,
      url: item.url,
      content: item.content,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      publishedAt: item.publishedAt,
    }));

    return NextResponse.json(transformedNews);
  } catch (err) {
    console.error("Error loading news items:", err);
    return NextResponse.json([], { status: 500 });
  }
}
