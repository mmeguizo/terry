import { notFound } from 'next/navigation';
import Image from 'next/image';
import configData from '@/config/site-config.json';
import fs from 'fs';
import path from 'path';

// This will be used for static generation of known news items
export async function generateStaticParams() {
    return configData.newsItems.map((item) => ({
        slug: item.url.replace('/news/', ''), // Extract slug from URL
    }));
}

// Function to get news item by slug
async function getNewsItem(slug) {
    try {
        // First try to fetch from Strapi API
        const baseUrl = process.env.SITE_DOMAIN || 'http://localhost:3000';
        const newsRes = await fetch(`${baseUrl}/api/news`, { cache: "no-store" });
        
        if (newsRes.ok) {
            const newsItems = await newsRes.json();
            const strapiItem = newsItems.find(item => item.slug === slug);
            
            if (strapiItem) {
                return {
                    title: strapiItem.title,
                    date: strapiItem.date,
                    image: strapiItem.image,
                    content: strapiItem.content,
                    slug: strapiItem.slug,
                    url: `/news/${strapiItem.slug}`,
                    // Parse content if it's rich text
                    body: strapiItem.content 
                        ? (Array.isArray(strapiItem.content) ? strapiItem.content : [strapiItem.content])
                        : ["This news article content is being updated. Please check back later."],
                    author: "News Team",
                    category: "Motorsport News",
                    readTime: "2 min read",
                    tags: ["motorsport", "racing"]
                };
            }
        }

        // Fallback to local config
        const newsItem = configData.newsItems.find(item =>
            item.url === `/news/${slug}`
        );

        if (!newsItem) {
            return null;
        }

        // Try to load detailed content from JSON file
        const contentPath = path.join(process.cwd(), 'src', 'content', 'news', `${slug}.json`);

        if (fs.existsSync(contentPath)) {
            const fileContent = fs.readFileSync(contentPath, 'utf8');
            const detailedContent = JSON.parse(fileContent);

            // Merge config data with detailed content
            return {
                ...newsItem,
                ...detailedContent,
                // Ensure we keep the original URL from config
                url: newsItem.url
            };
        } else {
            // Fallback to basic content if JSON file doesn't exist
            return {
                ...newsItem,
                body: ["This news item doesn't have detailed content yet. Please check back later for the full article."],
                author: "News Team",
                tags: ["motorsport", "event"],
                category: "General",
                readTime: "1 min read"
            };
        }
    } catch (error) {
        console.error(`Error loading news item ${slug}:`, error);
        return null;
    }
}

export default async function NewsPage({ params }) {
    const awaitedParams = await params;
    const newsItem = await getNewsItem(awaitedParams.slug);

    if (!newsItem) {
        notFound();
    }

    const canonical = typeof window === 'undefined' ? undefined : window.location.origin + newsItem.url;

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: newsItem.title,
        image: newsItem.image && newsItem.image.trim() && newsItem.image !== 'null' && newsItem.image !== 'undefined' ? [newsItem.image] : undefined,
        datePublished: newsItem.date,
        dateModified: newsItem.date,
        author: newsItem.author ? { '@type': 'Person', name: newsItem.author } : undefined,
    };

    return (
        <div className="">
            {/* JSON-LD for SEO */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
            <div className="">
                {/* Hero Section */}
                <div className="mb-10">
                    {newsItem.image && newsItem.image.trim() && newsItem.image !== 'null' && newsItem.image !== 'undefined' ? (
                        <div className="relative w-full aspect-video max-h-[600px] overflow-hidden mb-6 rounded-md">
                            <Image
                                src={newsItem.image}
                                alt={newsItem.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="relative w-full aspect-video max-h-[600px] overflow-hidden mb-6 rounded-md bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
                            <div className="text-white/60 text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-lg font-medium">News Article</p>
                            </div>
                        </div>
                    )}

                    <div className="container">
                        <div>
                            {/* Category and Read Time */}
                            <div className="flex items-center gap-4 mb-4">
                                {newsItem.category && (
                                    <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-sm uppercase tracking-wide">
                                        {newsItem.category}
                                    </span>
                                )}
                                {newsItem.readTime && (
                                    <span className="text-white/60 text-sm">
                                        {newsItem.readTime}
                                    </span>
                                )}
                                {newsItem.featured && (
                                    <span className="px-3 py-1 bg-yellow-500 text-black text-xs rounded-sm uppercase tracking-wide">
                                        Featured
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                                {newsItem.title}
                            </h1>
                            {/* Excerpt */}
                            {newsItem.excerpt && (
                                <p className="text-xl text-white/80 mb-6 leading-relaxed">
                                    {newsItem.excerpt}
                                </p>
                            )}
                            <div className="flex items-center text-white/60 mb-8">
                                <time className="text-sm">
                                    {new Date(newsItem.date).toLocaleDateString('en-AU', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                                {newsItem.author && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <span className="text-sm">By {newsItem.author}</span>
                                    </>
                                )}
                            </div>
                            <div className="mb-8">
                              <a href="#news" className="button" style={{ "--primary-color": '#3b82f6' }}>
                                ← Back to News
                              </a>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div>
                            <div className="">
                                <div className="max-w-none">
                                    {/* Render body content */}
                                    {Array.isArray(newsItem.body) ? (
                                        newsItem.body.map((item, index) => {
                                            // Handle Strapi block content
                                            if (typeof item === 'object' && item.type === 'paragraph') {
                                                return (
                                                    <p key={index} className="text-[17px] text-white/90 leading-8 mb-5">
                                                        {item.children?.map((child, childIndex) => {
                                                            if (typeof child === 'object' && child.text) {
                                                                return child.text;
                                                            }
                                                            return typeof child === 'string' ? child : '';
                                                        }).join('')}
                                                    </p>
                                                );
                                            }
                                            // Handle plain string content
                                            else if (typeof item === 'string') {
                                                return (
                                                    <p key={index} className="text-[17px] text-white/90 leading-8 mb-5">
                                                        {item}
                                                    </p>
                                                );
                                            }
                                            // Skip invalid content
                                            return null;
                                        })
                                    ) : typeof newsItem.body === 'string' ? (
                                        <p className="text-[17px] text-white/90 leading-8">
                                            {newsItem.body}
                                        </p>
                                    ) : (
                                        <p className="text-[17px] text-white/90 leading-8">
                                            This news article content is being updated. Please check back later.
                                        </p>
                                    )}
                                    {/* Tags */}
                                    {newsItem.tags && newsItem.tags.length > 0 && (
                                        <div className="mt-10 pt-6 border-t border-white/10">
                                            <h4 className="text-sm font-semibold text-white mb-3">Tags:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {newsItem.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-sm uppercase tracking-wide"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Back to News */}
                            {/* <div className="mt-8 text-center">
                            <a
                                href="/#latest-news"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                ← Back to Latest News
                            </a>
                        </div> */}
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
}

// Helper function to extract text content from body structure
function extractTextFromBody(body) {
    if (typeof body === 'string') {
        return body;
    }
    
    if (Array.isArray(body)) {
        let text = '';
        for (const item of body) {
            if (typeof item === 'string') {
                text += item + ' ';
            } else if (typeof item === 'object' && item.type === 'paragraph' && item.children) {
                for (const child of item.children) {
                    if (typeof child === 'object' && child.text) {
                        text += child.text + ' ';
                    } else if (typeof child === 'string') {
                        text += child + ' ';
                    }
                }
            }
        }
        return text.trim();
    }
    
    return '';
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    const awaitedParams = await params;
    const newsItem = await getNewsItem(awaitedParams.slug);

    if (!newsItem) {
        return {
            title: 'News Not Found',
        };
    }

    const bodyText = extractTextFromBody(newsItem.body);
    const description = newsItem.seo?.metaDescription ||
        newsItem.excerpt ||
        (bodyText ? bodyText.substring(0, 160) : '') ||
        `Read about ${newsItem.title}`;

    return {
        title: `${newsItem.title} | Wakefield 300`,
        description: description,
        keywords: newsItem.seo?.keywords?.join(', '),
        openGraph: {
            title: newsItem.title,
            description: description,
            images: newsItem.image && newsItem.image.trim() && newsItem.image !== 'null' && newsItem.image !== 'undefined' ? [newsItem.image] : [],
            type: 'article',
            publishedTime: newsItem.date,
        },
        twitter: {
            card: 'summary_large_image',
            title: newsItem.title,
            description: description,
            images: newsItem.image && newsItem.image.trim() && newsItem.image !== 'null' && newsItem.image !== 'undefined' ? [newsItem.image] : [],
        }
    };
}