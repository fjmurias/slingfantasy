import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Users } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface EventPicksDrawerProps {
  eventName: string;
  sportName: string;
  sportCategory: string;
  isCompleted: boolean;
}

interface DraftMatrixData {
  sports: Array<{ id: number; name: string; category: string; code: string }>;
  players: string[];
  matrix: Record<string, Record<string, string | null>>;
}

export function EventPicksDrawer({ eventName, sportName, sportCategory, isCompleted }: EventPicksDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: draftMatrix, isLoading } = useQuery<DraftMatrixData>({
    queryKey: ['/api/draft/matrix'],
    enabled: isOpen, // Only fetch when opened
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cool': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Neutral': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'Wild Card': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPlayerPicks = () => {
    if (!draftMatrix) return [];
    
    const sportPicks = draftMatrix.matrix[sportName] || {};
    return draftMatrix.players.map(player => ({
      player,
      pick: sportPicks[player] || null
    })).filter(item => item.pick); // Only show players who made picks
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium">{eventName}</span>
                <Badge variant="outline" className={getCategoryColor(sportCategory)}>
                  {sportCategory}
                </Badge>
                {isCompleted && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Completed
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Click to view all player picks
              </div>
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <Card className="mx-4 mb-4">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-4">
                Loading player picks...
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Player Picks for {eventName}</span>
                </div>
                
                {getPlayerPicks().length === 0 ? (
                  <div className="text-center text-muted-foreground py-4">
                    No picks found for this event
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {getPlayerPicks().map(({ player, pick }) => (
                      <div key={player} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="font-medium">{player}</span>
                        <span className="text-sm text-muted-foreground">
                          {pick?.replace(`${player}'s `, '') || 'No pick'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}