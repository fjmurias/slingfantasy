import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Sport {
  id: number;
  name: string;
  category: string;
  code: string;
}

interface DraftMatrixData {
  sports: Sport[];
  players: string[];
  matrix: Record<string, Record<string, string | null>>;
}

interface DraftMatrixProps {
  selectedPlayer: string;
}

export function DraftMatrix({ selectedPlayer }: DraftMatrixProps) {
  const { data: draftMatrix, isLoading } = useQuery<DraftMatrixData>({
    queryKey: ['/api/draft/matrix'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Draft Picks Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading draft matrix...</div>
        </CardContent>
      </Card>
    );
  }

  if (!draftMatrix) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Draft Picks Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">No draft data available</div>
        </CardContent>
      </Card>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cool': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Neutral': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'Wild Card': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedPlayer}'s Draft Picks</CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete draft selections across {draftMatrix.sports.length} sports
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-2 text-left bg-muted font-medium">
                  Sport
                </th>
                <th className="border border-border p-2 text-left bg-muted font-medium">
                  Pick
                </th>
              </tr>
            </thead>
            <tbody>
              {draftMatrix.sports.map((sport) => (
                <tr key={sport.id} className="hover:bg-muted/50">
                  <td className="border border-border p-2 font-medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getCategoryColor(sport.category)}>
                        {sport.name}
                      </Badge>
                    </div>
                  </td>
                  <td className="border border-border p-2 text-sm">
                    {draftMatrix.matrix[sport.name]?.[selectedPlayer] ? (
                      <div className="font-medium">
                        {draftMatrix.matrix[sport.name][selectedPlayer]?.replace(`${selectedPlayer}'s `, '')}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">No pick</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Cool Sports
          </Badge>
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            Neutral Sports
          </Badge>
          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Wild Card Sports
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}