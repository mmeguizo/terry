"use client";

import { useConfig } from "@/context/ConfigContext";
import Link from "next/link";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi2";

// Utility function to determine if a color is dark or light
const isColorDark = (color) => {
  if (!color) return false;
  
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance < 0.5;
};

// Get contrasting text color
const getContrastColor = (backgroundColor) => {
  return isColorDark(backgroundColor) ? '#ffffff' : '#000000';
};

// Get card background based on section background
const getCardBackground = (config, sectionBg = null) => {
  const primaryColor = config.primaryColor || '#3b82f6';
  const baseBg = sectionBg || config.menuBackground || '#ffffff';
  const isDarkBg = isColorDark(baseBg);
  
  // Use the section background as base with subtle primary color accent
  if (isDarkBg) {
    return `linear-gradient(135deg, ${baseBg}F0 0%, ${primaryColor}08 50%, ${baseBg}F0 100%)`;
  } else {
    return `linear-gradient(135deg, ${baseBg}F8 0%, ${primaryColor}05 50%, ${baseBg}F8 100%)`;
  }
};

const Card = ({ href, children, className = "", sectionBg = null }) => {
  const config = useConfig();
  const baseBg = sectionBg || config.menuBackground || '#ffffff';
  const isDarkTheme = isColorDark(baseBg);
  const primaryColor = config.primaryColor || '#3b82f6';
  const textColor = getContrastColor(baseBg);
  
  return (
    <div
      className={`group relative rounded-xl overflow-hidden backdrop-blur-lg border transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] ${className}`}
      style={{
        background: getCardBackground(config, sectionBg),
        borderColor: `${primaryColor}30`,
        boxShadow: `0 8px 32px rgba(0,0,0,${isDarkTheme ? '0.4' : '0.12'}), 0 0 0 1px ${primaryColor}10`,
        color: textColor
      }}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}10 0%, transparent 50%, ${primaryColor}05 100%)`
        }}
      ></div>
      <div className="relative z-10">
        {href ? <a href={href} className="block">{children}</a> : children}
      </div>
      <div 
        className="absolute inset-0 rounded-xl ring-1 ring-inset"
        style={{ ringColor: `${primaryColor}20` }}
      ></div>
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => {
  const config = useConfig();
  const primaryColor = config.primaryColor || '#3b82f6';
  const isDarkTheme = isColorDark(config.menuBackground);
  
  return (
    <div 
      className={`px-6 py-5 border-b ${className}`}
      style={{
        borderColor: `${primaryColor}20`,
        background: `linear-gradient(to right, ${primaryColor}${isDarkTheme ? '15' : '08'}, ${primaryColor}${isDarkTheme ? '08' : '03'}, ${primaryColor}${isDarkTheme ? '15' : '08'})`
      }}
    >
      {children}
    </div>
  );
};

const CardImage = ({ src, alt = "", className = "" }) => {
  return (
    <div className={`relative w-full aspect-video overflow-hidden ${className}`}>
      {src && src.trim() !== '' ? (
        <Image 
          src={src} 
          alt={alt} 
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" 
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 font-medium text-sm">NO IMAGE</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

const CardBody = ({ children, className = "" }) => {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
};

const CardFooter = ({ children, className = "" }) => {
  const config = useConfig();
  const primaryColor = config.primaryColor || '#3b82f6';
  const isDarkTheme = isColorDark(config.menuBackground);
  
  return (
    <div 
      className={`px-6 py-4 border-t ${className}`}
      style={{
        borderColor: `${primaryColor}20`,
        background: `linear-gradient(to right, ${primaryColor}${isDarkTheme ? '10' : '05'}, ${primaryColor}${isDarkTheme ? '05' : '02'}, ${primaryColor}${isDarkTheme ? '10' : '05'})`
      }}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardImage, CardBody, CardFooter };

// NewsCard: Tailwind overlay style adapted from HyperUI patterns
const NewsCard = ({ href, image, title, date, category, sectionBg = null }) => {
  const config = useConfig();
  const accent = config?.primaryColor || "#0ea5e9";
  const baseBg = sectionBg || config.menuBackground || '#ffffff';
  const isDarkTheme = isColorDark(baseBg);
  
  // Use the same clean style as sponsors section
  const cardBg = 'rgba(255, 255, 255, 0.8)';
  const textColor = '#374151'; // Clean dark gray text like sponsors

  const normalize = (val) => {
    if (typeof val !== "string") return "";
    let v = val.trim();
    while (v.startsWith("@")) v = v.slice(1);
    return v;
  };

  const isValidUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    const trimmed = url.trim();
    if (!trimmed || trimmed === "" || trimmed === "null" || trimmed === "undefined") return false;
    try {
      if (trimmed.startsWith("/")) return true; // internal paths are valid
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        new URL(trimmed); // test if it's a valid URL
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const rawHref = normalize(href);
  const safeHref = isValidUrl(rawHref) ? rawHref : "#";
  const isHttp = safeHref.startsWith("http://") || safeHref.startsWith("https://");
  const isInternal = safeHref.startsWith("/");

  const commonProps = {
    className: "group relative block overflow-hidden rounded-2xl backdrop-blur-sm border transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl",
    style: { 
      background: cardBg,
      borderColor: 'rgba(255, 255, 255, 0.5)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      color: textColor
    },
  };

  const content = (
    <>
      {/* Clean background glow effect - same as sponsors */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      ></div>

        {/* Racing corner designs - same as sponsors */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl">
          <div 
            className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ borderColor: `${accent}80` }}
          ></div>
          <div 
            className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ borderColor: `${accent}80` }}
          ></div>
          <div 
            className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ borderColor: `${accent}60` }}
          ></div>
          <div 
            className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ borderColor: `${accent}60` }}
          ></div>
        </div>

      {/* Main content container */}
      <div className="relative z-10">
        {/* Image section with modern effects */}
        <div className="relative aspect-video overflow-hidden">
          {(() => {
            const img = normalize(image);
            const valid = isValidUrl(img);
            if (valid && img) {
              return (
                <Image
                  src={img}
                  alt={title || "News Image"}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  onError={(e) => {
                    console.warn('Image failed to load:', img);
                    e.target.style.display = 'none';
                  }}
                />
              );
            } else {
              return (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
                  <div className="text-white/60 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">News Image</p>
                  </div>
                </div>
              );
            }
          })()}
          
          {/* Clean gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          {/* Clean category pill */}
          {category && (
            <div className="absolute left-4 top-4">
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-sm border border-white/30 shadow-sm"
                style={{ 
                  background: `linear-gradient(135deg, ${accent} 0%, ${accent}CC 100%)`,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                {typeof category === 'string' ? category : 'News'}
              </span>
            </div>
          )}
          
          {/* Clean date display */}
          {date && (
            <div className="absolute right-4 top-4">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 shadow-sm">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }}></div>
                <span className="text-gray-700 text-xs font-medium">{typeof date === 'string' ? date : 'Date TBA'}</span>
              </div>
            </div>
          )}

          {/* Clean shine effect - same as sponsors */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-t-2xl"></div>
        </div>

        {/* Clean content section - same style as sponsors */}
        <div className="relative p-6 bg-white/10 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-4">
            <h3 
              className="text-lg font-semibold leading-tight flex-1 mr-4 group-hover:text-gray-900 transition-colors duration-300"
              style={{ color: textColor }}
            >
              {typeof title === 'string' ? title : 'Article Title'}
            </h3>
            
            {/* Clean icon */}
            <div 
              className="flex-shrink-0 w-8 h-8 rounded-full backdrop-blur-sm border flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              style={{
                background: `linear-gradient(135deg, ${accent}20 0%, ${accent}10 100%)`,
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}
            >
              <HiArrowRight 
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300"
                style={{ color: accent }}
              />
            </div>
          </div>

          {/* Clean read indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div 
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                    style={{ 
                      backgroundColor: `${accent}80`,
                      animationDelay: `${i * 100}ms`
                    }}
                  ></div>
                ))}
              </div>
              <span 
                className="text-sm font-medium tracking-wide"
                style={{ color: accent }}
              >
                READ
              </span>
            </div>
          </div>
        </div>

        {/* Clean border glow - same as sponsors */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 group-hover:ring-blue-200/50 transition-all duration-300"></div>
      </div>
    </>
  );

  if (isInternal) {
    return (
      <Link href={safeHref} {...commonProps}>
        {content}
      </Link>
    );
  }

  return (
    <a href={safeHref} {...commonProps} target={isHttp ? "_blank" : undefined} rel={isHttp ? "noopener noreferrer" : undefined}>
      {content}
    </a>
  );
};

export { NewsCard };
