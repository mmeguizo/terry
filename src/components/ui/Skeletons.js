"use client";

import React from "react";

// Base skeleton component with racing-themed animations
const SkeletonBase = ({ className = "", children, ...props }) => (
  <div 
    className={`animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Hero section skeleton
export const HeroSkeleton = () => (
  <section className="relative w-full h-[900px] lg:h-[750px] xl:h-[800px] 2xl:h-[900px] 3xl:h-[1000px] bg-gray-900 overflow-hidden">
    {/* Background skeleton */}
    <SkeletonBase className="absolute inset-0" />
    
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40 z-10"></div>
    
    <div className="container absolute z-20 inset-0 flex items-center text-center gap-4 pt-20 xl:pt-24 2xl:pt-32">
      <div className="grid xl:grid-cols-[3fr_2fr] gap-12 xl:gap-24 2xl:gap-32 3xl:gap-40 w-full lg:grid-cols-[1fr_1fr]">
        
        {/* Left side - Countdown and titles */}
        <div className="grow font-bold flex flex-col gap-4">
          {/* Countdown skeleton */}
          <div className="flex justify-center lg:justify-start mb-8 xl:mb-12 2xl:mb-16">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xs:gap-6 xl:gap-8 2xl:gap-12 3xl:gap-16">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <SkeletonBase className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 xs:p-6 xl:p-8 2xl:p-10 border border-white/20 min-w-[80px] xs:min-w-[100px] xl:min-w-[120px] 2xl:min-w-[140px]">
                    <SkeletonBase className="h-12 xs:h-16 lg:h-20 xl:h-24 2xl:h-28 w-full mb-2 bg-white/20" />
                    <SkeletonBase className="h-3 xs:h-4 xl:h-5 2xl:h-6 w-full bg-white/20" />
                  </SkeletonBase>
                </div>
              ))}
            </div>
          </div>
          
          {/* Event name skeleton */}
          <SkeletonBase className="h-12 xs:h-16 xl:h-20 2xl:h-24 3xl:h-28 w-full max-w-2xl bg-white/20" />
          
          {/* Event location skeleton */}
          <SkeletonBase className="h-10 xs:h-12 xl:h-16 2xl:h-20 3xl:h-24 w-4/5 max-w-xl bg-white/20" />
          
          {/* Event date skeleton */}
          <SkeletonBase className="h-6 xl:h-7 2xl:h-8 w-1/2 max-w-sm bg-white/20" />
          
          {/* Event info button skeleton */}
          <SkeletonBase className="h-12 xl:h-14 2xl:h-16 w-40 bg-white/20 rounded-lg mt-4" />
        </div>
        
        {/* Right side - Action buttons */}
        <div className="shrink-0 flex flex-col justify-end grow gap-3 xl:gap-4 2xl:gap-5">
          {[...Array(3)].map((_, index) => (
            <SkeletonBase key={index} className="h-12 xl:h-14 2xl:h-16 w-full bg-white/20 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
    
    {/* Racing corner decorations */}
    <div className="absolute inset-0 pointer-events-none z-15">
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-white/20"></div>
      <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-white/20"></div>
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-white/20"></div>
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-white/20"></div>
    </div>
  </section>
);

// News section skeleton
export const NewsSkeleton = () => (
  <section className="py-16 xl:py-20 2xl:py-24 bg-gray-900">
    <div className="container">
      {/* Section title skeleton */}
      <div className="text-center mb-12 xl:mb-16 2xl:mb-20">
        <SkeletonBase className="h-8 xl:h-10 2xl:h-12 w-64 mx-auto mb-4" />
        <SkeletonBase className="h-1 w-32 mx-auto" />
      </div>
      
      {/* News grid skeleton */}
      <div className="grid gap-6 xl:gap-8 2xl:gap-10 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="group">
            <SkeletonBase className="aspect-video w-full mb-4 rounded-lg" />
            <SkeletonBase className="h-6 xl:h-7 2xl:h-8 w-full mb-2" />
            <SkeletonBase className="h-4 xl:h-5 2xl:h-6 w-3/4 mb-2" />
            <SkeletonBase className="h-4 xl:h-5 2xl:h-6 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Event documents skeleton
export const DocumentsSkeleton = () => (
  <section className="py-16 xl:py-20 2xl:py-24 bg-gray-800">
    <div className="container">
      {/* Section title skeleton */}
      <div className="text-center mb-12 xl:mb-16 2xl:mb-20">
        <SkeletonBase className="h-8 xl:h-10 2xl:h-12 w-80 mx-auto mb-4" />
        <SkeletonBase className="h-1 w-40 mx-auto" />
      </div>
      
      {/* Documents grid skeleton */}
      <div className="grid gap-4 xl:gap-6 2xl:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <SkeletonBase key={index} className="h-16 xl:h-18 2xl:h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  </section>
);

// Sponsors section skeleton
export const SponsorsSkeleton = () => (
  <section className="py-16 xl:py-20 2xl:py-24 bg-gray-900">
    <div className="container">
      {/* Section title skeleton */}
      <div className="text-center mb-12 xl:mb-16 2xl:mb-20">
        <SkeletonBase className="h-8 xl:h-10 2xl:h-12 w-48 mx-auto mb-4" />
        <SkeletonBase className="h-1 w-24 mx-auto" />
      </div>
      
      {/* Sponsors grid skeleton */}
      <div className="grid gap-6 xl:gap-8 2xl:gap-10 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {[...Array(12)].map((_, index) => (
          <SkeletonBase key={index} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    </div>
  </section>
);

// Event page skeleton
export const EventPageSkeleton = () => (
  <div className="min-h-screen bg-gray-900 pt-28 xl:pt-32 2xl:pt-36 pb-24 xl:pb-28 2xl:pb-32">
    <div className="container">
      {/* Event header skeleton */}
      <div className="mb-12 xl:mb-16 2xl:mb-20">
        <SkeletonBase className="h-12 xl:h-16 2xl:h-20 w-full max-w-2xl mb-6" />
        <SkeletonBase className="h-6 xl:h-7 2xl:h-8 w-1/2 mb-4" />
        <SkeletonBase className="h-4 xl:h-5 2xl:h-6 w-1/3" />
      </div>
      
      {/* Event content grid */}
      <div className="grid gap-8 xl:gap-12 2xl:gap-16 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6 xl:space-y-8 2xl:space-y-10">
          <SkeletonBase className="h-64 xl:h-80 2xl:h-96 w-full rounded-lg" />
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <SkeletonBase key={index} className="h-4 xl:h-5 2xl:h-6 w-full" />
            ))}
          </div>
        </div>
        
        {/* Right column */}
        <div className="space-y-6 xl:space-y-8 2xl:space-y-10">
          <SkeletonBase className="h-32 xl:h-40 2xl:h-48 w-full rounded-lg" />
          <div className="grid gap-4 grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <SkeletonBase key={index} className="h-20 xl:h-24 2xl:h-28 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// News article skeleton
export const NewsArticleSkeleton = () => (
  <div className="min-h-screen bg-gray-900 pt-28 xl:pt-32 2xl:pt-36 pb-24 xl:pb-28 2xl:pb-32">
    <div className="container max-w-4xl">
      {/* Article header */}
      <div className="mb-12 xl:mb-16 2xl:mb-20">
        <SkeletonBase className="h-12 xl:h-16 2xl:h-20 w-full mb-6" />
        <SkeletonBase className="h-6 xl:h-7 2xl:h-8 w-1/3 mb-4" />
        <SkeletonBase className="aspect-video w-full rounded-lg" />
      </div>
      
      {/* Article content */}
      <div className="prose prose-lg xl:prose-xl 2xl:prose-2xl max-w-none">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="mb-6">
            <SkeletonBase className="h-4 xl:h-5 2xl:h-6 w-full mb-2" />
            <SkeletonBase className="h-4 xl:h-5 2xl:h-6 w-full mb-2" />
            <SkeletonBase className="h-4 xl:h-5 2xl:h-6 w-3/4 mb-2" />
            <SkeletonBase className="h-4 xl:h-5 2xl:h-6 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Generic card skeleton
export const CardSkeleton = ({ className = "" }) => (
  <div className={`p-6 bg-gray-800 rounded-lg ${className}`}>
    <SkeletonBase className="h-6 w-3/4 mb-4" />
    <SkeletonBase className="h-4 w-full mb-2" />
    <SkeletonBase className="h-4 w-full mb-2" />
    <SkeletonBase className="h-4 w-2/3" />
  </div>
);

// Racing-themed loading spinner
export const RacingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };
  
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Tire/wheel spinner */}
      <div className="absolute inset-0 border-4 border-gray-600 rounded-full animate-spin border-t-blue-500"></div>
      <div className="absolute inset-2 border-2 border-gray-700 rounded-full animate-spin animate-reverse border-t-red-500"></div>
      
      {/* Racing flag pattern */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-white animate-pulse"></div>
      </div>
    </div>
  );
};

// Full page loading with racing theme
export const FullPageLoader = ({ message = "Loading..." }) => (
  <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
    <div className="text-center">
      <RacingSpinner size="xl" className="mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-white mb-2">🏁 {message}</h2>
      <p className="text-gray-400">Preparing your racing experience...</p>
      
      {/* Racing track animation */}
      <div className="mt-8 w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-red-500 rounded-full animate-[race_2s_ease-in-out_infinite]"></div>
      </div>
    </div>
  </div>
);

// Racing Dashboard Skeletons
export const LiveTimingSkeleton = () => (
  <div className="bg-gray-900 rounded-2xl overflow-hidden">
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 border-b border-gray-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <SkeletonBase className="h-6 w-32" />
        </div>
        <SkeletonBase className="h-4 w-24" />
      </div>
    </div>
    <div className="p-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
          <div className="flex items-center space-x-4">
            <SkeletonBase className="w-8 h-8 rounded-full" />
            <SkeletonBase className="w-12 h-6" />
            <SkeletonBase className="w-32 h-4" />
          </div>
          <div className="flex space-x-4">
            <SkeletonBase className="w-16 h-4" />
            <SkeletonBase className="w-20 h-4" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const TrackMapSkeleton = () => (
  <div className="bg-gray-900 rounded-2xl overflow-hidden">
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 border-b border-gray-600">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBase className="h-6 w-48 mb-2" />
          <div className="flex space-x-4">
            <SkeletonBase className="h-4 w-20" />
            <SkeletonBase className="h-4 w-24" />
          </div>
        </div>
        <SkeletonBase className="w-16 h-8" />
      </div>
    </div>
    <div className="p-6">
      <div className="bg-gray-800 rounded-lg p-4 mb-6 h-64 flex items-center justify-center">
        <div className="text-center">
          <RacingSpinner size="lg" className="mx-auto mb-4" />
          <SkeletonBase className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <SkeletonBase className="h-6 w-32 mb-4" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg mb-2">
              <div className="flex items-center space-x-3">
                <SkeletonBase className="w-6 h-6" />
                <SkeletonBase className="w-24 h-4" />
              </div>
              <SkeletonBase className="w-16 h-4" />
            </div>
          ))}
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <SkeletonBase className="h-6 w-32 mb-4" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded animate-pulse"></div>
                <SkeletonBase className="w-20 h-4" />
              </div>
              <SkeletonBase className="w-12 h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const RaceResultsSkeleton = () => (
  <div className="bg-gray-900 rounded-2xl overflow-hidden">
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 border-b border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBase className="h-8 w-40" />
        <SkeletonBase className="h-4 w-24" />
      </div>
      <div className="flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <SkeletonBase key={i} className="w-24 h-10" />
        ))}
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            {['Pos', 'Driver', 'Team', 'Time', 'Points', 'Status'].map((header, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <SkeletonBase className="h-4 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, i) => (
            <tr key={i} className="border-b border-gray-700">
              <td className="px-4 py-4">
                <SkeletonBase className="w-8 h-8 rounded-full" />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center space-x-3">
                  <SkeletonBase className="w-8 h-6" />
                  <SkeletonBase className="w-32 h-4" />
                </div>
              </td>
              <td className="px-4 py-4">
                <SkeletonBase className="w-24 h-4" />
              </td>
              <td className="px-4 py-4">
                <SkeletonBase className="w-20 h-4" />
              </td>
              <td className="px-4 py-4">
                <SkeletonBase className="w-8 h-4" />
              </td>
              <td className="px-4 py-4">
                <SkeletonBase className="w-16 h-4" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const PhotoGallerySkeleton = () => (
  <div>
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <SkeletonBase className="h-8 w-48" />
        <SkeletonBase className="h-4 w-20" />
      </div>
      <div className="flex flex-wrap gap-2">
        {[...Array(6)].map((_, i) => (
          <SkeletonBase key={i} className="w-24 h-10" />
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="aspect-square bg-gray-800 rounded-lg relative overflow-hidden">
          <SkeletonBase className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <SkeletonBase className="h-4 w-3/4 mb-2" />
            <SkeletonBase className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default {
  HeroSkeleton,
  NewsSkeleton,
  DocumentsSkeleton,
  SponsorsSkeleton,
  EventPageSkeleton,
  NewsArticleSkeleton,
  CardSkeleton,
  RacingSpinner,
  FullPageLoader,
  LiveTimingSkeleton,
  TrackMapSkeleton,
  RaceResultsSkeleton,
  PhotoGallerySkeleton
};
