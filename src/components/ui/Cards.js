"use client";

import { useConfig } from "@/context/ConfigContext";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

const Card = ({ href, children, className = "" }) => {
  return (
    <div
      className={`group rounded-lg overflow-hidden bg-white/95 backdrop-blur-sm border border-neutral-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
    >
      {href ? <a href={href} className="block">{children}</a> : children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => {
  return <div className={`px-6 py-4 border-b border-neutral-200 ${className}`}>{children}</div>;
};

const CardImage = ({ src, alt = "", className = "" }) => {
  return (
    <div className={`relative w-full aspect-video overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </div>
  );
};

const CardBody = ({ children, className = "" }) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

const CardFooter = ({ children, className = "" }) => {
  return <div className={`px-6 py-4 border-t border-neutral-200 ${className}`}>{children}</div>;
};

export { Card, CardHeader, CardImage, CardBody, CardFooter };

// NewsCard: Tailwind overlay style adapted from HyperUI patterns
const NewsCard = ({ href, image, title, date, category }) => {
  const config = useConfig();
  const accent = config?.primaryColor || "#0ea5e9";

  return (
    <Link
      href={href}
      className="group relative block rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_38px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:rotate-[-0.5deg]"
      style={{ outlineColor: accent }}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title || ""}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/75 group-hover:via-black/35" />
        {/* sheen */}
        <div className="pointer-events-none absolute -inset-x-10 -top-10 h-28 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.12),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rotate-[-5deg]" />
        {category ? (
          <span
            className="absolute left-3 top-3 inline-flex items-center rounded-sm px-2 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: accent }}
          >
            {category}
          </span>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-white text-lg font-semibold leading-tight drop-shadow">
          {title}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          {date ? (
            <p className="text-white/80 text-sm">{date}</p>
          ) : <span />}
          <span className="inline-flex items-center gap-1 text-white/90 text-sm opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
            Read <HiArrowRight />
          </span>
        </div>
      </div>

      <div
        className="absolute -bottom-0.5 inset-x-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: accent }}
      />
    </Link>
  );
};

export { NewsCard };
