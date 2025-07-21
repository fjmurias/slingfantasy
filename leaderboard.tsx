import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface LeaderboardPlayer {
  playerName: string;
  totalPoints: number;
  completedEvents: number;
  pointsBreakdown: { [event: string]: number };
  rank: number;
}

export default function Leaderboard() {
  const [, setLocation] = useLocation();

  const { data: leaderboard = [], isLoading } = useQuery<LeaderboardPlayer[]>({
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

  const getPlayerInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", 
      "bg-indigo-500", "bg-red-500", "bg-yellow-500", "bg-teal-500",
      "bg-orange-500", "bg-cyan-500", "bg-lime-500", "bg-rose-500",
      "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-sky-500"
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <Card className="border border-gray-100">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Current Standings</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Loading leaderboard...</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show top 5 players, but highlight Fern if they're not in top 5
  const topPlayers = leaderboard.slice(0, 5);
  const fernPlayer = leaderboard.find(p => p.playerName === 'Fern');
  const showFernSeparately = fernPlayer && fernPlayer.rank > 5;

  return (
    <Card className="border border-gray-100">
      <CardHeader className="border-b border-gray-100">
        <CardTitle>Current Standings</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Ryan's Sports Challenge 2026 • {leaderboard.length} Players</p>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {topPlayers.map((player, index) => (
          <div 
            key={player.playerName} 
            className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
              player.playerName === 'Fern' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {getRankIcon(player.rank)}
              </div>
              <div className={`w-10 h-10 ${getAvatarColor(index)} rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">{getPlayerInitial(player.playerName)}</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-bold ${player.playerName === 'Fern' ? 'text-blue-900' : 'text-gray-900'}`}>
                    #{player.rank} {player.playerName}
                    {player.playerName === 'Fern' && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {player.completedEvents} events • {(player.totalPoints / Math.max(player.completedEvents, 1)).toFixed(1)} avg
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${player.playerName === 'Fern' ? 'text-blue-900' : 'text-gray-900'}`}>
                    {player.totalPoints.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {showFernSeparately && fernPlayer && (
          <>
            <div className="border-t pt-3 mt-4">
              <p className="text-xs text-gray-500 mb-3">Your Position:</p>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{getPlayerInitial(fernPlayer.playerName)}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-blue-900">
                        #{fernPlayer.rank} {fernPlayer.playerName}
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                      </h4>
                      <p className="text-sm text-gray-600">
                        {fernPlayer.completedEvents} events • {(fernPlayer.totalPoints / Math.max(fernPlayer.completedEvents, 1)).toFixed(1)} avg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-900">
                        {fernPlayer.totalPoints.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <Button 
          variant="ghost" 
          className="text-blue-600 hover:text-blue-800"
          onClick={() => setLocation('/standings')}
        >
          View Full Standings 
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
}