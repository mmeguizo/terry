"use client";

import { useEffect, useState } from "react";
import { Card, CardImage, CardBody } from "@/components/ui/Cards";

const LatestNews = () => {
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNewsItems(data);
      } catch (error) {
        console.error("Failed to load news items:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="bg-neutral-500 py-18">
      <div className="container">
        <h1 className="xs:text-4xl text-3xl font-semibold text-white text-start mb-8 uppercase">latest News</h1>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 grid-cols-1 justify-between gap-6">
          {newsItems.map((newsItem, index) => (
            <Card key={index} href={newsItem.url}>
              <CardImage src={newsItem.image} alt={newsItem.title} />
              <CardBody>
                <h3 className="font-semibold text-xl">{newsItem.title}</h3>
                <small className="text-neutral-500 font-normal">{newsItem.date}</small>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
