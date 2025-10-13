"use client";

import { useState, useEffect, useRef } from "react";
import { useConfig } from "@/context/ConfigContext";
import { useRealtimeWithRecovery } from "@/hooks/useErrorRecovery";
import { RacingSpinner } from "@/components/ui/Skeletons";
import ErrorBoundary from "@/components/error/ErrorBoundary";

const LiveTiming = ({ eventId, className = "" }) => {
  const config = useConfig();
  const [timingData, setTimingData] = useState([]);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef(null);

  // Mock WebSocket connection for live timing
  const connectToLiveTiming = async () => {
    // In production, this would connect to actual live timing WebSocket
    return {
      onData: (callback) => {
        // Simulate live timing updates
        intervalRef.current = setInterval(() => {
          const mockData = generateMockTimingData();
          callback(mockData);
        }, 2000);
      },
      onError: (callback) => {
        // Handle connection errors
        setTimeout(() => callback(new Error('Live timing connection lost')), 5000);
      },
      onClose: (callback) => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        callback();
      },
      close: () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    };
  };

  const {
    isConnected,
    connectionData,
    error,
    reconnect
  } = useRealtimeWithRecovery(connectToLiveTiming, {
    maxRetries: 10,
    retryDelay: 3000
  });

  useEffect(() => {
    if (connectionData) {
      setTimingData(connectionData.drivers || []);
      setSessionInfo(connectionData.session || null);
      setIsLive(connectionData.isLive || false);
      setLastUpdate(new Date());
    }
  }, [connectionData]);

  const generateMockTimingData = () => {
    const drivers = [
      { id: 1, name: "Lewis Hamilton", team: "Mercedes", number: "44", position: 1 },
      { id: 2, name: "Max Verstappen", team: "Red Bull Racing", number: "1", position: 2 },
      { id: 3, name: "Charles Leclerc", team: "Ferrari", number: "16", position: 3 },
      { id: 4, name: "Lando Norris", team: "McLaren", number: "4", position: 4 },
      { id: 5, name: "George Russell", team: "Mercedes", number: "63", position: 5 },
      { id: 6, name: "Carlos Sainz", team: "Ferrari", number: "55", position: 6 },
      { id: 7, name: "Sergio Perez", team: "Red Bull Racing", number: "11", position: 7 },
      { id: 8, name: "Fernando Alonso", team: "Aston Martin", number: "14", position: 8 }
    ];

    return {
      drivers: drivers.map(driver => ({
        ...driver,
        lapTime: `1:${(20 + Math.random() * 10).toFixed(3)}`,
        gap: driver.position === 1 ? "Leader" : `+${(Math.random() * 30).toFixed(3)}s`,
        sector1: `${(25 + Math.random() * 5).toFixed(3)}s`,
        sector2: `${(28 + Math.random() * 5).toFixed(3)}s`,
        sector3: `${(27 + Math.random() * 5).toFixed(3)}s`,
        speed: Math.floor(280 + Math.random() * 40),
        status: Math.random() > 0.9 ? "PIT" : "RUNNING",
        lastLap: Math.floor(1 + Math.random() * 50)
      })),
      session: {
        name: "Race",
        timeRemaining: "45:32",
        lapsRemaining: 23,
        weather: "Dry",
        temperature: "24°C",
        trackTemp: "42°C"
      },
      isLive: true
    };
  };

  const formatTime = (timeString) => {
    return timeString || "--:---.---";
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 1: return "text-yellow-400"; // Gold
      case 2: return "text-gray-300";   // Silver
      case 3: return "text-orange-400"; // Bronze
      default: return "text-white";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "RUNNING": return "text-green-400";
      case "PIT": return "text-yellow-400";
      case "OUT": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  if (error && !isConnected) {
    return (
      <div className={`bg-gray-900 rounded-2xl p-6 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">⏱️</div>
          <h3 className="text-xl font-bold text-white mb-2">Live Timing Unavailable</h3>
          <p className="text-gray-400 mb-4">Unable to connect to live timing data</p>
          <button
            onClick={reconnect}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: config.primaryColor || '#3b82f6',
              color: 'white'
            }}
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <h2 className="text-xl font-bold text-white">
                {isLive ? 'LIVE TIMING' : 'TIMING'}
              </h2>
            </div>
            {sessionInfo && (
              <div className="text-sm text-gray-300">
                {sessionInfo.name}
              </div>
            )}
          </div>
          
          {lastUpdate && (
            <div className="text-xs text-gray-400">
              Updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Session Info */}
        {sessionInfo && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Time Remaining:</span>
              <div className="text-white font-mono">{sessionInfo.timeRemaining}</div>
            </div>
            <div>
              <span className="text-gray-400">Laps:</span>
              <div className="text-white font-mono">{sessionInfo.lapsRemaining}</div>
            </div>
            <div>
              <span className="text-gray-400">Weather:</span>
              <div className="text-white">{sessionInfo.weather}</div>
            </div>
            <div>
              <span className="text-gray-400">Track Temp:</span>
              <div className="text-white">{sessionInfo.trackTemp}</div>
            </div>
          </div>
        )}
      </div>

      {/* Timing Table */}
      <div className="overflow-x-auto">
        {!isConnected ? (
          <div className="p-8 text-center">
            <RacingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-400">Connecting to live timing...</p>
          </div>
        ) : timingData.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">🏁</div>
            <p className="text-gray-400">No timing data available</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr className="text-xs text-gray-300 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Pos</th>
                <th className="px-4 py-3 text-left">Driver</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-right">Gap</th>
                <th className="px-4 py-3 text-right">Last Lap</th>
                <th className="px-4 py-3 text-right">S1</th>
                <th className="px-4 py-3 text-right">S2</th>
                <th className="px-4 py-3 text-right">S3</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {timingData.map((driver, index) => (
                <tr 
                  key={driver.id}
                  className={`border-b border-gray-700 hover:bg-gray-800 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850'
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className={`font-bold text-lg ${getPositionColor(driver.position)}`}>
                      {driver.position}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-mono">
                        {driver.number}
                      </span>
                      <span className="text-white font-medium">{driver.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{driver.team}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-gray-300">
                    {driver.gap}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-white">
                    {formatTime(driver.lapTime)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-400">
                    {driver.sector1}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-400">
                    {driver.sector2}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-400">
                    {driver.sector3}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-medium ${getStatusColor(driver.status)}`}>
                      {driver.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 flex justify-between items-center">
        <span>Live timing updates every 2 seconds</span>
        {isLive && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function LiveTimingWithBoundary(props) {
  return (
    <ErrorBoundary context="live-timing" level="component">
      <LiveTiming {...props} />
    </ErrorBoundary>
  );
}



