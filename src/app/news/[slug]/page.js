import { notFound } from 'next/navigation';
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

    return (
        <div className="">
            <div className="">
                {/* Hero Section */}
                <div className="mb-8">
                    <div className="relative w-full aspect-video max-h-[600px] overflow-hidden mb-6">
                        <img
                            src={newsItem.image}
                            alt={newsItem.title}
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
                        </div>

                        {/* Content Section */}
                        <div>
                            <div className="">
                                <div className="prose prose-lg max-w-none">
                                    {/* Render body content */}
                                    {Array.isArray(newsItem.body) ? (
                                        newsItem.body.map((paragraph, index) => (
                                            <p key={index} className="text-lg text-gray-700 leading-relaxed mb-6">
                                                {paragraph}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-lg text-gray-700 leading-relaxed">
                                            {newsItem.body}
                                        </p>
                                    )}
                                    {/* Tags */}
                                    {newsItem.tags && newsItem.tags.length > 0 && (
                                        <div className="mt-8 pt-6 border-t border-gray-200">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Tags:</h4>
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