// import { useAuth } from "@/hooks/useAuth"; // Removed for public demo
import Navbar from "@/components/navbar";
import Leaderboard from "@/components/leaderboard";
import UpcomingEvents from "@/components/upcoming-events";
import FernTeamDetails from "@/components/fern-team-details";
import SportCategories from "@/components/sport-categories";
import WildCardUsage from "@/components/wild-card-usage";
import RecentActivity from "@/components/recent-activity";
import { DraftMatrix } from "@/components/draft-matrix";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Calendar, CheckCircle, Star, Download, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";

interface Event {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  maxPoints: string;
  sportName?: string;
  sportCategory?: string;
  sportIcon?: string;
}

export default function Home() {
  // const { user } = useAuth(); // Removed for public demo
  const [, setLocation] = useLocation();
  const [selectedPlayer, setSelectedPlayer] = useState("Fern");

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const { data: upcomingEventsData = [] } = useQuery<Event[]>({
    queryKey: ['/api/events/upcoming'],
  });

  // Use existing working leaderboard endpoint to get players and data
  const { data: leaderboardData = [] } = useQuery({
    queryKey: ['/api/leaderboard/real'],
  });

  // Fetch complete draft data to get player picks
  const { data: draftData } = useQuery({
    queryKey: ['/api/draft/complete'],
  });

  // Fetch player-specific stats
  const { data: playerStats } = useQuery({
    queryKey: ['/api/player', selectedPlayer, 'stats'],
  });

  const allPlayers = leaderboardData.map((player: any) => player.playerName).sort();
  const playerData = leaderboardData.find((player: any) => player.playerName === selectedPlayer);
  const playerPicks = draftData?.draftByPlayer?.[selectedPlayer] || [];

  // Use stats from new endpoint
  const totalPoints = playerStats?.totalPoints || 0;
  const possiblePoints = playerStats?.possiblePoints || 0;
  const completedEvents = playerStats?.completedEvents || 0;
  const upcomingEvents = playerStats?.upcomingEvents || 0;
  
  // Wild card tracking (TODO: make dynamic)
  const wildCardsUsed = 3;
  const totalWildCards = 4;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Ryan's Sports Challenge 2026</h2>
              <p className="text-lg text-gray-600">Multi-Sport Fantasy League • 16 Players • 18 Sports</p>
            </div>
            
            {/* Player Selector */}
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select a player" />
                </SelectTrigger>
                <SelectContent>
                  {allPlayers.map((player) => (
                    <SelectItem key={player} value={player}>
                      {player}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Top row on mobile: Total Points and Possible Points */}
          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPoints.toLocaleString()}</p>
                </div>
                <Trophy className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Possible Points</p>
                  <p className="text-2xl font-bold text-gray-900">{possiblePoints.toLocaleString()}</p>
                </div>
                <Star className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          {/* Second row on mobile: Completed Events and Upcoming Events */}
          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Events</p>
                  <p className="text-2xl font-bold text-gray-900">{completedEvents}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingEvents}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Draft Matrix - Full Width */}
        <div className="mb-8">
          <DraftMatrix selectedPlayer={selectedPlayer} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Current Leaderboard */}
          <div className="lg:col-span-2">
            <Leaderboard />
          </div>

          {/* Upcoming Events */}
          <div>
            <UpcomingEvents events={Array.isArray(upcomingEventsData) ? upcomingEventsData : []} />
          </div>
        </div>

        {/* Player's Team Performance Details */}
        <div className="mb-8">
          <FernTeamDetails 
            playerName={selectedPlayer} 
            playerData={playerData ? {
              points: playerData.pointsBreakdown,
              picks: playerPicks,
              totalPoints: playerData.totalPoints,
              completedEvents: playerData.completedEvents,
              totalPicks: playerPicks?.length || 0,
              playerRank: playerData.rank
            } : undefined}
          />
        </div>

        {/* Sport Categories */}
        <div className="mt-8">
          <SportCategories />
        </div>

        {/* Wild Card Usage and Recent Activity */}
        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          <WildCardUsage 
            used={wildCardsUsed} 
            total={totalWildCards} 
          />
          <RecentActivity />
        </div>

        {/* Draft Preview Section */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-3xl font-bold mb-4">Multi-Sport Draft Experience</h3>
              <p className="text-xl text-blue-100 mb-6">Draft across 18+ sports with strategic wild card picks and real-time scoring</p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <i className="fas fa-football-ball mr-2"></i>
                  <span>NFL</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <i className="fas fa-basketball-ball mr-2"></i>
                  <span>NBA</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <i className="fas fa-golf-ball mr-2"></i>
                  <span>Golf</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <i className="fas fa-tennis-ball mr-2"></i>
                  <span>Tennis</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <i className="fas fa-futbol mr-2"></i>
                  <span>FIFA</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <i className="fas fa-plus mr-2"></i>
                  <span>13+ More</span>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => setLocation('/enhanced-draft')}
                  className="bg-white text-blue-600 hover:bg-gray-50 shadow-lg"
                >
                  <i className="fas fa-chart-line mr-2"></i>
                  Enhanced Draft Analysis
                </Button>
                <Button 
                  onClick={() => setLocation('/draft')}
                  className="bg-blue-500/20 text-white hover:bg-blue-500/30 border border-white/20"
                >
                  <i className="fas fa-play mr-2"></i>
                  Basic Draft View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
