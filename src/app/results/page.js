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

export async function generateMetadata() {
  const config = await getSiteConfig();
  
  return {
    title: `Results & Standings - ${config.siteTitle || 'RaceReady'}`,
    description: `View championship standings, race results, and driver statistics for ${config.siteTitle || 'RaceReady'}`,
  };
}

export default async function ResultsPage() {
  const config = await getSiteConfig();

  // TODO: Replace with actual data from API/Strapi
  const championshipStandings = [
    { position: 1, driver: 'John Smith', team: 'Team Alpha Racing', points: 245, wins: 5, podiums: 8, polePositions: 6 },
    { position: 2, driver: 'Jane Doe', team: 'Beta Motorsport', points: 228, wins: 4, podiums: 9, polePositions: 4 },
    { position: 3, driver: 'Bob Wilson', team: 'Gamma Racing Team', points: 201, wins: 3, podiums: 7, polePositions: 3 },
    { position: 4, driver: 'Sarah Johnson', team: 'Delta Speed', points: 189, wins: 2, podiums: 6, polePositions: 2 },
    { position: 5, driver: 'Mike Brown', team: 'Epsilon Racing', points: 176, wins: 2, podiums: 5, polePositions: 3 },
    { position: 6, driver: 'Lisa Chen', team: 'Zeta Motorsport', points: 154, wins: 1, podiums: 4, polePositions: 1 },
    { position: 7, driver: 'Tom Anderson', team: 'Eta Racing', points: 142, wins: 1, podiums: 3, polePositions: 2 },
    { position: 8, driver: 'Emma Davis', team: 'Theta Speed', points: 128, wins: 0, podiums: 3, polePositions: 1 },
  ];

  const recentRaces = [
    {
      id: 1,
      eventName: 'Wakefield 300',
      round: 'Round 8',
      date: '2024-09-15',
      venue: 'Wakefield Park',
      winner: 'John Smith',
      fastestLap: 'Jane Doe - 1:05.234',
    },
    {
      id: 2,
      eventName: 'Sydney SuperSprint',
      round: 'Round 7',
      date: '2024-08-20',
      venue: 'Sydney Motorsport Park',
      winner: 'Jane Doe',
      fastestLap: 'John Smith - 1:28.456',
    },
    {
      id: 3,
      eventName: 'Bathurst Challenge',
      round: 'Round 6',
      date: '2024-07-18',
      venue: 'Mount Panorama',
      winner: 'Bob Wilson',
      fastestLap: 'Sarah Johnson - 2:04.789',
    },
  ];

  const teamStandings = [
    { position: 1, team: 'Team Alpha Racing', points: 387, wins: 7 },
    { position: 2, team: 'Beta Motorsport', points: 356, wins: 6 },
    { position: 3, team: 'Gamma Racing Team', points: 312, wins: 4 },
    { position: 4, team: 'Delta Speed', points: 298, wins: 3 },
    { position: 5, team: 'Epsilon Racing', points: 267, wins: 2 },
  ];

  return (
    <>
      <Header />
      
      <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: config.menuBackground || '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="mb-12">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: config.textColor || '#1a1a1a' }}
            >
              🏆 Results & Standings
            </h1>
            <p 
              className="text-lg md:text-xl"
              style={{ color: config.textColor || '#1a1a1a', opacity: 0.8 }}
            >
              2024 Championship Season
            </p>
          </div>

          {/* Season Selector */}
          <div className="mb-8 flex gap-3 flex-wrap">
            <select 
              className="px-4 py-2 rounded-lg border-2 font-semibold transition-colors duration-200"
              style={{
                borderColor: config.primaryColor || '#3b82f6',
                color: config.textColor || '#1a1a1a',
              }}
            >
              <option>2024 Season</option>
              <option>2023 Season</option>
              <option>2022 Season</option>
            </select>

            <select 
              className="px-4 py-2 rounded-lg border-2 font-semibold transition-colors duration-200"
              style={{
                borderColor: config.primaryColor || '#3b82f6',
                color: config.textColor || '#1a1a1a',
              }}
            >
              <option>All Classes</option>
              <option>Pro Class</option>
              <option>Am Class</option>
              <option>Junior Class</option>
            </select>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div 
              className="bg-white rounded-2xl p-6 shadow-lg"
              style={{
                borderLeft: `4px solid ${config.primaryColor || '#3b82f6'}`,
              }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: config.primaryColor || '#3b82f6' }}>
                8
              </div>
              <div className="text-sm font-semibold" style={{ color: config.textColor || '#1a1a1a', opacity: 0.7 }}>
                Rounds Complete
              </div>
            </div>

            <div 
              className="bg-white rounded-2xl p-6 shadow-lg"
              style={{
                borderLeft: `4px solid ${config.primaryColor || '#3b82f6'}`,
              }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: config.primaryColor || '#3b82f6' }}>
                42
              </div>
              <div className="text-sm font-semibold" style={{ color: config.textColor || '#1a1a1a', opacity: 0.7 }}>
                Total Competitors
              </div>
            </div>

            <div 
              className="bg-white rounded-2xl p-6 shadow-lg"
              style={{
                borderLeft: `4px solid ${config.primaryColor || '#3b82f6'}`,
              }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: config.primaryColor || '#3b82f6' }}>
                4
              </div>
              <div className="text-sm font-semibold" style={{ color: config.textColor || '#1a1a1a', opacity: 0.7 }}>
                Rounds Remaining
              </div>
            </div>

            <div 
              className="bg-white rounded-2xl p-6 shadow-lg"
              style={{
                borderLeft: `4px solid ${config.primaryColor || '#3b82f6'}`,
              }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: config.primaryColor || '#3b82f6' }}>
                17
              </div>
              <div className="text-sm font-semibold" style={{ color: config.textColor || '#1a1a1a', opacity: 0.7 }}>
                Points Gap
              </div>
            </div>
          </div>

          {/* Championship Standings */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-3xl font-bold"
                style={{ color: config.textColor || '#1a1a1a' }}
              >
                Driver Championship
              </h2>
              <button
                className="px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
              >
                📊 View Full Stats
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
                      <th className="px-6 py-4">Driver</th>
                      <th className="px-6 py-4 hidden md:table-cell">Team</th>
                      <th className="px-6 py-4 text-right">Points</th>
                      <th className="px-6 py-4 text-right hidden sm:table-cell">Wins</th>
                      <th className="px-6 py-4 text-right hidden lg:table-cell">Podiums</th>
                      <th className="px-6 py-4 text-right hidden xl:table-cell">Poles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {championshipStandings.map((driver, index) => (
                      <tr 
                        key={driver.position}
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
                              {driver.position}
                            </span>
                            {index === 0 && <span className="text-xl">🏆</span>}
                            {index === 1 && <span className="text-xl">🥈</span>}
                            {index === 2 && <span className="text-xl">🥉</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link 
                            href={`/results/driver/${driver.driver.toLowerCase().replace(' ', '-')}`}
                            className="font-semibold hover:underline"
                            style={{ color: config.textColor || '#1a1a1a' }}
                          >
                            {driver.driver}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                          {driver.team}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span 
                            className="font-bold text-lg"
                            style={{ color: config.primaryColor || '#3b82f6' }}
                          >
                            {driver.points}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-700 hidden sm:table-cell">
                          {driver.wins}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-700 hidden lg:table-cell">
                          {driver.podiums}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-700 hidden xl:table-cell">
                          {driver.polePositions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Two Column Layout: Recent Races + Team Standings */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            
            {/* Recent Races */}
            <div>
              <h2 
                className="text-3xl font-bold mb-6"
                style={{ color: config.textColor || '#1a1a1a' }}
              >
                Recent Races
              </h2>

              <div className="space-y-4">
                {recentRaces.map((race) => (
                  <Link
                    key={race.id}
                    href={`/results/race/${race.id}`}
                    className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div 
                          className="text-xs font-bold uppercase mb-1"
                          style={{ color: config.primaryColor || '#3b82f6' }}
                        >
                          {race.round}
                        </div>
                        <h3 
                          className="text-xl font-bold"
                          style={{ color: config.textColor || '#1a1a1a' }}
                        >
                          {race.eventName}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {new Date(race.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      📍 {race.venue}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Winner</div>
                        <div className="font-semibold" style={{ color: config.textColor || '#1a1a1a' }}>
                          🏁 {race.winner}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Fastest Lap</div>
                        <div className="font-mono text-sm font-semibold" style={{ color: config.primaryColor || '#3b82f6' }}>
                          ⚡ {race.fastestLap}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                href="/results/races"
                className="mt-6 block text-center py-3 px-6 rounded-lg font-semibold border-2 transition-all duration-200 hover:shadow-lg"
                style={{
                  borderColor: config.primaryColor || '#3b82f6',
                  color: config.primaryColor || '#3b82f6',
                }}
              >
                View All Race Results →
              </Link>
            </div>

            {/* Team Standings */}
            <div>
              <h2 
                className="text-3xl font-bold mb-6"
                style={{ color: config.textColor || '#1a1a1a' }}
              >
                Team Championship
              </h2>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr 
                      className="text-white text-left text-sm font-bold uppercase"
                      style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                    >
                      <th className="px-6 py-4">Pos</th>
                      <th className="px-6 py-4">Team</th>
                      <th className="px-6 py-4 text-right">Points</th>
                      <th className="px-6 py-4 text-right">Wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamStandings.map((team, index) => (
                      <tr 
                        key={team.position}
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
                              {team.position}
                            </span>
                            {index === 0 && <span className="text-xl">🏆</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link 
                            href={`/results/team/${team.team.toLowerCase().replace(/\s+/g, '-')}`}
                            className="font-semibold hover:underline"
                            style={{ color: config.textColor || '#1a1a1a' }}
                          >
                            {team.team}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span 
                            className="font-bold text-lg"
                            style={{ color: config.primaryColor || '#3b82f6' }}
                          >
                            {team.points}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-700">
                          {team.wins}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Championship Progress */}
              <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
                <h3 
                  className="text-xl font-bold mb-4"
                  style={{ color: config.textColor || '#1a1a1a' }}
                >
                  Championship Progress
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: config.textColor || '#1a1a1a' }}>Season Complete</span>
                      <span className="font-semibold" style={{ color: config.primaryColor || '#3b82f6' }}>67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: '67%',
                          backgroundColor: config.primaryColor || '#3b82f6',
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Next Round</div>
                      <div className="font-semibold" style={{ color: config.textColor || '#1a1a1a' }}>
                        Round 9
                      </div>
                      <div className="text-sm text-gray-600">Oct 20, 2024</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Location</div>
                      <div className="font-semibold" style={{ color: config.textColor || '#1a1a1a' }}>
                        Phillip Island
                      </div>
                      <div className="text-sm text-gray-600">Victoria</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div 
            className="rounded-2xl p-8 text-center"
            style={{
              background: `linear-gradient(135deg, ${config.primaryColor || '#3b82f6'}15 0%, ${config.primaryColor || '#3b82f6'}05 100%)`,
            }}
          >
            <h3 
              className="text-2xl font-bold mb-3"
              style={{ color: config.textColor || '#1a1a1a' }}
            >
              Want to see your name here?
            </h3>
            <p 
              className="text-lg mb-6"
              style={{ color: config.textColor || '#1a1a1a', opacity: 0.8 }}
            >
              Join the championship and compete with the best drivers
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/events"
                className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-xl"
                style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
              >
                View Upcoming Events
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 rounded-lg font-semibold border-2 transition-all duration-200 hover:shadow-xl"
                style={{
                  borderColor: config.primaryColor || '#3b82f6',
                  color: config.primaryColor || '#3b82f6',
                }}
              >
                Contact Us
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

