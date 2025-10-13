/**
 * Smart Caching Utility for Multi-Tenant Racing Website
 * Implements intelligent caching strategies with racing-specific optimizations
 */

// Cache configuration for different content types
const CACHE_CONFIG = {
  // Site configuration - changes rarely, cache longer
  siteConfig: {
    ttl: 30 * 60 * 1000, // 30 minutes
    staleWhileRevalidate: true,
    key: 'site-config'
  },
  
  // News articles - moderate frequency updates
  news: {
    ttl: 10 * 60 * 1000, // 10 minutes
    staleWhileRevalidate: true,
    key: 'news'
  },
  
  // Events - can change frequently during race weekends
  events: {
    ttl: 5 * 60 * 1000, // 5 minutes
    staleWhileRevalidate: true,
    key: 'events'
  },
  
  // Live timing data - very frequent updates
  liveData: {
    ttl: 30 * 1000, // 30 seconds
    staleWhileRevalidate: true,
    key: 'live-data'
  },
  
  // Static content - rarely changes
  static: {
    ttl: 60 * 60 * 1000, // 1 hour
    staleWhileRevalidate: false,
    key: 'static'
  }
};

class SmartCache {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      staleHits: 0,
      errors: 0
    };
    
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Generate cache key with site-specific prefix
   */
  generateKey(type, identifier, siteSlug) {
    const config = CACHE_CONFIG[type] || CACHE_CONFIG.static;
    return `${siteSlug || 'default'}:${config.key}:${identifier}`;
  }

  /**
   * Get cached data with intelligent fallback
   */
  async get(key, fetchFunction, options = {}) {
    const {
      type = 'static',
      siteSlug = process.env.SITE_SLUG,
      forceRefresh = false,
      timeout = 10000
    } = options;

    const cacheKey = this.generateKey(type, key, siteSlug);
    const config = CACHE_CONFIG[type] || CACHE_CONFIG.static;
    const now = Date.now();

    // Check if we have cached data
    const cached = this.cache.get(cacheKey);
    
    if (cached && !forceRefresh) {
      const age = now - cached.timestamp;
      const isExpired = age > config.ttl;
      const isStale = age > (config.ttl * 0.8); // Consider stale at 80% of TTL

      // Return fresh data immediately
      if (!isExpired) {
        this.stats.hits++;
        return {
          data: cached.data,
          fromCache: true,
          age: age,
          fresh: true
        };
      }

      // For stale-while-revalidate, return stale data and update in background
      if (config.staleWhileRevalidate && cached.data) {
        this.stats.staleHits++;
        
        // Start background refresh (don't await)
        this.backgroundRefresh(cacheKey, fetchFunction, config, timeout);
        
        return {
          data: cached.data,
          fromCache: true,
          age: age,
          fresh: false,
          stale: true
        };
      }
    }

    // Check if there's already a pending request for this key
    if (this.pendingRequests.has(cacheKey)) {
      try {
        const result = await this.pendingRequests.get(cacheKey);
        return {
          data: result,
          fromCache: false,
          age: 0,
          fresh: true,
          deduped: true
        };
      } catch (error) {
        this.pendingRequests.delete(cacheKey);
        throw error;
      }
    }

    // Fetch new data
    this.stats.misses++;
    return this.fetchAndCache(cacheKey, fetchFunction, config, timeout);
  }

  /**
   * Fetch data and cache it
   */
  async fetchAndCache(cacheKey, fetchFunction, config, timeout) {
    const fetchPromise = this.withTimeout(fetchFunction(), timeout);
    this.pendingRequests.set(cacheKey, fetchPromise);

    try {
      const data = await fetchPromise;
      
      // Cache the successful result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        config
      });

      this.pendingRequests.delete(cacheKey);
      
      return {
        data,
        fromCache: false,
        age: 0,
        fresh: true
      };
    } catch (error) {
      this.stats.errors++;
      this.pendingRequests.delete(cacheKey);
      
      // Try to return stale data if available
      const cached = this.cache.get(cacheKey);
      if (cached && cached.data) {
        console.warn(`Fetch failed for ${cacheKey}, returning stale data:`, error.message);
        return {
          data: cached.data,
          fromCache: true,
          age: Date.now() - cached.timestamp,
          fresh: false,
          stale: true,
          error: error.message
        };
      }
      
      throw error;
    }
  }

  /**
   * Background refresh for stale-while-revalidate
   */
  async backgroundRefresh(cacheKey, fetchFunction, config, timeout) {
    try {
      const data = await this.withTimeout(fetchFunction(), timeout);
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        config
      });
    } catch (error) {
      console.warn(`Background refresh failed for ${cacheKey}:`, error.message);
    }
  }

  /**
   * Add timeout to fetch operations
   */
  withTimeout(promise, timeout) {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  }

  /**
   * Invalidate cache entries
   */
  invalidate(pattern, siteSlug) {
    const prefix = siteSlug ? `${siteSlug}:` : '';
    const fullPattern = `${prefix}${pattern}`;
    
    for (const key of this.cache.keys()) {
      if (key.includes(fullPattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache for a specific site
   */
  clearSite(siteSlug) {
    const prefix = `${siteSlug}:`;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      const maxAge = entry.config.ttl * 2; // Keep stale data for 2x TTL
      
      if (age > maxAge) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired cache entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(2) : 0;
    
    return {
      ...this.stats,
      total,
      hitRate: `${hitRate}%`,
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size
    };
  }

  /**
   * Preload critical data for better performance
   */
  async preload(siteSlug, criticalData = []) {
    const preloadPromises = criticalData.map(async ({ key, fetchFunction, type }) => {
      try {
        await this.get(key, fetchFunction, { type, siteSlug, forceRefresh: false });
      } catch (error) {
        console.warn(`Preload failed for ${key}:`, error.message);
      }
    });

    await Promise.allSettled(preloadPromises);
  }
}

// Create singleton instance
const smartCache = new SmartCache();

// Racing-specific cache helpers
export const cacheHelpers = {
  /**
   * Cache site configuration with long TTL
   */
  getSiteConfig: (siteSlug, fetchFunction) => 
    smartCache.get('config', fetchFunction, { type: 'siteConfig', siteSlug }),

  /**
   * Cache news with medium TTL
   */
  getNews: (siteSlug, fetchFunction) => 
    smartCache.get('articles', fetchFunction, { type: 'news', siteSlug }),

  /**
   * Cache events with short TTL for race weekends
   */
  getEvents: (siteSlug, fetchFunction) => 
    smartCache.get('list', fetchFunction, { type: 'events', siteSlug }),

  /**
   * Cache individual event with short TTL
   */
  getEvent: (eventId, siteSlug, fetchFunction) => 
    smartCache.get(`event-${eventId}`, fetchFunction, { type: 'events', siteSlug }),

  /**
   * Cache live data with very short TTL
   */
  getLiveData: (eventId, siteSlug, fetchFunction) => 
    smartCache.get(`live-${eventId}`, fetchFunction, { type: 'liveData', siteSlug }),

  /**
   * Invalidate event-related cache (useful when race results update)
   */
  invalidateEvents: (siteSlug) => {
    smartCache.invalidate('events:', siteSlug);
    smartCache.invalidate('live-', siteSlug);
  },

  /**
   * Invalidate news cache (when new articles are published)
   */
  invalidateNews: (siteSlug) => {
    smartCache.invalidate('news:', siteSlug);
  },

  /**
   * Get cache statistics for monitoring
   */
  getStats: () => smartCache.getStats(),

  /**
   * Preload critical data for a site
   */
  preloadSite: async (siteSlug, configFetch, newsFetch, eventsFetch) => {
    await smartCache.preload(siteSlug, [
      { key: 'config', fetchFunction: configFetch, type: 'siteConfig' },
      { key: 'articles', fetchFunction: newsFetch, type: 'news' },
      { key: 'list', fetchFunction: eventsFetch, type: 'events' }
    ]);
  }
};

export default smartCache;
