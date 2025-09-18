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
    <section id="news" className="relative bg-gradient-to-br from-neutral-600 via-neutral-500 to-neutral-700 py-20 scroll-mt-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h1 className="xs:text-5xl text-4xl font-bold text-white mb-4 uppercase tracking-wider">
            Latest News
            <span className="block w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-4 rounded-full"></span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Stay updated with the latest racing news, updates, and event information
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 xl:grid-cols-4 grid-cols-1 justify-between gap-8">
          {newsItems.map((newsItem, index) => (
            <div
              key={index}
              className="opacity-0 translate-y-8 animate-[fadeInUp_0.6s_ease-out_forwards]"
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
