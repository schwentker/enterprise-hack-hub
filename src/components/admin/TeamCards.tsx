import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Target } from "lucide-react";
import type { Team } from "@/pages/admin/Teams";

interface TeamCardsProps {
  teams: Team[];
  onTeamClick: (team: Team) => void;
  onUpdate: () => void;
}

const trackColors: Record<string, string> = {
  Promptathon: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Buildathon: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Vibeathon: "bg-pink-500/10 text-pink-500 border-pink-500/20",
};

const statusColors: Record<string, string> = {
  forming: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  complete: "bg-green-500/10 text-green-500 border-green-500/20",
  building: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  submitted: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

export function TeamCards({ teams, onTeamClick }: TeamCardsProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (teams.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Teams Yet</h3>
        <p className="text-muted-foreground">Teams will appear here as they form</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <Card
          key={team.id}
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => onTeamClick(team)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{team.name}</CardTitle>
              <Badge variant="outline" className={statusColors[team.status]}>
                {team.status}
              </Badge>
            </div>
            <Badge variant="outline" className={trackColors[team.track]}>
              {team.track}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {team.members?.length || 0}/{team.max_members} members
              </span>
            </div>

            {team.challenge && (
              <div className="flex items-start gap-2 text-sm">
                <Target className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground line-clamp-2">{team.challenge}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {team.members?.slice(0, 4).map((member) => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      {getInitials(member.registration?.full_name || "?")}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {(team.members?.length || 0) > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{(team.members?.length || 0) - 4} more
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
