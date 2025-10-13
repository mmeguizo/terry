"use client";

import { useState, useEffect } from "react";
import { useConfig } from "@/context/ConfigContext";

const InstallPrompt = () => {
  const config = useConfig();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return true;
      }
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    // Check if iOS
    const checkIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      setIsIOS(isIOSDevice);
      return isIOSDevice;
    };

    if (checkInstalled()) return;
    checkIOS();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a delay (better UX)
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('🏁 RaceReady PWA installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSInstructions(true);
      }
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('🏁 User accepted PWA install');
      } else {
        console.log('🏁 User dismissed PWA install');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('PWA install error:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    }
  };

  // Don't show if already installed or dismissed
  if (isInstalled || (typeof window !== 'undefined' && sessionStorage.getItem('pwa-prompt-dismissed'))) {
    return null;
  }

  // iOS Instructions Modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Install RaceReady
          </h3>
          <div className="text-left text-gray-700 space-y-3 mb-6">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 font-bold">1.</span>
              <span>Tap the <strong>Share</strong> button at the bottom of Safari</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 font-bold">2.</span>
              <span>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong></span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 font-bold">3.</span>
              <span>Tap <strong>&quot;Add&quot;</strong> to install the app</span>
            </div>
          </div>
          <button
            onClick={() => setShowIOSInstructions(false)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  // Main install prompt
  if (!showPrompt && !isIOS) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-up-fade">
      <div 
        className="bg-gradient-to-r from-gray-900 to-black text-white p-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl transform transition-all duration-500 hover:scale-102 hover:shadow-3xl"
        style={{
          background: `linear-gradient(135deg, ${config.primaryColor || '#3b82f6'}15 0%, #00000095 100%)`,
          animation: 'slideUpFade 0.6s ease-out, gentlePulse 3s ease-in-out infinite'
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setShowPrompt(false)}
          className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors duration-200 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Dismiss install prompt"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Racing header */}
        <div className="flex items-center mb-3">
          <div className="text-2xl mr-3 animate-bounce-subtle">🏁</div>
          <div>
            <h3 className="font-bold text-lg">Install {config.siteTitle || 'RaceReady'}</h3>
            <p className="text-sm opacity-80">Get the full racing experience</p>
          </div>
        </div>

        {/* Features - simplified */}
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex items-center">
            <span className="text-green-400 mr-2">✓</span>
            <span>Offline event schedules</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-400 mr-2">✓</span>
            <span>Push notifications for race updates</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-400 mr-2">✓</span>
            <span>Faster loading & app-like experience</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-white text-gray-900 py-2 px-4 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
            style={{
              background: config.primaryColor || '#3b82f6',
              color: 'white'
            }}
          >
            {isIOS ? 'How to Install' : 'Install App'}
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-white/80 hover:text-white transition-colors text-sm"
          >
            Later
          </button>
        </div>

        {/* Racing decoration */}
        <div className="absolute top-2 right-2 opacity-20">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white transform rotate-45"></div>
            <div className="w-2 h-2 bg-white transform rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
