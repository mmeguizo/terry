import { Suspense } from "react";
// Get config function (same as in layout.js)
async function getConfig() {
  try {
    const baseUrl = process.env.SITE_DOMAIN || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/config`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Config API failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch config:', error);
    // Fallback to default config
    return {
      siteTitle: "RaceReady",
      primaryColor: "#3b82f6",
      accentColor: "#8b5cf6"
    };
  }
}
import LiveTiming from "@/components/racing/LiveTiming";
import PhotoGallery from "@/components/racing/PhotoGallery";
import RaceResults from "@/components/racing/RaceResults";
import TrackMap from "@/components/racing/TrackMap";
import { RacingSpinner } from "@/components/ui/Skeletons";
import ErrorBoundary from "@/components/error/ErrorBoundary";

export async function generateMetadata() {
  const config = await getConfig();
  
  return {
    title: `Racing Dashboard - ${config.siteTitle}`,
    description: `Live timing, results, and interactive features for ${config.siteTitle}`,
    openGraph: {
      title: `Racing Dashboard - ${config.siteTitle}`,
      description: `Live timing, results, and interactive features for ${config.siteTitle}`,
      type: 'website',
    },
  };
}

export default async function DashboardPage() {
  const config = await getConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920')"
          }}
        ></div>
        
        <div className="relative z-20 container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Racing
              <span 
                className="block text-transparent bg-clip-text bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${config.primaryColor || '#3b82f6'}, ${config.accentColor || '#8b5cf6'})`
                }}
              >
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Experience the thrill of motorsport with live timing, interactive track maps, 
              race results, and exclusive photo galleries. Your complete racing command center.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">LIVE</div>
                <div className="text-sm text-gray-300">Timing</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">3D</div>
                <div className="text-sm text-gray-300">Track Map</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">HD</div>
                <div className="text-sm text-gray-300">Photos</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">REAL</div>
                <div className="text-sm text-gray-300">Results</div>
              </div>
            </div>

            {/* Racing Pattern */}
            <div className="flex items-center space-x-2 text-white/60">
              <div className="flex space-x-1">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 ${i % 2 === 0 ? 'bg-white' : 'bg-transparent border border-white'}`}
                  ></div>
                ))}
              </div>
              <span className="text-sm font-mono">STARTING GRID</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        
        {/* Live Timing Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Live Timing</h2>
              <p className="text-gray-400">Real-time race positions and sector times</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>LIVE DATA</span>
            </div>
          </div>
          
          <ErrorBoundary context="live-timing" level="section">
            <Suspense fallback={
              <div className="bg-gray-900 rounded-2xl p-8">
                <RacingSpinner size="lg" className="mx-auto" />
                <p className="text-center text-gray-400 mt-4">Loading live timing...</p>
              </div>
            }>
              <LiveTiming eventId="current" className="w-full" />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* Track Map Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Interactive Track Map</h2>
              <p className="text-gray-400">Live car positions and track analysis</p>
            </div>
            <div className="text-sm text-gray-400">
              Click on cars for details
            </div>
          </div>
          
          <ErrorBoundary context="track-map" level="section">
            <Suspense fallback={
              <div className="bg-gray-900 rounded-2xl p-8">
                <RacingSpinner size="lg" className="mx-auto" />
                <p className="text-center text-gray-400 mt-4">Loading track map...</p>
              </div>
            }>
              <TrackMap className="w-full" />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* Results and Gallery Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          
          {/* Race Results */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Race Results</h2>
              <p className="text-gray-400">Complete session results and standings</p>
            </div>
            
            <ErrorBoundary context="race-results" level="section">
              <Suspense fallback={
                <div className="bg-gray-900 rounded-2xl p-8">
                  <RacingSpinner size="lg" className="mx-auto" />
                  <p className="text-center text-gray-400 mt-4">Loading results...</p>
                </div>
              }>
                <RaceResults eventId="current" className="w-full" />
              </Suspense>
            </ErrorBoundary>
          </section>

          {/* Photo Gallery */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Photo Gallery</h2>
              <p className="text-gray-400">Exclusive racing photography and moments</p>
            </div>
            
            <ErrorBoundary context="photo-gallery" level="section">
              <Suspense fallback={
                <div className="bg-gray-900 rounded-2xl p-8">
                  <RacingSpinner size="lg" className="mx-auto" />
                  <p className="text-center text-gray-400 mt-4">Loading gallery...</p>
                </div>
              }>
                <PhotoGallery eventId="current" className="w-full" />
              </Suspense>
            </ErrorBoundary>
          </section>
        </div>

        {/* Additional Features */}
        <section className="bg-gray-800/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">More Racing Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-lg p-6 text-center group hover:bg-gray-800 transition-colors">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Statistics</h3>
              <p className="text-gray-400 text-sm">Detailed race analytics and driver performance metrics</p>
              <div className="mt-4 text-xs text-gray-500">Coming Soon</div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 text-center group hover:bg-gray-800 transition-colors">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-lg font-semibold text-white mb-2">Live Stream</h3>
              <p className="text-gray-400 text-sm">Watch the race live with multiple camera angles</p>
              <div className="mt-4 text-xs text-gray-500">Coming Soon</div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 text-center group hover:bg-gray-800 transition-colors">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
              <p className="text-gray-400 text-sm">Connect with other racing fans during the event</p>
              <div className="mt-4 text-xs text-gray-500">Coming Soon</div>
            </div>
          </div>
        </section>

        {/* Racing Footer Pattern */}
        <div className="text-center py-8">
          <div className="flex justify-center items-center space-x-2 text-gray-600 mb-4">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1 h-1 ${i % 2 === 0 ? 'bg-gray-600' : 'bg-transparent'}`}
              ></div>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            🏁 Racing Dashboard - Real-time motorsport experience
          </p>
        </div>
      </div>
    </div>
  );
}
