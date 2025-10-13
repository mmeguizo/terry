"use client";

import { useState, useEffect, useRef } from "react";
import { useConfig } from "@/context/ConfigContext";
import { GalleryImage } from "@/components/ui/ProgressiveImage";
import ErrorBoundary from "@/components/error/ErrorBoundary";

const PhotoGallery = ({ eventId, photos = [], className = "" }) => {
  const config = useConfig();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const lightboxRef = useRef(null);

  // Mock photo data if none provided
  const mockPhotos = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
      title: "Race Start",
      category: "race",
      photographer: "Racing Photography",
      timestamp: "2024-01-15T14:30:00Z"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
      thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300",
      title: "Pit Stop Action",
      category: "pits",
      photographer: "Motorsport Images",
      timestamp: "2024-01-15T15:45:00Z"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
      thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300",
      title: "Victory Celebration",
      category: "podium",
      photographer: "Victory Lane Photos",
      timestamp: "2024-01-15T17:20:00Z"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
      title: "Track Action",
      category: "race",
      photographer: "Speed Shots",
      timestamp: "2024-01-15T16:10:00Z"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800",
      thumbnail: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300",
      title: "Paddock Atmosphere",
      category: "paddock",
      photographer: "Behind the Scenes",
      timestamp: "2024-01-15T13:15:00Z"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
      thumbnail: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300",
      title: "Grid Walk",
      category: "grid",
      photographer: "Grid Photography",
      timestamp: "2024-01-15T14:00:00Z"
    }
  ];

  const galleryPhotos = photos.length > 0 ? photos : mockPhotos;

  const categories = [
    { id: 'all', label: 'All Photos', icon: '📸' },
    { id: 'race', label: 'Race Action', icon: '🏁' },
    { id: 'pits', label: 'Pit Lane', icon: '🔧' },
    { id: 'podium', label: 'Podium', icon: '🏆' },
    { id: 'paddock', label: 'Paddock', icon: '🏟️' },
    { id: 'grid', label: 'Grid', icon: '🚦' }
  ];

  const filteredPhotos = filter === 'all' 
    ? galleryPhotos 
    : galleryPhotos.filter(photo => photo.category === filter);

  const openLightbox = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  const navigatePhoto = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredPhotos.length
      : currentIndex === 0 ? filteredPhotos.length - 1 : currentIndex - 1;
    
    setCurrentIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isLightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigatePhoto('prev');
          break;
        case 'ArrowRight':
          navigatePhoto('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isLightboxOpen, currentIndex]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className={`${className}`}>
      {/* Gallery Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <span className="mr-3">📸</span>
            Photo Gallery
          </h2>
          <div className="text-sm text-gray-400">
            {filteredPhotos.length} photos
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                filter === category.id
                  ? 'text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              style={{
                backgroundColor: filter === category.id ? (config.primaryColor || '#3b82f6') : undefined
              }}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Photos Available</h3>
          <p className="text-gray-500">Photos will appear here during and after the event.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-800 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              onClick={() => openLightbox(photo, index)}
            >
              <GalleryImage
                src={photo.thumbnail || photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
                onClick={() => openLightbox(photo, index)}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-sm mb-1">{photo.title}</h3>
                  <p className="text-gray-300 text-xs">{photo.photographer}</p>
                </div>
              </div>

              {/* Racing corner indicators */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && selectedPhoto && (
        <div 
          ref={lightboxRef}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === lightboxRef.current && closeLightbox()}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-60 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation buttons */}
          <button
            onClick={() => navigatePhoto('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => navigatePhoto('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Main image */}
          <div className="max-w-7xl max-h-full flex flex-col items-center">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            
            {/* Photo info */}
            <div className="mt-6 text-center max-w-2xl">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedPhoto.title}</h3>
              <div className="flex items-center justify-center space-x-4 text-gray-300 text-sm">
                <span>📷 {selectedPhoto.photographer}</span>
                <span>🕒 {formatTimestamp(selectedPhoto.timestamp)}</span>
                <span>📂 {categories.find(c => c.id === selectedPhoto.category)?.label}</span>
              </div>
            </div>
          </div>

          {/* Photo counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} / {filteredPhotos.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default function PhotoGalleryWithBoundary(props) {
  return (
    <ErrorBoundary context="photo-gallery" level="component">
      <PhotoGallery {...props} />
    </ErrorBoundary>
  );
}



