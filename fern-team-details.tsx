import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, Users, Trophy } from "lucide-react";

interface PlayerData {
  points?: { [event: string]: number };
  pointsBreakdown?: { [event: string]: number };
  picks?: Array<{
    playerName: string;
    sportCategory: string;
    teamOrAthlete: string;
    isWildCard: boolean;
  }>;
  totalPoints: number;
  completedEvents: number;
  totalPicks?: number;
  playerRank?: number;
}

interface PlayerTeamDetailsProps {
  playerName: string;
  playerData?: PlayerData;
}

export default function FernTeamDetails({ playerName, playerData }: PlayerTeamDetailsProps) {
  const { data: dynamicPlayerData, isLoading } = useQuery<PlayerData>({
    queryKey: ['/api/player', playerName, 'data'],
    enabled: !!playerName,
  });
  
  // Use passed data or fallback to fetched data
  const fernData = playerData || dynamicPlayerData;

  if (isLoading || !fernData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!fernData) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cool':
        return 'bg-blue-100 text-blue-800';
      case 'Neutral':
        return 'bg-gray-100 text-gray-800';
      case 'Wild Card':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completedEventsData = Object.entries(fernData.pointsBreakdown || fernData.points || {}).filter(([event, points]) => 
    event && event.trim() !== '' && (points as number) > 0
  );

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>{playerName}'s Team Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{fernData.totalPoints.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">#{fernData.playerRank}</div>
              <div className="text-sm text-gray-600">Current Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{fernData.completedEvents}</div>
              <div className="text-sm text-gray-600">Events Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{fernData.totalPicks}</div>
              <div className="text-sm text-gray-600">Total Picks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Completed Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedEventsData.map(([event, points]) => (
              <div key={event} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{event}</h4>
                  <p className="text-sm text-gray-600">Event completed</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{(points as number).toFixed(1)}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Draft Picks by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span>Draft Picks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Cool', 'Neutral', 'Wild Card'].map(category => {
              const categoryPicks = fernData.picks?.filter(pick => pick.sportCategory === category) || [];
              if (categoryPicks.length === 0) return null;
              
              return (
                <div key={category}>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                    <span>{category} Sports</span>
                    <Badge variant="outline" className={getCategoryColor(category)}>
                      {categoryPicks.length}
                    </Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {categoryPicks.map((pick, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm text-gray-900">{pick.teamOrAthlete}</div>
                        <div className="text-xs text-gray-600">
                          {pick.sportCategory} • Pick #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Wild Card Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span>Wild Card Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Wild Cards Used</h4>
              <p className="text-sm text-gray-600">Strategic picks for maximum points</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">3/4</div>
              <div className="text-xs text-gray-500">75% utilized</div>
            </div>
          </div>
          <div className="mt-4 bg-purple-50 rounded-lg p-3">
            <div className="text-sm text-purple-800">
              <strong>Strategy tip:</strong> You have 1 wild card remaining. Save it for a high-value event later in the season!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}