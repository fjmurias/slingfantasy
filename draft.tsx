import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, CheckCircle, Clock, Star, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface PlayerPick {
  playerName: string;
  sportCategory: string;
  teamOrAthlete: string;
  isWildCard: boolean;
  isCompleted?: boolean;
  sportEvent?: string;
}

interface DraftData {
  draftByPlayer: { [playerName: string]: PlayerPick[] };
  scheduleData: any[];
  completedSports: string[];
  totalPlayers: number;
}

export default function Draft() {
  const { user } = useAuth();

  const { data: draftData, isLoading } = useQuery<DraftData>({
    queryKey: ['/api/draft/complete'],
  });

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'cool':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-200';  
      case 'wild card':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCompletionStatus = (isCompleted: boolean) => {
    return isCompleted ? {
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      className: 'bg-green-50 border-green-200',
      textClass: 'text-green-900'
    } : {
      icon: <Clock className="w-4 h-4 text-orange-600" />,
      className: 'bg-orange-50 border-orange-200', 
      textClass: 'text-orange-900'
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading draft data...</div>
          </div>
        </main>
      </div>
    );
  }

  const players = Object.keys(draftData?.draftByPlayer || {});
  const totalPicks = Object.values(draftData?.draftByPlayer || {}).reduce((total, picks) => total + picks.length, 0);
  const completedPicks = Object.values(draftData?.draftByPlayer || {})
    .flat()
    .filter(pick => pick.isCompleted).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Draft Board</h2>
          <p className="text-lg text-gray-600">Ryan's Sports Challenge 2026 • Complete Draft Overview</p>
        </div>

        {/* Draft Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{players.length}</p>
                  <p className="text-sm text-gray-600">Total Players</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{totalPicks}</p>
                  <p className="text-sm text-gray-600">Total Picks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{completedPicks}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {totalPicks > 0 ? Math.round((completedPicks / totalPicks) * 100) : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Players Draft Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {players.map((playerName) => {
            const picks = draftData?.draftByPlayer[playerName] || [];
            const playerCompleted = picks.filter(pick => pick.isCompleted).length;
            const playerTotal = picks.length;
            
            return (
              <Card key={playerName} className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      <span>{playerName}</span>
                    </span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {playerCompleted}/{playerTotal}
                      </Badge>
                      <div className="text-sm text-gray-600">
                        {playerTotal > 0 ? Math.round((playerCompleted / playerTotal) * 100) : 0}%
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {picks.map((pick, index) => {
                      const status = getCompletionStatus(pick.isCompleted || false);
                      
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${status.className} transition-all`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {status.icon}
                              <span className={`font-medium text-sm ${status.textClass}`}>
                                {pick.teamOrAthlete}
                              </span>
                            </div>
                            <Badge className={getCategoryColor(pick.sportCategory)} variant="outline">
                              {pick.sportCategory}
                            </Badge>
                          </div>
                          
                          {pick.isWildCard && (
                            <div className="flex items-center mt-2">
                              <Star className="w-3 h-3 text-purple-600 mr-1" />
                              <span className="text-xs text-purple-700 font-medium">Wild Card</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {picks.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No picks recorded
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Category Legend */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Draft Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    Cool Sports
                  </h4>
                  <p className="text-sm text-blue-700">Premium leagues and major events</p>
                  <p className="text-xs text-blue-600 mt-1">NFL, NCAAF, NCAAB, Golf majors</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Neutral Sports
                  </h4>
                  <p className="text-sm text-gray-700">Balanced scoring opportunities</p>
                  <p className="text-xs text-gray-600 mt-1">NBA, NHL, Tennis, Lacrosse</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Wild Card Sports
                  </h4>
                  <p className="text-sm text-purple-700">Strategic bonus picks</p>
                  <p className="text-xs text-purple-600 mt-1">FIFA, MLB, F1, Special events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Completion Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Event Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-bold text-green-900 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed Sports ({draftData?.completedSports.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {draftData?.completedSports.map((sport, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-bold text-orange-900 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Progress Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Events:</span>
                      <span className="font-medium">{draftData?.scheduleData.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completed:</span>
                      <span className="font-medium">{draftData?.completedSports.length || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${((draftData?.completedSports.length || 0) / (draftData?.scheduleData.length || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}