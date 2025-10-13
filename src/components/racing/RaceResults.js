"use client";

import { useState, useEffect } from "react";
import { useConfig } from "@/context/ConfigContext";
import { useApiWithRecovery } from "@/hooks/useErrorRecovery";
import { RacingSpinner } from "@/components/ui/Skeletons";
import { APIError } from "@/components/error/ErrorComponents";
import ErrorBoundary from "@/components/error/ErrorBoundary";

const RaceResults = ({ eventId, sessionType = "race", className = "" }) => {
  const config = useConfig();
  const [selectedSession, setSelectedSession] = useState(sessionType);
  const [sortBy, setSortBy] = useState('position');
  const [sortOrder, setSortOrder] = useState('asc');

  // Mock API call for race results
  const fetchResults = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return generateMockResults(selectedSession);
  };

  const { data: results, loading, error, refetch } = useApiWithRecovery(
    fetchResults,
    [selectedSession],
    { maxRetries: 3 }
  );

  const generateMockResults = (session) => {
    const baseDrivers = [
      { id: 1, name: "Lewis Hamilton", team: "Mercedes", number: "44", country: "GBR" },
      { id: 2, name: "Max Verstappen", team: "Red Bull Racing", number: "1", country: "NLD" },
      { id: 3, name: "Charles Leclerc", team: "Ferrari", number: "16", country: "MON" },
      { id: 4, name: "Lando Norris", team: "McLaren", number: "4", country: "GBR" },
      { id: 5, name: "George Russell", team: "Mercedes", number: "63", country: "GBR" },
      { id: 6, name: "Carlos Sainz", team: "Ferrari", number: "55", country: "ESP" },
      { id: 7, name: "Sergio Perez", team: "Red Bull Racing", number: "11", country: "MEX" },
      { id: 8, name: "Fernando Alonso", team: "Aston Martin", number: "14", country: "ESP" },
      { id: 9, name: "Lance Stroll", team: "Aston Martin", number: "18", country: "CAN" },
      { id: 10, name: "Oscar Piastri", team: "McLaren", number: "81", country: "AUS" }
    ];

    if (session === 'qualifying') {
      return {
        session: "Qualifying",
        results: baseDrivers.map((driver, index) => ({
          ...driver,
          position: index + 1,
          time: `1:${(18 + Math.random() * 5).toFixed(3)}`,
          gap: index === 0 ? "Pole Position" : `+${(Math.random() * 2).toFixed(3)}s`,
          q1Time: `1:${(20 + Math.random() * 3).toFixed(3)}`,
          q2Time: index < 15 ? `1:${(19 + Math.random() * 2).toFixed(3)}` : "---",
          q3Time: index < 10 ? `1:${(18 + Math.random() * 1).toFixed(3)}` : "---",
          status: "Completed"
        }))
      };
    }

    if (session === 'practice') {
      return {
        session: "Practice 1",
        results: baseDrivers.map((driver, index) => ({
          ...driver,
          position: index + 1,
          time: `1:${(19 + Math.random() * 4).toFixed(3)}`,
          gap: index === 0 ? "Fastest" : `+${(Math.random() * 3).toFixed(3)}s`,
          laps: Math.floor(15 + Math.random() * 20),
          status: Math.random() > 0.1 ? "Completed" : "Mechanical"
        }))
      };
    }

    // Race results
    return {
      session: "Race",
      results: baseDrivers.map((driver, index) => ({
        ...driver,
        position: index + 1,
        time: index === 0 ? "1:32:45.123" : `+${(Math.random() * 60).toFixed(3)}s`,
        gap: index === 0 ? "Winner" : `+${(Math.random() * 60).toFixed(3)}s`,
        laps: 58,
        fastestLap: `1:${(20 + Math.random() * 3).toFixed(3)}`,
        points: Math.max(0, 25 - index * 2),
        status: Math.random() > 0.15 ? "Finished" : ["DNF", "DNS", "DSQ"][Math.floor(Math.random() * 3)]
      }))
    };
  };

  const sessions = [
    { id: 'practice', label: 'Practice', icon: '🏃' },
    { id: 'qualifying', label: 'Qualifying', icon: '⏱️' },
    { id: 'race', label: 'Race', icon: '🏁' }
  ];

  const getPositionColor = (position) => {
    switch (position) {
      case 1: return "text-yellow-400 bg-yellow-400/20"; // Gold
      case 2: return "text-gray-300 bg-gray-300/20";     // Silver
      case 3: return "text-orange-400 bg-orange-400/20"; // Bronze
      default: return "text-white bg-gray-700/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Finished":
      case "Completed": 
        return "text-green-400";
      case "DNF":
      case "Mechanical": 
        return "text-red-400";
      case "DNS": 
        return "text-yellow-400";
      case "DSQ": 
        return "text-orange-400";
      default: 
        return "text-gray-400";
    }
  };

  const getFlagEmoji = (country) => {
    const flags = {
      'GBR': '🇬🇧', 'NLD': '🇳🇱', 'MON': '🇲🇨', 'ESP': '🇪🇸',
      'MEX': '🇲🇽', 'CAN': '🇨🇦', 'AUS': '🇦🇺', 'GER': '🇩🇪',
      'FRA': '🇫🇷', 'ITA': '🇮🇹', 'JPN': '🇯🇵', 'USA': '🇺🇸'
    };
    return flags[country] || '🏁';
  };

  const sortResults = (results, sortBy, order) => {
    return [...results].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'position' || sortBy === 'points') {
        aVal = parseInt(aVal);
        bVal = parseInt(bVal);
      }
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedResults = results?.results ? sortResults(results.results, sortBy, sortOrder) : [];

  if (loading) {
    return (
      <div className={`bg-gray-900 rounded-2xl p-8 ${className}`}>
        <div className="text-center">
          <RacingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-400">Loading race results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-900 rounded-2xl p-6 ${className}`}>
        <APIError
          error={error}
          endpoint="/api/results"
          onRetry={refetch}
          className="max-w-2xl mx-auto"
        />
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 border-b border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-3">🏆</span>
            Race Results
          </h2>
          <div className="text-sm text-gray-300">
            {results?.session || "Session"}
          </div>
        </div>

        {/* Session Tabs */}
        <div className="flex space-x-2">
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => setSelectedSession(session.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                selectedSession === session.id
                  ? 'text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              style={{
                backgroundColor: selectedSession === session.id ? (config.primaryColor || '#3b82f6') : undefined
              }}
            >
              <span>{session.icon}</span>
              <span>{session.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        {sortedResults.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">🏁</div>
            <p className="text-gray-400">No results available for this session</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr className="text-xs text-gray-300 uppercase tracking-wider">
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort('position')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Pos</span>
                    {sortBy === 'position' && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left">Driver</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th 
                  className="px-4 py-3 text-right cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort('time')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Time/Gap</span>
                    {sortBy === 'time' && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                {selectedSession === 'race' && (
                  <>
                    <th className="px-4 py-3 text-right">Fastest Lap</th>
                    <th 
                      className="px-4 py-3 text-right cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort('points')}
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>Points</span>
                        {sortBy === 'points' && (
                          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  </>
                )}
                {selectedSession === 'qualifying' && (
                  <>
                    <th className="px-4 py-3 text-right">Q1</th>
                    <th className="px-4 py-3 text-right">Q2</th>
                    <th className="px-4 py-3 text-right">Q3</th>
                  </>
                )}
                {selectedSession === 'practice' && (
                  <th className="px-4 py-3 text-right">Laps</th>
                )}
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((result, index) => (
                <tr 
                  key={result.id}
                  className={`border-b border-gray-700 hover:bg-gray-800 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850'
                  }`}
                >
                  <td className="px-4 py-4">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getPositionColor(result.position)}`}>
                      {result.position}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-mono">
                        {result.number}
                      </span>
                      <div>
                        <div className="text-white font-medium flex items-center space-x-2">
                          <span>{getFlagEmoji(result.country)}</span>
                          <span>{result.name}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-300 text-sm">{result.team}</td>
                  <td className="px-4 py-4 text-right font-mono text-sm text-white">
                    {result.time}
                  </td>
                  {selectedSession === 'race' && (
                    <>
                      <td className="px-4 py-4 text-right font-mono text-xs text-gray-400">
                        {result.fastestLap}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-sm text-white">
                        {result.points}
                      </td>
                    </>
                  )}
                  {selectedSession === 'qualifying' && (
                    <>
                      <td className="px-4 py-4 text-right font-mono text-xs text-gray-400">
                        {result.q1Time}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-xs text-gray-400">
                        {result.q2Time}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-xs text-gray-400">
                        {result.q3Time}
                      </td>
                    </>
                  )}
                  {selectedSession === 'practice' && (
                    <td className="px-4 py-4 text-right text-sm text-gray-300">
                      {result.laps}
                    </td>
                  )}
                  <td className="px-4 py-4 text-center">
                    <span className={`text-xs font-medium ${getStatusColor(result.status)}`}>
                      {result.status}
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
        <span>Click column headers to sort results</span>
        <span>{sortedResults.length} drivers</span>
      </div>
    </div>
  );
};

export default function RaceResultsWithBoundary(props) {
  return (
    <ErrorBoundary context="race-results" level="component">
      <RaceResults {...props} />
    </ErrorBoundary>
  );
}



