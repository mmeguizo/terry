"use client";

import { useConfig } from "@/context/ConfigContext";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

const Card = ({ href, children, className = "" }) => {
  return (
    <div
      className={`group relative rounded-xl overflow-hidden bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-lg border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        {href ? <a href={href} className="block">{children}</a> : children}
      </div>
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10"></div>
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => {
  return <div className={`px-6 py-5 border-b border-gradient-to-r from-neutral-200/50 via-neutral-100 to-neutral-200/50 bg-gradient-to-r from-gray-50/50 to-blue-50/30 ${className}`}>{children}</div>;
};

const CardImage = ({ src, alt = "", className = "" }) => {
  return (
    <div className={`relative w-full aspect-video overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

const CardBody = ({ children, className = "" }) => {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
};

const CardFooter = ({ children, className = "" }) => {
  return <div className={`px-6 py-4 border-t border-gradient-to-r from-neutral-200/50 via-neutral-100 to-neutral-200/50 bg-gradient-to-r from-gray-50/30 to-blue-50/20 ${className}`}>{children}</div>;
};

export { Card, CardHeader, CardImage, CardBody, CardFooter };

// NewsCard: Tailwind overlay style adapted from HyperUI patterns
const NewsCard = ({ href, image, title, date, category }) => {
  const config = useConfig();
  const accent = config?.primaryColor || "#0ea5e9";

  return (
    <Link
      href={href}
      className="group relative block rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] backdrop-blur-sm"
      style={{ outlineColor: accent }}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title || ""}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 transition-all duration-500 group-hover:from-black/80 group-hover:via-black/40 group-hover:to-black/10" />
        
        {/* Enhanced shine effect */}
        <div className="pointer-events-none absolute -inset-x-10 -top-10 h-32 bg-[linear-gradient(115deg,transparent_25%,rgba(255,255,255,0.3)_45%,rgba(255,255,255,0.6)_50%,rgba(255,255,255,0.3)_55%,transparent_75%)] opacity-0 group-hover:opacity-100 transition-all duration-700 rotate-[-8deg] animate-pulse" />
        
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {category ? (
          <span
            className="absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md shadow-lg"
            style={{ backgroundColor: `${accent}CC` }}
          >
            {category}
          </span>
        ) : null}
        
        {/* Date badge */}
        {date && (
          <div className="absolute right-4 top-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5">
            <p className="text-white text-xs font-medium">{date}</p>
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
        <h3 className="text-white text-xl font-bold leading-tight drop-shadow-lg mb-3 group-hover:text-blue-100 transition-colors duration-300">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-white/90 text-sm font-medium opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
            <span>Read Article</span>
            <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>
      </div>

      {/* Enhanced bottom accent */}
      <div
        className="absolute -bottom-1 inset-x-0 h-1 opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 20px ${accent}40`
        }}
      />
      
      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all duration-500"></div>
    </Link>
  );
};

export { NewsCard };
