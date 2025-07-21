import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Users, TrendingUp, Star, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";

interface EnhancedDraftPick {
  playerName: string;
  teamOrAthlete: string;
  sportCategory: string;
  isCompleted: boolean;
  league: string;
  sport: string;
  maxPoints: number;
  leagueCompleted: boolean;
  leagueTotalPoints: number;
}

interface UserStats {
  currentPoints: number;
  maxPossiblePoints: number;
  completedPicks: number;
  totalPicks: number;
  completionPercentage: number;
  leagueBreakdown: Record<string, {
    current: number;
    possible: number;
    completed: boolean;
    picks: string[];
  }>;
}

interface League {
  name: string;
  sport: string;
  totalPoints: number;
  isCompleted: boolean;
  endDate: string;
}

interface EnhancedDraftData {
  draftByPlayer: Record<string, EnhancedDraftPick[]>;
  userStats: Record<string, UserStats>;
  leagues: League[];
}

export default function EnhancedDraft() {
  const { data, isLoading, error } = useQuery<EnhancedDraftData>({
    queryKey: ['/api/draft/complete'],
    staleTime: 0, // Force fresh data
    refetchOnMount: true,
  });

  // Debug logging
  if (data) {
    console.log('Draft data received:', data);
    const firstPlayer = Object.keys(data.draftByPlayer)[0];
    if (firstPlayer && data.userStats) {
      console.log(`Stats for ${firstPlayer}:`, data.userStats[firstPlayer]);
      console.log(`Current points for ${firstPlayer}:`, data.userStats[firstPlayer]?.currentPoints);
    }
  }
  
  const [expandedPlayers, setExpandedPlayers] = useState<Set<string>>(new Set());
  
  const togglePlayerExpansion = (playerName: string) => {
    const newExpanded = new Set(expandedPlayers);
    if (newExpanded.has(playerName)) {
      newExpanded.delete(playerName);
    } else {
      newExpanded.add(playerName);
    }
    setExpandedPlayers(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error loading draft data. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { draftByPlayer, userStats, leagues } = data;

  // Calculate overview stats
  const totalPlayers = Object.keys(draftByPlayer).length;
  const totalPicks = Object.values(draftByPlayer).reduce((acc, picks) => acc + picks.length, 0);
  const completedPicks = Object.values(draftByPlayer)
    .flat()
    .filter(pick => pick.isCompleted).length;
  const completionPercentage = Math.round((completedPicks / totalPicks) * 100);

  // Get top 3 players by max possible points
  const topPlayers = Object.entries(userStats)
    .sort(([,a], [,b]) => b.maxPossiblePoints - a.maxPossiblePoints)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-amber-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Draft Board</h1>
            <p className="text-gray-600">Ryan's Sports Challenge 2026 • Complete Draft Overview</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{totalPlayers}</div>
                  <div className="text-sm text-gray-600">Total Players</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{totalPicks}</div>
                  <div className="text-sm text-gray-600">Total Picks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{completedPicks}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-amber-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{completionPercentage}%</div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Draft Cards - 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(draftByPlayer).map(([playerName, picks]) => {
            const stats = userStats[playerName];
            const completedCount = picks.filter(p => p.isCompleted).length;
            const completionRate = Math.round((completedCount / picks.length) * 100);
            const isExpanded = expandedPlayers.has(playerName);
            const visiblePicks = isExpanded ? picks : picks.slice(0, 4);

            return (
              <Card key={playerName} className="relative">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <span className="text-lg font-bold">{playerName}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {stats?.currentPoints || 0}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">current pts</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {completedCount}/{picks.length} ({completionRate}%)
                      </div>
                    </div>
                  </CardTitle>
                  <div className="text-sm text-gray-600 mt-1">
                    Max Potential: <span className="font-semibold text-gray-900">{stats?.maxPossiblePoints || 0} points</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Show picks (first 4 or all if expanded) */}
                  {visiblePicks.map((pick, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        pick.isCompleted 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-orange-50 border-orange-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {pick.isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-orange-400" />
                          )}
                          <span className="font-medium text-sm">{pick.teamOrAthlete}</span>
                        </div>
                        <Badge
                          variant={pick.sportCategory === 'Cool' ? 'default' : 
                                 pick.sportCategory === 'Neutral' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {pick.sportCategory}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="font-medium">{pick.league || 'Unknown'}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{pick.maxPoints || 0} pts</span>
                          {pick.isCompleted && (
                            <span className="text-green-600">✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {picks.length > 4 && (
                    <button
                      onClick={() => togglePlayerExpansion(playerName)}
                      className="w-full flex items-center justify-center gap-2 pt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <span>Show Less</span>
                          <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span>+{picks.length - 4} more picks</span>
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}