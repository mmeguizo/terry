"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { RacingSpinner } from "./Skeletons";

// Generate a simple blur placeholder
const generateBlurPlaceholder = (width = 40, height = 40) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Create a simple gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#374151');
  gradient.addColorStop(0.5, '#4b5563');
  gradient.addColorStop(1, '#374151');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
};

// Enhanced Image component with progressive loading
export const ProgressiveImage = ({ 
  src, 
  alt, 
  className = "",
  width,
  height,
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  onLoadComplete,
  showSpinner = true,
  racingTheme = true,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => observerRef.current?.disconnect();
  }, [priority]);

  const handleLoadComplete = (result) => {
    setIsLoading(false);
    onLoadComplete?.(result);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Generate blur placeholder
  const blurDataURL = typeof window !== 'undefined' 
    ? generateBlurPlaceholder(width || 40, height || 40)
    : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzc0MTUxIi8+Cjwvc3ZnPgo=';

  // Error fallback
  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-800 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-gray-400">
          {racingTheme ? (
            <>
              <div className="text-4xl mb-2">🏁</div>
              <p className="text-sm">Image unavailable</p>
            </>
          ) : (
            <p className="text-sm">Failed to load</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef} 
      className={`relative overflow-hidden ${className}`}
      style={!fill ? { width, height } : undefined}
    >
      {/* Loading overlay */}
      {isLoading && showSpinner && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
          {racingTheme ? (
            <RacingSpinner size="md" />
          ) : (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          )}
        </div>
      )}

      {/* Racing-themed loading pattern */}
      {isLoading && racingTheme && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-[shimmer_2s_infinite]">
          {/* Checkered flag pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(45deg, #4b5563 25%, transparent 25%),
                linear-gradient(-45deg, #4b5563 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #4b5563 75%),
                linear-gradient(-45deg, transparent 75%, #4b5563 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              animation: 'checkered-flag 3s ease-in-out infinite'
            }} />
          </div>
        </div>
      )}

      {/* Actual image - only render when in view */}
      {(isInView || priority) && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          priority={priority}
          quality={quality}
          sizes={sizes}
          placeholder="blur"
          blurDataURL={blurDataURL}
          onLoad={handleLoadComplete}
          onError={handleError}
          className={`transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${fill ? 'object-cover' : ''}`}
          {...props}
        />
      )}

      {/* Racing corner decorations for loaded images */}
      {!isLoading && racingTheme && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/40"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/40"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/40"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/40"></div>
        </div>
      )}
    </div>
  );
};

// Specialized components for different use cases
export const HeroImage = ({ src, alt, className = "", ...props }) => (
  <ProgressiveImage
    src={src}
    alt={alt}
    fill
    priority
    quality={90}
    sizes="100vw"
    className={`object-cover ${className}`}
    racingTheme={true}
    {...props}
  />
);

export const NewsImage = ({ src, alt, className = "", ...props }) => (
  <ProgressiveImage
    src={src}
    alt={alt}
    width={400}
    height={225}
    quality={80}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className={`aspect-video object-cover rounded-lg ${className}`}
    racingTheme={true}
    {...props}
  />
);

export const SponsorImage = ({ src, alt, className = "", ...props }) => (
  <ProgressiveImage
    src={src}
    alt={alt}
    width={200}
    height={200}
    quality={85}
    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px"
    className={`aspect-square object-contain p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors ${className}`}
    racingTheme={false}
    showSpinner={false}
    {...props}
  />
);

export const EventImage = ({ src, alt, className = "", ...props }) => (
  <ProgressiveImage
    src={src}
    alt={alt}
    width={600}
    height={400}
    quality={85}
    sizes="(max-width: 768px) 100vw, 600px"
    className={`aspect-[3/2] object-cover rounded-lg ${className}`}
    racingTheme={true}
    {...props}
  />
);

// Gallery image with lightbox support
export const GalleryImage = ({ 
  src, 
  alt, 
  thumbnail, 
  className = "", 
  onClick,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`group cursor-pointer relative overflow-hidden rounded-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <ProgressiveImage
        src={thumbnail || src}
        alt={alt}
        width={300}
        height={200}
        quality={75}
        sizes="(max-width: 768px) 50vw, 300px"
        className="aspect-[3/2] object-cover transition-transform duration-300 group-hover:scale-110"
        racingTheme={true}
        {...props}
      />
      
      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="text-white text-center">
          <div className="text-2xl mb-2">🔍</div>
          <p className="text-sm font-medium">View Full Size</p>
        </div>
      </div>
      
      {/* Racing corner indicators */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-white"></div>
        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-white"></div>
        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-white"></div>
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-white"></div>
      </div>
    </div>
  );
};

export default ProgressiveImage;
