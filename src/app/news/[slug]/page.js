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
        // First, check if the news item exists in our config
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
    const newsItem = await getNewsItem(params.slug);

    if (!newsItem) {
        notFound();
    }

    const canonical = typeof window === 'undefined' ? undefined : window.location.origin + newsItem.url;

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: newsItem.title,
        image: [newsItem.image],
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
                    <div className="relative w-full aspect-video max-h-[600px] overflow-hidden mb-6 rounded-md">
                        <Image
                            src={newsItem.image}
                            alt={newsItem.title}
                            fill
                            className="object-cover"
                        />
                    </div>

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
                                        newsItem.body.map((paragraph, index) => (
                                            <p key={index} className="text-[17px] text-white/90 leading-8 mb-5">
                                                {paragraph}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-[17px] text-white/90 leading-8">
                                            {newsItem.body}
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

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    const newsItem = await getNewsItem(params.slug);

    if (!newsItem) {
        return {
            title: 'News Not Found',
        };
    }

    const description = newsItem.seo?.metaDescription ||
        newsItem.excerpt ||
        (Array.isArray(newsItem.body) ? newsItem.body[0]?.substring(0, 160) : newsItem.body?.substring(0, 160)) ||
        `Read about ${newsItem.title}`;

    return {
        title: `${newsItem.title} | Wakefield 300`,
        description: description,
        keywords: newsItem.seo?.keywords?.join(', '),
        openGraph: {
            title: newsItem.title,
            description: description,
            images: [newsItem.image],
            type: 'article',
            publishedTime: newsItem.date,
        },
        twitter: {
            card: 'summary_large_image',
            title: newsItem.title,
            description: description,
            images: [newsItem.image],
        }
    };
}