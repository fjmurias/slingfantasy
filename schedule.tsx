import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Trophy, CheckCircle, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EventPicksDrawer } from "@/components/event-picks-drawer";

interface ScheduleEvent {
  sport: string;
  endingDate: string;
  type: string;
  pointStructure: number[];
  isCompleted?: boolean;
}

export default function Schedule() {
  const { user } = useAuth();

  const { data: events = [], isLoading } = useQuery<ScheduleEvent[]>({
    queryKey: ['/api/schedule/complete'],
  });

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'cool':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'fruity':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCompletionStatus = (isCompleted: boolean) => {
    return isCompleted ? {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      badge: 'Completed',
      className: 'bg-green-50 border-green-200',
      textClass: 'text-green-900',
      badgeClass: 'bg-green-100 text-green-800'
    } : {
      icon: <Clock className="w-5 h-5 text-orange-600" />,
      badge: 'Upcoming',
      className: 'bg-orange-50 border-orange-200',
      textClass: 'text-orange-900',
      badgeClass: 'bg-orange-100 text-orange-800'
    };
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'TBD' || dateString === 'Now') return dateString;
    
    const cleanDate = dateString.replace(/\s+/g, ' ').trim();
    
    if (cleanDate.includes('-')) {
      return cleanDate;
    }
    
    if (cleanDate.includes('2025') || cleanDate.includes('2026')) {
      return cleanDate;
    }
    
    return cleanDate;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading schedule...</div>
          </div>
        </main>
      </div>
    );
  }

  const completedEvents = events.filter(event => event.isCompleted);
  const upcomingEvents = events.filter(event => !event.isCompleted);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sports Schedule</h2>
          <p className="text-lg text-gray-600">Ryan's Sports Challenge 2026 • {events.length} Total Events</p>
        </div>

        {/* Schedule Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                  <p className="text-sm text-gray-600">Total Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{completedEvents.length}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((completedEvents.length / events.length) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mobile: Upcoming first, Desktop: Completed first (left column) */}
          <div className="order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Completed Events ({completedEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedEvents.map((event, index) => (
                  <EventPicksDrawer
                    key={`completed-${index}`}
                    eventName={event.sport}
                    sportName={event.sport}
                    sportCategory={event.type}
                    isCompleted={true}
                  />
                ))}
                {completedEvents.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No completed events yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mobile: First, Desktop: Second (right column) */}
          <div className="order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Upcoming Events ({upcomingEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <EventPicksDrawer
                    key={`upcoming-${index}`}
                    eventName={event.sport}
                    sportName={event.sport}
                    sportCategory={event.type}
                    isCompleted={false}
                  />
                ))}
                {upcomingEvents.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No upcoming events
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Point Structure Legend */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Point Structure Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-2">Cool Sports</h4>
                  <p className="text-sm text-blue-700">Highest point values (50-150 max)</p>
                  <p className="text-xs text-blue-600 mt-1">NFL, NCAAF, NCAAB, Golf majors</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-2">Neutral Sports</h4>
                  <p className="text-sm text-gray-700">Balanced scoring (15-75 max)</p>
                  <p className="text-xs text-gray-600 mt-1">NBA, NHL, Tennis, Lacrosse</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-2">Fruity Sports</h4>
                  <p className="text-sm text-purple-700">Special scoring (10-50 max)</p>
                  <p className="text-xs text-purple-600 mt-1">FIFA, MLB, F1, Special events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}