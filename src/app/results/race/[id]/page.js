import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

async function getSiteConfig() {
  try {
    const baseUrl = process.env.SITE_DOMAIN || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/config`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch config');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching config:', error);
    return {};
  }
}

export async function generateMetadata({ params }) {
  const config = await getSiteConfig();
  
  return {
    title: `Race Results - ${config.siteTitle || 'RaceReady'}`,
    description: `View detailed race results, lap times, and statistics`,
  };
}

export default async function RaceResultPage({ params }) {
  const config = await getSiteConfig();
  const { id } = params;

  // TODO: Fetch actual race data from API
  const raceData = {
    id: id,
    eventName: 'Wakefield 300',
    round: 'Round 8',
    date: '2024-09-15',
    venue: 'Wakefield Park',
    circuit: {
      length: '2.2 km',
      turns: 11,
      direction: 'Clockwise',
    },
    conditions: {
      weather: 'Sunny',
      trackTemp: '28°C',
      airTemp: '24°C',
    },
  };

  const race1Results = [
    { position: 1, number: 7, driver: 'John Smith', team: 'Team Alpha Racing', laps: 20, time: '24:32.145', fastestLap: '1:05.234', gap: 'Leader', points: 25 },
    { position: 2, number: 12, driver: 'Jane Doe', team: 'Beta Motorsport', laps: 20, time: '24:32.379', fastestLap: '1:05.456', gap: '+0.234', points: 20 },
    { position: 3, number: 5, driver: 'Bob Wilson', team: 'Gamma Racing Team', laps: 20, time: '24:33.168', fastestLap: '1:05.789', gap: '+1.023', points: 16 },
    { position: 4, number: 22, driver: 'Sarah Johnson', team: 'Delta Speed', laps: 20, time: '24:34.501', fastestLap: '1:06.012', gap: '+2.356', points: 13 },
    { position: 5, number: 18, driver: 'Mike Brown', team: 'Epsilon Racing', laps: 20, time: '24:35.234', fastestLap: '1:06.234', gap: '+3.089', points: 11 },
    { position: 6, number: 9, driver: 'Lisa Chen', team: 'Zeta Motorsport', laps: 20, time: '24:36.789', fastestLap: '1:06.456', gap: '+4.644', points: 10 },
    { position: 7, number: 33, driver: 'Tom Anderson', team: 'Eta Racing', laps: 20, time: '24:38.012', fastestLap: '1:06.678', gap: '+5.867', points: 9 },
    { position: 8, number: 15, driver: 'Emma Davis', team: 'Theta Speed', laps: 20, time: '24:39.456', fastestLap: '1:06.890', gap: '+7.311', points: 8 },
    { position: 'DNF', number: 44, driver: 'Chris Lee', team: 'Iota Racing', laps: 12, time: 'DNF', fastestLap: '1:07.123', gap: 'DNF', points: 0 },
  ];

  const race2Results = [
    { position: 1, number: 12, driver: 'Jane Doe', team: 'Beta Motorsport', laps: 20, time: '24:28.901', fastestLap: '1:05.123', gap: 'Leader', points: 25 },
    { position: 2, number: 7, driver: 'John Smith', team: 'Team Alpha Racing', laps: 20, time: '24:29.234', fastestLap: '1:05.345', gap: '+0.333', points: 20 },
    { position: 3, number: 22, driver: 'Sarah Johnson', team: 'Delta Speed', laps: 20, time: '24:30.567', fastestLap: '1:05.678', gap: '+1.666', points: 16 },
    { position: 4, number: 5, driver: 'Bob Wilson', team: 'Gamma Racing Team', laps: 20, time: '24:31.890', fastestLap: '1:05.901', gap: '+2.989', points: 13 },
    { position: 5, number: 18, driver: 'Mike Brown', team: 'Epsilon Racing', laps: 20, time: '24:33.123', fastestLap: '1:06.123', gap: '+4.222', points: 11 },
  ];

  return (
    <>
      <Header />
      
      <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: config.menuBackground || '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm">
            <Link href="/results" className="hover:underline" style={{ color: config.primaryColor || '#3b82f6' }}>
              Results
            </Link>
            <span style={{ color: config.textColor || '#1a1a1a', opacity: 0.5 }}>›</span>
            <span style={{ color: config.textColor || '#1a1a1a' }}>
              {raceData.eventName}
            </span>
          </div>

          {/* Race Header */}
          <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                <div 
                  className="text-sm font-bold uppercase mb-2"
                  style={{ color: config.primaryColor || '#3b82f6' }}
                >
                  {raceData.round}
                </div>
                <h1 
                  className="text-4xl md:text-5xl font-bold mb-2"
                  style={{ color: config.textColor || '#1a1a1a' }}
                >
                  {raceData.eventName}
                </h1>
                <div className="text-lg text-gray-600">
                  📍 {raceData.venue} • {new Date(raceData.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <Link
                href="/events"
                className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
              >
                📅 View Event Details
              </Link>
            </div>

            {/* Event Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t">
              <div>
                <div className="text-sm text-gray-500 mb-1">Circuit Length</div>
                <div className="text-lg font-bold" style={{ color: config.textColor || '#1a1a1a' }}>
                  {raceData.circuit.length}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Turns</div>
                <div className="text-lg font-bold" style={{ color: config.textColor || '#1a1a1a' }}>
                  {raceData.circuit.turns}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Weather</div>
                <div className="text-lg font-bold" style={{ color: config.textColor || '#1a1a1a' }}>
                  ☀️ {raceData.conditions.weather}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Track Temp</div>
                <div className="text-lg font-bold" style={{ color: config.textColor || '#1a1a1a' }}>
                  🌡️ {raceData.conditions.trackTemp}
                </div>
              </div>
            </div>
          </div>

          {/* Race 1 Results */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-3xl font-bold"
                style={{ color: config.textColor || '#1a1a1a' }}
              >
                🏁 Race 1 Results
              </h2>
              <button
                className="px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
              >
                📥 Download PDF
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr 
                      className="text-white text-left text-sm font-bold uppercase"
                      style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                    >
                      <th className="px-6 py-4">Pos</th>
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Driver</th>
                      <th className="px-6 py-4 hidden lg:table-cell">Team</th>
                      <th className="px-6 py-4 text-right hidden md:table-cell">Laps</th>
                      <th className="px-6 py-4 text-right hidden xl:table-cell">Time</th>
                      <th className="px-6 py-4 text-right">Gap</th>
                      <th className="px-6 py-4 text-right hidden sm:table-cell">Fastest Lap</th>
                      <th className="px-6 py-4 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {race1Results.map((result, index) => (
                      <tr 
                        key={index}
                        className="border-b hover:bg-gray-50 transition-colors duration-150"
                        style={{ 
                          backgroundColor: index === 0 ? `${config.primaryColor || '#3b82f6'}10` : 
                                          result.position === 'DNF' ? '#fee' : 'transparent',
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span 
                              className="font-bold text-lg"
                              style={{ color: result.position === 'DNF' ? '#dc2626' : config.textColor || '#1a1a1a' }}
                            >
                              {result.position}
                            </span>
                            {index === 0 && <span className="text-xl">🏆</span>}
                            {index === 1 && <span className="text-xl">🥈</span>}
                            {index === 2 && <span className="text-xl">🥉</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className="font-bold px-3 py-1 rounded-lg text-white text-sm"
                            style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                          >
                            {result.number}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link 
                            href={`/results/driver/${result.driver.toLowerCase().replace(' ', '-')}`}
                            className="font-semibold hover:underline"
                            style={{ color: config.textColor || '#1a1a1a' }}
                          >
                            {result.driver}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm hidden lg:table-cell">
                          {result.team}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-700 hidden md:table-cell">
                          {result.laps}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-sm text-gray-700 hidden xl:table-cell">
                          {result.time}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-700">
                          {result.gap}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-sm hidden sm:table-cell">
                          <span style={{ color: config.primaryColor || '#3b82f6', fontWeight: '600' }}>
                            {result.fastestLap}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span 
                            className="font-bold text-lg"
                            style={{ color: config.primaryColor || '#3b82f6' }}
                          >
                            {result.points}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Race 1 Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-xs text-gray-500 mb-1">Fastest Lap</div>
                <div className="font-bold text-lg" style={{ color: config.primaryColor || '#3b82f6' }}>
                  1:05.234
                </div>
                <div className="text-sm text-gray-600">John Smith</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-xs text-gray-500 mb-1">Pole Position</div>
                <div className="font-bold text-lg" style={{ color: config.primaryColor || '#3b82f6' }}>
                  1:04.987
                </div>
                <div className="text-sm text-gray-600">Jane Doe</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-xs text-gray-500 mb-1">Finishers</div>
                <div className="font-bold text-lg" style={{ color: config.textColor || '#1a1a1a' }}>
                  8 / 9
                </div>
                <div className="text-sm text-gray-600">89% Finish Rate</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-xs text-gray-500 mb-1">Lead Changes</div>
                <div className="font-bold text-lg" style={{ color: config.textColor || '#1a1a1a' }}>
                  3
                </div>
                <div className="text-sm text-gray-600">Between 2 Drivers</div>
              </div>
            </div>
          </div>

          {/* Race 2 Results */}
          <div className="mb-8">
            <h2 
              className="text-3xl font-bold mb-6"
              style={{ color: config.textColor || '#1a1a1a' }}
            >
              🏁 Race 2 Results
            </h2>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr 
                      className="text-white text-left text-sm font-bold uppercase"
                      style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                    >
                      <th className="px-6 py-4">Pos</th>
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Driver</th>
                      <th className="px-6 py-4 hidden lg:table-cell">Team</th>
                      <th className="px-6 py-4 text-right hidden md:table-cell">Laps</th>
                      <th className="px-6 py-4 text-right hidden xl:table-cell">Time</th>
                      <th className="px-6 py-4 text-right">Gap</th>
                      <th className="px-6 py-4 text-right hidden sm:table-cell">Fastest Lap</th>
                      <th className="px-6 py-4 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {race2Results.map((result, index) => (
                      <tr 
                        key={index}
                        className="border-b hover:bg-gray-50 transition-colors duration-150"
                        style={{ 
                          backgroundColor: index === 0 ? `${config.primaryColor || '#3b82f6'}10` : 'transparent',
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span 
                              className="font-bold text-lg"
                              style={{ color: config.textColor || '#1a1a1a' }}
                            >
                              {result.position}
                            </span>
                            {index === 0 && <span className="text-xl">🏆</span>}
                            {index === 1 && <span className="text-xl">🥈</span>}
                            {index === 2 && <span className="text-xl">🥉</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className="font-bold px-3 py-1 rounded-lg text-white text-sm"
                            style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                          >
                            {result.number}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link 
                            href={`/results/driver/${result.driver.toLowerCase().replace(' ', '-')}`}
                            className="font-semibold hover:underline"
                            style={{ color: config.textColor || '#1a1a1a' }}
                          >
                            {result.driver}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm hidden lg:table-cell">
                          {result.team}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-700 hidden md:table-cell">
                          {result.laps}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-sm text-gray-700 hidden xl:table-cell">
                          {result.time}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-700">
                          {result.gap}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-sm hidden sm:table-cell">
                          <span style={{ color: config.primaryColor || '#3b82f6', fontWeight: '600' }}>
                            {result.fastestLap}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span 
                            className="font-bold text-lg"
                            style={{ color: config.primaryColor || '#3b82f6' }}
                          >
                            {result.points}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <Link
              href="/results"
              className="px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-200 hover:shadow-lg"
              style={{
                borderColor: config.primaryColor || '#3b82f6',
                color: config.primaryColor || '#3b82f6',
              }}
            >
              ← Back to All Results
            </Link>
            <Link
              href="/events"
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
            >
              View Upcoming Events →
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

