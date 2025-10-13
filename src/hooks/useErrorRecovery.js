"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export const useErrorRecovery = (options = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    exponentialBackoff = true,
    onError,
    onRetry,
    onMaxRetriesReached
  } = options;

  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);
  
  const retryTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const calculateDelay = useCallback((attempt) => {
    if (!exponentialBackoff) return retryDelay;
    return retryDelay * Math.pow(2, attempt);
  }, [retryDelay, exponentialBackoff]);

  const handleError = useCallback((error, context = {}) => {
    if (!mountedRef.current) return;

    console.error('🚨 Error caught by recovery hook:', error, context);
    
    setError({ ...error, context, timestamp: Date.now() });
    onError?.(error, context);

    // Auto-retry for certain error types
    const shouldAutoRetry = 
      error.name === 'NetworkError' || 
      error.status >= 500 || 
      error.code === 'TIMEOUT';

    if (shouldAutoRetry && retryCount < maxRetries) {
      scheduleRetry();
    }
  }, [retryCount, maxRetries, onError]);

  const scheduleRetry = useCallback(() => {
    if (retryCount >= maxRetries) {
      onMaxRetriesReached?.(error);
      return;
    }

    const delay = calculateDelay(retryCount);
    setIsRetrying(true);

    retryTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      
      setRetryCount(prev => prev + 1);
      setIsRetrying(false);
      onRetry?.(retryCount + 1);
    }, delay);
  }, [retryCount, maxRetries, calculateDelay, error, onRetry, onMaxRetriesReached]);

  const retry = useCallback(async (asyncOperation) => {
    if (isRetrying || retryCount >= maxRetries) return;

    setIsRecovering(true);
    setIsRetrying(true);

    try {
      const result = await asyncOperation();
      
      if (mountedRef.current) {
        // Success - reset error state
        setError(null);
        setRetryCount(0);
        setIsRecovering(false);
        setIsRetrying(false);
      }
      
      return result;
    } catch (retryError) {
      if (mountedRef.current) {
        setRetryCount(prev => prev + 1);
        setError(retryError);
        setIsRetrying(false);
        
        if (retryCount + 1 < maxRetries) {
          scheduleRetry();
        } else {
          setIsRecovering(false);
          onMaxRetriesReached?.(retryError);
        }
      }
      
      throw retryError;
    }
  }, [isRetrying, retryCount, maxRetries, scheduleRetry, onMaxRetriesReached]);

  const reset = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    setError(null);
    setRetryCount(0);
    setIsRetrying(false);
    setIsRecovering(false);
  }, []);

  const canRetry = retryCount < maxRetries && !isRetrying;

  return {
    error,
    isRetrying,
    retryCount,
    isRecovering,
    canRetry,
    maxRetries,
    handleError,
    retry,
    reset,
    scheduleRetry: canRetry ? scheduleRetry : null
  };
};

// Hook for API calls with automatic error recovery
export const useApiWithRecovery = (apiCall, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const {
    handleError,
    retry,
    reset,
    error,
    isRetrying,
    retryCount,
    canRetry
  } = useErrorRecovery({
    ...options,
    onRetry: (attempt) => {
      console.log(`🔄 API retry attempt ${attempt}`);
      executeApiCall();
    }
  });

  const executeApiCall = useCallback(async () => {
    if (!apiCall) return;

    setLoading(true);
    
    try {
      const result = await apiCall();
      setData(result);
      reset(); // Clear any previous errors
    } catch (error) {
      handleError(error, { apiCall: apiCall.name });
    } finally {
      setLoading(false);
    }
  }, [apiCall, handleError, reset]);

  useEffect(() => {
    executeApiCall();
  }, dependencies);

  const refetch = useCallback(() => {
    reset();
    executeApiCall();
  }, [reset, executeApiCall]);

  return {
    data,
    loading: loading || isRetrying,
    error,
    retryCount,
    canRetry,
    refetch,
    retry: () => retry(apiCall)
  };
};

// Hook for form submission with error recovery
export const useFormWithRecovery = (submitFunction, options = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitData, setSubmitData] = useState(null);
  
  const {
    handleError,
    retry,
    reset,
    error,
    isRetrying,
    retryCount,
    canRetry
  } = useErrorRecovery({
    maxRetries: 2, // Lower retry count for forms
    ...options,
    onRetry: (attempt) => {
      console.log(`🔄 Form retry attempt ${attempt}`);
    }
  });

  const submit = useCallback(async (formData) => {
    setIsSubmitting(true);
    
    try {
      const result = await submitFunction(formData);
      setSubmitData(result);
      reset();
      return result;
    } catch (error) {
      handleError(error, { formData });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [submitFunction, handleError, reset]);

  const retrySubmit = useCallback((formData) => {
    return retry(() => submitFunction(formData));
  }, [retry, submitFunction]);

  return {
    submit,
    retrySubmit,
    isSubmitting: isSubmitting || isRetrying,
    submitData,
    error,
    retryCount,
    canRetry,
    reset
  };
};

// Hook for real-time data with connection recovery
export const useRealtimeWithRecovery = (connectFunction, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionData, setConnectionData] = useState(null);
  const connectionRef = useRef(null);
  
  const {
    handleError,
    retry,
    reset,
    error,
    isRetrying,
    retryCount
  } = useErrorRecovery({
    maxRetries: 10, // Higher retry count for real-time connections
    retryDelay: 2000,
    ...options,
    onRetry: (attempt) => {
      console.log(`🔄 Reconnection attempt ${attempt}`);
      connect();
    }
  });

  const connect = useCallback(async () => {
    try {
      const connection = await connectFunction();
      connectionRef.current = connection;
      setIsConnected(true);
      reset();
      
      // Handle connection events
      connection.onData = (data) => setConnectionData(data);
      connection.onError = (error) => {
        setIsConnected(false);
        handleError(error, { type: 'connection' });
      };
      connection.onClose = () => {
        setIsConnected(false);
        handleError(new Error('Connection closed'), { type: 'disconnect' });
      };
      
    } catch (error) {
      setIsConnected(false);
      handleError(error, { type: 'connection' });
    }
  }, [connectFunction, handleError, reset]);

  const disconnect = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.close?.();
      connectionRef.current = null;
    }
    setIsConnected(false);
    reset();
  }, [reset]);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    isConnected: isConnected && !isRetrying,
    connectionData,
    error,
    retryCount,
    isRetrying,
    reconnect: connect,
    disconnect
  };
};



