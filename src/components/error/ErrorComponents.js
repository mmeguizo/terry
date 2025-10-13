"use client";

import { useState, useEffect } from "react";
import { useConfig } from "@/context/ConfigContext";
import Link from "next/link";

// API Error Component
export const APIError = ({ 
  error, 
  endpoint, 
  onRetry, 
  retryCount = 0, 
  maxRetries = 3,
  className = "" 
}) => {
  const config = useConfig();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (retryCount >= maxRetries || isRetrying) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorMessage = () => {
    if (error?.status === 404) return "Racing data not found";
    if (error?.status === 500) return "Racing servers are experiencing issues";
    if (error?.status === 503) return "Racing services temporarily unavailable";
    if (error?.name === 'NetworkError') return "Check your internet connection";
    return "Unable to load racing data";
  };

  return (
    <div className={`bg-red-900/20 border border-red-500/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="text-red-400 text-xl">🚨</div>
        <div className="flex-1">
          <h3 className="text-red-400 font-semibold mb-1">
            Connection Error
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            {getErrorMessage()}
          </p>
          
          {endpoint && (
            <p className="text-gray-500 text-xs mb-3">
              Endpoint: {endpoint}
            </p>
          )}

          <div className="flex items-center space-x-3">
            {retryCount < maxRetries && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                {isRetrying ? 'Retrying...' : `Retry (${retryCount}/${maxRetries})`}
              </button>
            )}
            
            <span className="text-gray-500 text-xs">
              Auto-retry in 30s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Image Error Component
export const ImageError = ({ 
  src, 
  alt, 
  fallbackSrc, 
  className = "",
  showPlaceholder = true 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    if (fallbackSrc && !hasError) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          className={className}
          onError={() => setHasError(true)}
          onLoad={() => setIsLoading(false)}
        />
      );
    }

    if (showPlaceholder) {
      return (
        <div className={`bg-gray-800 flex items-center justify-center ${className}`}>
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-2">🏁</div>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      onLoad={() => setIsLoading(false)}
    />
  );
};

// Data Loading Error
export const DataError = ({ 
  message = "Unable to load data", 
  onRetry, 
  showRetry = true,
  icon = "⚠️",
  className = ""
}) => {
  const config = useConfig();

  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">
        {message}
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        Racing data is temporarily unavailable
      </p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: config.primaryColor || '#3b82f6',
            color: 'white'
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

// Network Error Component
export const NetworkError = ({ onRetry, className = "" }) => {
  const [isOnline, setIsOnline] = useState(navigator?.onLine ?? true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className={`bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="text-yellow-400 text-xl">📡</div>
        <div className="flex-1">
          <h3 className="text-yellow-400 font-semibold mb-1">
            Connection Lost
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            You&apos;re currently offline. Some racing features may be limited.
          </p>
          
          <button
            onClick={onRetry}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Check Connection
          </button>
        </div>
      </div>
    </div>
  );
};

// Form Error Component
export const FormError = ({ 
  errors = [], 
  title = "Please fix the following errors:",
  className = "" 
}) => {
  if (!errors.length) return null;

  return (
    <div className={`bg-red-900/20 border border-red-500/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="text-red-400 text-xl">❌</div>
        <div className="flex-1">
          <h3 className="text-red-400 font-semibold mb-2">
            {title}
          </h3>
          <ul className="text-gray-300 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-red-400">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// 404 Error Component
export const NotFoundError = ({ 
  type = "page", 
  message, 
  suggestions = [],
  className = "" 
}) => {
  const config = useConfig();

  const getTypeConfig = () => {
    switch (type) {
      case 'event':
        return {
          icon: '🏁',
          title: 'Event Not Found',
          defaultMessage: 'The racing event you&apos;re looking for doesn&apos;t exist or has been moved.',
          fallbackLink: '/events',
          fallbackText: 'Browse All Events'
        };
      case 'news':
        return {
          icon: '📰',
          title: 'Article Not Found',
          defaultMessage: 'This racing news article is no longer available.',
          fallbackLink: '/#news',
          fallbackText: 'Latest Racing News'
        };
      default:
        return {
          icon: '🔍',
          title: 'Page Not Found',
          defaultMessage: 'The page you&apos;re looking for doesn&apos;t exist.',
          fallbackLink: '/',
          fallbackText: 'Go Home'
        };
    }
  };

  const { icon, title, defaultMessage, fallbackLink, fallbackText } = getTypeConfig();

  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="text-6xl mb-6">{icon}</div>
      
      <h1 className="text-3xl font-bold text-white mb-4">
        {title}
      </h1>
      
      <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
        {message || defaultMessage}
      </p>

      {suggestions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">
            You might be looking for:
          </h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <Link
                  href={suggestion.href}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {suggestion.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href={fallbackLink}
        className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors"
        style={{
          backgroundColor: config.primaryColor || '#3b82f6',
          color: 'white'
        }}
      >
        {fallbackText}
      </Link>
    </div>
  );
};

// Timeout Error Component
export const TimeoutError = ({ 
  onRetry, 
  timeout = 30000,
  className = "" 
}) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onRetry?.();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onRetry]);

  return (
    <div className={`bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="text-orange-400 text-xl">⏱️</div>
        <div className="flex-1">
          <h3 className="text-orange-400 font-semibold mb-1">
            Request Timeout
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            Racing servers are taking longer than expected to respond.
          </p>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onRetry}
              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Retry Now
            </button>
            
            <span className="text-gray-500 text-xs">
              Auto-retry in {countdown}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
