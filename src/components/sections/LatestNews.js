"use client";

import { useEffect, useState } from "react";
import { Card, CardImage, CardBody, NewsCard } from "@/components/ui/Cards";
import { useConfig } from "@/context/ConfigContext";
import { NewsSkeleton } from "@/components/ui/Skeletons";
import { cacheHelpers } from "@/utils/smartCache";
import { DataError, APIError } from "@/components/error/ErrorComponents";
import { useErrorRecovery } from "@/hooks/useErrorRecovery";

const LatestNews = () => {
  const config = useConfig();
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    error, 
    retryCount, 
    canRetry, 
    handleError, 
    reset 
  } = useErrorRecovery({
    maxRetries: 3,
    onError: (error) => console.error('🚨 News loading error:', error),
    onMaxRetriesReached: (error) => console.error('❌ Max retries reached for news:', error)
  });

  function sanitize(list) {
    const ensureValidUrl = (value) => {
      if (typeof value !== "string") return "";
      const v = value.trim();
      if (!v) return "";
      if (v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/")) return v;
      // treat obvious invalid tokens like "undefined", "null" as empty
      if (v.toLowerCase() === "undefined" || v.toLowerCase() === "null") return "";
      return "";
    };

    return (Array.isArray(list) ? list : [])
      .filter(Boolean)
      .map((item) => ({
        ...item,
        url: ensureValidUrl(item?.url) || "",
        image: ensureValidUrl(item?.image),
        title: typeof item?.title === "string" ? item.title : "",
      }));
  }

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        // Use smart caching for news data
        const result = await cacheHelpers.getNews(
          process.env.NEXT_PUBLIC_SITE_SLUG || 'default',
          async () => {
            const res = await fetch("/api/news");
            if (!res.ok) throw new Error("News API failed");
            return await res.json();
          }
        );
        
        const cleaned = sanitize(result.data);
        if (cleaned.length > 0) {
          setNewsItems(cleaned);
          console.log(`🏁 News loaded: ${result.fromCache ? 'from cache' : 'fresh fetch'} (${cleaned.length} items)`);
        } else {
          setNewsItems(sanitize(config.newsItems));
        }
      } catch (fetchError) {
        handleError(fetchError, { 
          endpoint: '/api/news',
          operation: 'fetchNews',
          siteSlug: process.env.NEXT_PUBLIC_SITE_SLUG 
        });
        
        // Fallback to config news items
        console.warn("🚨 News API failed, using fallback data");
        setNewsItems(sanitize(config.newsItems));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [config.newsItems]);

  // Show skeleton while loading
  if (isLoading) {
    return <NewsSkeleton />;
  }

  // Show error state with retry option
  if (error && newsItems.length === 0) {
    return (
      <section 
        id="news" 
        className="relative py-20 xl:py-24 2xl:py-28 scroll-mt-24"
        style={{ background: config.menuBackground || '#ffffff' }}
      >
        <div className="container">
          <APIError
            error={error}
            endpoint="/api/news"
            onRetry={() => {
              reset();
              window.location.reload();
            }}
            retryCount={retryCount}
            maxRetries={3}
            className="max-w-2xl mx-auto"
          />
        </div>
      </section>
    );
  }

  // Show partial error if we have some data but there was an error
  const showPartialError = error && newsItems.length > 0;

  return (
    <section 
      id="news" 
      className="relative py-20 xl:py-24 2xl:py-28 scroll-mt-24 overflow-hidden"
      style={{
        background: config.menuBackground || '#ffffff'
      }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-2">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
        ></div>
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500"
          style={{ backgroundColor: config.primaryColor ? `${config.primaryColor}60` : '#8b5cf660' }}
        ></div>
      </div>
      
      {/* Racing corner designs */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top corners */}
        <div 
          className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 opacity-20"
          style={{ borderColor: config.primaryColor || '#3b82f6' }}
        ></div>
        <div 
          className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 opacity-20"
          style={{ borderColor: config.primaryColor || '#3b82f6' }}
        ></div>
        {/* Bottom corners */}
        <div 
          className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 opacity-20"
          style={{ borderColor: config.primaryColor || '#3b82f6' }}
        ></div>
        <div 
          className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 opacity-20"
          style={{ borderColor: config.primaryColor || '#3b82f6' }}
        ></div>
        
        {/* Racing stripes */}
        <div 
          className="absolute top-0 left-0 w-full h-1 opacity-15"
          style={{ background: `linear-gradient(to right, transparent, ${config.primaryColor || '#3b82f6'}, transparent)` }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-full h-1 opacity-15"
          style={{ background: `linear-gradient(to right, transparent, ${config.primaryColor || '#3b82f6'}, transparent)` }}
        ></div>
      </div>
      
      <div className="container relative z-10 max-w-7xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="text-center mb-16 xl:mb-20 2xl:mb-24">
          <h1 
            className="xs:text-5xl text-4xl xl:text-6xl 2xl:text-7xl font-bold mb-4 xl:mb-6 2xl:mb-8 uppercase tracking-wider"
            style={{ color: config.textColor || '#000000' }}
          >
            Latest News
            <span 
              className="block w-24 xl:w-28 2xl:w-32 h-1 xl:h-1.5 2xl:h-2 mx-auto mt-4 xl:mt-6 2xl:mt-8 rounded-full"
              style={{ background: `linear-gradient(to right, ${config.primaryColor || '#3b82f6'}, ${config.primaryColor ? `${config.primaryColor}80` : '#3b82f680'})` }}
            ></span>
          </h1>
          <p 
            className="text-lg xl:text-xl 2xl:text-2xl max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto"
            style={{ color: config.textColor || '#000000' }}
          >
            Stay updated with the latest racing news, updates, and event information
</p>
        </div>

        {/* Partial error notification */}
        {showPartialError && (
          <div className="mb-8">
            <APIError
              error={error}
              endpoint="/api/news"
              onRetry={() => {
                reset();
                window.location.reload();
              }}
              retryCount={retryCount}
              maxRetries={3}
              className="max-w-2xl mx-auto"
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-w-none gap-8 xl:gap-10 2xl:gap-12 justify-items-center">
          {newsItems.map((newsItem, index) => (
            <div
              key={index}
              className="opacity-0 translate-y-8 animate-[fadeInUp_0.6s_ease-out_forwards] w-full max-w-sm"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {(() => {
                // Create a safe slug from the news item
                let slug = '';
                if (typeof newsItem.slug === 'string' && newsItem.slug.trim().length > 0) {
                  slug = newsItem.slug.trim();
                } else if (typeof newsItem.url === 'string' && newsItem.url.startsWith('/news/')) {
                  slug = newsItem.url.replace(/^\/news\//, '').replace(/\/+$/, '');
                } else if (typeof newsItem.title === 'string') {
                  // Generate slug from title as fallback
                  slug = newsItem.title.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
                }
                
                const internalHref = slug ? `/news/${slug}` : '#';
                
                return (
              <NewsCard
                href={internalHref}
                image={newsItem.image}
                title={newsItem.title}
                date={newsItem.date}
                category={newsItem.category || "News"}
                sectionBg={config.menuBackground}
              />
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
