"use client";

import { useEffect, useState } from "react";
import { Card, CardImage, CardBody, NewsCard } from "@/components/ui/Cards";
import { useConfig } from "@/context/ConfigContext";

const LatestNews = () => {
  const config = useConfig();
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("News API failed");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setNewsItems(data);
        } else {
          setNewsItems(config.newsItems || []);
        }
      } catch (error) {
        console.error("Failed to load news items:", error);
        setNewsItems(config.newsItems || []);
      }
    };

    fetchNews();
  }, [config.newsItems]);

  return (
    <section id="news" className="relative bg-gradient-to-br from-neutral-600 via-neutral-500 to-neutral-700 py-20 xl:py-24 2xl:py-28 scroll-mt-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Racing corner designs */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top corners */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-blue-400/40"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-blue-400/40"></div>
        {/* Bottom corners */}
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-purple-400/40"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-purple-400/40"></div>
        
        {/* Racing stripes */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
      </div>
      
      <div className="container relative z-10 max-w-7xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="text-center mb-16 xl:mb-20 2xl:mb-24">
          <h1 className="xs:text-5xl text-4xl xl:text-6xl 2xl:text-7xl font-bold text-white mb-4 xl:mb-6 2xl:mb-8 uppercase tracking-wider">
            Latest News
            <span className="block w-24 xl:w-28 2xl:w-32 h-1 xl:h-1.5 2xl:h-2 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-4 xl:mt-6 2xl:mt-8 rounded-full"></span>
          </h1>
          <p className="text-white/80 text-lg xl:text-xl 2xl:text-2xl max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto">
            Stay updated with the latest racing news, updates, and event information
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-w-none gap-8 xl:gap-10 2xl:gap-12 justify-items-center">
          {newsItems.map((newsItem, index) => (
            <div
              key={index}
              className="opacity-0 translate-y-8 animate-[fadeInUp_0.6s_ease-out_forwards] w-full max-w-sm"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <NewsCard
                href={newsItem.url}
                image={newsItem.image}
                title={newsItem.title}
                date={newsItem.date}
                category={newsItem.category}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
