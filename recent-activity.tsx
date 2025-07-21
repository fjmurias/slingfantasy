import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Trophy, Star, Calendar, Users, TrendingUp } from "lucide-react";

export default function RecentActivity() {
  // Real activity data based on the CSV and league events
  const activities = [
    {
      id: 1,
      type: "event_completed",
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      title: "NCAAB (2025) Completed",
      description: "John earned 30 pts • Ryan earned 75 pts",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      type: "event_update",
      icon: Trophy,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      title: "College Lacrosse Finals",
      description: "Poz leads with Georgetown pick",
      timestamp: "1 day ago"
    },
    {
      id: 3,
      type: "wildcard_used",
      icon: Star,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      title: "Wild Card Play",
      description: "Mazzie used wild card on NHL pick",
      timestamp: "3 days ago"
    },
    {
      id: 4,
      type: "draft_pick",
      icon: Users,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      title: "Draft Round 18 Complete",
      description: "All players completed WNBA picks",
      timestamp: "1 week ago"
    },
    {
      id: 5,
      type: "scoring_update",
      icon: TrendingUp,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
      title: "Leaderboard Update",
      description: "John takes first place with Masters performance",
      timestamp: "1 week ago"
    },
    {
      id: 6,
      type: "event_scheduled",
      icon: Calendar,
      iconColor: "text-gray-600",
      iconBg: "bg-gray-100",
      title: "NFL Draft Approaching",
      description: "Event starts April 24 - check your picks",
      timestamp: "2 weeks ago"
    }
  ];

  const formatTimeAgo = (timestamp: string) => {
    return timestamp;
  };

  return (
    <Card className="border border-gray-100">
      <CardHeader className="border-b border-gray-100">
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Latest events and point updates</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center`}>
                  <IconComponent className={`w-4 h-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-600 mt-1 break-words">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Activity
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
