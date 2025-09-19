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
      className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-700 hover:scale-[1.02] hover:-rotate-1"
      style={{ 
        boxShadow: `0 25px 50px -12px rgba(0,0,0,0.4), 0 0 40px ${accent}15`
      }}
    >
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${accent}15 0%, transparent 40%)`
        }}
      ></div>

      {/* Racing corner designs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-blue-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-blue-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10">
        {/* Image section with modern effects */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image}
            alt={title || ""}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
          
          {/* Modern gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Animated mesh overlay */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, ${accent}40 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${accent}30 0%, transparent 50%)`
            }}
          ></div>

          {/* Category pill with modern styling */}
          {category && (
            <div className="absolute left-4 top-4">
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-md border border-white/20 shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${accent}90 0%, ${accent}70 100%)`,
                  boxShadow: `0 8px 32px ${accent}40`
                }}
              >
                {category}
              </span>
            </div>
          )}
          
          {/* Futuristic date display */}
          {date && (
            <div className="absolute right-4 top-4">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-white text-xs font-mono font-medium">{date}</span>
              </div>
            </div>
          )}

          {/* Scanning line effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
              style={{ animationDelay: '200ms' }}
            ></div>
          </div>
        </div>

        {/* Content section with glassmorphism */}
        <div className="relative p-6 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
          {/* Decorative elements */}
          <div className="absolute top-0 left-6 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
          
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-white leading-tight flex-1 mr-4 group-hover:text-cyan-100 transition-colors duration-300">
              {title}
            </h3>
            
            {/* Futuristic icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <HiArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
          </div>

          {/* Interactive read indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div 
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 group-hover:bg-cyan-400 transition-colors duration-300"
                    style={{ animationDelay: `${i * 100}ms` }}
                  ></div>
                ))}
              </div>
              <span className="text-cyan-400 text-sm font-medium tracking-wide">READ</span>
            </div>
            
            <div className="text-xs text-gray-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              ACCESSING...
            </div>
          </div>
        </div>

        {/* Bottom tech accent */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent group-hover:via-cyan-300 transition-colors duration-300"></div>
        
        {/* Corner accent */}
        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-cyan-400/40 group-hover:border-cyan-400/80 transition-colors duration-300"></div>
      </div>

      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 0%, ${accent}10 50%, transparent 100%)`,
          filter: 'blur(1px)'
        }}
      ></div>
    </Link>
  );
};

export { NewsCard };
