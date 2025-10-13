"use client";

import { useState, useEffect } from "react";
import { useNetworkStatus } from "@/hooks/usePWA";

const NetworkStatus = () => {
  const { isOnline, connectionType, effectiveType, isSlowConnection } = useNetworkStatus();
  const [showStatus, setShowStatus] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Show status when going offline or coming back online
    if (!isOnline) {
      setShowStatus(true);
      setWasOffline(true);
    } else if (wasOffline) {
      setShowStatus(true);
      // Hide after 3 seconds when back online
      const timer = setTimeout(() => {
        setShowStatus(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  // Show warning for slow connections
  useEffect(() => {
    if (isSlowConnection && isOnline) {
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSlowConnection, isOnline]);

  if (!showStatus) return null;

  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: "📡",
        message: "You're offline",
        description: "Some features may be limited",
        bgColor: "bg-red-500/90",
        textColor: "text-white"
      };
    } else if (isSlowConnection) {
      return {
        icon: "🐌",
        message: "Slow connection detected",
        description: "Racing data may load slowly",
        bgColor: "bg-yellow-500/90",
        textColor: "text-black"
      };
    } else {
      return {
        icon: "✅",
        message: "Back online!",
        description: "All racing features available",
        bgColor: "bg-green-500/90",
        textColor: "text-white"
      };
    }
  };

  const { icon, message, description, bgColor, textColor } = getStatusConfig();

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className={`${bgColor} ${textColor} px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm border border-white/20 flex items-center space-x-3 max-w-sm`}>
        <div className="text-xl">{icon}</div>
        <div className="flex-1">
          <div className="font-semibold text-sm">{message}</div>
          <div className="text-xs opacity-90">{description}</div>
        </div>
        {!isOnline && (
          <button
            onClick={() => window.location.reload()}
            className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs font-medium transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus;



