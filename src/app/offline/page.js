"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Racing flag animation */}
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-bounce">🏁</div>
          <div className="flex justify-center space-x-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-4">
            You&apos;re Offline
          </h1>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            No internet connection detected. Don&apos;t worry - you can still access cached racing content and event schedules.
          </p>

          {/* Available offline features */}
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-400 mb-3">
              Available Offline:
            </h2>
            <ul className="text-left text-gray-300 space-y-2">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Cached event schedules
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Previously viewed news
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Event documents
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Site navigation
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
            
            <Link
              href="/"
              className="block w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-white/20"
            >
              Browse Offline Content
            </Link>
          </div>

          {/* Racing-themed decoration */}
          <div className="mt-6 flex justify-center space-x-4 opacity-50">
            <div className="w-8 h-1 bg-white transform -skew-x-12"></div>
            <div className="w-8 h-1 bg-blue-500 transform -skew-x-12"></div>
            <div className="w-8 h-1 bg-white transform -skew-x-12"></div>
          </div>
        </div>

        {/* Connection status */}
        <div className="mt-6 text-sm text-gray-400">
          <div id="connection-status" className="flex items-center justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            Offline Mode
          </div>
        </div>
      </div>

      {/* Background racing elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-white/10 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-blue-500/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white/5 rounded-full animate-pulse"></div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
