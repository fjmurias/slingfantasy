import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Standings() {
  const { user } = useAuth();

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['/api/leaderboard/real'],
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getPlayerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPlayerColor = (index: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-gray-500',
      'bg-teal-500', 'bg-orange-500', 'bg-cyan-500', 'bg-lime-500',
      'bg-violet-500', 'bg-rose-500', 'bg-emerald-500', 'bg-sky-500'
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">League Standings</h2>
          <p className="text-lg text-gray-600">Ryan's Sports Challenge 2026 • {leaderboard.length} Players</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Full Leaderboard */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Rank</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Player</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Points</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Events</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Avg</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-500">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {leaderboard.map((player: any, index: number) => (
                        <tr 
                          key={player.playerName}
                          className={`${player.rank <= 3 ? 'bg-amber-50' : 'bg-white'} ${player.playerName === 'Fern' ? 'ring-2 ring-blue-200 bg-blue-50' : ''}`}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              {getRankIcon(player.rank)}
                              <span className="font-medium text-gray-900">{player.rank}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 ${getPlayerColor(index)} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                                {getPlayerInitials(player.playerName)}
                              </div>
                              <div>
                                <span className={`font-medium ${player.playerName === 'Fern' ? 'text-blue-900' : 'text-gray-900'}`}>
                                  {player.playerName}
                                </span>
                                {player.playerName === 'Fern' && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className={`font-bold ${player.playerName === 'Fern' ? 'text-blue-900' : 'text-gray-900'}`}>
                              {player.totalPoints.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right text-gray-600">
                            {player.completedEvents}
                          </td>
                          <td className="py-4 px-4 text-right text-gray-600">
                            {(player.totalPoints / Math.max(player.completedEvents, 1)).toFixed(1)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            {player.totalPoints > 150 ? (
                              <TrendingUp className="w-4 h-4 text-green-500 mx-auto" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Podium</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {leaderboard.slice(0, 3).map((player: any, index: number) => (
                  <div key={player.playerName} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(player.rank)}
                      <span className="font-bold text-lg">{player.rank}</span>
                    </div>
                    <div className={`w-10 h-10 ${getPlayerColor(index)} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                      {getPlayerInitials(player.playerName)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{player.playerName}</p>
                      <p className="text-sm text-gray-600">{player.totalPoints.toFixed(1)} pts</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>League Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Players</span>
                  <span className="font-medium">{leaderboard.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Points</span>
                  <span className="font-medium">
                    {leaderboard.length > 0 
                      ? (leaderboard.reduce((sum: number, p: any) => sum + (p.totalPoints || 0), 0) / leaderboard.length).toFixed(1)
                      : '0'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Highest Score</span>
                  <span className="font-medium">
                    {leaderboard.length > 0 ? leaderboard[0]?.totalPoints || '0' : '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Point Spread</span>
                  <span className="font-medium">
                    {leaderboard.length > 1 
                      ? (leaderboard[0]?.totalPoints - leaderboard[leaderboard.length - 1]?.totalPoints || 0)
                      : '0'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <p>Top 3 players are separated by less than 26 points</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>Average events played: {
                    leaderboard.length > 0 
                      ? (leaderboard.reduce((sum: number, p: any) => sum + p.eventsPlayed, 0) / leaderboard.length).toFixed(1)
                      : '0'
                  }</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p>Most consistent performer has highest average per event</p>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Leading Player</span>
                  <span className="font-medium">
                    {leaderboard.length > 0 ? leaderboard[0]?.playerName : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Top Score</span>
                  <span className="font-medium">
                    {leaderboard.length > 0 ? `${leaderboard[0]?.totalPoints?.toFixed(1)} pts` : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Fern's Position Highlight */}
            {leaderboard.find((p: any) => p.playerName === 'Fern') && (
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Your Position</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const fernPlayer = leaderboard.find((p: any) => p.playerName === 'Fern');
                    if (!fernPlayer) return null;
                    return (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Rank</span>
                          <span className="font-bold text-blue-600">#{fernPlayer.rank}/16</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Points</span>
                          <span className="font-bold text-blue-600">{fernPlayer.totalPoints.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Points Behind Leader</span>
                          <span className="font-medium text-gray-900">
                            -{(leaderboard[0]?.totalPoints - fernPlayer.totalPoints).toFixed(1)}
                          </span>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg mt-3">
                          <p className="text-sm text-blue-800">
                            You've completed {fernPlayer.completedEvents} events with an average of{' '}
                            {(fernPlayer.totalPoints / Math.max(fernPlayer.completedEvents, 1)).toFixed(1)} points per event.
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
