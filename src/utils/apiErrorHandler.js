/**
 * Racing API Error Handler
 * Comprehensive error handling for racing platform APIs
 */

// Error types specific to racing platform
export const RacingErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  STRAPI_ERROR: 'STRAPI_ERROR',
  RACEREADY_ERROR: 'RACEREADY_ERROR',
  CACHE_ERROR: 'CACHE_ERROR'
};

// Racing-specific error messages
const RacingErrorMessages = {
  [RacingErrorTypes.NETWORK_ERROR]: {
    title: 'Connection Lost',
    message: 'Unable to connect to racing servers',
    suggestion: 'Check your internet connection and try again',
    icon: '📡'
  },
  [RacingErrorTypes.API_ERROR]: {
    title: 'Racing API Error',
    message: 'Racing servers are experiencing issues',
    suggestion: 'Please try again in a few moments',
    icon: '🔌'
  },
  [RacingErrorTypes.TIMEOUT_ERROR]: {
    title: 'Request Timeout',
    message: 'Racing servers are taking too long to respond',
    suggestion: 'The servers might be busy during race events',
    icon: '⏱️'
  },
  [RacingErrorTypes.VALIDATION_ERROR]: {
    title: 'Invalid Data',
    message: 'The racing data format is incorrect',
    suggestion: 'Please check your input and try again',
    icon: '❌'
  },
  [RacingErrorTypes.AUTHENTICATION_ERROR]: {
    title: 'Access Denied',
    message: 'You need permission to access this racing data',
    suggestion: 'Please log in or contact support',
    icon: '🔒'
  },
  [RacingErrorTypes.RATE_LIMIT_ERROR]: {
    title: 'Too Many Requests',
    message: 'You\'re requesting racing data too quickly',
    suggestion: 'Please wait a moment before trying again',
    icon: '🚦'
  },
  [RacingErrorTypes.STRAPI_ERROR]: {
    title: 'CMS Error',
    message: 'Unable to load content from racing CMS',
    suggestion: 'Content might be temporarily unavailable',
    icon: '📝'
  },
  [RacingErrorTypes.RACEREADY_ERROR]: {
    title: 'Live Timing Error',
    message: 'Unable to connect to live race timing',
    suggestion: 'Live timing might not be available for this event',
    icon: '🏁'
  },
  [RacingErrorTypes.CACHE_ERROR]: {
    title: 'Cache Error',
    message: 'Unable to load cached racing data',
    suggestion: 'Trying to fetch fresh data...',
    icon: '💾'
  }
};

export class RacingError extends Error {
  constructor(type, originalError = null, context = {}) {
    const errorConfig = RacingErrorMessages[type] || RacingErrorMessages[RacingErrorTypes.API_ERROR];
    
    super(errorConfig.message);
    
    this.name = 'RacingError';
    this.type = type;
    this.title = errorConfig.title;
    this.suggestion = errorConfig.suggestion;
    this.icon = errorConfig.icon;
    this.originalError = originalError;
    this.context = context;
    this.timestamp = new Date().toISOString();
    this.errorId = `racing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      title: this.title,
      message: this.message,
      suggestion: this.suggestion,
      icon: this.icon,
      context: this.context,
      timestamp: this.timestamp,
      errorId: this.errorId,
      stack: this.stack
    };
  }
}

// Error classification function
export const classifyError = (error, context = {}) => {
  // Network errors
  if (!navigator.onLine) {
    return new RacingError(RacingErrorTypes.NETWORK_ERROR, error, { ...context, offline: true });
  }

  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERR') {
    return new RacingError(RacingErrorTypes.NETWORK_ERROR, error, context);
  }

  // Timeout errors
  if (error.name === 'TimeoutError' || error.code === 'TIMEOUT') {
    return new RacingError(RacingErrorTypes.TIMEOUT_ERROR, error, context);
  }

  // HTTP status errors
  if (error.status || error.response?.status) {
    const status = error.status || error.response.status;
    
    switch (status) {
      case 400:
        return new RacingError(RacingErrorTypes.VALIDATION_ERROR, error, { ...context, status });
      case 401:
      case 403:
        return new RacingError(RacingErrorTypes.AUTHENTICATION_ERROR, error, { ...context, status });
      case 404:
        return new RacingError(RacingErrorTypes.API_ERROR, error, { 
          ...context, 
          status,
          title: 'Racing Data Not Found',
          message: 'The requested racing information is not available'
        });
      case 429:
        return new RacingError(RacingErrorTypes.RATE_LIMIT_ERROR, error, { ...context, status });
      case 500:
      case 502:
      case 503:
      case 504:
        return new RacingError(RacingErrorTypes.API_ERROR, error, { ...context, status });
      default:
        return new RacingError(RacingErrorTypes.API_ERROR, error, { ...context, status });
    }
  }

  // Strapi-specific errors
  if (context.endpoint?.includes('/api/') || error.message?.includes('Strapi')) {
    return new RacingError(RacingErrorTypes.STRAPI_ERROR, error, context);
  }

  // RaceReady-specific errors
  if (context.endpoint?.includes('raceready') || error.message?.includes('RaceReady')) {
    return new RacingError(RacingErrorTypes.RACEREADY_ERROR, error, context);
  }

  // Cache errors
  if (error.message?.includes('cache') || context.cache) {
    return new RacingError(RacingErrorTypes.CACHE_ERROR, error, context);
  }

  // Default to generic API error
  return new RacingError(RacingErrorTypes.API_ERROR, error, context);
};

// Enhanced fetch wrapper with racing-specific error handling
export const racingFetch = async (url, options = {}) => {
  const {
    timeout = 30000,
    retries = 3,
    retryDelay = 1000,
    context = {},
    ...fetchOptions
  } = options;

  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
      });

      // Make the request
      const fetchPromise = fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers
        }
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // Handle HTTP errors
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.response = response;
        throw error;
      }

      // Try to parse JSON
      try {
        const data = await response.json();
        return data;
      } catch (parseError) {
        // If JSON parsing fails, return text
        const text = await response.text();
        return text;
      }

    } catch (error) {
      lastError = classifyError(error, { 
        ...context, 
        url, 
        attempt: attempt + 1,
        maxAttempts: retries + 1
      });

      // Don't retry on certain error types
      const noRetryTypes = [
        RacingErrorTypes.VALIDATION_ERROR,
        RacingErrorTypes.AUTHENTICATION_ERROR
      ];

      if (noRetryTypes.includes(lastError.type) || attempt === retries) {
        throw lastError;
      }

      // Wait before retry
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        console.log(`🔄 Retrying racing API call (${attempt + 1}/${retries + 1}): ${url}`);
      }
    }
  }

  throw lastError;
};

// Error reporting function
export const reportRacingError = (error, additionalContext = {}) => {
  const errorReport = {
    ...error.toJSON?.() || { message: error.message, stack: error.stack },
    ...additionalContext,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server-side',
    timestamp: new Date().toISOString()
  };

  // Log to console with racing theme
  console.group('🏁 Racing Error Report');
  console.error('Error:', error);
  console.table(errorReport);
  console.groupEnd();

  // Send to analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      custom_map: {
        error_type: error.type,
        error_id: error.errorId
      }
    });
  }

  // Send to error monitoring service (implement based on your service)
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry, LogRocket, etc.
    // Sentry.captureException(error, { extra: errorReport });
  }

  return errorReport;
};

// Global error handler setup
export const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = classifyError(event.reason, { type: 'unhandledRejection' });
    reportRacingError(error);
    console.error('🚨 Unhandled Promise Rejection:', error);
  });

  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    const error = classifyError(event.error, { 
      type: 'globalError',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
    reportRacingError(error);
    console.error('🚨 Global JavaScript Error:', error);
  });

  console.log('🏁 Racing error handling initialized');
};

// Utility functions for common error scenarios
export const handleApiError = (error, context = {}) => {
  const racingError = classifyError(error, context);
  reportRacingError(racingError, context);
  return racingError;
};

export const isRetryableError = (error) => {
  const retryableTypes = [
    RacingErrorTypes.NETWORK_ERROR,
    RacingErrorTypes.TIMEOUT_ERROR,
    RacingErrorTypes.API_ERROR,
    RacingErrorTypes.CACHE_ERROR
  ];
  
  return retryableTypes.includes(error.type);
};

export const getRetryDelay = (attempt, baseDelay = 1000) => {
  return Math.min(baseDelay * Math.pow(2, attempt), 30000); // Max 30 seconds
};
