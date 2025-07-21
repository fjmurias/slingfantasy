import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WildCardUsageProps {
  used?: number;
  total?: number;
}

export default function WildCardUsage({ used, total }: WildCardUsageProps) {
  // Real data from the CSV showing wild card usage by player
  const wildCardData = [
    { name: "Pat", used: 4, total: 4, percentage: 100, color: "bg-blue-500" },
    { name: "Collins", used: 4, total: 4, percentage: 100, color: "bg-green-500" },
    { name: "Steed", used: 3, total: 4, percentage: 75, color: "bg-purple-500" },
    { name: "Minich", used: 3, total: 4, percentage: 75, color: "bg-pink-500" },
    { name: "The King", used: 3, total: 4, percentage: 75, color: "bg-indigo-500" },
    { name: "Fern", used: 3, total: 4, percentage: 75, color: "bg-red-500" },
    { name: "Peterson", used: 3, total: 4, percentage: 75, color: "bg-yellow-500" },
    { name: "Delany", used: 3, total: 4, percentage: 75, color: "bg-gray-500" },
    { name: "Paul", used: 3, total: 4, percentage: 75, color: "bg-teal-500" },
    { name: "Poz", used: 3, total: 4, percentage: 75, color: "bg-orange-500" },
    { name: "Mazzie", used: 2, total: 4, percentage: 50, color: "bg-cyan-500" },
    { name: "Huff", used: 2, total: 4, percentage: 50, color: "bg-lime-500" },
    { name: "Kane", used: 2, total: 4, percentage: 50, color: "bg-violet-500" },
    { name: "Frank", used: 2, total: 4, percentage: 50, color: "bg-rose-500" },
    { name: "Robbie", used: 2, total: 4, percentage: 50, color: "bg-emerald-500" },
    { name: "Brendan", used: 1, total: 4, percentage: 25, color: "bg-sky-500" }
  ];

  const getProgressBarColor = (percentage: number) => {
    if (percentage === 100) return "bg-green-600";
    if (percentage >= 75) return "bg-yellow-500";
    if (percentage >= 50) return "bg-blue-500";
    return "bg-red-500";
  };

  const getPlayerInitial = (name: string) => {
    return name[0].toUpperCase();
  };

  // Show top players with highest usage
  const topPlayers = wildCardData.slice(0, 6);

  return (
    <Card className="border border-gray-100">
      <CardHeader className="border-b border-gray-100">
        <CardTitle>Wild Card Usage</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Strategic pick allocation by player</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {topPlayers.map((player) => (
            <div key={player.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${player.color} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                  {getPlayerInitial(player.name)}
                </div>
                <div>
                  <span className="font-medium text-gray-900">{player.name}</span>
                  <div className="text-xs text-gray-600">{player.used}/{player.total} Wild Cards Used</div>
                </div>
              </div>
              <div className="text-right">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${getProgressBarColor(player.percentage)} h-2 rounded-full`}
                    style={{ width: `${player.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-1">{player.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Total Wild Cards Available:</span>
              <span className="font-medium">{wildCardData.length * 4}</span>
            </div>
            <div className="flex justify-between">
              <span>Wild Cards Used:</span>
              <span className="font-medium">{wildCardData.reduce((sum, player) => sum + player.used, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Usage:</span>
              <span className="font-medium">
                {Math.round(wildCardData.reduce((sum, player) => sum + player.percentage, 0) / wildCardData.length)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
