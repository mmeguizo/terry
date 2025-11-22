// /app/api/news/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const siteSlug = process.env.SITE_SLUG;
    if (!siteSlug) {
      return NextResponse.json({ error: "SITE_SLUG not set" }, { status: 400 });
    }

    // Try multiple approaches for Strapi v5 compatibility
    // First try articles endpoint (for Strapi Cloud)
    let newsUrl = `${process.env.STRAPI_URL}/api/articles?sort[0]=publishedAt:desc`;
    console.log('Fetching news with URL:', newsUrl);
    
    let newsRes = await fetch(newsUrl, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    
    console.log('News response status:', newsRes.status);
    let newsData = await newsRes.json();
    
    // If articles fails, try news-items as fallback
    if (!newsRes.ok || newsData.error) {
      console.log('Trying news-items endpoint...');
      newsUrl = `${process.env.STRAPI_URL}/api/news-items?filters[sites][slug][$eq]=${siteSlug}&sort[0]=publishedAt:desc`;
      newsRes = await fetch(newsUrl, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      newsData = await newsRes.json();
    }
    
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

    // Motorsport placeholder images for articles without images
    const placeholderImages = [
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg',
      'https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg',
      'https://images.pexels.com/photos/544290/pexels-photo-544290.jpeg',
      'https://images.pexels.com/photos/192334/pexels-photo-192334.jpeg',
      'https://images.pexels.com/photos/274399/pexels-photo-274399.jpeg',
      'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
      'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg',
      'https://images.pexels.com/photos/137577/pexels-photo-137577.jpeg',
    ];

    const normalized = transformedNews.map((n, index) => {
      let normalizedImage = null;

      if (n.image) {
        // If article has an image, normalize the URL
        normalizedImage = n.image.startsWith('http') ? n.image : `${base}${n.image}`;
      } else {
        // If no image, use placeholder
        normalizedImage = placeholderImages[index % placeholderImages.length];
      }

      return {
        ...n,
        image: normalizedImage,
      };
    });

    return NextResponse.json(normalized);
  } catch (err) {
    console.error("Error loading news items:", err);
    return NextResponse.json([], { status: 500 });
  }
}
