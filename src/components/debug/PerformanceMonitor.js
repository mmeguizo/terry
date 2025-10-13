"use client";

import { useEffect, useState } from "react";
import { cacheHelpers } from "@/utils/smartCache";

const PerformanceMonitor = ({ enabled = process.env.NODE_ENV === 'development' }) => {
  const [stats, setStats] = useState({
    cacheStats: null,
    vitals: {},
    loadTimes: {},
    isVisible: false
  });

  useEffect(() => {
    if (!enabled) return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        setStats(prev => ({
          ...prev,
          vitals: {
            ...prev.vitals,
            [entry.name]: {
              value: entry.value,
              rating: entry.value < 100 ? 'good' : entry.value < 300 ? 'needs-improvement' : 'poor'
            }
          }
        }));
      }
    });

    // Observe various performance metrics
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      console.warn('Performance Observer not supported:', e);
    }

    // Monitor load times
    const loadStartTime = performance.now();
    
    const checkLoadComplete = () => {
      if (document.readyState === 'complete') {
        setStats(prev => ({
          ...prev,
          loadTimes: {
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
            firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0
          }
        }));
      } else {
        setTimeout(checkLoadComplete, 100);
      }
    };
    
    checkLoadComplete();

    // Update cache stats periodically
    const updateCacheStats = () => {
      setStats(prev => ({
        ...prev,
        cacheStats: cacheHelpers.getStats()
      }));
    };

    updateCacheStats();
    const interval = setInterval(updateCacheStats, 5000);

    // Keyboard shortcut to toggle visibility (Ctrl+Shift+P)
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setStats(prev => ({ ...prev, isVisible: !prev.isVisible }));
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [enabled]);

  if (!enabled || !stats.isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setStats(prev => ({ ...prev, isVisible: true }))}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-lg transition-colors"
          title="Show Performance Monitor (Ctrl+Shift+P)"
        >
          🏁 Perf
        </button>
      </div>
    );
  }

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'good': return 'text-green-400';
      case 'needs-improvement': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatMs = (ms) => `${Math.round(ms)}ms`;
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 backdrop-blur-xl text-white p-4 rounded-xl border border-white/20 max-w-sm text-xs font-mono shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-blue-400 flex items-center gap-2">
          🏁 Performance Monitor
        </h3>
        <button
          onClick={() => setStats(prev => ({ ...prev, isVisible: false }))}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Cache Stats */}
      {stats.cacheStats && (
        <div className="mb-3 p-2 bg-white/5 rounded-lg">
          <h4 className="font-semibold text-green-400 mb-1">🚀 Smart Cache</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>Hit Rate: <span className="text-green-400">{stats.cacheStats.hitRate}</span></div>
            <div>Cache Size: <span className="text-blue-400">{stats.cacheStats.cacheSize}</span></div>
            <div>Hits: <span className="text-green-400">{stats.cacheStats.hits}</span></div>
            <div>Misses: <span className="text-yellow-400">{stats.cacheStats.misses}</span></div>
            <div>Stale Hits: <span className="text-orange-400">{stats.cacheStats.staleHits}</span></div>
            <div>Errors: <span className="text-red-400">{stats.cacheStats.errors}</span></div>
          </div>
        </div>
      )}

      {/* Core Web Vitals */}
      <div className="mb-3 p-2 bg-white/5 rounded-lg">
        <h4 className="font-semibold text-yellow-400 mb-1">⚡ Core Web Vitals</h4>
        {Object.entries(stats.vitals).map(([name, data]) => (
          <div key={name} className="flex justify-between">
            <span className="capitalize">{name.replace(/-/g, ' ')}:</span>
            <span className={getRatingColor(data.rating)}>
              {formatMs(data.value)}
            </span>
          </div>
        ))}
      </div>

      {/* Load Times */}
      {Object.keys(stats.loadTimes).length > 0 && (
        <div className="mb-3 p-2 bg-white/5 rounded-lg">
          <h4 className="font-semibold text-purple-400 mb-1">⏱️ Load Times</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>DOM Ready:</span>
              <span className="text-green-400">{formatMs(stats.loadTimes.domContentLoaded)}</span>
            </div>
            <div className="flex justify-between">
              <span>Load Complete:</span>
              <span className="text-blue-400">{formatMs(stats.loadTimes.loadComplete)}</span>
            </div>
            <div className="flex justify-between">
              <span>First Paint:</span>
              <span className="text-yellow-400">{formatMs(stats.loadTimes.firstPaint)}</span>
            </div>
            <div className="flex justify-between">
              <span>First Content:</span>
              <span className="text-orange-400">{formatMs(stats.loadTimes.firstContentfulPaint)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Memory Usage (if available) */}
      {performance.memory && (
        <div className="p-2 bg-white/5 rounded-lg">
          <h4 className="font-semibold text-red-400 mb-1">🧠 Memory</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Used:</span>
              <span className="text-red-400">{formatBytes(performance.memory.usedJSHeapSize)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="text-yellow-400">{formatBytes(performance.memory.totalJSHeapSize)}</span>
            </div>
            <div className="flex justify-between">
              <span>Limit:</span>
              <span className="text-green-400">{formatBytes(performance.memory.jsHeapSizeLimit)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-3 pt-2 border-t border-white/10 text-xs text-gray-400">
        Press <kbd className="bg-white/10 px-1 rounded">Ctrl+Shift+P</kbd> to toggle
      </div>
    </div>
  );
};

export default PerformanceMonitor;
