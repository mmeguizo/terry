"use client";

import { useState, useEffect } from "react";
import { useConfig } from "@/context/ConfigContext";

const NotificationManager = () => {
  const config = useConfig();
  const [permission, setPermission] = useState('default');
  const [subscription, setSubscription] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
      
      // Show prompt after user has been on site for a while
      const timer = setTimeout(() => {
        if (Notification.permission === 'default' && !(typeof window !== 'undefined' && sessionStorage.getItem('notification-prompt-dismissed'))) {
          setShowPrompt(true);
        }
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (permission === 'granted') {
      registerPushSubscription();
    }
  }, [permission]);

  const registerPushSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setSubscription(existingSubscription);
        return;
      }

      // Subscribe to push notifications
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '')
      });

      setSubscription(newSubscription);
      
      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: newSubscription,
          siteSlug: process.env.NEXT_PUBLIC_SITE_SLUG
        }),
      });

      console.log('🏁 Push notification subscription registered');
    } catch (error) {
      console.error('Failed to register push subscription:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      setShowPrompt(false);

      if (result === 'granted') {
        // Show a welcome notification
        showWelcomeNotification();
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  };

  const showWelcomeNotification = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('🏁 RaceReady Notifications Enabled!', {
          body: 'You\'ll now receive updates about race events, results, and breaking news.',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          tag: 'welcome',
          vibrate: [200, 100, 200],
          actions: [
            {
              action: 'view-events',
              title: 'View Events',
              icon: '/icons/action-events.png'
            }
          ]
        });
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('notification-prompt-dismissed', 'true');
    }
  };

  // Test notification (for development)
  const sendTestNotification = async () => {
    if (subscription) {
      try {
        await fetch('/api/notifications/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: '🏁 Test Race Update',
            body: 'This is a test notification from RaceReady!',
            url: '/events',
            tag: 'test'
          }),
        });
      } catch (error) {
        console.error('Failed to send test notification:', error);
      }
    }
  };

  if (!isSupported || permission === 'denied') {
    return null;
  }

  // Notification prompt with smooth animations and auto-dismiss
  if (showPrompt && permission === 'default') {
    return (
      <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-in-fade">
        <div 
          className="bg-gradient-to-r from-gray-900 to-black text-white p-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl transform transition-all duration-500 hover:scale-102 hover:shadow-3xl"
          style={{
            background: `linear-gradient(135deg, ${config.primaryColor || '#3b82f6'}15 0%, #00000095 100%)`,
            animation: 'slideInFade 0.6s ease-out, gentlePulse 3s ease-in-out infinite'
          }}
        >
          {/* Close button - subtle but accessible */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors duration-200 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Racing header */}
          <div className="flex items-center mb-3">
            <div className="text-2xl mr-3 animate-bounce-subtle">🔔</div>
            <div>
              <h3 className="font-bold text-lg">Stay Updated</h3>
              <p className="text-sm opacity-80">Get race notifications</p>
            </div>
          </div>

          {/* Features - simplified for cleaner look */}
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex items-center">
              <span className="text-green-400 mr-2">🏁</span>
              <span>Race start reminders</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">🏆</span>
              <span>Live results & updates</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">📰</span>
              <span>Breaking racing news</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <button
              onClick={requestPermission}
              className="flex-1 py-2 px-4 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{
                background: config.primaryColor || '#3b82f6',
                color: 'white'
              }}
            >
              Enable Notifications
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-white/80 hover:text-white transition-colors text-sm"
            >
              Not Now
            </button>
          </div>

          {/* Racing decoration */}
          <div className="absolute top-2 right-2 opacity-20">
            <div className="w-6 h-6 border-2 border-white rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  // Development controls (only show in development)
  if (process.env.NODE_ENV === 'development' && permission === 'granted') {
    return (
      <div className="fixed bottom-20 right-4 z-30">
        <button
          onClick={sendTestNotification}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-lg transition-colors"
          title="Send Test Notification"
        >
          🔔 Test
        </button>
      </div>
    );
  }

  return null;
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default NotificationManager;
