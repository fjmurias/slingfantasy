import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function SportCategories() {
  const { data: sports = [] } = useQuery({
    queryKey: ['/api/sports'],
  });

  const { data: events = [] } = useQuery({
    queryKey: ['/api/events'],
  });

  // Calculate point totals by category
  const calculateCategoryStats = () => {
    const categories = {
      Cool: { sports: [], totalPoints: 0 },
      Neutral: { sports: [], totalPoints: 0 },
      Fruity: { sports: [], totalPoints: 0 }
    };

    sports.forEach((sport: any) => {
      const category = sport.category;
      if (categories[category as keyof typeof categories]) {
        categories[category as keyof typeof categories].sports.push(sport);
        
        // Calculate total points for this sport from events
        const sportEvents = events.filter((event: any) => event.sportId === sport.id);
        const sportTotalPoints = sportEvents.reduce((sum: number, event: any) => {
          return sum + parseFloat(event.maxPoints || '0');
        }, 0);
        
        categories[category as keyof typeof categories].totalPoints += sportTotalPoints;
      }
    });

    return categories;
  };

  const categoryStats = calculateCategoryStats();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cool': return 'fas fa-snowflake';
      case 'Neutral': return 'fas fa-balance-scale';
      case 'Wild Card': return 'fas fa-star';
      default: return 'fas fa-circle';
    }
  };

  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'Cool':
        return {
          bg: 'bg-cool-50',
          border: 'border-cool-200',
          dot: 'bg-cool-500',
          badge: 'bg-cool-100 text-cool-700'
        };
      case 'Neutral':
        return {
          bg: 'bg-neutral-50',
          border: 'border-neutral-200',
          dot: 'bg-neutral-500',
          badge: 'bg-neutral-100 text-neutral-700'
        };
      case 'Wild Card':
        return {
          bg: 'bg-wildcard-50',
          border: 'border-wildcard-200',
          dot: 'bg-wildcard-500',
          badge: 'bg-wildcard-100 text-wildcard-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          dot: 'bg-gray-500',
          badge: 'bg-gray-100 text-gray-700'
        };
    }
  };

  // Sample sport-specific point totals based on the design
  const sportPointTotals = {
    'NFL': 470,
    'NCAAB (2026)': 420,
    'NCAAF': 420,
    'Golf': 392.5,
    'College Lacrosse': 245,
    'NBA': 245,
    'NHL': 245,
    'French Open (Women\'s)': 122,
    'French Open (Men\'s)': 122,
    'Wimbledon (Women\'s)': 122,
    'Wimbledon (Men\'s)': 122,
    'FIFA Club World Cup': 165,
    'MLB': 165,
    'Formula 1': 165,
    'WNBA': 30
  };

  const getCategorySpecificSports = (category: string) => {
    switch (category) {
      case 'Cool':
        return [
          { name: 'NFL', points: 470 },
          { name: 'NCAAB (2026)', points: 420 },
          { name: 'NCAAF', points: 420 },
          { name: 'Golf', points: 392.5 }
        ];
      case 'Neutral':
        return [
          { name: 'College Lacrosse', points: 245 },
          { name: 'NBA', points: 245 },
          { name: 'NHL', points: 245 },
          { name: 'Tennis (All)', points: 488 }
        ];
      case 'Fruity':
        return [
          { name: 'FIFA Club World Cup', points: 165 },
          { name: 'MLB', points: 165 },
          { name: 'Formula 1', points: 165 },
          { name: 'WNBA', points: 30 }
        ];
      default:
        return [];
    }
  };

  const getCategoryTotal = (category: string) => {
    switch (category) {
      case 'Cool': return 1346;
      case 'Neutral': return 1001;
      case 'Fruity': return 525;
      default: return 0;
    }
  };

  return (
    <Card className="border border-gray-100">
      <CardHeader className="border-b border-gray-100">
        <CardTitle>Sports by Category</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Point allocation and event classification</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(categoryStats).map(([category, data]) => {
            const colors = getCategoryColors(category);
            const specificSports = getCategorySpecificSports(category);
            const totalPoints = getCategoryTotal(category);
            
            return (
              <div key={category} className={`${colors.bg} rounded-lg p-4 border ${colors.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 ${colors.dot} rounded-full`}></div>
                    <h4 className="font-bold text-gray-900">{category} Sports</h4>
                  </div>
                  <span className={`text-xs ${colors.badge} px-2 py-1 rounded-full`}>
                    {totalPoints.toLocaleString()} pts total
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  {specificSports.map((sport) => (
                    <div key={sport.name} className="flex justify-between">
                      <span className="text-gray-600">{sport.name}</span>
                      <span className="font-medium text-gray-900">{sport.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
