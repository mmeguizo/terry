"use client";

import React from "react";
import { useConfig } from "@/context/ConfigContext";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('🚨 Racing App Error Caught:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Report error to monitoring service (if available)
    this.reportError(error, errorInfo);
  }

  reportError = (error, errorInfo) => {
    try {
      // Send error to monitoring service
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: error.toString(),
          fatal: false,
          error_id: this.state.errorId
        });
      }

      // Log to console with racing theme
      console.group('🏁 Racing Error Report');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Error ID:', this.state.errorId);
      console.groupEnd();
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI based on error type and context
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          context={this.props.context || 'general'}
          level={this.props.level || 'component'}
        />
      );
    }

    return this.props.children;
  }
}

// Racing-themed error fallback component
const ErrorFallback = ({ 
  error, 
  errorInfo, 
  errorId, 
  onRetry, 
  onReload, 
  context = 'general',
  level = 'component'
}) => {
  const config = useConfig();
  
  const getErrorConfig = () => {
    const errorType = error?.name || 'Error';
    const errorMessage = error?.message || 'Something went wrong';
    
    // Different error types get different racing themes
    switch (context) {
      case 'events':
        return {
          icon: '🏁',
          title: 'Race Schedule Error',
          message: 'Unable to load event information',
          suggestion: 'The race schedule might be temporarily unavailable. Please try again.',
          bgGradient: 'from-red-900 via-red-800 to-gray-900'
        };
      case 'news':
        return {
          icon: '📰',
          title: 'News Feed Error', 
          message: 'Unable to load racing news',
          suggestion: 'The news feed is experiencing issues. Check back in a moment.',
          bgGradient: 'from-orange-900 via-orange-800 to-gray-900'
        };
      case 'live-timing':
        return {
          icon: '⏱️',
          title: 'Live Timing Error',
          message: 'Unable to connect to live timing',
          suggestion: 'Live timing data is temporarily unavailable. Retrying automatically...',
          bgGradient: 'from-blue-900 via-blue-800 to-gray-900'
        };
      case 'api':
        return {
          icon: '🔌',
          title: 'Connection Error',
          message: 'Unable to connect to racing servers',
          suggestion: 'Check your internet connection or try again later.',
          bgGradient: 'from-purple-900 via-purple-800 to-gray-900'
        };
      default:
        return {
          icon: '⚠️',
          title: 'Racing App Error',
          message: errorMessage.length > 100 ? 'An unexpected error occurred' : errorMessage,
          suggestion: 'Something went wrong with the racing application. Please try refreshing.',
          bgGradient: 'from-gray-900 via-gray-800 to-black'
        };
    }
  };

  const { icon, title, message, suggestion, bgGradient } = getErrorConfig();
  const isFullPage = level === 'page';

  return (
    <div className={`${isFullPage ? 'min-h-screen' : 'min-h-[400px]'} bg-gradient-to-br ${bgGradient} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full text-center">
        {/* Racing flag animation */}
        <div className="mb-8">
          <div className="text-6xl mb-4 animate-bounce">{icon}</div>
          <div className="flex justify-center space-x-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ 
                  backgroundColor: config.primaryColor || '#3b82f6',
                  animationDelay: `${i * 0.2}s` 
                }}
              />
            ))}
          </div>
        </div>

        {/* Error content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h1 className="text-2xl font-bold text-white mb-3">
            {title}
          </h1>
          
          <p className="text-gray-300 mb-4 leading-relaxed">
            {message}
          </p>

          <p className="text-gray-400 text-sm mb-6">
            {suggestion}
          </p>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={onRetry}
              className="w-full font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: config.primaryColor || '#3b82f6',
                color: 'white'
              }}
            >
              Try Again
            </button>
            
            <button
              onClick={onReload}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-white/20"
            >
              Reload Page
            </button>
          </div>

          {/* Error details (development only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-6 text-left">
              <summary className="text-gray-400 text-sm cursor-pointer hover:text-white">
                Error Details (Dev Only)
              </summary>
              <div className="mt-2 p-3 bg-black/30 rounded text-xs font-mono text-red-300 overflow-auto max-h-32">
                <div className="mb-2">
                  <strong>Error ID:</strong> {errorId}
                </div>
                <div className="mb-2">
                  <strong>Error:</strong> {error.toString()}
                </div>
                {error.stack && (
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs mt-1">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Racing decoration */}
          <div className="mt-6 flex justify-center space-x-4 opacity-50">
            <div className="w-8 h-1 bg-white transform -skew-x-12"></div>
            <div className="w-8 h-1 transform -skew-x-12" style={{ backgroundColor: config.primaryColor || '#3b82f6' }}></div>
            <div className="w-8 h-1 bg-white transform -skew-x-12"></div>
          </div>
        </div>
      </div>

      {/* Background racing elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-white/5 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-white/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
