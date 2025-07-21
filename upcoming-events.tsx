import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface Event {
  id?: number;
  name: string;
  startDate?: string;
  sportCategory?: string;
  maxPoints?: string;
  sportIcon?: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

export default function UpcomingEvents({ events = [] }: UpcomingEventsProps) {
  const [, setLocation] = useLocation();

  // Mock data if no events provided
  const mockEvents = [
    {
      name: "The Masters",
      startDate: "April 10-13",
      sportCategory: "Cool",
      maxPoints: "139",
      icon: "fas fa-golf-ball"
    },
    {
      name: "NFL Draft",
      startDate: "April 24",
      sportCategory: "Cool",
      maxPoints: "139",
      icon: "fas fa-football-ball"
    },
    {
      name: "College Lacrosse",
      startDate: "May 24-26",
      sportCategory: "Neutral",
      maxPoints: "245",
      icon: "fas fa-hockey-puck"
    },
    {
      name: "FIFA Club World Cup",
      startDate: "July 2025",
      sportCategory: "Fruity",
      maxPoints: "165",
      icon: "fas fa-futbol"
    },
  ];

  const displayEvents = events.length > 0 ? events.slice(0, 4) : mockEvents;

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'cool':
        return {
          bg: 'bg-cool-50',
          border: 'border-cool-200',
          iconBg: 'bg-cool-500',
          badgeBg: 'bg-cool-100',
          badgeText: 'text-cool-800'
        };
      case 'neutral':
        return {
          bg: 'bg-neutral-50',
          border: 'border-neutral-200',
          iconBg: 'bg-neutral-500',
          badgeBg: 'bg-neutral-100',
          badgeText: 'text-neutral-800'
        };
      case 'fruity':
        return {
          bg: 'bg-fruity-50',
          border: 'border-fruity-200',
          iconBg: 'bg-fruity-500',
          badgeBg: 'bg-fruity-100',
          badgeText: 'text-fruity-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          iconBg: 'bg-gray-500',
          badgeBg: 'bg-gray-100',
          badgeText: 'text-gray-800'
        };
    }
  };

  const getSportIcon = (event: any) => {
    if (event.sportIcon) return event.sportIcon;
    if (event.icon) return event.icon;
    
    // Default icons based on sport name
    const name = event.name.toLowerCase();
    if (name.includes('golf') || name.includes('masters')) return 'fas fa-golf-ball';
    if (name.includes('nfl') || name.includes('football')) return 'fas fa-football-ball';
    if (name.includes('lacrosse')) return 'fas fa-hockey-puck';
    if (name.includes('fifa') || name.includes('soccer')) return 'fas fa-futbol';
    return 'fas fa-trophy';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    return dateString;
  };

  return (
    <Card className="border border-gray-100">
      <CardHeader className="border-b border-gray-100">
        <CardTitle>Upcoming Events</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Next major sport competitions</p>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {displayEvents.map((event, index) => {
          const colors = getCategoryColor(event.sportCategory || 'neutral');
          return (
            <div 
              key={event.id || `event-${index}`}
              className={`flex items-center space-x-3 p-3 ${colors.bg} rounded-lg border ${colors.border}`}
            >
              <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                <i className={`${getSportIcon(event)} text-white`}></i>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900">{event.name}</h4>
                <p className="text-xs text-gray-600">{formatDate(event.startDate || 'TBD')}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs ${colors.badgeBg} ${colors.badgeText} px-2 py-1 rounded-full`}>
                    {event.sportCategory || 'Neutral'} • {event.maxPoints || '0'} pts max
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <Button 
          variant="ghost" 
          className="text-blue-600 hover:text-blue-800"
          onClick={() => setLocation('/schedule')}
        >
          View Full Schedule 
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
}
