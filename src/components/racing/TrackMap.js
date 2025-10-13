"use client";

import { useState, useEffect, useRef } from "react";
import { useConfig } from "@/context/ConfigContext";
import ErrorBoundary from "@/components/error/ErrorBoundary";

const TrackMap = ({ trackData, livePositions = [], className = "" }) => {
  const config = useConfig();
  const canvasRef = useRef(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showSectors, setShowSectors] = useState(true);
  const [animationFrame, setAnimationFrame] = useState(0);

  // Mock track data if none provided
  const defaultTrackData = {
    name: "Silverstone Circuit",
    length: "5.891 km",
    turns: 18,
    direction: "clockwise",
    sectors: [
      { id: 1, name: "Sector 1", color: "#10b981", length: "1.8 km" },
      { id: 2, name: "Sector 2", color: "#f59e0b", length: "2.1 km" },
      { id: 3, name: "Sector 3", color: "#ef4444", length: "2.0 km" }
    ],
    corners: [
      { id: 1, name: "Abbey", type: "right", speed: "high" },
      { id: 2, name: "Farm Curve", type: "right", speed: "medium" },
      { id: 3, name: "Village", type: "left", speed: "low" },
      { id: 4, name: "The Loop", type: "right", speed: "low" },
      { id: 5, name: "Aintree", type: "left", speed: "medium" },
      { id: 6, name: "Wellington Straight", type: "straight", speed: "high" },
      { id: 7, name: "Brooklands", type: "right", speed: "low" },
      { id: 8, name: "Luffield", type: "right", speed: "low" },
      { id: 9, name: "Woodcote", type: "right", speed: "medium" }
    ],
    // SVG path for track outline (simplified Silverstone-like shape)
    trackPath: "M 100 200 Q 150 150 200 200 L 300 180 Q 350 160 380 200 L 400 250 Q 420 300 380 350 L 300 380 Q 250 400 200 380 L 150 360 Q 100 340 80 300 L 60 250 Q 80 220 100 200 Z"
  };

  const track = trackData || defaultTrackData;

  // Mock live positions if none provided
  const mockPositions = [
    { id: 1, driver: "Hamilton", number: "44", position: { x: 150, y: 200 }, speed: 285, sector: 1 },
    { id: 2, driver: "Verstappen", number: "1", position: { x: 200, y: 190 }, speed: 290, sector: 1 },
    { id: 3, driver: "Leclerc", number: "16", position: { x: 250, y: 185 }, speed: 275, sector: 2 },
    { id: 4, driver: "Norris", number: "4", position: { x: 300, y: 200 }, speed: 280, sector: 2 }
  ];

  const positions = livePositions.length > 0 ? livePositions : mockPositions;

  // Animation loop for moving cars
  useEffect(() => {
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
    };

    const interval = setInterval(animate, 100);
    return () => clearInterval(interval);
  }, []);

  // Draw track on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw track outline
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 8;
    ctx.stroke(new Path2D(track.trackPath));

    // Draw track surface
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 6;
    ctx.stroke(new Path2D(track.trackPath));

    // Draw sector divisions if enabled
    if (showSectors) {
      track.sectors.forEach((sector, index) => {
        ctx.strokeStyle = sector.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        // Draw sector boundaries (simplified)
        const sectorStart = (index / track.sectors.length) * 100;
        ctx.beginPath();
        ctx.moveTo(100 + sectorStart, 180);
        ctx.lineTo(100 + sectorStart, 220);
        ctx.stroke();
        
        ctx.setLineDash([]);
      });
    }

    // Draw start/finish line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(95, 190);
    ctx.lineTo(105, 210);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw cars
    positions.forEach((car, index) => {
      const x = car.position.x + Math.sin(animationFrame * 0.1 + index) * 2;
      const y = car.position.y + Math.cos(animationFrame * 0.1 + index) * 1;
      
      // Car body
      ctx.fillStyle = selectedCar === car.id ? (config.primaryColor || '#3b82f6') : '#ef4444';
      ctx.fillRect(x - 3, y - 6, 6, 12);
      
      // Car number
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(car.number, x, y + 2);
      
      // Speed indicator (small line)
      const speedLength = (car.speed / 300) * 10;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y - 8);
      ctx.lineTo(x, y - 8 - speedLength);
      ctx.stroke();
    });

  }, [animationFrame, selectedCar, showSectors, positions, track, config.primaryColor]);

  const handleCarClick = (car) => {
    setSelectedCar(selectedCar === car.id ? null : car.id);
  };

  const getSectorColor = (sectorId) => {
    const sector = track.sectors.find(s => s.id === sectorId);
    return sector ? sector.color : '#6b7280';
  };

  return (
    <div className={`bg-gray-900 rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="mr-3">🗺️</span>
              {track.name}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
              <span>📏 {track.length}</span>
              <span>🔄 {track.turns} turns</span>
              <span>↻ {track.direction}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSectors(!showSectors)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                showSectors 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Sectors
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Track Map */}
        <div className="relative bg-gray-800 rounded-lg p-4 mb-6">
          <canvas
            ref={canvasRef}
            className="w-full h-64 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              // Find closest car to click
              const clickedCar = positions.find(car => {
                const distance = Math.sqrt(
                  Math.pow(car.position.x - x, 2) + Math.pow(car.position.y - y, 2)
                );
                return distance < 20;
              });
              
              if (clickedCar) {
                handleCarClick(clickedCar);
              }
            }}
          />
          
          {/* Legend */}
          <div className="absolute top-2 right-2 bg-black/50 rounded-lg p-3 text-xs">
            <div className="text-white font-medium mb-2">Legend</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-2 bg-red-500 rounded"></div>
                <span className="text-gray-300">Cars</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1 bg-green-500"></div>
                <span className="text-gray-300">Speed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1 bg-white" style={{background: 'repeating-linear-gradient(90deg, white 0px, white 2px, transparent 2px, transparent 4px)'}}></div>
                <span className="text-gray-300">Start/Finish</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Positions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Positions */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">🏁</span>
              Live Positions
            </h3>
            <div className="space-y-2">
              {positions.map((car, index) => (
                <div
                  key={car.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    selectedCar === car.id
                      ? 'bg-blue-600/20 border border-blue-500'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => handleCarClick(car)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-mono">
                      {car.number}
                    </div>
                    <div className="text-white font-medium">{car.driver}</div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="text-gray-300">
                      {car.speed} km/h
                    </div>
                    <div 
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: getSectorColor(car.sector) + '40', color: getSectorColor(car.sector) }}
                    >
                      S{car.sector}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Track Sectors */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Track Sectors
            </h3>
            <div className="space-y-3">
              {track.sectors.map(sector => (
                <div key={sector.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: sector.color }}
                    ></div>
                    <div>
                      <div className="text-white font-medium">{sector.name}</div>
                      <div className="text-gray-400 text-sm">{sector.length}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">
                    {positions.filter(car => car.sector === sector.id).length} cars
                  </div>
                </div>
              ))}
            </div>

            {/* Key Corners */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-white mb-3">Key Corners</h4>
              <div className="grid grid-cols-1 gap-2">
                {track.corners.slice(0, 5).map(corner => (
                  <div key={corner.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{corner.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        corner.speed === 'high' ? 'bg-green-600 text-white' :
                        corner.speed === 'medium' ? 'bg-yellow-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {corner.speed}
                      </span>
                      <span className="text-gray-400">{corner.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Car Details */}
        {selectedCar && (
          <div className="mt-6 bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Car Details - #{positions.find(c => c.id === selectedCar)?.number}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Driver:</span>
                <div className="text-white font-medium">
                  {positions.find(c => c.id === selectedCar)?.driver}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Current Speed:</span>
                <div className="text-white font-medium">
                  {positions.find(c => c.id === selectedCar)?.speed} km/h
                </div>
              </div>
              <div>
                <span className="text-gray-400">Sector:</span>
                <div className="text-white font-medium">
                  Sector {positions.find(c => c.id === selectedCar)?.sector}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Position:</span>
                <div className="text-white font-medium">
                  P{positions.findIndex(c => c.id === selectedCar) + 1}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function TrackMapWithBoundary(props) {
  return (
    <ErrorBoundary context="track-map" level="component">
      <TrackMap {...props} />
    </ErrorBoundary>
  );
}



