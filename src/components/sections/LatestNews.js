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
    <section id="news" className="bg-neutral-500 py-18 scroll-mt-24">
      <div className="container">
        <h1 className="xs:text-4xl text-3xl font-semibold text-white text-start mb-8 uppercase">Latest News</h1>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 grid-cols-1 justify-between gap-6">
          {newsItems.map((newsItem, index) => (
            <NewsCard
              key={index}
              href={newsItem.url}
              image={newsItem.image}
              title={newsItem.title}
              date={newsItem.date}
              category={newsItem.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
