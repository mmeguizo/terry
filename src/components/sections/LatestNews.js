"use client";

import { useEffect, useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import Link from "next/link";
import Image from "next/image";

// Use Link for internal paths; <a> for external URLs
function isInternal(href = "") {
  return typeof href === "string" && href.startsWith("/") && !href.startsWith("//");
}
function AorLink({ href, children }) {
  if (!href) return <span>{children}</span>;
  return isInternal(href) ? (
    <Link href={href}>{children}</Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

// Simple Card components used by LatestNews
function Card({ href, children, ...props }) {
  const content = (
    <article className="bg-white rounded overflow-hidden shadow-sm" {...props}>
      {children}
    </article>
  );
  return href ? <AorLink href={href}>{content}</AorLink> : content;
}
function CardImage({ src, alt }) {
  if (!src) return null;
  return (
    <div className="relative h-48 w-full overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
function CardBody({ children }) {
  return <div className="p-4">{children}</div>;
}

export default function LatestNews() {
  const [newsItems, setNewsItems] = useState([]);
  const config = useConfig();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let items = Array.isArray(data) ? data : [];
        // Fallback to config.newsItems if API is empty
        if (!items.length && Array.isArray(config?.newsItems)) {
          items = config.newsItems.map((n) => ({
            title: n.title,
            date: n.date,
            image: n.image,
            url: n.url,
          }));
        }
        setNewsItems(items);
      } catch (error) {
        console.error("Failed to load news items:", error);
        // Last resort: use config.newsItems if present
        if (Array.isArray(config?.newsItems)) {
          setNewsItems(
            config.newsItems.map((n) => ({
              title: n.title,
              date: n.date,
              image: n.image,
              url: n.url,
            }))
          );
        } else {
          setNewsItems([]);
        }
      }
    };
    fetchNews();
  }, [config]);

  return (
    <section className="bg-neutral-500 py-18">
      <div className="container">
        <h1 className="xs:text-4xl text-3xl font-semibold text-white text-start mb-8 uppercase">
          latest News
        </h1>
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
}
